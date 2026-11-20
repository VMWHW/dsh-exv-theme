# DSH EXV THEME
给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的 WIN10 直角科幻风 HUD 主题包，整包自包含，不联网，不依赖外部资源服务。
A Windows 10-style self-contained sci-fi HUD theme for DeepSeek Harness, no network calls, no external asset server.

<img width="720" height="405" alt="EXV-boot-visual-0 1 1-release-720" src="https://github.com/user-attachments/assets/5e9ee558-d405-4b7d-8ca1-d1226a092992" />

插件将整个 Wallpaper Engine 搬进DSH(甚至在一些方面超越了小红车),拥有惊人的视觉效果和酷炫且实用的各类功能,兼顾中高端硬件用户的极致美观要求和低端硬件用户的性能要求,还内置本地实时渲染的开机动画;
对整个软件几乎所有控件和UI元素进行大改,拥有可分别设置不同模式、可随意调整位置和大小、可任意开关的组件系统: 包含时钟/峰谷/余额/记事本(和待办模式)/超级剪贴板(可一键保存、自由取用文字、图片乃至文件)；
同时拥有超高的自定义程度,允许对整个动态壁纸系统进行数十项改动,包括光标点击涟漪、各图层对鼠标的差别跟踪、呼吸效果、光效强度和范围、各图层分辨率和帧率、代码雨与模拟荧光屏扫描波的样式,甚至Live2D角色在你挂机时偷瞄你一眼、以及偷瞄时是否朝你做个小表情的开关等等;
还可以打开桌面模式,长按左键模拟对动态角色的拖拽效果,在等待肥鱼思考时隐藏对话流,享受和交互壁纸本身。

## 安装 / Install

### 1. GUI
侧边栏 **插件 → 添加插件**，填入 `dsh-exv-theme`，装完重启 DSH。填入 `dsh-exv-theme-visual`以额外安装visual视觉增强包，增强包**完全免费、可选、自愿安装**

<img width="563" height="388" alt="image" src="https://github.com/user-attachments/assets/ed147df0-73bc-4731-81f8-bcf3b583c61b" />

### 2. 命令行
```bash
dsh plugin --profile desktop add dsh-exv-theme   # 桌面端
dsh plugin --profile web add dsh-exv-theme       # Web / CLI
```

装好后 Plugins 页会多一个 bundle：青色 HUD、视差背景、去圆角三个子插件，可以单独开关。从 2.2.x 升级请先卸载旧版（旧包名 `@local/*`），离线安装器会自动清理。

### 3. 离线安装器（推荐给不想碰命令行的）
从 [Releases](../../releases) 下载 `DSH-EXV-Theme-<版本>-Setup.exe`，双击即用：
- 单个 exe，离线运行，不需要 npm、也不需要联网；内置全部插件载荷，解包自己完成。
- 列表里勾选要装的包（三个子插件默认全选），点「开始安装」；安装时会先关掉 DSH，装完可以顺手勾上「安装完成后启动 DSH」。
- 装过的机器再运行一次就是更新：它同时充当包管理器，取消勾选的包会被摘掉。
- 右边红色「一键卸载」会把这套装整体移除，不写注册表、不装服务、文件都在 `~/.dsh` 下，卸载后配置仍保留在 localStorage。
- 卸载前不需要「二次确认」：能打开安装器、专门去点那个红色按钮的人，显然不是手滑；真要装回来再双击一次就行。
- 安装器不单独维护版本号，它总是跟同一次 Release 的本体版本一致（文件名里的版本就是本体版本）。

也可以继续用离线的 zip：解压后双击 `install.cmd`，效果一样，只是少了选装和卸载界面。EXE安装器会一直与增强包的最新版同步更新。

## 功能 / Features
<img width="984" height="608" alt="image" src="https://github.com/user-attachments/assets/dfea3785-cff1-48c7-9dc7-8009f0f6eb0e" />

- **主题色**：6 张色卡（EXV Cyan / Blue_Whale / Wild_Fire / Lemon_Juice / Leaf_Ocean / FulFilled_Void），整套界面、数码管、画布动效、预设缩略图与开场动画一起换色；换色保存后重启 DSH 生效。
<img width="986" height="609" alt="image" src="https://github.com/user-attachments/assets/6c1624e6-0a30-494b-8bdb-526fd3d37106" />

- **背景**：default / chips / cyberpunk / starsky / frankfurt / darkness（纯黑）/ **自定义纯色**（色相、饱和度、明度三条滑条，拖动即时变色）七种；可调节位移呼吸、亮度呼吸。
<img width="85" height="277" alt="image" src="https://github.com/user-attachments/assets/ad0d7d13-340a-49d6-b5f3-35a94ba849d3" />

- **代码雨 / 格阵**：两层独立，格阵可单独开关；代码雨帧率 30/60、分辨率 720P/1K/2K、密度 25–200%、下落速度 25–200%，支持 2D/3D 扫描波与点击涟漪；字符模式可选「随机 01」或「全 1 余晖」。
<img width="957" height="1116" alt="image" src="https://github.com/user-attachments/assets/77249181-5e93-4adf-a859-69c7aabea34d" />

- **主人物**：关闭 / 静态（9 个立绘，可单独调大小和位置）/ 动态（15 个 Live2D 模型，入场 + 待机循环，眼神与头部跟随鼠标）；偷瞄可单独开关，打开后可再开关按模型支持的随机微表情。
<img width="1043" height="527" alt="image" src="https://github.com/user-attachments/assets/94ff2f43-612c-4fe3-a18a-d16f3dc702fc" />

- **LOGO**：可开关、调大小与呼吸。
<img width="439" height="558" alt="image" src="https://github.com/user-attachments/assets/af02c78d-8c09-49f7-90d1-1de50be14103" />

- **HUD 组件**：时间 / 峰谷状态 / 余额 / 剪贴板 / 笔记待办，可拖动、缩放、单独开关；余额支持本金与赠金明细、实时消耗速率；时钟和余额支持「完整 / 极简」，剪贴板支持 1 / 2 / 3 格。
- **笔记 / 待办**：内置的记事本组件，笔记和待办两种模式，支持折叠、改大小、拖动、字号调节、条目拖动排序；内容由宿主端插件存在 `~/.dsh/notepad/` 下（纯文本 + JSON），换会话也在。
<img width="1466" height="990" alt="image" src="https://github.com/user-attachments/assets/d0329340-de7a-451b-8703-383809d9e93a" />

- **配置预设**：把整套外观和 HUD 布局（组件位置、缩放、显隐、模式、剪贴板/记事本尺寸）存成预设，点一下完整套用；「开场动画」「按钮自动缩回」这类功能开关也会一起保存和恢复。预设按文件夹分组（默认&模板 / 预置静态 / 预置动态 / 用户自定义），标题可点开合；新建的预设自动落在「用户自定义」。出厂预设全部不可删除，卡片角上标出类型（默认 / 静态 / 动态 / 极简 / 模板），带筛选树，标签支持同类多选；缩略图按每条预设自己的主色渲染，打开预设页自动生成。
- **开场动画**：主题加载时全屏播一次 EXV 出水面动画（约 11 秒），单击 / 任意按键 / Esc 跳过；设置 → 其他 → 开场动画可关，默认开。
- **其他**：桌面模式、拖拽照明、指针照明、方角界面（flat-corners）；输入框旁三颗模式按钮可悬停展开，是否在打开模式后自动缩回可在「其他 → 工具按钮」里调。

## 视觉增强包 / Visual pack
<img width="2560" height="1403" alt="image" src="https://github.com/user-attachments/assets/8bd83c3d-51d9-4cfe-992e-f45007add823" />

本体之外还有一个可选的视觉增强包（仓库：[VMWHW/dsh-exv-theme-visual](https://github.com/VMWHW/dsh-exv-theme-visual)，npm 包 `dsh-exv-theme-visual`），专为性能强劲的机器提供极致的视觉效果与4K级超高清资源：
- **实时渲染开场动画**
- **无极调色**
- **全局实时后期特效**：色差（弱 / 标准 / 强三档）、溢光、颗粒、CRT、光晕、暗角
- **超高清背景**：六张 Battlefield 3 官方CG原图

安装：`dsh plugin --profile desktop add dsh-exv-theme-visual`，或在离线安装器里勾上「视觉增强包」。

> **版本要求：本体 2.7.0 及以上。** 更早的本体没有后效灯所需的设置行类型，装上增强包后「后效」页只会显示强度与提示、看不到六盏灯。

## 系统要求 / Requirements
- Windows 10 / 11（x64）桌面端；Web 端同样可用。
- DeepSeek Harness `>= 0.2.2-rc.1 < 0.3.0`（`engines.dsh`）。
- 主题依赖宿主的内部 DOM 结构与类名，DSH 大版本升级后需要等主题跟进，目前rc-5已经过测试完全可用。

## 权限与数据 / Permissions
- 不访问网络，不上传任何数据。
- 唯一读写用户文件的地方是内置小本本：宿主端插件在 `~/.dsh/notepad/` 下写 `小本本.txt` 和 `todo.json`，只写这两个文件。
- 不调用系统命令，不修改宿主安装目录。
- 离线安装器只做三件事：把插件复制到 `~/.dsh/plugins`、改 `~/.dsh/profiles/desktop/package.json`、在 profile 里建插件链接；不写注册表。
- 其余数据都在 `localStorage`（主题配置、预设、HUD 布局、缩略图缓存）；卸载后配置保留，可在设置里清除。

## 卸载 / Uninstall
- **Plugins** 页找到 `dsh-exv-theme` → Remove；或
  ```bash
  dsh plugin --profile desktop remove dsh-exv-theme
  ```
- 离线版：双击 `uninstall.cmd`，或再运行一次安装器点「一键卸载」。

## 从源码构建 / Build from source
`plugins/parallax-bg/client.js` 是约 40 MB 的构建产物，**不进 git**，只随 Release 和 npm 包分发。需要自行构建时见 [BUILDING.md](BUILDING.md)：准备 `assets/`（图片与 Live2D 模型）和 `vendor/`（Cubism Core / Pixi / cubism4），然后运行
```bash
node tools/build-parallax.mjs
```

离线安装器也能自己打：
```bash
node tools/build-installer.mjs            # 出 zip + Setup.exe（exe 落在 _build/out）
node tools/build-installer.mjs --packs core   # 只打本体三个包
```

## 许可证与第三方 / License
- 本项目自写的代码采用 [MIT](LICENSE) 许可。
- `parallax-bg` 内嵌的 Live2D Cubism Core、pixi.js、pixi-live2d-cubism4，以及《少女前线》的模型与美术素材**不在 MIT 范围内**，详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
- 本项目是爱好者作品，与 Sunborn / MICA Team / Live2D 株式会社没有隶属或授权关系；角色素材仅供学习与个人测试，请勿用于商业用途。

## 联系 / Contact
报 bug、提需求请开 Issue.
- GitHub：[@VMWHW](https://github.com/VMWHW)
- QQ：2205206455
- QQ 频道：extervention · https://pd.qq.com/s/1mqvuu5pl
- B 站：https://space.bilibili.com/1993141778
- 网易云音乐：https://music.163.com/#/user/home?id=1815721565
- 工作站（文件存档）：https://ht.ys168.com/?dlmc=extervention

---
这个主题没有团队，也没有使用外部协助。是我一个人，加上很多个深夜和很多轮对话，用上百亿token，上万字提示词，20余轮满上下文会话，和我自己实际上手的修改，才终于将这个主题包做得稍微像样了点。

如果它对上了你的电波，让 DSH 客户端变得更符合你的审美、也更实用，不妨动动小手点个 Star，或者转给同样在寻求 DSH 美化包的人——这是对我和我的助手最实在的支持。相信那无数个她也会和我一样开心。我们做得很慢，但会一直稳步推进下去，让这个插件不负我们这一路的坎坷。
