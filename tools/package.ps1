[CmdletBinding()]
param(
  [string]$Source = '',
  [string]$OutputDir = '',
  [switch]$SkipChecksum
)

# 打发布包：复制插件与脚本，生成 checksums.txt，然后压缩成 zip。
# 用法：
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\package.ps1
# 前置条件：plugins\parallax-bg\client.js 已构建（见 BUILDING.md）。

$ErrorActionPreference = 'Stop'

function Write-Step([string]$Text) {
  Write-Host "[package] $Text" -ForegroundColor Cyan
}

$root = if ([string]::IsNullOrWhiteSpace($Source)) {
  Split-Path -Parent $PSScriptRoot
} else {
  (Resolve-Path -LiteralPath $Source).Path
}
$outputDir = if ([string]::IsNullOrWhiteSpace($OutputDir)) {
  Join-Path $root 'dist'
} else {
  (New-Item -ItemType Directory -Force -Path $OutputDir).FullName
}
$version = (Get-Content -LiteralPath (Join-Path $root 'VERSION.txt') -Raw).Trim()
if (-not $version) { throw '找不到 VERSION.txt 或内容为空。' }

$stage = Join-Path $outputDir ("DSH-EXV-Theme-$version")
$zip = "$stage.zip"
$plugins = @('flat-corners', 'cyan-theme', 'parallax-bg')
$extras = @(
  'install.cmd', 'install.ps1', 'uninstall.cmd', 'uninstall.ps1',
  'README.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md', 'BUILDING.md', 'VERSION.txt'
)

$built = Join-Path $root 'plugins\parallax-bg\client.js'
if (-not (Test-Path -LiteralPath $built)) {
  throw "缺少构建产物 plugins\parallax-bg\client.js。请先运行：node tools/build-parallax.mjs"
}

Write-Step "打包版本 $version"
if (Test-Path -LiteralPath $stage) { Remove-Item -LiteralPath $stage -Recurse -Force }
if (Test-Path -LiteralPath $zip) { Remove-Item -LiteralPath $zip -Force }
New-Item -ItemType Directory -Force -Path (Join-Path $stage 'plugins') | Out-Null

foreach ($name in $plugins) {
  $source = Join-Path $root "plugins\$name"
  if (-not (Test-Path -LiteralPath $source)) { throw "缺少插件目录：$source" }
  Copy-Item -LiteralPath $source -Destination (Join-Path $stage "plugins\$name") -Recurse -Force
  Write-Step "已复制插件 $name"
}

foreach ($file in $extras) {
  $source = Join-Path $root $file
  if (Test-Path -LiteralPath $source) {
    Copy-Item -LiteralPath $source -Destination (Join-Path $stage $file) -Force
  } else {
    Write-Host "  跳过（不存在）：$file" -ForegroundColor DarkGray
  }
}

if (-not $SkipChecksum) {
  $lines = New-Object System.Collections.Generic.List[string]
  $lines.Add("# DSH EXV Theme $version payload checksums")
  $lines.Add("# format: <sha256>  <path relative to the package root>")
  $files = Get-ChildItem -LiteralPath (Join-Path $stage 'plugins') -Recurse -File | Sort-Object FullName
  foreach ($file in $files) {
    $relative = $file.FullName.Substring($stage.Length + 1).Replace('\', '/')
    $hash = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLower()
    $lines.Add("$hash  $relative")
  }
  Set-Content -LiteralPath (Join-Path $stage 'checksums.txt') -Value $lines -Encoding ASCII
  Write-Step "已生成 checksums.txt（$($files.Count) 个文件）"
}

Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $zip -CompressionLevel Optimal -Force

$payload = (Get-ChildItem -LiteralPath (Join-Path $stage 'plugins') -Recurse -File | Measure-Object Length -Sum).Sum
$zipItem = Get-Item -LiteralPath $zip
$sha256 = (Get-FileHash -LiteralPath $zip -Algorithm SHA256).Hash.ToLower()
Write-Step '完成'
Write-Host ("  目录  : {0}" -f $stage)
Write-Host ("  zip   : {0} ({1:N2} MB)" -f $zip, ($zipItem.Length / 1MB))
Write-Host ("  payload: {0:N2} MB" -f ($payload / 1MB))
Write-Host ("  sha256: {0}" -f $sha256)
