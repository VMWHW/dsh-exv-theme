[CmdletBinding()]
param(
  [string]$DshHomeOverride = '',
  [switch]$NoLaunch
)

$ErrorActionPreference = 'Stop'
$PluginNames = @('flat-corners', 'cyan-theme', 'parallax-bg')
$BundleNames = @('@local/flat-corners', '@local/cyan-theme', '@local/parallax-bg')
$BackupKeep = 3

function Write-Step([string]$Text) {
  Write-Host "[DSH EXV 2.0] $Text" -ForegroundColor Cyan
}

function Normalize-FullPath([string]$Path) {
  if ([string]::IsNullOrWhiteSpace($Path)) { return '' }
  return ([IO.Path]::GetFullPath($Path)).TrimEnd('\', '/')
}

# 与 install.ps1 一致：先 CloseMainWindow 等 6 秒，仍不退出才强杀。
function Stop-DshProcess {
  $running = @(Get-Process -Name 'DeepSeek Harness' -ErrorAction SilentlyContinue)
  if ($running.Count -eq 0) { return $false }
  Write-Step '检测到 DSH 正在运行，正在关闭...'
  Write-Host '             未提交的会话不会自动保存。' -ForegroundColor DarkGray
  foreach ($process in $running) {
    try { [void]$process.CloseMainWindow() } catch { }
  }
  for ($i = 0; $i -lt 12; $i += 1) {
    Start-Sleep -Milliseconds 500
    if (@(Get-Process -Name 'DeepSeek Harness' -ErrorAction SilentlyContinue).Count -eq 0) { return $true }
  }
  Write-Step 'DSH 未在 6 秒内退出，改为强制结束。'
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

$movedPlugins = New-Object System.Collections.ArrayList
$profilePkg = ''
$profileBackup = ''
$profileWritten = $false
$stamp = Get-Date -Format 'yyyyMMddHHmmss'

try {
  $dshHome = if ([string]::IsNullOrWhiteSpace($DshHomeOverride)) {
    if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $env:USERPROFILE '.dsh' }
  } else {
    $DshHomeOverride
  }
  $dshHome = Normalize-FullPath $dshHome
  $profileDir = Join-Path $dshHome 'profiles\desktop'
  $profilePkg = Join-Path $profileDir 'package.json'
  $pluginsDir = Join-Path $dshHome 'plugins'
  $isLiveHome = ((Normalize-FullPath (Join-Path $env:USERPROFILE '.dsh')) -eq $dshHome)
  $exe = Join-Path $env:LOCALAPPDATA 'Programs\DeepSeek Harness\DeepSeek Harness.exe'

  if (-not (Test-Path -LiteralPath $profilePkg)) {
    throw "找不到 DSH desktop profile：$profilePkg"
  }

  $wasRunning = $false
  if ($isLiveHome) {
    $wasRunning = Stop-DshProcess
  }

  # ---- 1. 先把插件目录改名，profile 写成功后才真正删除 --------------------
  foreach ($name in $PluginNames) {
    $target = Join-Path $pluginsDir $name
    if (Test-Path -LiteralPath $target) {
      $aside = "$target.old-$stamp"
      Move-Item -LiteralPath $target -Destination $aside -Force
      [void]$movedPlugins.Add([pscustomobject]@{ Old = $aside; Target = $target })
    }
  }

  # ---- 2. 更新 profile（备份 + 原子替换）--------------------------------
  $profileBackup = "$profilePkg.pre-exv-uninstall-$stamp.bak"
  Copy-Item -LiteralPath $profilePkg -Destination $profileBackup -Force
  $pkg = Get-Content -LiteralPath $profilePkg -Raw | ConvertFrom-Json
  if ($pkg.PSObject.Properties['dsh'] -and $pkg.dsh.PSObject.Properties['profile']) {
    $kept = @($pkg.dsh.profile.bundles | Where-Object { $BundleNames -notcontains $_ })
    $pkg.dsh.profile.bundles = @($kept)
  }
  if ($pkg.PSObject.Properties['dependencies']) {
    foreach ($dep in $BundleNames) {
      if ($pkg.dependencies.PSObject.Properties[$dep]) {
        $pkg.dependencies.PSObject.Properties.Remove($dep)
      }
    }
  }
  Write-JsonAtomically -Path $profilePkg -Data $pkg
  $profileWritten = $true
  Write-Step '已从 profile 移除主题依赖与 bundles'

  # ---- 3. 删除插件目录 ---------------------------------------------------
  foreach ($item in $movedPlugins) {
    if (Test-Path -LiteralPath $item.Old) {
      Remove-Item -LiteralPath $item.Old -Recurse -Force
      Write-Step ("已删除插件 " + (Split-Path $item.Target -Leaf))
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
    try { & $node $pnpm install --prefer-offline } catch { Write-Warning $_.Exception.Message } finally { Pop-Location }
  }

  Remove-OldBackups -Directory $profileDir -Filter 'package.json.pre-exv-*.bak' -Keep $BackupKeep

  Write-Step '卸载完成。主题配置仍保留在 DSH 的 localStorage 中。'
  # 与 install.ps1 对齐：只在卸载前 DSH 本来就开着时才重新拉起。
  if (-not $NoLaunch -and $wasRunning -and (Test-Path -LiteralPath $exe)) {
    Write-Step '正在重新启动 DSH...'
    Start-Process -FilePath $exe
  }
} catch {
  Write-Host ''
  Write-Host '卸载失败：' -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  if ($movedPlugins.Count -gt 0 -or $profileWritten) {
    Write-Host ''
    Write-Host '正在回滚到卸载前的状态...' -ForegroundColor Yellow
  }
  foreach ($item in $movedPlugins) {
    if (Test-Path -LiteralPath $item.Old) {
      Move-Item -LiteralPath $item.Old -Destination $item.Target -Force -ErrorAction SilentlyContinue
    }
  }
  if ($profileWritten -and $profileBackup -and (Test-Path -LiteralPath $profileBackup)) {
    Copy-Item -LiteralPath $profileBackup -Destination $profilePkg -Force
  }
  exit 1
}

exit 0
