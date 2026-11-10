# DSH EXV Theme

**DSH EXV Theme** — 为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 制作的科幻 HUD 主题包：纯黑底 + 青色 HUD、分层视差背景、代码雨与扫描波、15 个 Live2D 主人物、可自定义的 HUD 组件。完全自包含，不依赖任何外部资源服务。

A self-contained sci-fi HUD theme pack for DeepSeek Harness: black-and-cyan HUD, layered parallax backdrop, code rain, 15 Live2D characters and a customizable HUD. Everything ships inside the package — no external asset server, no network calls.

<img width="2560" height="1440" alt="EXV theme screenshot" src="https://github.com/user-attachments/assets/81479d15-ee22-496d-b08e-70d3425adbcf" />
<img width="1164" height="761" alt="EXV theme screenshot" src="https://github.com/user-attachments/assets/6776baa6-0037-4aa7-81f3-ddfd19eb3fd9" />
<img width="1164" height="540" alt="EXV theme screenshot" src="https://github.com/user-attachments/assets/ebb79364-d4fb-4806-9ea1-cc9436a773c1" />
<img width="808" height="809" alt="EXV theme screenshot" src="https://github.com/user-attachments/assets/cb75588d-ba86-4986-bd5e-2e9e56d4cd84" />

## 安装 / Install

从 2.3.0 起这是一个标准的 DSH 插件包（一个安装入口，包含三个子插件）。

**图形界面（推荐）**

侧边栏 **Plugins → Add plugin**，填入包名：

```text
dsh-exv-theme
```

**命令行**

```bash
# 桌面端（Windows 客户端）
dsh plugin --profile desktop add dsh-exv-theme

# Web / CLI profile
dsh plugin --profile web add dsh-exv-theme
```

安装完成后重启 DSH（或按提示刷新页面）。主题会在 **Plugins** 页显示为一个 bundle，包含三行可单独开关的插件：

| 插件 | 作用 |
| --- | --- |
| `dsh-exv-cyan-theme` | 黑色 + 青色 HUD、背景编辑面板、组件系统、桌面模式 |
| `dsh-exv-parallax-bg` | 视差背景、代码雨 / 扫描波、15 个 Live2D 主人物 |
| `dsh-exv-flat-corners` | 去掉界面圆角 |

**离线安装包**

不想用插件市场或 npm 时，下载 [Releases](../../releases) 里的 `DSH-EXV-Theme-<版本>.zip`，解压后双击 `install.cmd`。它会关闭 DSH、安装三个插件、更新 profile 并重新启动。两种方式装的是同一套代码。

**从 2.2.x 升级**

2.2.x 的包名是 `@local/*`。请先卸载旧版，再按上面的方式安装 2.3.0；离线安装器会自动清理旧条目。

## 功能 / Features

- **背景**：default / chips / cyberpunk / starsky / frankfurt 五种预设，可调节位移呼吸、亮度呼吸。
- **代码雨**：帧率 30/60、分辨率 720P/1K/2K、密度 25–200%、下落速度 25–200%，支持 2D/3D 扫描波与点击涟漪。
- **主人物**：关闭 / 静态（9 个立绘）/ 动态（15 个 Live2D 模型，入场 + 待机循环，眼神与头部跟随鼠标，待机时会偶尔瞟一眼屏幕中心）。
- **LOGO**：三种预设，可调大小与呼吸。
- **HUD 组件**：时间 / 峰谷状态 / 余额 / 剪贴板，可拖动、缩放、单独开关；余额支持本金与赠金明细、实时消耗速率。
- **其他**：桌面模式、拖拽照明、指针照明、方角界面（flat-corners）。

配置保存在浏览器 `localStorage`（`dsh-exv-theme.config.v1`），面板左下角可一键恢复默认。

## 系统要求 / Requirements

- Windows 10 / 11（x64）桌面端；Web 端同样可用。
- DeepSeek Harness `>= 0.2.2-rc.1 < 0.3.0`（`engines.dsh`）。
- 主题依赖宿主的内部 DOM 结构与类名，DSH 大版本升级后需要等主题跟进。

## 权限与数据 / Permissions

- 不访问网络，不上传任何数据，不读写用户文件。
- 不调用系统命令，不修改宿主安装目录。
- 唯一写入的是 `localStorage` 里的主题配置；卸载后配置保留，可在设置里清除。

## 卸载 / Uninstall

- **Plugins** 页找到 `dsh-exv-theme` → Remove；或
  ```bash
  dsh plugin --profile desktop remove dsh-exv-theme
  ```
- 离线版：双击 `uninstall.cmd`。

## 默认设置 / Defaults

- Live2D 帧率 120（30/60/90/120）
- 代码雨 60 FPS、2K、密度与速度 100%
- 拖拽照明强度 100%（滑条居中）
- 暂停策略：仅页面最小化时暂停；切到其他窗口继续运行

## 已知限制 / Known limitations

- M4 SOPMOD II 4507 N/D 与 M4 SOPMOD II MOD 三个模型本身没有眼动参数，面板会自动隐藏眼动开关。
- 首次加载与冷切换 Live2D 模型需要解码资源，会有一瞬间卡顿；切换过的模型（LRU 2）可秒切。
- 2K + 120 帧对集成显卡有压力，可在面板里降档。
- 桌面模式只隐藏主对话流，输入框仍保留。
- 4K 全屏下扫描波峰值仍可能掉帧（2K 分辨率满帧）。

## 从源码构建 / Build from source

`plugins/parallax-bg/client.js` 是约 40 MB 的构建产物，**不进 git**，只随 Release 和 npm 包分发。需要自行构建时见 [BUILDING.md](BUILDING.md)：准备 `assets/`（图片与 Live2D 模型）和 `vendor/`（Cubism Core / Pixi / cubism4），然后运行

```bash
node tools/build-parallax.mjs
```

## 许可证与第三方 / License

- 本项目自写的代码采用 [MIT](LICENSE) 许可。
- `parallax-bg` 内嵌的 Live2D Cubism Core、pixi.js、pixi-live2d-cubism4，以及《少女前线》的模型与美术素材**不在 MIT 范围内**，详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
- 本项目是爱好者作品，与 Sunborn / MICA Team / Live2D 株式会社没有隶属或授权关系；角色素材仅供学习与个人测试，请勿用于商业用途。

## 反馈 / Feedback

请开 Issue，并附上 DSH 版本、Windows 版本、安装方式（npm / 离线包 / 源码自建）和相关日志。
