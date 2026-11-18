[CmdletBinding()]
param(
  [string]$DshHomeOverride = '',
  [string]$ManifestPath = '',
  [string[]]$Packs = @(),
  [string]$LogPath = '',
  [switch]$NoLaunch,
  [switch]$SkipProcessStop
)

# 2.6.0 起的卸载引擎：按 manifest.json 反着做，支持只卸某个增强包。
# 没有 manifest.json 的老 zip 退回三包硬编码。

$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false) } catch { }
$BackupKeep = 3
$stamp = Get-Date -Format 'yyyyMMddHHmmss'
$logPath = if ([string]::IsNullOrWhiteSpace($LogPath)) { Join-Path $env:TEMP "dsh-exv-uninstall-$stamp.log" } else { $LogPath }
try { Remove-Item -LiteralPath ("$logPath.done") -Force -ErrorAction SilentlyContinue } catch { }

function Write-Log([string]$Text, [string]$Color = 'Cyan') {
  $line = "[exv] $Text"
  Write-Host $line -ForegroundColor $Color
  try { [IO.File]::AppendAllText($logPath, $line + "`r`n", (New-Object System.Text.UTF8Encoding($false))) } catch { }
}

function Write-Note([string]$Text) { Write-Log $Text 'DarkGray' }

function Normalize-FullPath([string]$Path) {
  if ([string]::IsNullOrWhiteSpace($Path)) { return '' }
  return ([IO.Path]::GetFullPath($Path)).TrimEnd('\', '/')
}

# 与 install.ps1 一致：先 CloseMainWindow 等 6 秒，仍不退出才强杀。
function Stop-DshProcess {
  $running = @(Get-Process -Name 'DeepSeek Harness' -ErrorAction SilentlyContinue)
  if ($running.Count -eq 0) { return $false }
  Write-Log '检测到 DSH 正在运行，正在关闭……'
  Write-Note '未提交的会话不会自动保存。'
  foreach ($process in $running) { try { [void]$process.CloseMainWindow() } catch { } }
  for ($i = 0; $i -lt 12; $i += 1) {
    Start-Sleep -Milliseconds 500
    if (@(Get-Process -Name 'DeepSeek Harness' -ErrorAction SilentlyContinue).Count -eq 0) { return $true }
  }
  Write-Log 'DSH 未在 6 秒内退出，改为强制结束。' 'Yellow'
  @(Get-Process -Name 'DeepSeek Harness' -ErrorAction SilentlyContinue) |
    Stop-Process -Force -ErrorAction SilentlyContinue
  Start-Sleep -Seconds 2
  return $true
}

function Write-JsonAtomically([string]$Path, $Data) {
  $json = $Data | ConvertTo-Json -Depth 20
  $null = $json | ConvertFrom-Json
  $directory = Split-Path -Parent $Path
  $temp = Join-Path $directory ("package.json.tmp-" + [guid]::NewGuid().ToString('N'))
  try {
    [IO.File]::WriteAllText($temp, $json, (New-Object System.Text.UTF8Encoding($false)))
    Move-Item -LiteralPath $temp -Destination $Path -Force
  } finally {
    if (Test-Path -LiteralPath $temp) { Remove-Item -LiteralPath $temp -Force -ErrorAction SilentlyContinue }
  }
}

function Remove-OldBackups([string]$Directory, [string]$Filter, [int]$Keep) {
  $files = @(Get-ChildItem -LiteralPath $Directory -Filter $Filter -File -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending)
  if ($files.Count -le $Keep) { return }
  $files | Select-Object -Skip $Keep | ForEach-Object {
    Remove-Item -LiteralPath $_.FullName -Force -ErrorAction SilentlyContinue
  }
}

function Get-PackManifest([string]$Root, [string]$Path) {
  $file = if ([string]::IsNullOrWhiteSpace($Path)) { Join-Path $Root 'manifest.json' } else { $Path }
  if (Test-Path -LiteralPath $file) {
    $raw = [IO.File]::ReadAllText($file, (New-Object System.Text.UTF8Encoding($false))) | ConvertFrom-Json
    $list = New-Object System.Collections.Generic.List[object]
    foreach ($pack in @($raw.packs)) {
      $dependency = if ($pack.dependency) { [string]$pack.dependency } else { [string]$pack.bundle }
      $list.Add([pscustomobject]@{
        id = [string]$pack.id; title = [string]$pack.title; folder = [string]$pack.folder
        bundle = [string]$pack.bundle; dependency = $dependency
      })
    }
    return $list
  }
  Write-Note '没有 manifest.json，按旧版三包清单卸载。'
  $list = New-Object System.Collections.Generic.List[object]
  foreach ($item in @(
    @{ id = 'flat-corners'; title = '方角补丁'; folder = 'flat-corners'; bundle = 'dsh-exv-flat-corners' },
    @{ id = 'cyan-theme'; title = '界面层'; folder = 'cyan-theme'; bundle = 'dsh-exv-cyan-theme' },
    @{ id = 'parallax-bg'; title = '背景与 Live2D'; folder = 'parallax-bg'; bundle = 'dsh-exv-parallax-bg' }
  )) {
    $list.Add([pscustomobject]@{
      id = $item.id; title = $item.title; folder = $item.folder
      bundle = $item.bundle; dependency = $item.bundle
    })
  }
  return $list
}

$moved = New-Object System.Collections.ArrayList
$profilePkg = ''
$profileBackup = ''
$profileWritten = $false

try {
  $root = $PSScriptRoot
  $allPacks = Get-PackManifest -Root $root -Path $ManifestPath
  $wantedIds = @()
  if ($Packs.Count -gt 0) {
    $wantedIds = @($Packs | ForEach-Object { $_ -split ',' } | Where-Object { $_ } | ForEach-Object { $_.Trim() })
    $targets = @($allPacks | Where-Object { $wantedIds -contains $_.id })
  } else {
    $targets = @($allPacks)
  }
  if ($targets.Count -eq 0) { throw '没有匹配到要卸载的包。' }

  $dshHome = if ([string]::IsNullOrWhiteSpace($DshHomeOverride)) {
    if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $env:USERPROFILE '.dsh' }
  } else { $DshHomeOverride }
  $dshHome = Normalize-FullPath $dshHome
  $profileDir = Join-Path $dshHome 'profiles\desktop'
  $profilePkg = Join-Path $profileDir 'package.json'
  $pluginsDir = Join-Path $dshHome 'plugins'
  $isLiveHome = ((Normalize-FullPath (Join-Path $env:USERPROFILE '.dsh')) -eq $dshHome)
  $exe = Join-Path $env:LOCALAPPDATA 'Programs\DeepSeek Harness\DeepSeek Harness.exe'

  if (-not (Test-Path -LiteralPath $profilePkg)) { throw "找不到 DSH desktop profile：$profilePkg" }

  $wasRunning = $false
  if ($isLiveHome -and -not $SkipProcessStop) { $wasRunning = Stop-DshProcess }

  # ---- 1. 先把插件目录改名，profile 写成功后才真正删除 --------------------
  foreach ($pack in $targets) {
    $target = Join-Path $pluginsDir $pack.folder
    if (Test-Path -LiteralPath $target) {
      $aside = "$target.old-$stamp"
      Move-Item -LiteralPath $target -Destination $aside -Force
      [void]$moved.Add([pscustomobject]@{ Old = $aside; Target = $target })
    }
  }

  # ---- 2. 更新 profile（备份 + 原子替换）--------------------------------
  $profileBackup = "$profilePkg.pre-exv-uninstall-$stamp.bak"
  Copy-Item -LiteralPath $profilePkg -Destination $profileBackup -Force
  $pkg = [IO.File]::ReadAllText($profilePkg, (New-Object System.Text.UTF8Encoding($false))) | ConvertFrom-Json
  $bundleNames = @($targets | ForEach-Object { $_.bundle }) + @('@local/flat-corners', '@local/cyan-theme', '@local/parallax-bg')
  $depNames = @($targets | ForEach-Object { $_.dependency }) + @('@local/flat-corners', '@local/cyan-theme', '@local/parallax-bg')
  if ($pkg.PSObject.Properties['dsh'] -and $pkg.dsh.PSObject.Properties['profile']) {
    $kept = @($pkg.dsh.profile.bundles | Where-Object { $bundleNames -notcontains $_ })
    $pkg.dsh.profile.bundles = @($kept)
  }
  if ($pkg.PSObject.Properties['dependencies']) {
    foreach ($dep in $depNames) {
      if ($pkg.dependencies.PSObject.Properties[$dep]) { $pkg.dependencies.PSObject.Properties.Remove($dep) }
    }
  }
  Write-JsonAtomically -Path $profilePkg -Data $pkg
  $profileWritten = $true
  Write-Log '已从 profile 移除 bundles 与 dependencies'

  # 清掉 2.2.x 留在 node_modules\@local 下的联接
  $legacyScope = Join-Path (Join-Path $profileDir 'node_modules') '@local'
  foreach ($pack in $targets) {
    $old = Join-Path $legacyScope $pack.folder
    if (Test-Path -LiteralPath $old) {
      $oldItem = Get-Item -LiteralPath $old -Force
      if ($oldItem.Attributes -band [IO.FileAttributes]::ReparsePoint) { [IO.Directory]::Delete($old, $false) }
    }
  }

  # ---- 3. 删除插件目录 ---------------------------------------------------
  foreach ($item in $moved) {
    if (Test-Path -LiteralPath $item.Old) {
      Remove-Item -LiteralPath $item.Old -Recurse -Force
      Write-Log ("已删除插件 " + (Split-Path $item.Target -Leaf))
    }
  }

  # ---- 4. 重新链接依赖 ---------------------------------------------------
  $runtime = Join-Path $dshHome 'dsh-runtimes\dsh-primary-runtime'
  if (-not (Test-Path -LiteralPath (Join-Path $runtime 'dependencies\node\bin\node.exe'))) {
    $runtime = Join-Path $env:LOCALAPPDATA 'Programs\DeepSeek Harness\resources\runtime\primary-runtime'
  }
  $node = Join-Path $runtime 'dependencies\node\bin\node.exe'
  $pnpm = Join-Path $runtime 'dependencies\pnpm\bin\pnpm.cjs'
  if ((Test-Path -LiteralPath $node) -and (Test-Path -LiteralPath $pnpm)) {
    Push-Location $profileDir
    try { & $node $pnpm install --prefer-offline | Out-Host } catch { Write-Log $_.Exception.Message 'Yellow' } finally { Pop-Location }
  }

  Remove-OldBackups -Directory $profileDir -Filter 'package.json.pre-exv-*.bak' -Keep $BackupKeep

  Write-Log '卸载完成。主题配置仍保留在 DSH 的 localStorage 中。' 'Green'
  if (-not $NoLaunch -and $wasRunning -and (Test-Path -LiteralPath $exe)) {
    Write-Log '正在重新启动 DSH……'
    Start-Process -FilePath $exe
  }
} catch {
  Write-Host ''
  Write-Host '卸载失败：' -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  try { [IO.File]::AppendAllText($logPath, "卸载失败：$($_.Exception.Message)`r`n", (New-Object System.Text.UTF8Encoding($false))) } catch { }
  foreach ($item in $moved) {
    if (Test-Path -LiteralPath $item.Old) {
      Move-Item -LiteralPath $item.Old -Destination $item.Target -Force -ErrorAction SilentlyContinue
    }
  }
  if ($profileWritten -and $profileBackup -and (Test-Path -LiteralPath $profileBackup)) {
    Copy-Item -LiteralPath $profileBackup -Destination $profilePkg -Force
  }
  try { [IO.File]::WriteAllText("$logPath.done", "fail") } catch { }
exit 1
}

try { [IO.File]::WriteAllText("$logPath.done", "ok") } catch { }
exit 0
