[CmdletBinding()]
param(
  [string]$DshHomeOverride = '',
  [switch]$NoLaunch,
  [switch]$SkipProcessStop
)

$ErrorActionPreference = 'Stop'
$ThemeName = 'DSH EXV Theme 2.0'
$PluginNames = @('flat-corners', 'cyan-theme', 'parallax-bg')
$BundleNames = @('@local/flat-corners', '@local/cyan-theme', '@local/parallax-bg')
$DependencyMap = [ordered]@{
  '@local/flat-corners' = 'flat-corners'
  '@local/cyan-theme' = 'cyan-theme'
  '@local/parallax-bg' = 'parallax-bg'
}

function Write-Step([string]$Text) {
  Write-Host "[DSH EXV 2.0] $Text" -ForegroundColor Cyan
}

try {
  $dshHome = if ([string]::IsNullOrWhiteSpace($DshHomeOverride)) {
    if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $env:USERPROFILE '.dsh' }
  } else {
    $DshHomeOverride
  }
  $dshHome = [IO.Path]::GetFullPath($dshHome)
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

  $isLiveHome = ([IO.Path]::GetFullPath((Join-Path $env:USERPROFILE '.dsh')) -eq $dshHome)
  $wasRunning = $false
  $exe = Join-Path $env:LOCALAPPDATA 'Programs\DeepSeek Harness\DeepSeek Harness.exe'

  if ($isLiveHome -and -not $SkipProcessStop) {
    $running = @(Get-Process -Name 'DeepSeek Harness' -ErrorAction SilentlyContinue)
    if ($running.Count -gt 0) {
      Write-Step '检测到 DSH 正在运行，正在关闭以便安装...'
      $running | Stop-Process -Force
      Start-Sleep -Seconds 2
      $wasRunning = $true
    }
  }

  Write-Step "安装到 $dshHome"
  New-Item -ItemType Directory -Force -Path $pluginsDir | Out-Null
  foreach ($name in $PluginNames) {
    $source = Join-Path $payload $name
    $target = Join-Path $pluginsDir $name
    if (Test-Path -LiteralPath $target) {
      Remove-Item -LiteralPath $target -Recurse -Force
    }
    Copy-Item -LiteralPath $source -Destination $target -Recurse -Force
    Write-Step "已复制插件 $name"
  }

  $stamp = Get-Date -Format 'yyyyMMddHHmmss'
  Copy-Item -LiteralPath $profilePkg -Destination "$profilePkg.pre-exv-$stamp.bak" -Force
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
  $json = $pkg | ConvertTo-Json -Depth 20
  [IO.File]::WriteAllText($profilePkg, $json, (New-Object System.Text.UTF8Encoding($false)))
  Write-Step '已更新 DSH profile 依赖和 bundle 列表'

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
  Write-Host ''
  Write-Host '如果 DSH 已在运行时被关闭，请重新打开 DSH；安装失败不会删除主题外的任何文件。' -ForegroundColor Yellow
  exit 1
}

exit 0
