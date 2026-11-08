[CmdletBinding()]
param(
  [string]$DshHomeOverride = '',
  [switch]$NoLaunch,
  [switch]$SkipProcessStop,
  [switch]$Force
)

$ErrorActionPreference = 'Stop'
$ThemeName = 'DSH EXV Theme 2.0'
# 主题依赖宿主的内部结构（data-dsh-* / data-testid / data-slot 共 70 余处），
# 换 DSH 版本就可能失效。这里只做提示，不阻断：版本不符时需显式 -Force。
$TestedDshVersion = '0.2.2-rc.1'
$PluginNames = @('flat-corners', 'cyan-theme', 'parallax-bg')
$BundleNames = @('@local/flat-corners', '@local/cyan-theme', '@local/parallax-bg')
$DependencyMap = [ordered]@{
  '@local/flat-corners' = 'flat-corners'
  '@local/cyan-theme' = 'cyan-theme'
  '@local/parallax-bg' = 'parallax-bg'
}
$BackupKeep = 3

function Write-Step([string]$Text) {
  Write-Host "[DSH EXV 2.0] $Text" -ForegroundColor Cyan
}

function Write-Note([string]$Text) {
  Write-Host "             $Text" -ForegroundColor DarkGray
}

function Normalize-FullPath([string]$Path) {
  if ([string]::IsNullOrWhiteSpace($Path)) { return '' }
  return ([IO.Path]::GetFullPath($Path)).TrimEnd('\', '/')
}

function Get-InstalledDshVersion {
  $roots = @(
    'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall',
    'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall',
    'HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall'
  )
  foreach ($root in $roots) {
    $items = @(Get-ItemProperty "$root\*" -ErrorAction SilentlyContinue |
      Where-Object { $_.DisplayName -like '*DeepSeek Harness*' -and $_.DisplayVersion })
    if ($items.Count -gt 0) { return [string]$items[0].DisplayVersion }
  }
  return ''
}

# 先礼后兵：CloseMainWindow 等 6 秒，仍不退出才强杀。
function Stop-DshProcess {
  $running = @(Get-Process -Name 'DeepSeek Harness' -ErrorAction SilentlyContinue)
  if ($running.Count -eq 0) { return $false }
  Write-Step '检测到 DSH 正在运行，正在关闭...'
  Write-Note '未提交的会话不会自动保存。'
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

# 先写临时文件、回验 JSON、再原子替换，避免写坏 profile。
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
  $payload = Join-Path $PSScriptRoot 'plugins'

  if (-not (Test-Path -LiteralPath $profilePkg)) {
    throw "找不到 DSH desktop profile：$profilePkg`n请先启动一次 DSH 客户端并完成初始化，然后完全退出，再运行本安装器。"
  }
  if (-not (Test-Path -LiteralPath $payload)) {
    throw "安装包不完整：找不到 $payload。请重新解压完整的安装包。"
  }

  $isLiveHome = ((Normalize-FullPath (Join-Path $env:USERPROFILE '.dsh')) -eq $dshHome)
  $exe = Join-Path $env:LOCALAPPDATA 'Programs\DeepSeek Harness\DeepSeek Harness.exe'

  # ---- 1. 版本门禁 -------------------------------------------------------
  $installedVersion = Get-InstalledDshVersion
  if ($installedVersion -and ($installedVersion -ne $TestedDshVersion)) {
    if (-not $Force) {
      throw ("检测到 DSH 版本 $installedVersion，本安装器只在 $TestedDshVersion 上验证过。`n" +
        "主题依赖宿主内部结构，版本不符可能显示异常。确认要继续，请加 -Force 重跑：`n" +
        "  powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1 -Force")
    }
    Write-Warning "DSH 版本 $installedVersion 与已测试版本 $TestedDshVersion 不一致，按 -Force 继续。"
  } elseif ($installedVersion) {
    Write-Step "DSH 版本 $installedVersion（已测试）"
  } else {
    Write-Note '未在注册表中找到 DSH 版本，跳过版本检查。'
  }

  # ---- 2. 关闭 DSH -------------------------------------------------------
  $wasRunning = $false
  if ($isLiveHome -and -not $SkipProcessStop) {
    $wasRunning = Stop-DshProcess
  }

  # ---- 3. 复制插件（旧目录先改名，失败可还原）----------------------------
  Write-Step "安装到 $dshHome"
  New-Item -ItemType Directory -Force -Path $pluginsDir | Out-Null
  foreach ($name in $PluginNames) {
    $source = Join-Path $payload $name
    if (-not (Test-Path -LiteralPath $source)) { throw "安装包不完整：找不到 $source" }
    $target = Join-Path $pluginsDir $name
    if (Test-Path -LiteralPath $target) {
      $aside = "$target.old-$stamp"
      Move-Item -LiteralPath $target -Destination $aside -Force
      [void]$movedPlugins.Add([pscustomobject]@{ Old = $aside; Target = $target })
    }
    Copy-Item -LiteralPath $source -Destination $target -Recurse -Force
    Write-Step "已复制插件 $name"
  }

  # ---- 4. 更新 profile（备份 + 原子替换）--------------------------------
  $profileBackup = "$profilePkg.pre-exv-$stamp.bak"
  Copy-Item -LiteralPath $profilePkg -Destination $profileBackup -Force
  $pkg = Get-Content -LiteralPath $profilePkg -Raw | ConvertFrom-Json
  if (-not $pkg.PSObject.Properties['dsh']) {
    $pkg | Add-Member -NotePropertyName dsh -NotePropertyValue ([pscustomobject]@{}) -Force
  }
  if (-not $pkg.dsh.PSObject.Properties['profile']) {
    $pkg.dsh | Add-Member -NotePropertyName profile -NotePropertyValue ([pscustomobject]@{}) -Force
  }
  $bundles = @($pkg.dsh.profile.bundles)
  foreach ($bundle in $BundleNames) {
    if ($bundles -notcontains $bundle) { $bundles += $bundle }
  }
  $pkg.dsh.profile.bundles = @($bundles)

  if (-not $pkg.PSObject.Properties['dependencies']) {
    $pkg | Add-Member -NotePropertyName dependencies -NotePropertyValue ([pscustomobject]@{}) -Force
  }
  foreach ($dep in $DependencyMap.Keys) {
    $target = (Join-Path $pluginsDir $DependencyMap[$dep]) -replace '\\', '/'
    $pkg.dependencies | Add-Member -NotePropertyName $dep -NotePropertyValue ("link:" + $target) -Force
  }
  Write-JsonAtomically -Path $profilePkg -Data $pkg
  $profileWritten = $true
  Write-Step '已更新 DSH profile 依赖和 bundle 列表'

  # ---- 5. 链接依赖 -------------------------------------------------------
  $runtimeCandidates = @(
    (Join-Path $dshHome 'dsh-runtimes\dsh-primary-runtime'),
    (Join-Path $env:LOCALAPPDATA 'Programs\DeepSeek Harness\resources\runtime\primary-runtime')
  )
  $runtime = $null
  foreach ($candidate in $runtimeCandidates) {
    if (Test-Path -LiteralPath (Join-Path $candidate 'dependencies\node\bin\node.exe')) {
      $runtime = $candidate
      break
    }
  }
  $linked = $false
  if ($runtime) {
    $node = Join-Path $runtime 'dependencies\node\bin\node.exe'
    $pnpm = Join-Path $runtime 'dependencies\pnpm\bin\pnpm.cjs'
    if ((Test-Path -LiteralPath $node) -and (Test-Path -LiteralPath $pnpm)) {
      Write-Step '运行 pnpm 安装/链接主题插件...'
      Push-Location $profileDir
      try {
        & $node $pnpm install --prefer-offline
        if ($LASTEXITCODE -eq 0) { $linked = $true }
        else { Write-Warning "pnpm install 返回 $LASTEXITCODE，改用目录联接。" }
      } catch {
        Write-Warning "pnpm install 失败：$($_.Exception.Message)，改用目录联接。"
      } finally {
        Pop-Location
      }
    }
  }

  if (-not $linked) {
    Write-Step '使用目录联接安装插件依赖...'
    $scope = Join-Path $profileDir 'node_modules\@local'
    New-Item -ItemType Directory -Force -Path $scope | Out-Null
    foreach ($dep in $DependencyMap.Keys) {
      $target = Join-Path $pluginsDir $DependencyMap[$dep]
      $link = Join-Path $scope $DependencyMap[$dep]
      if (Test-Path -LiteralPath $link) {
        $item = Get-Item -LiteralPath $link -Force
        if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
          [IO.Directory]::Delete($link, $false)
        } else {
          Remove-Item -LiteralPath $link -Recurse -Force
        }
      }
      New-Item -ItemType Junction -Path $link -Target $target | Out-Null
    }
  }

  # ---- 6. 收尾：删除旧目录、清理历史备份 ---------------------------------
  foreach ($item in $movedPlugins) {
    if (Test-Path -LiteralPath $item.Old) {
      Remove-Item -LiteralPath $item.Old -Recurse -Force -ErrorAction SilentlyContinue
    }
  }
  Remove-OldBackups -Directory $profileDir -Filter 'package.json.pre-exv-*.bak' -Keep $BackupKeep

  Write-Step '安装完成。'
  Write-Step '主题默认配置：代码雨 60fps / 2K，动态帧率 120，拖拽强度 100%。'

  if (-not $NoLaunch) {
    $runningAfter = @(Get-Process -Name 'DeepSeek Harness' -ErrorAction SilentlyContinue)
    if ((Test-Path -LiteralPath $exe) -and ($wasRunning -or $runningAfter.Count -eq 0)) {
      Write-Step '正在启动 DSH...'
      Start-Process -FilePath $exe
    } else {
      Write-Step '请完全退出并重新打开 DSH 使主题生效。'
    }
  }
} catch {
  Write-Host ''
  Write-Host '安装失败：' -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  if ($movedPlugins.Count -gt 0 -or $profileWritten) {
    Write-Host ''
    Write-Host '正在回滚到安装前的状态...' -ForegroundColor Yellow
  }
  foreach ($item in $movedPlugins) {
    if (Test-Path -LiteralPath $item.Target) {
      Remove-Item -LiteralPath $item.Target -Recurse -Force -ErrorAction SilentlyContinue
    }
    if (Test-Path -LiteralPath $item.Old) {
      Move-Item -LiteralPath $item.Old -Destination $item.Target -Force -ErrorAction SilentlyContinue
    }
  }
  if ($profileWritten -and $profileBackup -and (Test-Path -LiteralPath $profileBackup)) {
    Copy-Item -LiteralPath $profileBackup -Destination $profilePkg -Force
  }
  Write-Host ''
  Write-Host '如果 DSH 已在运行时被关闭，请重新打开 DSH；安装失败不会删除主题外的任何文件。' -ForegroundColor Yellow
  exit 1
}

exit 0
