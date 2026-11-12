# DSH EXV Theme

给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的科幻 HUD 主题包：纯黑底、青色 HUD、分层视差背景、代码雨与扫描波、15 个 Live2D 主人物，以及一套能自己摆放的 HUD 组件。整包自包含，不联网，不依赖外部资源服务。

A self-contained sci-fi HUD theme for DeepSeek Harness: black and cyan, parallax backdrop, code rain, 15 Live2D characters and a HUD you can arrange yourself. No network calls, no external asset server.

<img width="720" height="405" alt="EXV 开场动画" src="https://github.com/user-attachments/assets/185fe334-082f-4f73-bd4c-030e34a058e4" />

<img width="2560" height="1440" alt="EXV theme screenshot" src="https://github.com/user-attachments/assets/81479d15-ee22-496d-b08e-70d3425adbcf" />
<img width="1164" height="761" alt="EXV theme screenshot" src="https://github.com/user-attachments/assets/6776baa6-0037-4aa7-81f3-ddfd19eb3fd9" />
<img width="1164" height="540" alt="EXV theme screenshot" src="https://github.com/user-attachments/assets/ebb79364-d4fb-4806-9ea1-cc9436a773c1" />
<img width="808" height="809" alt="EXV theme screenshot" src="https://github.com/user-attachments/assets/cb75588d-ba86-4986-bd5e-2e9e56d4cd84" />

## 安装 / Install

侧边栏 **Plugins → Add plugin**，填入 `dsh-exv-theme`，装完重启 DSH。

```bash
dsh plugin --profile desktop add dsh-exv-theme   # 桌面端
dsh plugin --profile web add dsh-exv-theme       # Web / CLI
```

装好后 Plugins 页会多一个 bundle：青色 HUD、视差背景、去圆角三个子插件，可以单独开关。不想走 npm 就用 [Releases](../../releases) 里的离线包——解压、双击 `install.cmd`。从 2.2.x 升级请先卸载旧版（旧包名 `@local/*`），离线安装器会自动清理。

## 功能 / Features

- **背景**：default / chips / cyberpunk / starsky / frankfurt 五种预设，可调节位移呼吸、亮度呼吸。
- **代码雨**：帧率 30/60、分辨率 720P/1K/2K、密度 25–200%、下落速度 25–200%，支持 2D/3D 扫描波与点击涟漪；字符模式可选「随机 01」或「全 1 余晖」。
- **主人物**：关闭 / 静态（9 个立绘）/ 动态（15 个 Live2D 模型，入场 + 待机循环，眼神与头部跟随鼠标）；偷瞄可单独开关，打开后可再开关按模型支持的随机微表情。
- **LOGO**：三种预设，可调大小与呼吸。
- **HUD 组件**：时间 / 峰谷状态 / 余额 / 剪贴板 / 笔记待办，可拖动、缩放、单独开关；余额支持本金与赠金明细、实时消耗速率；时钟和余额支持「完整 / 极简」，剪贴板支持 1 / 2 / 3 格。
- **笔记 / 待办**：内置的小本本组件，笔记和待办两种模式，支持折叠、改大小、拖动、字号调节、条目拖动排序；内容由宿主端插件存在 `~/.dsh/notepad/` 下（纯文本 + JSON），换会话也在。
- **配置预设**：把整套外观和 HUD 布局（组件位置、缩放、显隐、模式、剪贴板/记事本尺寸）存成预设，点一下完整套用；出厂 Default 不能删。带筛选树（功能性 / 分辨率 / 主人物 / 专属角色 / 呼吸 / 情景 / 动效），新建时自动打标。每张预设卡都有缩略图，首次打开预设页点一次「允许预渲染」在本机生成，之后直接读缓存。
- **开场动画**：主题加载时全屏播一次 EXV 出水面动画（约 11 秒），单击 / 任意按键 / Esc 跳过；设置 → 其他 → 开场动画可关，默认开。
- **其他**：桌面模式、拖拽照明、指针照明、方角界面（flat-corners）。

配置保存在浏览器 `localStorage`（`dsh-exv-theme.config.v1`），预设和 HUD 布局另有自己的键；面板左下角可一键恢复默认。

## 系统要求 / Requirements

- Windows 10 / 11（x64）桌面端；Web 端同样可用。
- DeepSeek Harness `>= 0.2.2-rc.1 < 0.3.0`（`engines.dsh`）。
- 主题依赖宿主的内部 DOM 结构与类名，DSH 大版本升级后需要等主题跟进。

## 权限与数据 / Permissions

- 不访问网络，不上传任何数据。
- 唯一读写用户文件的地方是内置小本本：宿主端插件在 `~/.dsh/notepad/` 下写 `小本本.txt` 和 `todo.json`，只写这两个文件。
- 不调用系统命令，不修改宿主安装目录。
- 其余数据都在 `localStorage`（主题配置、预设、HUD 布局、缩略图缓存）；卸载后配置保留，可在设置里清除。

## 卸载 / Uninstall

- **Plugins** 页找到 `dsh-exv-theme` → Remove；或
  ```bash
  dsh plugin --profile desktop remove dsh-exv-theme
  ```
- 离线版：双击 `uninstall.cmd`。

## 默认设置 / Defaults

- Live2D 帧率 120（30/60/90/120）
- 代码雨 30 FPS、1K（1080）、密度与速度 100%（2.4.0 起；想要更细的雨或更高清的颗粒可以在面板里调 60 FPS / 2K）
- 拖拽照明强度 100%（滑条居中）
- 暂停策略：仅页面最小化时暂停；切到其他窗口继续运行

## 已知限制 / Known limitations

- M4 SOPMOD II 4507 N/D 与 M4 SOPMOD II MOD 三个模型本身没有眼动参数，面板会自动隐藏眼动开关。
- 微表情按模型实际绑定开放：部分模型只支持其中几种动作，VECTOR 1901 目前只保留偷瞄。
- 首次加载与冷切换 Live2D 模型需要解码资源，会有一瞬间卡顿；切换过的模型（LRU 2）可秒切。
- 2K + 120 帧对集成显卡有压力，可在面板里降档。
- 桌面模式只隐藏主对话流，输入框仍保留。
- 4K 全屏下扫描波峰值仍可能掉帧（2K 分辨率满帧）。
- 预设缩略图第一次打开预设页需要点一次「允许预渲染」（在本机生成并缓存，约 1 秒）。

## 从源码构建 / Build from source

`plugins/parallax-bg/client.js` 是约 40 MB 的构建产物，**不进 git**，只随 Release 和 npm 包分发。需要自行构建时见 [BUILDING.md](BUILDING.md)：准备 `assets/`（图片与 Live2D 模型）和 `vendor/`（Cubism Core / Pixi / cubism4），然后运行

```bash
node tools/build-parallax.mjs
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
