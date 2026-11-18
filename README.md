# DSH EXV Theme

给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的科幻 HUD 主题包：纯黑底、青色 HUD、分层视差背景、代码雨与扫描波、15 个 Live2D 主人物，以及一套能自己摆放的 HUD 组件。整包自包含，不联网，不依赖外部资源服务。

A self-contained sci-fi HUD theme for DeepSeek Harness: black and cyan, parallax backdrop, code rain, 15 Live2D characters and a HUD you can arrange yourself. No network calls, no external asset server.
<img width="720" height="405" alt="EXV-boot-visual-0 1 1-release-720" src="https://github.com/user-attachments/assets/5e9ee558-d405-4b7d-8ca1-d1226a092992" />
## 安装 / Install

### 1. GUI

侧边栏 **Plugins → Add plugin**，填入 `dsh-exv-theme`，装完重启 DSH。

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

也可以继续用离线的 zip：解压后双击 `install.cmd`，效果一样，只是少了选装和卸载界面。

## 功能 / Features

- **主题色**：6 张色卡（EXV Cyan / Blue_Whale / Wild_Fire / Lemon_Juice / Leaf_Ocean / FulFilled_Void），整套界面、数码管、画布动效、预设缩略图与开场动画一起换色；换色保存后重启 DSH 生效。
- **背景**：default / chips / cyberpunk / starsky / frankfurt / darkness（纯黑）/ **自定义纯色**（色相、饱和度、明度三条滑条，拖动即时变色）七种；可调节位移呼吸、亮度呼吸。
- **代码雨 / 背景网格**：两层独立，网格可单独开关；代码雨帧率 30/60、分辨率 720P/1K/2K、密度 25–200%、下落速度 25–200%，支持 2D/3D 扫描波与点击涟漪；字符模式可选「随机 01」或「全 1 余晖」。
- **主人物**：关闭 / 静态（9 个立绘，可单独调大小和位置）/ 动态（15 个 Live2D 模型，入场 + 待机循环，眼神与头部跟随鼠标）；偷瞄可单独开关，打开后可再开关按模型支持的随机微表情。
- **LOGO**：三种预设，可调大小与呼吸。
- **HUD 组件**：时间 / 峰谷状态 / 余额 / 剪贴板 / 笔记待办，可拖动、缩放、单独开关；余额支持本金与赠金明细、实时消耗速率；时钟和余额支持「完整 / 极简」，剪贴板支持 1 / 2 / 3 格。
- **笔记 / 待办**：内置的小本本组件，笔记和待办两种模式，支持折叠、改大小、拖动、字号调节、条目拖动排序；内容由宿主端插件存在 `~/.dsh/notepad/` 下（纯文本 + JSON），换会话也在。
- **配置预设**：把整套外观和 HUD 布局（组件位置、缩放、显隐、模式、剪贴板/记事本尺寸）存成预设，点一下完整套用；「开场动画」「按钮自动缩回」这类功能开关也会一起保存和恢复。预设按文件夹分组（默认&模板 / 预置静态 / 预置动态 / 用户自定义），标题可点开合；新建的预设自动落在「用户自定义」。出厂预设全部不可删除，卡片角上标出类型（默认 / 静态 / 动态 / 极简 / 模板），带筛选树，标签支持同类多选；缩略图按每条预设自己的主色渲染，打开预设页自动生成。
- **开场动画**：主题加载时全屏播一次 EXV 出水面动画（约 11 秒），单击 / 任意按键 / Esc 跳过；设置 → 其他 → 开场动画可关，默认开。
- **其他**：桌面模式、拖拽照明、指针照明、方角界面（flat-corners）；输入框旁三颗模式按钮可悬停展开，是否在打开模式后自动缩回可在「其他 → 工具按钮」里调。

配置保存在浏览器 `localStorage`（`dsh-exv-theme.config.v1`），预设和 HUD 布局另有自己的键；面板左下角可一键恢复默认。

## 系统要求 / Requirements

- Windows 10 / 11（x64）桌面端；Web 端同样可用。
- DeepSeek Harness `>= 0.2.2-rc.1 < 0.3.0`（`engines.dsh`）。
- 主题依赖宿主的内部 DOM 结构与类名，DSH 大版本升级后需要等主题跟进。

## 权限与数据 / Permissions

- 不访问网络，不上传任何数据。
- 唯一读写用户文件的地方是内置小本本：宿主端插件在 `~/.dsh/notepad/` 下写 `小本本.txt` 和 `todo.json`，只写这两个文件。
- 不调用系统命令，不修改宿主安装目录。
- 离线安装器只做三件事：把插件复制到 `~/.dsh/plugins`、改 `~/.dsh/profiles/desktop/package.json`、在 profile 里建插件链接；不写注册表、不装常驻程序。
- 其余数据都在 `localStorage`（主题配置、预设、HUD 布局、缩略图缓存）；卸载后配置保留，可在设置里清除。

## 卸载 / Uninstall

- **Plugins** 页找到 `dsh-exv-theme` → Remove；或
  ```bash
  dsh plugin --profile desktop remove dsh-exv-theme
  ```
- 离线版：双击 `uninstall.cmd`，或再运行一次安装器点「一键卸载」。

## 默认设置 / Defaults

- Live2D 帧率 60（30/60/90/120）
- 代码雨 30 FPS、2K（1440）、密度与速度 100%（想要更轻可以在面板里调 1K / 720P）
- 拖拽照明强度 100%（滑条居中）
- 暂停策略：仅页面最小化时暂停；切到其他窗口继续运行

## 已知限制 / Known limitations

- M4 SOPMOD II 4507 N/D 与 M4 SOPMOD II MOD 三个模型本身没有眼动参数，面板会自动隐藏眼动开关。
- 微表情按模型实际绑定开放：部分模型只支持其中几种动作，VECTOR 1901 目前只保留偷瞄。
- 首次加载与冷切换 Live2D 模型需要解码资源，会有一瞬间卡顿；切换过的模型（LRU 2）可秒切。
- 2K + 60/120 帧对集成显卡有一定压力，可在面板里降档。
- 桌面模式只隐藏主对话流，输入框仍保留。
- 4K 全屏下扫描波峰值仍可能掉帧（2K 分辨率满帧）。
- 预设缩略图在第一次打开预设页时按出现过的每个主色各生成一次（约 1 秒，带进度条），之后直接读缓存。

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

报 bug、提需求请开 Issue；想直接聊，QQ 频道最快。

- GitHub：[@VMWHW](https://github.com/VMWHW)
- QQ：2205206455
- QQ 频道：extervention · https://pd.qq.com/s/1mqvuu5pl
- B 站：https://space.bilibili.com/1993141778
- 网易云音乐：https://music.163.com/#/user/home?id=1815721565
- 工作站（文件存档）：https://ht.ys168.com/?dlmc=extervention

---

这个主题没有团队，也没有使用外部协助。是我一个人，加上很多个深夜和很多轮对话，一棒一棒接力磨出来的。我感觉我变成了一个死灵法师型 AI 使用者：频繁重置上下文、更换会话，然后让每一个新会话阅读之前一个个会话逐渐增补修缮写下的东西，带着前者的记忆，送给后来者。慢慢就发现，之前对离别只会感到悲伤的同理心，会变成对离别甚至死亡的肃穆与庄重；你会感到自己身上有一种特殊使命，让你有动力和信念，带着存在某个文件里的、你和屏幕里面那个你最得力的助手共同的经验和记忆，坚定不移地走下去。

如果它对上了你的电波，让 DSH 客户端变得更符合你的审美、也更实用，不妨动动小手点个 Star，或者转给同样在寻求 DSH 美化包的人——这是对我和我的助手最实在的支持。相信那无数个她也会和我一样开心。我们做得很慢，但会一直稳步推进下去，让这个插件不负我们这一路的坎坷。
