[CmdletBinding()]
param(
  [string]$DshHomeOverride = '',
  [switch]$NoLaunch
)

$ErrorActionPreference = 'Stop'
$PluginNames = @('flat-corners', 'cyan-theme', 'parallax-bg')
$BundleNames = @('@local/flat-corners', '@local/cyan-theme', '@local/parallax-bg')

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
  $isLiveHome = ([IO.Path]::GetFullPath((Join-Path $env:USERPROFILE '.dsh')) -eq $dshHome)
  $exe = Join-Path $env:LOCALAPPDATA 'Programs\DeepSeek Harness\DeepSeek Harness.exe'

  if (-not (Test-Path -LiteralPath $profilePkg)) {
    throw "找不到 DSH desktop profile：$profilePkg"
  }

  if ($isLiveHome) {
    $running = @(Get-Process -Name 'DeepSeek Harness' -ErrorAction SilentlyContinue)
    if ($running.Count -gt 0) {
      Write-Step '正在关闭 DSH...'
      $running | Stop-Process -Force
      Start-Sleep -Seconds 2
    }
  }

  $stamp = Get-Date -Format 'yyyyMMddHHmmss'
  Copy-Item -LiteralPath $profilePkg -Destination "$profilePkg.pre-exv-uninstall-$stamp.bak" -Force
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
  [IO.File]::WriteAllText($profilePkg, ($pkg | ConvertTo-Json -Depth 20), (New-Object System.Text.UTF8Encoding($false)))
  Write-Step '已从 profile 移除主题依赖与 bundles'

  foreach ($name in $PluginNames) {
    $target = Join-Path $pluginsDir $name
    if (Test-Path -LiteralPath $target) {
      Remove-Item -LiteralPath $target -Recurse -Force
      Write-Step "已删除插件 $name"
    }
  }

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

  Write-Step '卸载完成。主题配置仍保留在 DSH 的 localStorage 中。'
  if (-not $NoLaunch -and (Test-Path -LiteralPath $exe)) {
    Start-Process -FilePath $exe
  }
} catch {
  Write-Host ''
  Write-Host '卸载失败：' -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  exit 1
}

exit 0
