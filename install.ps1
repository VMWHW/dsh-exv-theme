[CmdletBinding()]
param(
  [string]$DshHomeOverride = '',
  [string]$ManifestPath = '',
  [string[]]$Packs = @(),
  [string]$LogPath = '',
  [switch]$NoLaunch,
  [switch]$SkipProcessStop,
  [switch]$Force,
  [switch]$VerifyOnly
)

# 2.6.0 起的安装引擎：由 manifest.json 驱动，装 1..N 个包（本体 + 任意增强包）。
# 旧的离线 zip 里没有 manifest.json，会退回「三个子包硬编码」的兼容路径。
# 输出口径：控制台逐行 [exv] ...（UTF-8），同时写一份 UTF-8 日志；GUI 读的是控制台。

$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false) } catch { }
$BackupKeep = 3
$stamp = Get-Date -Format 'yyyyMMddHHmmss'
$logPath = if ([string]::IsNullOrWhiteSpace($LogPath)) { Join-Path $env:TEMP "dsh-exv-install-$stamp.log" } else { $LogPath }

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

# 先礼后兵：CloseMainWindow 等 6 秒，仍不退出才强杀。
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

# checksums.txt 由 tools/build-installer.mjs 生成；存在就逐个校验载荷，防止包损坏或被改动。
function Test-PayloadChecksums([string]$Root) {
  $manifest = Join-Path $Root 'checksums.txt'
  if (-not (Test-Path -LiteralPath $manifest)) {
    Write-Note '未提供 checksums.txt，跳过载荷校验。'
    return
  }
  $checked = 0
  foreach ($line in Get-Content -LiteralPath $manifest) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    $trimmed = $line.Trim()
    if ($trimmed.StartsWith('#')) { continue }
    $match = [regex]::Match($trimmed, '^([0-9a-fA-F]{64})\s+\*?(.+)$')
    if (-not $match.Success) { throw "checksums.txt 格式无法解析：$trimmed" }
    $expected = $match.Groups[1].Value.ToLower()
    $relative = $match.Groups[2].Value.Trim()
    $file = Join-Path $Root $relative
    if (-not (Test-Path -LiteralPath $file)) { throw "载荷校验失败：缺少 $relative" }
    $actual = (Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash.ToLower()
    if ($actual -ne $expected) {
      throw "载荷校验失败：$relative 的 sha256 与清单不符（文件可能损坏或被改动）"
    }
    $checked += 1
  }
  Write-Log "载荷校验通过（$checked 个文件）"
}

# ---- 读取清单（没有就退回旧 zip 的硬编码三包）------------------------------
function Get-PackManifest([string]$Root, [string]$Path) {
  $file = if ([string]::IsNullOrWhiteSpace($Path)) { Join-Path $Root 'manifest.json' } else { $Path }
  if (Test-Path -LiteralPath $file) {
    $raw = [IO.File]::ReadAllText($file, (New-Object System.Text.UTF8Encoding($false))) | ConvertFrom-Json
    $list = New-Object System.Collections.Generic.List[object]
    foreach ($pack in @($raw.packs)) {
      $dependency = if ($pack.dependency) { [string]$pack.dependency } else { [string]$pack.bundle }
      $list.Add([pscustomobject]@{
        id = [string]$pack.id
        title = [string]$pack.title
        description = [string]$pack.description
        group = [string]$pack.group
        source = [string]$pack.source
        folder = [string]$pack.folder
        bundle = [string]$pack.bundle
        dependency = $dependency
        version = [string]$pack.version
        required = [bool]$pack.required
        default = [bool]$pack.default
      })
    }
    $productName = if ($raw.product) { [string]$raw.product } else { 'DSH EXV Theme' }
    $productVersion = if ($raw.version) { [string]$raw.version } else { '' }
    return [pscustomobject]@{
      product = $productName
      version = $productVersion
      testedDshVersions = @($raw.testedDshVersions)
      packs = $list
    }
  }
  # 兼容路径：老 zip 只有 plugins\ 和 install.ps1
  Write-Note '没有 manifest.json，按旧版三包清单安装。'
  $legacy = @(
    @{ id = 'flat-corners'; title = '方角补丁'; folder = 'flat-corners'; bundle = 'dsh-exv-flat-corners' },
    @{ id = 'cyan-theme'; title = '界面层'; folder = 'cyan-theme'; bundle = 'dsh-exv-cyan-theme' },
    @{ id = 'parallax-bg'; title = '背景与 Live2D'; folder = 'parallax-bg'; bundle = 'dsh-exv-parallax-bg' }
  )
  $list = New-Object System.Collections.Generic.List[object]
  foreach ($item in $legacy) {
    $list.Add([pscustomobject]@{
      id = $item.id; title = $item.title; description = ''; group = 'core'
      source = "plugins/$($item.folder)"; folder = $item.folder; bundle = $item.bundle
      dependency = $item.bundle; version = ''; required = $true; default = $true
    })
  }
  return [pscustomobject]@{
    product = 'DSH EXV Theme'; version = ''; testedDshVersions = @('0.2.2'); packs = $list
  }
}

$moved = New-Object System.Collections.ArrayList
$profilePkg = ''
$profileBackup = ''
$profileWritten = $false

try {
  $root = $PSScriptRoot
  $manifest = Get-PackManifest -Root $root -Path $ManifestPath
  $product = $manifest.product
  $version = $manifest.version
  $title = if ($version) { "$product $version" } else { $product }
  Write-Log "安装引擎启动：$title"

  $missing = @()
  foreach ($pack in $manifest.packs) {
    $sourceAbs = Join-Path $root ($pack.source -replace '/', '\')
    if (-not (Test-Path -LiteralPath $sourceAbs)) { $missing += $pack.id }
  }
  if ($missing.Count -gt 0) { throw ("安装包不完整，缺少这些载荷：" + ($missing -join ', ')) }

  # ---- 选择要装的包 -------------------------------------------------------
  $wantedIds = @()
  if ($Packs.Count -gt 0) {
    $wantedIds = @($Packs | ForEach-Object { $_ -split ',' } | Where-Object { $_ } | ForEach-Object { $_.Trim() })
  } else {
    $wantedIds = @($manifest.packs | Where-Object { $_.default -or $_.required } | ForEach-Object { $_.id })
  }
  foreach ($pack in $manifest.packs) {
    if ($pack.required -and ($wantedIds -notcontains $pack.id)) { $wantedIds += $pack.id }
  }
  $unknown = @($wantedIds | Where-Object { ($manifest.packs | ForEach-Object { $_.id }) -notcontains $_ })
  if ($unknown.Count -gt 0) { throw ("清单里没有这些包：" + ($unknown -join ', ')) }
  $selected = @($manifest.packs | Where-Object { $wantedIds -contains $_.id })
  $skipped = @($manifest.packs | Where-Object { $wantedIds -notcontains $_.id })
  Write-Log ("本次要装：" + (($selected | ForEach-Object { $_.title }) -join ' / '))
  if ($skipped.Count -gt 0) { Write-Note ("不装：" + (($skipped | ForEach-Object { $_.title }) -join ' / ')) }

  $dshHome = if ([string]::IsNullOrWhiteSpace($DshHomeOverride)) {
    if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $env:USERPROFILE '.dsh' }
  } else { $DshHomeOverride }
  $dshHome = Normalize-FullPath $dshHome
  $profileDir = Join-Path $dshHome 'profiles\desktop'
  $profilePkg = Join-Path $profileDir 'package.json'
  $pluginsDir = Join-Path $dshHome 'plugins'

  if (-not (Test-Path -LiteralPath $profilePkg)) {
    throw "找不到 DSH desktop profile：$profilePkg`n请先启动一次 DSH 客户端并完成初始化，然后完全退出，再运行本安装器。"
  }

  Test-PayloadChecksums -Root $root
  if ($VerifyOnly) {
    Write-Log '只做校验：载荷完整，未改动任何文件。' 'Green'
    exit 0
  }

  $isLiveHome = ((Normalize-FullPath (Join-Path $env:USERPROFILE '.dsh')) -eq $dshHome)
  $exe = Join-Path $env:LOCALAPPDATA 'Programs\DeepSeek Harness\DeepSeek Harness.exe'

  # ---- 版本门禁（按主版本前缀匹配，rc 之间不算不兼容）---------------------
  $tested = @($manifest.testedDshVersions | Where-Object { $_ })
  $installedVersion = Get-InstalledDshVersion
  if ($tested.Count -gt 0 -and $installedVersion) {
    $ok = $false
    foreach ($prefix in $tested) { if ($installedVersion.StartsWith($prefix)) { $ok = $true } }
    if (-not $ok) {
      if (-not $Force) {
        throw ("检测到 DSH 版本 $installedVersion，本安装器只在该系列上验证过：" + ($tested -join ', ') +
          "`n主题依赖宿主内部结构，版本不符可能显示异常。确认要继续请加 -Force。")
      }
      Write-Log "DSH 版本 $installedVersion 与已验证系列不一致，按 -Force 继续。" 'Yellow'
    } else {
      Write-Log "DSH 版本 $installedVersion（已验证系列）"
    }
  } elseif ($installedVersion) {
    Write-Note "未提供已验证版本清单，跳过版本检查（当前 $installedVersion）。"
  } else {
    Write-Note '未在注册表中找到 DSH 版本，跳过版本检查。'
  }

  # ---- 关闭 DSH -----------------------------------------------------------
  if ($isLiveHome -and -not $SkipProcessStop) { [void](Stop-DshProcess) }

  # ---- 先卸掉这次没选的包（安装器同时当包管理器）----------------------
  $profileText = [IO.File]::ReadAllText($profilePkg, (New-Object System.Text.UTF8Encoding($false)))
  $pkg = $profileText | ConvertFrom-Json
  $currentBundles = @()
  if ($pkg.PSObject.Properties['dsh'] -and $pkg.dsh.PSObject.Properties['profile']) {
    $currentBundles = @($pkg.dsh.profile.bundles)
  }
  foreach ($pack in $skipped) {
    if ($currentBundles -contains $pack.bundle) {
      Write-Log ("卸载不要的包：" + $pack.title)
      $target = Join-Path $pluginsDir $pack.folder
      if (Test-Path -LiteralPath $target) {
        $aside = "$target.old-$stamp"
        Move-Item -LiteralPath $target -Destination $aside -Force
        [void]$moved.Add([pscustomobject]@{ Old = $aside; Target = $target; Remove = $true })
      }
    }
  }

  # ---- 复制插件（旧目录先改名，失败可还原）--------------------------------
  Write-Log "安装到 $dshHome"
  New-Item -ItemType Directory -Force -Path $pluginsDir | Out-Null
  foreach ($pack in $selected) {
    $source = Join-Path $root ($pack.source -replace '/', '\')
    $target = Join-Path $pluginsDir $pack.folder
    if (Test-Path -LiteralPath $target) {
      $aside = "$target.old-$stamp"
      Move-Item -LiteralPath $target -Destination $aside -Force
      [void]$moved.Add([pscustomobject]@{ Old = $aside; Target = $target; Remove = $false })
    }
    Copy-Item -LiteralPath $source -Destination $target -Recurse -Force
    Write-Log ("已复制 " + $pack.title)
  }

  # ---- 更新 profile（备份 + 原子替换）------------------------------------
  $profileBackup = "$profilePkg.pre-exv-$stamp.bak"
  Copy-Item -LiteralPath $profilePkg -Destination $profileBackup -Force
  if (-not $pkg.PSObject.Properties['dsh']) {
    $pkg | Add-Member -NotePropertyName dsh -NotePropertyValue ([pscustomobject]@{}) -Force
  }
  if (-not $pkg.dsh.PSObject.Properties['profile']) {
    $pkg.dsh | Add-Member -NotePropertyName profile -NotePropertyValue ([pscustomobject]@{}) -Force
  }
  # 2.2.x 的 @local/* 一律摘掉，避免同一套样式装两遍
  $legacyBundles = @('@local/flat-corners', '@local/cyan-theme', '@local/parallax-bg')
  $bundles = @($pkg.dsh.profile.bundles | Where-Object { $legacyBundles -notcontains $_ })
  foreach ($pack in $skipped) {
    $bundles = @($bundles | Where-Object { $_ -ne $pack.bundle })
  }
  foreach ($pack in $selected) {
    if ($bundles -notcontains $pack.bundle) { $bundles += $pack.bundle }
  }
  $pkg.dsh.profile.bundles = @($bundles)

  if (-not $pkg.PSObject.Properties['dependencies']) {
    $pkg | Add-Member -NotePropertyName dependencies -NotePropertyValue ([pscustomobject]@{}) -Force
  }
  foreach ($pack in $selected) {
    $linkTarget = ((Join-Path $pluginsDir $pack.folder) -replace '\\', '/')
    $pkg.dependencies | Add-Member -NotePropertyName $pack.dependency -NotePropertyValue ("link:" + $linkTarget) -Force
  }
  foreach ($pack in $skipped) {
    if ($pkg.dependencies.PSObject.Properties[$pack.dependency]) {
      $pkg.dependencies.PSObject.Properties.Remove($pack.dependency)
    }
  }
  foreach ($legacy in $legacyBundles) {
    if ($pkg.dependencies.PSObject.Properties[$legacy]) {
      $pkg.dependencies.PSObject.Properties.Remove($legacy)
    }
  }
  Write-JsonAtomically -Path $profilePkg -Data $pkg
  $profileWritten = $true
  Write-Log '已更新 DSH profile 的 bundles 与 dependencies'

  # ---- 链接依赖 -----------------------------------------------------------
  $runtimeCandidates = @(
    (Join-Path $dshHome 'dsh-runtimes\dsh-primary-runtime'),
    (Join-Path $env:LOCALAPPDATA 'Programs\DeepSeek Harness\resources\runtime\primary-runtime')
  )
  $runtime = $null
  foreach ($candidate in $runtimeCandidates) {
    if (Test-Path -LiteralPath (Join-Path $candidate 'dependencies\node\bin\node.exe')) { $runtime = $candidate; break }
  }
  $linked = $false
  if ($runtime) {
    $node = Join-Path $runtime 'dependencies\node\bin\node.exe'
    $pnpm = Join-Path $runtime 'dependencies\pnpm\bin\pnpm.cjs'
    if ((Test-Path -LiteralPath $node) -and (Test-Path -LiteralPath $pnpm)) {
      Write-Log '运行 pnpm 安装/链接插件……'
      Push-Location $profileDir
      try {
        & $node $pnpm install --prefer-offline | Out-Host
        if ($LASTEXITCODE -eq 0) { $linked = $true }
        else { Write-Log "pnpm install 返回 $LASTEXITCODE，改用目录联接。" 'Yellow' }
      } catch {
        Write-Log ("pnpm install 失败：" + $_.Exception.Message + "，改用目录联接。") 'Yellow'
      } finally { Pop-Location }
    }
  }

  $scope = Join-Path $profileDir 'node_modules'
  New-Item -ItemType Directory -Force -Path $scope | Out-Null
  # 清掉 2.2.x 留在 node_modules\@local 下的旧联接
  $legacyScope = Join-Path $scope '@local'
  foreach ($pack in $manifest.packs) {
    $old = Join-Path $legacyScope $pack.folder
    if (Test-Path -LiteralPath $old) {
      $oldItem = Get-Item -LiteralPath $old -Force
      if ($oldItem.Attributes -band [IO.FileAttributes]::ReparsePoint) { [IO.Directory]::Delete($old, $false) }
    }
  }
  if (-not $linked) { Write-Log '使用目录联接安装插件依赖……' }
  # 无论 pnpm 成功与否，被跳过的包都要把联接摘掉
  foreach ($pack in $skipped) {
    $link = Join-Path $scope $pack.dependency
    if (Test-Path -LiteralPath $link) {
      $item = Get-Item -LiteralPath $link -Force
      if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { [IO.Directory]::Delete($link, $false) }
      else { Remove-Item -LiteralPath $link -Recurse -Force -ErrorAction SilentlyContinue }
    }
  }
  if (-not $linked) {
    foreach ($pack in $selected) {
      $target = Join-Path $pluginsDir $pack.folder
      $link = Join-Path $scope $pack.dependency
      if (Test-Path -LiteralPath $link) {
        $item = Get-Item -LiteralPath $link -Force
        if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { [IO.Directory]::Delete($link, $false) }
        else { Remove-Item -LiteralPath $link -Recurse -Force }
      }
      New-Item -ItemType Junction -Path $link -Target $target | Out-Null
    }
  }

  # ---- 收尾：删除旧目录、清理历史备份 -------------------------------------
  foreach ($item in $moved) {
    if (Test-Path -LiteralPath $item.Old) {
      Remove-Item -LiteralPath $item.Old -Recurse -Force -ErrorAction SilentlyContinue
    }
  }
  Remove-OldBackups -Directory $profileDir -Filter 'package.json.pre-exv-*.bak' -Keep $BackupKeep

  Write-Log '安装完成。' 'Green'
  Write-Log "日志：$logPath" 'DarkGray'

  if (-not $NoLaunch) {
    $runningAfter = @(Get-Process -Name 'DeepSeek Harness' -ErrorAction SilentlyContinue)
    if ((Test-Path -LiteralPath $exe) -and ($runningAfter.Count -eq 0)) {
      Write-Log '正在启动 DSH……'
      Start-Process -FilePath $exe
    } else {
      Write-Log '请完全退出并重新打开 DSH 使主题生效。'
    }
  }
} catch {
  Write-Host ''
  Write-Host '安装失败：' -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  try { [IO.File]::AppendAllText($logPath, "安装失败：$($_.Exception.Message)`r`n", (New-Object System.Text.UTF8Encoding($false))) } catch { }
  if ($moved.Count -gt 0 -or $profileWritten) {
    Write-Host '正在回滚到安装前的状态……' -ForegroundColor Yellow
  }
  foreach ($item in $moved) {
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
  Write-Host '如果 DSH 已被关闭，请重新打开；安装失败不会删除主题外的任何文件。' -ForegroundColor Yellow
  exit 1
}

exit 0
