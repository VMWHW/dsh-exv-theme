window.__ModuleLoader__.load({
  id: 'dsh-exv-parallax-bg',
  factory(require) {
    const ASSETS = {
      background: 'data:image/webp;base64,__BACKGROUND__',
      logo: 'data:image/webp;base64,__LOGO__',
      wordmark: 'data:image/webp;base64,__WORDMARK__',
      vv: 'data:image/webp;base64,__VV__',
      chips: 'data:image/webp;base64,__CHIPS__',
      cyberpunk: 'data:image/webp;base64,__CYBERPUNK__',
      starsky: 'data:image/webp;base64,__STARSKY__',
      frankfurt: 'data:image/webp;base64,__FRANKFURT__',
      cityflight: 'data:image/webp;base64,__BG_CITYFLIGHT__',
      cz5: 'data:image/webp;base64,__BG_CZ5__',
      deltaheavy: 'data:image/webp;base64,__BG_DELTAHEAVY__',
      overtheclouds: 'data:image/webp;base64,__BG_OVERTHECLOUDS__',
      planetshine: 'data:image/webp;base64,__BG_PLANETSHINE__',
      solar: 'data:image/webp;base64,__BG_SOLAR__',
      spacex: 'data:image/webp;base64,__BG_SPACEX__',
      spacexr: 'data:image/webp;base64,__BG_SPACEXR__',
      sunofbeach: 'data:image/webp;base64,__BG_SUNOFBEACH__',
      vvScarh: 'data:image/webp;base64,__VV_SCARH__',
      vvHk416: 'data:image/webp;base64,__VV_HK416__',
      vvScarl: 'data:image/webp;base64,__VV_SCARL__',
      vvUmp45: 'data:image/webp;base64,__VV_UMP45__',
      vvVector: 'data:image/webp;base64,__VV_VECTOR__',
      vvAk12: 'data:image/webp;base64,__VV_AK12__',
      vvM200: 'data:image/webp;base64,__VV_M200__',
      vvAk74m: 'data:image/webp;base64,__VV_AK74M__',
    };
    /* 预设缩略图的首次预渲染要用同一份素材：把已经装载好的 data URL 暴露到全局，
       cyan-theme 打开预设页时据此在本机画一次缩略图（不额外占包体积）。 */
    try {
      window.__DSH_EXV_ART__ = ASSETS;
    } catch (error) {
      /* 非浏览器环境 */
    }

    const THEME_CONFIG_KEY = 'dsh-exv-theme.config.v1';
    const THEME_VERSION = 3;
    const LIVE2D_DEFAULTS = {"ar15_4508":{"scale":180,"x":-9,"y":52},"ar15mod_n":{"scale":150,"x":1,"y":59},"hk416_3401_n":{"scale":143,"x":3,"y":45},"hk416_3401_d":{"scale":148,"x":0,"y":33},"hk416_805":{"scale":135,"x":1,"y":37},"hk416mod_n":{"scale":155,"x":2,"y":8},"m4_sopmod_ii_4507_n":{"scale":165,"x":1,"y":53},"m4_sopmod_ii_4507_d":{"scale":114,"x":4,"y":0},"m4_sopmod_iimod":{"scale":135,"x":-1,"y":39},"m4a1mod":{"scale":142,"x":2,"y":49},"ro635_4504":{"scale":139,"x":3,"y":37},"ro635mod":{"scale":146,"x":3,"y":49},"ump45mod_n":{"scale":139,"x":0,"y":40},"vector_1901":{"scale":153,"x":16,"y":60},"vector_6701_n":{"scale":170,"x":5,"y":26}};
    /* 主色（2.5.2）：与 cyan 共用配置字段 theme.accent；画布是逐帧画的，
       所以这里缓存当前主色，颜色字符串按需拼，不在每帧做解析。 */
    const ACCENT_DEFAULT = '#00FFF0';
    const FULLBODY_LIVE2D_DEFAULTS = {ar15_4508:[103,0,1],ar15mod_n:[106,0,3],hk416_3401_n:[112,0,6],hk416_3401_d:[139,0,17],hk416_805:[110,0,5],hk416mod_n:[159,0,-2],m4_sopmod_ii_4507_n:[103,0,1],m4_sopmod_ii_4507_d:[131,0,32],m4_sopmod_iimod:[106,0,3],m4a1mod:[106,0,0],ro635_4504:[116,0,8],ro635mod:[104,0,4],ump45mod_n:[109,0,1],vector_1901:[103,0,3],vector_6701_n:[126,0,-2]};
    const accentHexOf = (cfg) => {
      const value = cfg && cfg.theme && cfg.theme.accent;
      return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value) ? value.toUpperCase() : ACCENT_DEFAULT;
    };
    const SOLID_BG_DEFAULT = '#151517';
    const solidColorOf = (value) => (typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value) ? value.toUpperCase() : SOLID_BG_DEFAULT);
    let accentHexNow = ACCENT_DEFAULT;
    let accentCacheHex = '';
    let accentCacheRgb = [0, 255, 240];
    const accentRgbNow = () => {
      if (accentCacheHex !== accentHexNow) {
        accentCacheHex = accentHexNow;
        accentCacheRgb = [
          parseInt(accentCacheHex.slice(1, 3), 16),
          parseInt(accentCacheHex.slice(3, 5), 16),
          parseInt(accentCacheHex.slice(5, 7), 16),
        ];
      }
      return accentCacheRgb;
    };
    const accentRgba = (alpha) => {
      const [r, g, b] = accentRgbNow();
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    };
    /* 2.7.1：格子大小没存过时的初值（按界面比例给），调过之后以存的为准 */
    const CELL_SIZE_BY_SCALE = { '1k': 13, '2k': 16, '4k': 21 };
const THEME_DEFAULTS = {
      version: THEME_VERSION,
      theme: { accent: ACCENT_DEFAULT },
      /* 2.7.1：界面比例（1K / 2K / 4K）。启动常量，和主色一样重启生效。 */
      ui: { scale: '2k' },
      background: { preset: 'default', solidColor: SOLID_BG_DEFAULT, brightness: 100, breathing: { enabled: true, amplitude: 12 } },
      rain: {
        enabled: true,
        grid: true,
        gridBrightness: 100,
        gridBreathing: { enabled: true, amplitude: 50 },
        cellSize: 16,
        fps: 30,
        resolution: 1440,
        density: 100,
        lengthMin: 14,
        lengthMax: 32,
        speed: 100,
        effect: 'rain',
        charMode: 'binary',
        meteorAngleMin: 55,
        meteorAngleMax: 75,
        meteorSpeed: 100,
        meteorTrail: 0.9,
        meteorMode: 'net',
        headGlow: 'glow',
        opacity: 100,
        scanMode: '2d',
        scanSpeed: 100,
        scanBrightness: 100,
        breathing: { enabled: true, amplitude: 12 },
      },
      logos: { preset: 'default', enabled: true, size: 150, corner: 'tr', breathing: { enabled: true, amplitude: 12 } },
      vv: { mode: 'static', preset: 'vv', live2d: 'ar15_4508', fps: 60, renderScale: 'auto', light: { enabled: true, radius: 50, brightness: 50 }, live2dConfig: {"ar15_4508":{"scale":180,"x":-9,"y":52,"eye":true},"ar15mod_n":{"scale":150,"x":1,"y":59,"eye":true},"hk416_3401_n":{"scale":143,"x":3,"y":45,"eye":true},"hk416_3401_d":{"scale":148,"x":0,"y":33,"eye":true},"hk416_805":{"scale":135,"x":1,"y":37,"eye":true},"hk416mod_n":{"scale":155,"x":2,"y":8,"eye":true},"m4_sopmod_ii_4507_n":{"scale":165,"x":1,"y":53,"eye":false},"m4_sopmod_ii_4507_d":{"scale":114,"x":4,"y":0,"eye":false},"m4_sopmod_iimod":{"scale":135,"x":-1,"y":39,"eye":false},"m4a1mod":{"scale":142,"x":2,"y":49,"eye":true},"ro635_4504":{"scale":139,"x":3,"y":37,"eye":true},"ro635mod":{"scale":146,"x":3,"y":49,"eye":true},"ump45mod_n":{"scale":139,"x":0,"y":40,"eye":true},"vector_1901":{"scale":153,"x":16,"y":60,"eye":true},"vector_6701_n":{"scale":170,"x":5,"y":26,"eye":true}}, staticConfig: { scale: 100, x: 0, y: 0 }, glance: { enabled: true, expression: true }, entrance: true, breathing: { enabled: true, amplitude: 12 } },
      pointer: {
        light: { enabled: true, brightness: 100, radius: 60 },
        ripple: { enabled: true, brightness: 100, radius: 550, mode: '2d', speed: 100 },
        press: { enabled: true, brightness: 100, radius: 108 },
      },
      /* 2.7.1：鼠标视差拆到每一层，强度是百分比（100 = 该层原来的默认位移） */
      parallax: {
        bg: { enabled: true, strength: 100 },
        grid: { enabled: true, strength: 100 },
        logos: { enabled: true, strength: 100 },
        vv: { enabled: true, strength: 100 },
        widget: { enabled: true, strength: 100 },
      },
      /* 2.7.1：三小只（输入框旁的工具按钮）：大小、跟随/固定两种模式、固定时的角落与边距 */
      tools: { size: 100, mode: 'follow', corner: 'tr', margin: 10 },
    };
    const THEME_ENUMS = {
      'ui.scale': ['1k', '2k', '4k'],
      'background.preset': ['default', 'chips', 'cyberpunk', 'starsky', 'frankfurt', 'cityflight', 'cz5', 'deltaheavy', 'overtheclouds', 'planetshine', 'solar', 'spacex', 'spacexr', 'sunofbeach', 'darkness', 'solid'],
      'logos.preset': ['default', 'mark', 'text'],
      'logos.corner': ['tr', 'tl', 'br', 'bl'],
      'tools.mode': ['follow', 'fixed'],
      'tools.corner': ['tr', 'tl', 'br', 'bl'],
      'vv.mode': ['none', 'static', 'live2d'],
      'vv.renderScale': ['auto', '1', '1.5', '2'],
      'vv.preset': ['vv', 'scarh', 'hk416', 'scarl', 'ump45', 'vector', 'ak12', 'm200', 'ak74m'],
      'vv.live2d': ["ar15_4508","ar15mod_n","hk416_3401_n","hk416_3401_d","hk416_805","hk416mod_n","m4_sopmod_ii_4507_n","m4_sopmod_ii_4507_d","m4_sopmod_iimod","m4a1mod","ro635_4504","ro635mod","ump45mod_n","vector_1901","vector_6701_n"],
      'rain.scanMode': ['2d', '3d'],
      'rain.effect': ['rain', 'meteor'],
      'rain.meteorMode': ['net', 'volley'],
      'rain.charMode': ['binary', 'zero', 'phosphor'],
      'rain.headGlow': ['glow', 'none', 'streak'],
      'pointer.ripple.mode': ['2d', '3d'],
    };
    const themeClone = (value) => JSON.parse(JSON.stringify(value));
    const themeGroup = (source, name) => (source && typeof source === 'object' && source[name] && typeof source[name] === 'object' ? source[name] : {});
    const themeNumber = (value, min, max, fallback) => {
      const number = Number(value);
      if (!Number.isFinite(number)) return fallback;
      return Math.min(max, Math.max(min, number));
    };
    const themeOneOf = (key, value, fallback) => (THEME_ENUMS[key].indexOf(value) >= 0 ? value : fallback);
    const themeMerge = (base, patch) => {
      if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return patch;
      const out = Object.assign({}, base);
      Object.keys(patch).forEach((key) => {
        const value = patch[key];
        const previous = base ? base[key] : undefined;
        if (value && typeof value === 'object' && !Array.isArray(value) && previous && typeof previous === 'object' && !Array.isArray(previous)) {
          out[key] = themeMerge(previous, value);
        } else {
          out[key] = value;
        }
      });
      return out;
    };
    const themeNormalize = (raw) => {
      const out = themeClone(THEME_DEFAULTS);
      if (!raw || typeof raw !== 'object') return out;
      const legacy = !raw.version || raw.version === 1;
      const amplitude = (value) => {
        const number = Number(value);
        if (!Number.isFinite(number)) return 12;
        return Math.round(legacy ? (number / 100) * 12 : number);
      };
      const breathing = (value) => {
        const source = value && typeof value === 'object' ? value : {};
        return {
          enabled: source.enabled !== false,
          amplitude: Math.round(themeNumber(amplitude(source.amplitude), 0, 24, 12)),
        };
      };
      const background = themeGroup(raw, 'background');
      out.background.preset = themeOneOf('background.preset', background.preset, out.background.preset);
      out.background.breathing = breathing(background.breathing);
      out.background.solidColor = solidColorOf(background.solidColor);
      /* 2.7.1：背景亮度只做压暗（100 = 原样，0 = 全黑），遮罩层由 parallax 自己画 */
      out.background.brightness = Math.round(themeNumber(background.brightness, 0, 100, 100));
      const themeCfg = themeGroup(raw, 'theme');
      out.theme.accent = accentHexOf({ theme: themeCfg });
      /* 2.7.1：界面比例 */
      const uiCfg = themeGroup(raw, 'ui');
      out.ui.scale = themeOneOf('ui.scale', uiCfg.scale, '2k');
      const rain = themeGroup(raw, 'rain');
      out.rain.enabled = rain.enabled !== false;
      out.rain.grid = rain.grid !== false;
      out.rain.gridBrightness = Math.round(themeNumber(rain.gridBrightness, 0, 200, 100));
      /* 2.7.1：格子大小独立于界面比例（界面比例只管间距）。
         没存过这一项时，按界面比例给个初值：1K 13 / 2K 16 / 4K 21，调过之后就以存的为准。 */
      out.rain.cellSize = Math.round(themeNumber(rain.cellSize, 8, 24, CELL_SIZE_BY_SCALE[out.ui.scale] || 16));
      const rainFps = Number(rain.fps);
      out.rain.fps = [30, 60, 90, 120].includes(rainFps) ? rainFps : 60;
      const rainResolution = Number(rain.resolution);
      out.rain.resolution = [720, 1080, 1440, 2160].includes(rainResolution) ? rainResolution : 1440;
      out.rain.density = Math.round(themeNumber(rain.density, 25, 200, 100));
      /* 2.7.1：长度是区间，速度回到单值（旧的区间写法读它较大的那一端）。 */
      const legacySpeed = Number(rain.speed);
      const legacySpeedMax = Number(rain.speedMax);
      const speedRaw = Number.isFinite(legacySpeed)
        ? legacySpeed
        : (Number.isFinite(legacySpeedMax) ? legacySpeedMax : 100);
      out.rain.speed = Math.round(themeNumber(speedRaw, 25, 200, 100));
      const lengthLo = Math.round(themeNumber(rain.lengthMin, 2, 60, 14));
      const lengthHi = Math.round(themeNumber(rain.lengthMax, 2, 60, 32));
      out.rain.lengthMin = Math.min(lengthLo, lengthHi);
      out.rain.lengthMax = Math.max(lengthLo, lengthHi);
      out.rain.charMode = themeOneOf('rain.charMode', rain.charMode, out.rain.charMode);
      /* 2.7.1：头部光晕三档（无光 / 发光 / 强光拉丝）+ 代码雨整层不透明度 */
      out.rain.headGlow = themeOneOf('rain.headGlow', rain.headGlow, 'glow');
      /* 2.7.1：背景特效类型 + 流星雨参数（入射角、速度、网格尾迹、渐隐高度、火力网/集束） */
      out.rain.effect = themeOneOf('rain.effect', rain.effect, 'rain');
      const meteorAngleLo = Math.round(themeNumber(rain.meteorAngleMin, 15, 90, 55));
      const meteorAngleHi = Math.round(themeNumber(rain.meteorAngleMax, 15, 90, 75));
      out.rain.meteorAngleMin = Math.min(meteorAngleLo, meteorAngleHi);
      out.rain.meteorAngleMax = Math.max(meteorAngleLo, meteorAngleHi);
      /* 2.7.1：速度是单值（旧的区间写法读它较大的那一端） */
      const legacyMeteorSpeed = Number(rain.meteorSpeed);
      const legacyMeteorMax = Number(rain.meteorSpeedMax);
      const meteorSpeedRaw = Number.isFinite(legacyMeteorSpeed)
        ? legacyMeteorSpeed
        : (Number.isFinite(legacyMeteorMax) ? legacyMeteorMax : 100);
      out.rain.meteorSpeed = Math.round(themeNumber(meteorSpeedRaw, 25, 300, 100));
      out.rain.meteorTrail = Math.round(themeNumber(rain.meteorTrail, 0, 4, 0.9) * 10) / 10;
      out.rain.meteorMode = themeOneOf('rain.meteorMode', rain.meteorMode, 'net');
      out.rain.opacity = Math.round(themeNumber(rain.opacity, 0, 100, 100));
      out.rain.scanMode = themeOneOf('rain.scanMode', rain.scanMode, out.rain.scanMode);
      out.rain.scanSpeed = Math.round(themeNumber(rain.scanSpeed, 25, 200, 100));
      /* 2.7.1：扫描波有了自己的亮度（100 = 原样）；以前它借用「涟漪亮度」 */
      out.rain.scanBrightness = Math.round(themeNumber(rain.scanBrightness, 0, 200, 100));
      const gridBreathing = rain.gridBreathing && typeof rain.gridBreathing === 'object' ? rain.gridBreathing : {};
      out.rain.gridBreathing = {
        enabled: gridBreathing.enabled !== false,
        /* 2.7.1：字段名与其它呼吸统一成 amplitude（旧配置的 strength 照读） */
        amplitude: Math.round(themeNumber(
          gridBreathing.amplitude !== undefined ? gridBreathing.amplitude : gridBreathing.strength,
          0, 100, 50,
        )),
      };
      out.rain.breathing = breathing(rain.breathing);
      const logos = themeGroup(raw, 'logos');
      out.logos.preset = themeOneOf('logos.preset', logos.preset, out.logos.preset);
      out.logos.enabled = logos.enabled !== false;
      const size = Number(logos.size);
      const scale = Number(logos.scale);
      if (Number.isFinite(size)) {
        out.logos.size = Math.round(themeNumber(size, 75, 225, 150));
      } else if (Number.isFinite(scale)) {
        out.logos.size = Math.round(themeNumber(legacy ? (scale <= 3 ? scale : scale / 100) * 150 : scale, 75, 225, 150));
      }
      out.logos.breathing = breathing(logos.breathing);
      /* 2.7.1：LOGO 改成四角吸附（田字格），默认右上角，和原来的位置一致 */
      out.logos.corner = themeOneOf('logos.corner', logos.corner, 'tr');
      const vv = themeGroup(raw, 'vv');
      out.vv.mode = themeOneOf('vv.mode', vv.mode, out.vv.mode);
      out.vv.preset = themeOneOf('vv.preset', vv.preset, out.vv.preset);
      out.vv.live2d = themeOneOf('vv.live2d', vv.live2d, out.vv.live2d);
      const vvFps = Number(vv.fps);
      out.vv.fps = [30, 60, 90, 120].includes(vvFps) ? vvFps : 60;
      /* 2.7.1：Live2D 渲染倍率（auto = 跟屏幕 DPR，最高 2×）。Pixi renderer 只在创建时定分辨率，改档要重启。 */
      const renderScale = String(vv.renderScale === undefined ? 'auto' : vv.renderScale);
      out.vv.renderScale = ['auto', '1', '1.5', '2'].includes(renderScale) ? renderScale : 'auto';
      const live2dConfig = vv.live2dConfig && typeof vv.live2dConfig === 'object' ? vv.live2dConfig : {};
      out.vv.live2dConfig = {};
      for (const id of ["ar15_4508","ar15mod_n","hk416_3401_n","hk416_3401_d","hk416_805","hk416mod_n","m4_sopmod_ii_4507_n","m4_sopmod_ii_4507_d","m4_sopmod_iimod","m4a1mod","ro635_4504","ro635mod","ump45mod_n","vector_1901","vector_6701_n"]) {
        const def = LIVE2D_DEFAULTS[id] || { scale: 100, x: 0, y: 0 };
        const fullBodyDefault = FULLBODY_LIVE2D_DEFAULTS[id];
        const item = live2dConfig[id] && typeof live2dConfig[id] === 'object' ? live2dConfig[id] : {};
        const normalized = {
          scale: Math.round(themeNumber(item.scale, Math.max(0, def.scale - 100), def.scale + 100, def.scale)),
          x: Math.round(themeNumber(item.x, def.x - 50, def.x + 50, def.x)),
          y: Math.round(themeNumber(item.y, def.y - 80, def.y + 80, def.y)),
          eye: item.eye !== false,
        };
        /* 2.5.2：之前被改成「全身默认」的条目回退成 2.5.1 的默认（幂等；自己调过的保留） */
        if (fullBodyDefault && normalized.scale === fullBodyDefault[0] && normalized.x === fullBodyDefault[1] && normalized.y === fullBodyDefault[2]) {
          normalized.scale = def.scale;
          normalized.x = def.x;
          normalized.y = def.y;
        }
        out.vv.live2dConfig[id] = normalized;
      }
      const vvStatic = vv.staticConfig && typeof vv.staticConfig === 'object' ? vv.staticConfig : {};
      out.vv.staticConfig = {
        scale: Math.round(themeNumber(vvStatic.scale, 50, 200, 100)),
        x: Math.round(themeNumber(vvStatic.x, -50, 50, 0)),
        y: Math.round(themeNumber(vvStatic.y, -80, 80, 0)),
      };
      const vvLight = vv.light && typeof vv.light === 'object' ? vv.light : {};
      /* 2.7.1：三个照明统一成 { enabled, brightness, radius }。
         人物照明旧字段 range / strength 照读，数值语义不变（range=px 半径，strength=亮度乘数）。 */
      out.vv.light = {
        enabled: vvLight.enabled !== false,
        radius: Math.round(themeNumber(vvLight.radius !== undefined ? vvLight.radius : vvLight.range, 0, 100, 50)),
        brightness: Math.round(themeNumber(vvLight.brightness !== undefined ? vvLight.brightness : vvLight.strength, 0, 200, 50)),
      };
      const vvGlance = vv.glance && typeof vv.glance === 'object' ? vv.glance : {};
      out.vv.glance = {
        enabled: vvGlance.enabled !== false,
        expression: vvGlance.expression !== false,
      };
      /* 2.7.1：入场动画（login motion）开关 */
      out.vv.entrance = vv.entrance !== false;
      out.vv.breathing = breathing(vv.breathing);
      const pointer = themeGroup(raw, 'pointer');
      const effect = (value, baseRadius) => {
        if (typeof value === 'boolean') return { enabled: value, brightness: 100, radius: baseRadius };
        const source = value && typeof value === 'object' ? value : {};
        const radius = Number(source.radius);
        const nextRadius = Number.isFinite(radius) && legacy ? (radius / 100) * baseRadius : themeNumber(radius, 0, baseRadius * 2, baseRadius);
        return {
          enabled: source.enabled !== false,
          brightness: Math.round(themeNumber(source.brightness, 0, 200, 100)),
          radius: Math.round(themeNumber(nextRadius, 0, baseRadius * 2, baseRadius)),
        };
      };
      out.pointer.light = effect(pointer.light, 60);
      out.pointer.ripple = effect(pointer.ripple, 550);
      const rippleStyle = pointer.ripple && typeof pointer.ripple === 'object' ? pointer.ripple : {};
      /* 旧的“极简”现在就是 2D；旧的 2D（光带版）已移除 */
      const rippleMode = rippleStyle.mode === 'minimal' ? '2d' : rippleStyle.mode;
      out.pointer.ripple.mode = themeOneOf('pointer.ripple.mode', rippleMode, '2d');
      out.pointer.ripple.speed = Math.round(themeNumber(rippleStyle.speed, 25, 200, 100));
      const press = pointer.press && typeof pointer.press === 'object' ? pointer.press : {};
      const legacyPress = raw.version < 3 && Number(press.strength) === 200;
      /* 2.7.1：拖拽照明也有了自己的范围（以前是「光标半径 × 1.8」算出来的），
         强度改名 brightness（数值语义不变：0–200，100 = 原样）。 */
      out.pointer.press = {
        enabled: press.enabled !== false,
        brightness: legacyPress
          ? 100
          : Math.round(themeNumber(press.brightness !== undefined ? press.brightness : press.strength, 0, 200, 100)),
        radius: Math.round(themeNumber(press.radius, 40, 600, 108)),
      };
      /* 2.7.1：每层一份「鼠标视差」开关 + 强度（百分比，100 = 该层的原始位移） */
      const parallax = themeGroup(raw, 'parallax');
      const parallaxLayer = (name) => {
        const source = parallax[name] && typeof parallax[name] === 'object' ? parallax[name] : {};
        return {
          enabled: source.enabled !== false,
          strength: Math.round(themeNumber(source.strength, 0, 200, 100)),
        };
      };
      out.parallax = {
        bg: parallaxLayer('bg'),
        grid: parallaxLayer('grid'),
        logos: parallaxLayer('logos'),
        vv: parallaxLayer('vv'),
        widget: parallaxLayer('widget'),
      };
      /* 2.7.1：三小只：大小 60–160%，跟随输入框或固定到某个角落（边距是基准值，按窗口短边百分比换算） */
      const tools = themeGroup(raw, 'tools');
      out.tools = {
        size: Math.round(themeNumber(tools.size, 60, 160, 100)),
        mode: themeOneOf('tools.mode', tools.mode, 'follow'),
        corner: themeOneOf('tools.corner', tools.corner, 'tr'),
        margin: Math.round(themeNumber(tools.margin, 0, 100, 10)),
      };
      const motion = themeGroup(raw, 'motion');
      if (motion.breathing === false) {        out.background.breathing.enabled = false;
        out.rain.breathing.enabled = false;
        out.logos.breathing.enabled = false;
        out.vv.breathing.enabled = false;
      }
      return out;
    };
    const themeCreateStore = () => {
      let current = themeNormalize(null);
      try {
        const saved = window.localStorage.getItem(THEME_CONFIG_KEY);
        if (saved) current = themeNormalize(JSON.parse(saved));
      } catch (error) { /* 配置损坏时回落默认 */ }
      let saveTimer = 0;
      const listeners = new Set();
      const snapshot = () => themeClone(current);
      const emit = () => {
        const next = snapshot();
        listeners.forEach((listener) => {
          try { listener(next); } catch (error) { /* 单个订阅失败不影响其他 */ }
        });
        try { window.dispatchEvent(new CustomEvent('dsh-exv:config', { detail: next })); } catch (error) { /* ignore */ }
      };
      return {
        version: THEME_VERSION,
        defaults: themeClone(THEME_DEFAULTS),
        get: snapshot,
        patch(partial) {
          const source = partial && typeof partial === 'object' ? partial : {};
          current = themeNormalize(themeMerge(current, source));
          try {
            window.clearTimeout(saveTimer);
            saveTimer = window.setTimeout(() => {
              try { window.localStorage.setItem(THEME_CONFIG_KEY, JSON.stringify(current)); } catch (error) { /* ignore */ }
            }, 120);
          } catch (error) { /* ignore */ }
          emit();
          return snapshot();
        },
        reset() {
          current = themeNormalize(null);
          try { window.localStorage.setItem(THEME_CONFIG_KEY, JSON.stringify(current)); } catch (error) { /* ignore */ }
          emit();
          return snapshot();
        },
        subscribe(listener) {
          if (typeof listener !== 'function') return () => {};
          listeners.add(listener);
          return () => { listeners.delete(listener); };
        },
      };
    };
    window.__DSH_EXV__ = window.__DSH_EXV__ || themeCreateStore();

    const BACKGROUND_PRESETS = {
      default: {
        image: `url("${ASSETS.background}")`,
        size: 'cover',
      },
      chips: {
        image: `url("${ASSETS.chips}")`,
        size: 'cover',
      },
      cyberpunk: {
        image: `url("${ASSETS.cyberpunk}")`,
        size: 'cover',
      },
      starsky: {
        image: `url("${ASSETS.starsky}")`,
        size: 'cover',
      },
      frankfurt: {
        image: `url("${ASSETS.frankfurt}")`,
        size: 'cover',
      },
      cityflight: {
        image: `url("${ASSETS.cityflight}")`,
        size: 'cover',
      },
      cz5: {
        image: `url("${ASSETS.cz5}")`,
        size: 'cover',
      },
      deltaheavy: {
        image: `url("${ASSETS.deltaheavy}")`,
        size: 'cover',
      },
      overtheclouds: {
        image: `url("${ASSETS.overtheclouds}")`,
        size: 'cover',
      },
      planetshine: {
        image: `url("${ASSETS.planetshine}")`,
        size: 'cover',
      },
      solar: {
        image: `url("${ASSETS.solar}")`,
        size: 'cover',
      },
      spacex: {
        image: `url("${ASSETS.spacex}")`,
        size: 'cover',
      },
      spacexr: {
        image: `url("${ASSETS.spacexr}")`,
        size: 'cover',
      },
      sunofbeach: {
        image: `url("${ASSETS.sunofbeach}")`,
        size: 'cover',
      },
      /* 纯黑：不贴图，露出 #dsh-parallax 自己的黑底 */
      darkness: {
        image: 'none',
        size: 'cover',
      },
      /* 2.6.0：自定义纯色，颜色来自 background.solidColor（backgroundColor 在 applyConfig 里写） */
      solid: {
        image: 'none',
        size: 'cover',
      },
    };

    const VV_PRESETS = {
      vv: ASSETS.vv,
      scarh: ASSETS.vvScarh,
      hk416: ASSETS.vvHk416,
      scarl: ASSETS.vvScarl,
      ump45: ASSETS.vvUmp45,
      vector: ASSETS.vvVector,
      ak12: ASSETS.vvAk12,
      m200: ASSETS.vvM200,
      ak74m: ASSETS.vvAk74m,
    };

        const LIVE2D_ASSETS = __LIVE2D_ASSETS__;

    const BREATH_GROUP = { bg: 'background', rain: 'rain', logos: 'logos', vv: 'vv' };

    /* 2.7.1：界面比例（1K / 2K / 4K）。和主色一样是启动常量——保存后要完全重开 DSH。
       文字大小一律不动，只缩放几何：格阵间距、背景网格点阵、（本体侧）面板默认尺寸。 */
    const UI_SCALES = { '1k': 0.75, '2k': 1, '4k': 1.35 };
    const uiScaleOf = (cfg) => {
      const key = cfg && cfg.ui && cfg.ui.scale;
      return UI_SCALES[key] || 1;
    };
    /* 2.7.1：格阵几何。格子大小（rain.cellSize，8–24px）与界面比例互不绑定：
       界面比例只决定间距（22px × 系数），间距至少要给格子留 2px 间隙。
       画布渲染分辨率（rain.resolution）完全不参与这里——它只管清晰度。 */
    const GRID_MIN_GAP = 2;
    const GRID_BASE_STEP = 22;
    const gridGeometryOf = (cfg, scaleOverride) => {
      const scale = Number.isFinite(scaleOverride) && scaleOverride > 0
        ? scaleOverride
        : uiScaleOf(cfg);
      const rawCell = Number(cfg && cfg.rain ? cfg.rain.cellSize : 16);
      const cell = Number.isFinite(rawCell) ? Math.max(8, Math.min(24, rawCell)) : 16;
      const step = Math.max(cell + GRID_MIN_GAP, GRID_BASE_STEP * scale);
      const gap = step - cell;
      /* 描边按格子大小走（16px 对应 1.5px），最小 1px */
      const edge = Math.max(1, cell * 0.09375);
      return { cell, gap, step, ox: gap, edge };
    };

    /* 背景网格的点阵是 CSS 里的 SVG data URL，颜色写死在 URL 里、吃不到 CSS 变量，
       所以按当前主色重新拼这条规则；2.6.2 起网格跟随主题色，2.7.1 起按格子几何缩放。 */
    let gridGeomNow = { cell: 16, gap: 6, step: 22, ox: 6, edge: 1.5 };
    const gridRule = (hex, geom) => {
      const g = geom && Number.isFinite(geom.step) ? geom : { cell: 16, gap: 6, step: 22, ox: 6, edge: 1.5 };
      const num = (value) => String(Math.round(value * 1000) / 1000);
      const step = g.step;
      const dot = g.cell - g.edge;
      const offX = g.ox + g.edge / 2;
      const offY = g.edge / 2;
      const edge = g.edge;
      return '#dsh-parallax .pl-grid { position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27'
        + num(step) + '%27%20height=%27' + num(step) + '%27%3E%3Crect%20x=%27' + num(offX) + '%27%20y=%27' + num(offY)
        + '%27%20width=%27' + num(dot) + '%27%20height=%27' + num(dot) + '%27%20fill=%27none%27%20stroke=%27%23'
        + String(hex || ACCENT_DEFAULT).replace('#', '').toLowerCase()
        + '%27%20stroke-opacity=%270.18%27%20stroke-width=%27' + num(edge) + '%27/%3E%3C/svg%3E"); background-size: '
        + num(step) + 'px ' + num(step) + 'px; transition: opacity .16s ease; }';
    };
    const syncGridAccent = (geom) => {
      if (geom) gridGeomNow = geom;
      try {
        const st = document.querySelector('style[data-dsh-parallax]');
        if (!st) return;
        st.textContent = st.textContent.replace(/#dsh-parallax \.pl-grid \{[^}]*\}/, gridRule(accentHexNow, gridGeomNow));
      } catch (error) { /* ignore */ }
    };
    const css = [
      'html, body { background: transparent !important; }',
      '#root { position: relative; z-index: 1; background: transparent !important; }',
      'body {',
      '  --dsw-alias-bg-base: transparent !important;',
      '  --dsw-specific-sidebar-fill: rgba(0, 0, 0, 0.28) !important;',
      '}',
      '#dsh-parallax { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; background: #000; }',
      '#dsh-parallax .pl { position: absolute; inset: -5%; will-change: transform; }',
      '#dsh-parallax .pl[data-layer="logos"], #dsh-parallax .pl[data-layer="vv"] { inset: 0; }',
      '#dsh-parallax .pl-bg { position: absolute; inset: 0; background-repeat: no-repeat; background-size: cover; background-position: center; transform: scale(1.06); }',
      /* 2.7.1：背景亮度只压暗 —— 一层纯黑遮罩，盖在本体背景与增强包背景之上、格阵之下 */
      '#dsh-parallax .pl-bg-dim { position: absolute; inset: 0; background: #000; opacity: 0; pointer-events: none; transition: opacity .12s linear; }',
      gridRule(ACCENT_DEFAULT),
      '#dsh-parallax .pl-grid-layer, #dsh-parallax .pl-rain-layer { position: absolute; inset: 0; }',
      '#dsh-parallax .pl-grid-layer canvas, #dsh-parallax .pl-rain-layer canvas { position: absolute; inset: 0; display: block; width: 100%; height: 100%; }',
      '#dsh-parallax .pl-logos { position: absolute; top: 64px; right: 36px; bottom: auto; left: auto; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; transform-origin: top right; }',
      /* 2.7.1：四角吸附（默认右上角 = 原来的位置） */
      '#dsh-parallax .pl-logos[data-corner="tl"] { top: 64px; bottom: auto; left: 36px; right: auto; align-items: flex-start; transform-origin: top left; }',
      '#dsh-parallax .pl-logos[data-corner="br"] { top: auto; bottom: 64px; left: auto; right: 36px; align-items: flex-end; transform-origin: bottom right; }',
      '#dsh-parallax .pl-logos[data-corner="bl"] { top: auto; bottom: 64px; left: 36px; right: auto; align-items: flex-start; transform-origin: bottom left; }',
      /* 2.6.2：logo 层抬到暗角层（z-index 9）之上，右上角标志不再被暗角压暗 */
      '#dsh-parallax .pl[data-layer="logos"] { z-index: 10; }',
      '#dsh-parallax .pl-logo { display: block; width: 150px; height: auto; opacity: 1; filter: drop-shadow(0 0 10px rgba(var(--dsh-accent-rgb, 0,255,240), 0.35)); }',
      '#dsh-parallax .pl-wordmark { display: block; width: 150px; height: auto; opacity: 1; }',
      '#dsh-parallax .pl-vv-wrap { position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; }',
      '#dsh-parallax .pl-vv { height: calc(94vh * var(--vv-scale, 1)); width: auto; max-width: none; object-fit: contain; opacity: 1; transform-origin: bottom center; transform: translate(calc(var(--vv-x, 0) * 1vw), calc(6vh + var(--vv-y, 0) * 1vh)); filter: drop-shadow(0 0 34px rgba(var(--dsh-accent-rgb, 0,255,240), 0.16)); }',
      '#dsh-parallax .pl-live2d { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none; }',
      '#dsh-parallax .pl-press-glow { position: fixed; z-index: 60; left: -999px; top: -999px; width: 280px; height: 280px; margin: -140px 0 0 -140px; border-radius: 50%; pointer-events: none; opacity: 0; background: radial-gradient(circle, rgba(var(--dsh-accent-rgb, 0,255,240), 0.42) 0%, rgba(var(--dsh-accent-rgb, 0,255,240), 0.16) 34%, rgba(var(--dsh-accent-rgb, 0,255,240), 0.05) 58%, transparent 72%); filter: blur(6px); mix-blend-mode: screen; transition: opacity .12s ease; }',
    ].join('\n');

    /**
     * Falling square "code rain". Each string drops head-first; the head is a
     * solid opaque square, the body mixes solid and hollow squares at random
     * opacity, and the trailing squares fade out.
     */
    function startRain(canvas, gridCanvas, getConfig, getCharacter) {
      /* 2.5.0：拆成两层。canvas = 代码雨层（字符/余晖），gridCanvas = 背景网格层
         （点阵上的点亮、涟漪、扫描波、光照）。两层共用同一套几何常量与画布尺寸，
         且挂在同一个视差壳里，所以视差、呼吸、缩放之后仍然逐格重合。 */
      const rainContext = canvas.getContext('2d');
      const gridContext = gridCanvas.getContext('2d');
      if (!rainContext || !gridContext) return { dispose: () => {}, setEnabled: () => {} };
      let context = rainContext;
      /* 2.7.1：格阵几何拆成三件事，互不绑定——
         · 格子大小 rain.cellSize（8–24px，独立滑条，即时生效）
         · 间距 step = max(格子 + 2px, 22px × 界面比例)；界面比例只决定这个间距
         · 格子分辨率 rain.resolution（画布 backing 尺寸，只管清晰度，谁都不跟）
         两层画布共用同一份几何，所以点亮格子、涟漪、扫描波、人物光仍然逐格对齐。 */
      let GRID_SCALE = uiScaleOf(getConfig ? getConfig() : null);
      let CELL = 16;
      let GAP = 6;
      let STEP = CELL + GAP;
      let OX = 6;
      let CELL_EDGE = 1.5;
      let CELL_HALF = CELL_EDGE / 2;
      let CELL_SIDE = CELL - CELL_EDGE * 2;
      const applyGeometry = (cfg) => {
        const geom = gridGeometryOf(cfg || (getConfig ? getConfig() : null), GRID_SCALE);
        CELL = geom.cell;
        GAP = geom.gap;
        STEP = geom.step;
        OX = geom.ox;
        CELL_EDGE = geom.edge;
        CELL_HALF = CELL_EDGE / 2;
        CELL_SIDE = CELL - CELL_EDGE * 2;
      };
      applyGeometry();
      /* 颜色字符串按 8-bit 透明度预生成：每帧上千次 paint() 不再制造垃圾 */
      const PAINT_STEPS = 256;
      let paintTable = [];
      let paintHex = '';
      const buildPaint = () => {
        if (paintHex === accentHexNow) return paintTable;
        paintHex = accentHexNow;
        paintTable = [];
        for (let index = 0; index <= PAINT_STEPS; index += 1) {
          paintTable.push(accentRgba((index / PAINT_STEPS).toFixed(3)));
        }
        return paintTable;
      };
      const paint = (alpha) => buildPaint()[Math.max(0, Math.min(PAINT_STEPS, Math.round(alpha * PAINT_STEPS)))];
      const headPaint = () => 'rgba(255, 255, 255, 1)';
      /* 不读取 prefers-reduced-motion：本主题的动效就是它的全部内容，
         而且 Windows 关闭“显示动画”或远程会话下这个偏好会变成 reduce，
         会让背景直接停住（用户明确要求动画优先）。 */

      let width = 0;
      let height = 0;
      let deviceRatio = 1;
      let strings = [];
      let lastCharMode = null;
      let raf = 0;
      let last = 0;
      let resizeTimer = 0;
      let enabled = true;
      let active = true;
      let resolution = 0;
      let lastFrame = 0;
      const waves = [];
      const pointer = { x: -10000, y: -10000 };
      let pressing = false;
      /* 2.2：composer 思考时的外侧网格照明。cyan-theme 用 dsh-exv-thinking 事件同步，
         另外每 600ms 兜底读一次 data-dsh-thinking 并缓存 composer 矩形。 */
      let composerThinking = false;
      let composerThinkingAt = 0;
      let composerRect = null;
      let composerProbeAt = 0;
      const onThinking = (event) => {
        const next = Boolean(event && event.detail && event.detail.thinking);
        if (next === composerThinking) return;
        composerThinking = next;
        composerThinkingAt = performance.now();
        composerRect = null;
      };
      window.addEventListener('dsh-exv-thinking', onThinking);

      const config = () => (getConfig ? getConfig() : null) || {};
      const pointerConfig = () => config().pointer || {};
      const rainOn = () => (config().rain || {}).enabled !== false;
      const gridOn = () => (config().rain || {}).grid !== false;
      /* 量坐标统一走可见的那块画布：网格层关掉时指针坐标也没人用，
         但网格层开着时用它，才能把视差位移算进去。 */
      const measure = () => {
        const surface = gridCanvas.clientWidth ? gridCanvas : canvas;
        return surface.getBoundingClientRect();
      };

      /* 2.7.1：长度区间只决定新生成的雨丝（已经落下来的保持原长，靠自然换代换掉）；
         速度区间是「每串一个稳定随机位 p」，每帧按 p 在 [min,max] 之间插值，
         所以拖滑条时所有雨丝当场变速，快慢差别也保留。 */
      const clampNumber = (value, min, max, fallback) => {
        const number = Number(value);
        if (!Number.isFinite(number)) return fallback;
        return Math.round(Math.min(max, Math.max(min, number)));
      };
      const spawn = (initial) => {
        const rainCfg = config().rain || {};
        const lengthLo = clampNumber(rainCfg.lengthMin, 2, 60, 14);
        const lengthHi = clampNumber(rainCfg.lengthMax, 2, 60, 32);
        const lengthSpan = Math.max(0, Math.max(lengthLo, lengthHi) - Math.min(lengthLo, lengthHi));
        const len = Math.max(2, Math.min(lengthLo, lengthHi) + Math.floor(Math.random() * (lengthSpan + 1)));
        const squares = [];
        for (let index = 0; index < len; index += 1) {
          const fade = len > 1 ? index / (len - 1) : 0;
          const alpha = index === 0 ? 1 : 1 - fade * 0.95;
          squares.push({ alpha, hollow: index === 0 ? false : Math.random() < 0.5 });
        }
        const y = Math.round((initial ? Math.random() * height : -Math.random() * height * 0.3 - len * STEP) / STEP) * STEP;
        return {
          x: Math.floor(Math.random() * Math.max(1, Math.floor(width / STEP))) * STEP + OX,
          y,
          speed: 90 + Math.random() * 160,
          remainder: 0,
          len,
          squares,
          /* 2.3.1 荧光屏模式：每串的余晖长度随机，亮度也略有差别 */
          trailSeconds: 0.6 + Math.random() * 1.9,
          phosphorAlpha: 0.62 + Math.random() * 0.24,
          stampRow: Math.round(y / STEP),
        };
      };

      /** Draw a hollow cell outline at a grid position. */
      const strokeCell = (col, row, alpha) => {
        if (alpha <= 0.01) return;
        const x = OX + col * STEP;
        const y = row * STEP;
        if (x < -STEP || x > width + STEP || y < -STEP || y > height + STEP) return;
        context.strokeStyle = paint(alpha);
        context.lineWidth = CELL_EDGE;
        context.strokeRect(x + CELL_HALF, y + CELL_HALF, CELL - CELL_EDGE, CELL - CELL_EDGE);
      };

      /* 批量描边：同一帧里所有“点亮的格子”按亮度分档，每档只 stroke 一次。
         逐格 strokeRect（每格都换 strokeStyle + 单独 stroke）在角色光/雨点光
         这种上千格的场景里非常慢，是掉帧的主因之一。 */
      const LIGHT_BUCKETS = 12;
      const lightBuckets = [];
      for (let index = 0; index < LIGHT_BUCKETS; index += 1) lightBuckets.push([]);
      const queueCell = (col, row, alpha) => {
        if (alpha <= 0.012) return;
        const x = OX + col * STEP;
        const y = row * STEP;
        if (x < -STEP || x > width + STEP || y < -STEP || y > height + STEP) return;
        const level = Math.min(LIGHT_BUCKETS - 1, Math.floor(alpha * LIGHT_BUCKETS));
        lightBuckets[level].push(x, y);
      };
      const flushLightCells = () => {
        context.lineWidth = CELL_EDGE;
        for (let level = 0; level < LIGHT_BUCKETS; level += 1) {
          const cells = lightBuckets[level];
          if (cells.length === 0) continue;
          context.beginPath();
          for (let index = 0; index < cells.length; index += 2) {
            context.rect(cells[index] + CELL_HALF, cells[index + 1] + CELL_HALF, CELL - CELL_EDGE, CELL - CELL_EDGE);
          }
          context.strokeStyle = paint(((level + 0.5) / LIGHT_BUCKETS) * 0.95);
          context.stroke();
          cells.length = 0;
        }
      };

      /* 雨点头部光晕：预渲染一次，之后每帧只 drawImage，替代昂贵的 shadowBlur */
      let headGlowCanvas = null;
      const headGlowSprite = () => {
        if (headGlowCanvas) return headGlowCanvas;
        const size = 96;
        const surface = document.createElement('canvas');
        surface.width = size;
        surface.height = size;
        const glowContext = surface.getContext('2d');
        const gradient = glowContext.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.10, 'rgba(226, 255, 252, 0.85)');
        gradient.addColorStop(0.34, accentRgba(0.26));
        gradient.addColorStop(0.66, accentRgba(0.07));
        gradient.addColorStop(1, accentRgba(0));
        glowContext.fillStyle = gradient;
        glowContext.fillRect(0, 0, size, size);
        headGlowCanvas = surface;
        return surface;
      };

      /** Light the hollow outlines around a point, fading with distance. */
      const strokeHalo = (centerX, centerY, radius, peak) => {
        const minCol = Math.floor((centerX - radius) / STEP);
        const maxCol = Math.ceil((centerX + radius) / STEP);
        const minRow = Math.floor((centerY - radius) / STEP);
        const maxRow = Math.ceil((centerY + radius) / STEP);
        for (let col = minCol; col <= maxCol; col += 1) {
          for (let row = minRow; row <= maxRow; row += 1) {
            const cx = OX + col * STEP + CELL / 2;
            const cy = row * STEP + CELL / 2;
            const distance = Math.hypot(cx - centerX, cy - centerY);
            if (distance > radius) continue;
            queueCell(col, row, peak * (1 - distance / radius));
          }
        }
      };

      const drawPointerLight = () => {
        const light = pointerConfig().light;
        if (light && light.enabled === false) return;
        const brightness = light ? light.brightness / 100 : 1;
        const radius = light ? light.radius : 60;
        strokeHalo(pointer.x, pointer.y, radius, 0.34 * brightness);
      };

      /* Left button held: a wider, brighter halo plus lit grid cells around
         the cursor. This is deliberately stronger than the passive cursor
         light and works in any mode, desktop included. */
      const drawPointerPressLight = () => {
        if (!pressing) return;
        const pointerState = pointerConfig();
        const press = pointerState.press;
        if (!press || press.enabled === false) return;
        /* 2.7.1：拖拽照明有了自己的范围（旧配置没有这个字段时按 108 兜底，
           等于原来「光标半径 60 × 1.8」的观感） */
        const radius = Math.max(40, Math.min(600, Number(press.radius) || 108));
        const strength = Math.max(0, Math.min(200, Number(press.brightness) || 0)) / 100;
        strokeHalo(pointer.x, pointer.y, radius * 1.05, Math.min(0.8, 0.42 * strength));
        const minCol = Math.floor((pointer.x - radius) / STEP);
        const maxCol = Math.ceil((pointer.x + radius) / STEP);
        const minRow = Math.floor((pointer.y - radius) / STEP);
        const maxRow = Math.ceil((pointer.y + radius) / STEP);
        for (let col = minCol; col <= maxCol; col += 1) {
          for (let row = minRow; row <= maxRow; row += 1) {
            const cx = OX + col * STEP + CELL / 2;
            const cy = row * STEP + CELL / 2;
            const distance = Math.hypot(cx - pointer.x, cy - pointer.y);
            if (distance > radius) continue;
            queueCell(col, row, Math.min(1, (1 - distance / radius) * 0.95 * strength));
          }
        }
      };

      /* ---- 扫描波 / 点击涟漪 ------------------------------------------
         点击涟漪：只保留网格响应（和 2.0 一致）。
         扫描波：一条"锋面亮线 + 柔和径向渐变光环"的光带，光带扫过的方格各自
         记下时间戳，之后按线性亮度衰减——余辉只存在于方格上，背景和雨丝完全
         不受影响。光带宽度、扫过速度、可点亮的格子数都按当前视口换算，
         小窗 / 1080p / 4K 的观感一致，也不会有格子被上限截断的斑块。 */
      const TAU = Math.PI * 2;
      const CELL_TRAIL_SECONDS = 2.4;  /* 单格余辉保留时长（秒，线性衰减；调短可减负） */
      const CELL_FADE_BUCKETS = 72;    /* 按亮度分档批量描边；档位够细才没有阶梯 */
      const LIT_CELL_HARD_CAP = 24000; /* 超大屏下的内存/绘制硬上限 */

      /* 光带本体：一个径向渐变光环负责泛光，两道圆弧负责清晰的锋面。
         之前用 7 层同心描边叠亮度，层数少时能看出同心台阶；渐变是连续的。
         渐变直接画在主画布上（离屏放大在软件光栅下反而更慢）。 */
      const strokeBeam = (centerX, centerY, radius, intensity, maxGlow) => {
        if (radius <= 0 || intensity <= 0.004) return;
        const alpha = Math.min(1, intensity);
        /* 光带宽度跟着视口走：小窗窄一点，4K 宽一点；点击涟漪可以用 maxGlow 收窄 */
        const scale = Math.max(0.7, Math.min(2.2, Math.hypot(width, height) / 2400));
        const glow = Number.isFinite(maxGlow) ? Math.min(180 * scale, maxGlow) : 180 * scale;
        const inner = Math.max(0, radius - glow);
        const outer = Math.max(radius + glow, inner + 1);
        /* 亮度剖面以 radius 为中心、向两侧对称衰减；写成连续 stop，
           峰位按 radius 实际落在渐变里的比例换算，起步阶段也不会偏成一圈光斑。 */
        const peak = (radius - inner) / (outer - inner);
        const profile = [
          [-1, 0], [-0.68, 0.012], [-0.44, 0.05], [-0.24, 0.15],
          [-0.10, 0.40], [0, 0.86],
          [0.10, 0.40], [0.24, 0.15], [0.44, 0.05], [0.68, 0.012], [1, 0],
        ];
        const stops = [];
        for (const [offset, value] of profile) {
          const at = peak + offset * 0.5;
          if (at < 0 || at > 1) continue;
          stops.push([at, value]);
        }
        if (stops.length === 0 || stops[0][0] > 0) stops.unshift([0, 0]);
        if (stops[stops.length - 1][0] < 1) stops.push([1, 0]);
        const gradient = context.createRadialGradient(centerX, centerY, inner, centerX, centerY, outer);
        for (const [at, value] of stops) gradient.addColorStop(at, paint(value * alpha));
        context.fillStyle = gradient;
        /* 只填光带本身那一圈：整盘填充在 4K 上等于每帧刷满全屏，太贵 */
        context.beginPath();
        context.arc(centerX, centerY, outer, 0, TAU, false);
        if (inner > 0.5) context.arc(centerX, centerY, inner, 0, TAU, true);
        context.fill('evenodd');
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, TAU);
        context.lineWidth = 2.4 * scale;
        context.strokeStyle = paint(0.42 * alpha);
        context.stroke();
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, TAU);
        context.lineWidth = 1.1 * scale;
        context.strokeStyle = `rgba(242, 255, 253, ${alpha})`;
        context.stroke();
      };

      /* 被扫过的方格：key = "col:row" -> { x, y, t, a } */
      const litCells = new Map();

      const stampCells = (wave, radius, strength, now) => {
        if (strength <= 0.01) return;
        /* 每个波可以有自己的余辉/下沉时长与 2D/3D 风格：点击涟漪和全屏扫描互不干扰 */
        const trail = Number.isFinite(wave.trailSeconds) ? wave.trailSeconds : CELL_TRAIL_SECONDS;
        const sink = Number.isFinite(wave.sinkSeconds) ? wave.sinkSeconds : SCAN3D_SINK_SECONDS;
        const threeD = Boolean(wave.threeD);
        const inner = Math.max(0, radius - STEP * 0.9);
        const outer = radius + STEP * 0.9;
        const outer2 = outer * outer;
        const inner2 = inner * inner;
        /* 只点亮画布内的格子：屏幕外的余辉没人看，却会让每帧的遍历量翻几倍 */
        const maxColIndex = Math.floor((width - CELL) / STEP);
        const maxRowIndex = Math.floor((height - CELL) / STEP);
        const minCol = Math.max(0, Math.floor((wave.x - outer) / STEP));
        const maxCol = Math.min(maxColIndex, Math.ceil((wave.x + outer) / STEP));
        /* 上限跟着格网大小走：4K 有约 1.7 万格，固定 9000 会让余辉被截断成斑块 */
        const cellCount = (maxColIndex + 1) * (maxRowIndex + 1);
        const cap = Math.min(LIT_CELL_HARD_CAP, Math.max(512, cellCount));
        const half = CELL / 2;
        const touch = (col, row) => {
          if (col < 0 || row < 0 || col > maxColIndex || row > maxRowIndex) return;
          const key = col + ':' + row;
          const cell = litCells.get(key);
          if (cell) {
            cell.t = now;
            cell.trail = trail;
            cell.sink = sink;
            cell.threeD = threeD;
            if (strength > cell.a) cell.a = strength;
          } else if (litCells.size < cap) {
            litCells.set(key, { x: OX + col * STEP, y: row * STEP, t: now, a: strength, trail, sink, threeD });
          }
        };
        /* 只遍历圆环内的格子：按列解出上下两段行区间，
           避免在外接正方形里逐格算距离（4K 下那是每帧七万次）。 */
        for (let col = minCol; col <= maxCol; col += 1) {
          const cx = OX + col * STEP + half;
          const dx = cx - wave.x;
          const dx2 = dx * dx;
          if (dx2 > outer2) continue;
          const dyOuter = Math.sqrt(outer2 - dx2);
          const dyInner = dx2 < inner2 ? Math.sqrt(inner2 - dx2) : 0;
          const topMin = Math.ceil((wave.y + dyInner - half) / STEP);
          const topMax = Math.floor((wave.y + dyOuter - half) / STEP);
          for (let row = topMin; row <= topMax; row += 1) touch(col, row);
          const bottomMin = Math.ceil((wave.y - dyOuter - half) / STEP);
          const bottomMax = Math.floor((wave.y - dyInner - half) / STEP);
          for (let row = bottomMin; row <= bottomMax; row += 1) touch(col, row);
        }
      };

      /* 按亮度分档批量画：每档只设一次 fillStyle，几千个方格也只有几十次状态切换。
         空心方格用 4 条实心边拼成：“上/下通长、左/右让开两角”，四条边互不重叠，
         几何上等价于 1.5px 逐格描边，边框位置、格子间隙和余辉亮度都保持一致。
         不用 stroke 的原因：canvas 的小矩形描边要走路径细分，2K 满屏余辉（约 3800
         格）实测 rAF p90 40ms；fillRect 走矩形快速路径，同样格数 p90 13.4ms。 */
      const waveBuckets = [];
      for (let level = 0; level < CELL_FADE_BUCKETS; level += 1) waveBuckets.push([]);
      /* 3D 扫描：整片方格当水面看，波峰把当前一圈格子“抬”起来（放大、变亮），
         波过去之后再慢慢沉回原位；这个模式没有核心光束，只有余晖的亮度衰减。
         每格在 stamp 时记下所属波形的风格与余辉/下沉时长，所以点击涟漪和全屏
         扫描可以各自使用不同速度、同时存在。 */
      const SCAN3D_LIFT = 0.34;          /* 波峰处额外放大的比例 */
      const SCAN3D_SINK_SECONDS = 0.85;  /* 从波峰沉回原位的时长（秒） */
      const SCAN3D_CREST_ALPHA = 0.55;   /* 波峰相对余晖的额外亮度占比 */
      /* 点击 3D：扩散距离减半、余辉继续缩短、下沉也随小半径收紧，
         这样一次点击的存活格少、衰减快，可以同时存在很多个涟漪。 */
      const CLICK3D_TRAIL_SECONDS = 0.8; /* 点击 3D 的余辉时长（100% 速度） */
      const CLICK3D_SINK_SECONDS = 0.55; /* 点击 3D 的下沉时长（100% 速度） */
      const CLICK3D_RADIUS_FACTOR = 0.5; /* 3D 涟漪扩散距离 = 涟漪范围的一半 */
      const drawLitCells = (now) => {
        if (litCells.size === 0) return;
        for (const [key, cell] of litCells) {
          const age = (now - cell.t) / 1000;
          const trail = cell.trail || CELL_TRAIL_SECONDS;
          if (age >= trail) {
            litCells.delete(key);
            continue;
          }
          /* 线性衰减：亮度随时间均匀下降，不再先陡后缓 */
          const fade = 1 - age / trail;
          let alpha = cell.a * fade;
          if (alpha <= 0.012) continue;
          if (cell.threeD) {
            const sink = cell.sink || SCAN3D_SINK_SECONDS;
            const settle = 1 - Math.min(1, age / sink);
            /* 波峰处最亮，沉下去后只剩逐渐衰减的余晖 */
            cell.swell = settle;
            alpha *= (1 - SCAN3D_CREST_ALPHA) + SCAN3D_CREST_ALPHA * cell.swell;
          }
          const level = Math.min(CELL_FADE_BUCKETS - 1, Math.floor(alpha * CELL_FADE_BUCKETS));
          waveBuckets[level].push(cell);
        }
        for (let level = 0; level < CELL_FADE_BUCKETS; level += 1) {
          const cells = waveBuckets[level];
          if (cells.length === 0) continue;
          context.fillStyle = paint(((level + 0.5) / CELL_FADE_BUCKETS) * 0.95);
          for (const cell of cells) {
            if (cell.threeD) {
              /* 以格子中心放大：波峰处格子变大、线宽也跟着变粗、间隙收窄，
                 像水面鼓起来（线宽随高度一起放大，透视上更连贯） */
              const grow = SCAN3D_LIFT * cell.swell;
              const size = CELL + CELL * grow;
              const edge = CELL_EDGE * (1 + grow);
              const inset = (size - CELL) / 2;
              const x = cell.x - inset;
              const y = cell.y - inset;
              context.fillRect(x, y, size, edge);
              context.fillRect(x, y + size - edge, size, edge);
              context.fillRect(x, y + edge, edge, size - edge * 2);
              context.fillRect(x + size - edge, y + edge, edge, size - edge * 2);
            } else {
              /* 逐格画边：方格之间保留空隙，这是背景网格的原有观感 */
              context.fillRect(cell.x, cell.y, CELL, CELL_EDGE);
              context.fillRect(cell.x, cell.y + CELL - CELL_EDGE, CELL, CELL_EDGE);
              context.fillRect(cell.x, cell.y + CELL_EDGE, CELL_EDGE, CELL_SIDE);
              context.fillRect(cell.x + CELL - CELL_EDGE, cell.y + CELL_EDGE, CELL_EDGE, CELL_SIDE);
            }
          }
          cells.length = 0;
        }
      };

      const drawWaves = (now) => {
        const themeConfig = config();
        const pointerState = themeConfig.pointer || {};
        const ripple = pointerState.ripple;
        const rippleOn = !ripple || ripple.enabled !== false;
        if (!rippleOn) {
          for (let index = waves.length - 1; index >= 0; index -= 1) {
            if (waves[index].kind !== 'scan' || waves[index].click) waves.splice(index, 1);
          }
        }
        const brightness = ripple ? ripple.brightness / 100 : 1;
        /* 2.7.1：扫描波用自己那档亮度（不再借涟漪亮度）；100 = 原样 */
        const scanBrightnessRaw = Number(themeConfig.rain && themeConfig.rain.scanBrightness);
        const scanBrightness = Math.max(0, Math.min(200, Number.isFinite(scanBrightnessRaw) ? scanBrightnessRaw : 100)) / 100;
        const clickMaxRadius = ripple ? ripple.radius : 550;
        const rawClickSpeed = Number(ripple && ripple.speed);
        const clickSpeedScale = Math.max(0.25, Math.min(2, (Number.isFinite(rawClickSpeed) ? rawClickSpeed : 100) / 100));
        for (let index = waves.length - 1; index >= 0; index -= 1) {
          const wave = waves[index];
          const scan = wave.kind === 'scan';
          if (!scan && !rippleOn) {
            waves.splice(index, 1);
            continue;
          }
          const speed = Number(wave.speed) || (scan ? 320 : 560 * clickSpeedScale);
          const age = (now - wave.born) / 1000;
          let radius = age * speed;
          if (scan) {
            /* 掉帧时不让光带一下子跳出去：每帧最多前进 50ms 的距离，
               追上时间目标之前看起来是连续滑过去的；长时间不可见后恢复时
               直接把落后量截到 250ms，避免光带慢慢爬。 */
            const target = radius;
            if (wave.displayRadius === undefined) {
              wave.displayRadius = target;
            } else {
              const lagLimit = speed * 0.25;
              wave.displayRadius = Math.min(
                target,
                Math.max(wave.displayRadius + speed * 0.05, target - lagLimit),
              );
            }
            radius = wave.displayRadius;
            /* 全屏扫描用画布对角线；点击涟漪用设置里的“涟漪范围” */
            const maxRadius = Number.isFinite(wave.maxRadius) ? wave.maxRadius : Math.hypot(width, height) + STEP * 2;
            if (maxRadius <= 0 || radius > maxRadius) {
              waves.splice(index, 1);
              continue;
            }
            /* 起步 0.25s 淡入，收尾 16% 半径淡出，避免光带头尾硬切 */
            const fadeIn = Math.min(1, age / 0.25);
            const fadeOut = Math.max(0, Math.min(1, (maxRadius - radius) / (maxRadius * 0.16)));
            /* 点击 3D 的“最高亮度”也随扩散距离一起衰减：越接近边缘，连波峰都很暗，
               看起来像自然散开；全屏扫描波保持原来的亮度。 */
            const edgeFade = wave.click ? Math.max(0, 1 - radius / maxRadius) : 1;
            const strength = 0.95 * Math.min(fadeIn, fadeOut) * (wave.click ? brightness : scanBrightness) * edgeFade;
            /* 光带扫过的方格单独记时间，之后各自衰减 */
            stampCells(wave, radius, strength, now);
            if (!wave.threeD) strokeBeam(wave.x, wave.y, radius, strength, wave.beamGlow);
            continue;
          }

          /* 2D 点击涟漪：只画当前这一圈网格，不做余辉 */
          const attenuation = 1 - radius / clickMaxRadius;
          if (attenuation <= 0) {
            waves.splice(index, 1);
            continue;
          }
          const inner = Math.max(0, radius - STEP * 0.9);
          const outer = radius + STEP * 0.9;
          const minCol = Math.floor((wave.x - outer) / STEP);
          const maxCol = Math.ceil((wave.x + outer) / STEP);
          const minRow = Math.floor((wave.y - outer) / STEP);
          const maxRow = Math.ceil((wave.y + outer) / STEP);
          for (let col = minCol; col <= maxCol; col += 1) {
            for (let row = minRow; row <= maxRow; row += 1) {
              const cx = OX + col * STEP + CELL / 2;
              const cy = row * STEP + CELL / 2;
              const distance = Math.hypot(cx - wave.x, cy - wave.y);
              if (distance < inner || distance > outer) continue;
              strokeCell(col, row, 0.85 * attenuation * brightness);
            }
          }
        }
        drawLitCells(now);
      };

      /* One-shot startup scan: same grid ring as a click ripple, but it runs
         from the tool cluster to the whole viewport with no distance fade. */
      window.__dshScanWave = (x, y) => {
        if (!gridOn()) return;
        const w = width || window.innerWidth;
        const h = height || window.innerHeight;
        const diagonal = Math.hypot(w, h);
        /* 点击按钮启动扫描波时，这次按下已经生成了一圈涟漪；
           扫描波从同一处起跑会把两层盖在一起，所以只把这次按下的涟漪撤掉，
           扫描波开始后用户再点仍然是正常的点击涟漪。 */
        const startedAt = performance.now();
        for (let index = waves.length - 1; index >= 0; index -= 1) {
          const wave = waves[index];
          if (wave.click && startedAt - wave.born < 700) waves.splice(index, 1);
        }
        const rainConfig = config().rain || {};
        const rawSpeed = Number(rainConfig.scanSpeed);
        const speedScale = Math.max(0.25, Math.min(2, (Number.isFinite(rawSpeed) ? rawSpeed : 100) / 100));
        waves.push({
          kind: 'scan',
          x: Number.isFinite(x) ? x : w / 2,
          y: Number.isFinite(y) ? y : h / 2,
          born: performance.now(),
          /* 按对角线换算速度：100% 时约 7 秒扫完整个屏幕；扫描速度滑条按比例缩放 */
          speed: Math.max(150, diagonal / 7) * speedScale,
          threeD: rainConfig.scanMode === '3d',
          /* 余辉/下沉按速度反比缩放，保证不同速度下波形空间宽度一致 */
          trailSeconds: CELL_TRAIL_SECONDS / speedScale,
          sinkSeconds: SCAN3D_SINK_SECONDS / speedScale,
        });
      };

      const drawWidgetLight = () => {
        const rects = window.__dshWidgetRects;
        if (!Array.isArray(rects) || rects.length === 0) return;
        const bounds = measure();
        const motion = window.__dshWidgetMotion || { x: 0, y: 0 };
        const range = 14;
        for (const source of rects) {
          if (!source || !Number.isFinite(source.x) || !Number.isFinite(source.y)) continue;
          const rect = { x: source.x + motion.x - bounds.left, y: source.y + motion.y - bounds.top };
          const w = Number.isFinite(source.w) ? source.w : 0;
          const h = Number.isFinite(source.h) ? source.h : 0;
          const minCol = Math.floor((rect.x - range) / STEP);
          const maxCol = Math.ceil((rect.x + w + range) / STEP);
          const minRow = Math.floor((rect.y - range) / STEP);
          const maxRow = Math.ceil((rect.y + h + range) / STEP);
          for (let col = minCol; col <= maxCol; col += 1) {
            for (let row = minRow; row <= maxRow; row += 1) {
              const cx = OX + col * STEP + CELL / 2;
              const cy = row * STEP + CELL / 2;
              const insideX = cx >= rect.x && cx <= rect.x + w;
              const insideY = cy >= rect.y && cy <= rect.y + h;
              let distance;
              if (insideX && insideY) {
                distance = Math.min(cx - rect.x, rect.x + w - cx, cy - rect.y, rect.y + h - cy);
              } else {
                const dx = insideX ? 0 : Math.min(Math.abs(cx - rect.x), Math.abs(cx - (rect.x + w)));
                const dy = insideY ? 0 : Math.min(Math.abs(cy - rect.y), Math.abs(cy - (rect.y + h)));
                distance = Math.hypot(dx, dy);
              }
              if (distance > range) continue;
              queueCell(col, row, 0.8 * (1 - distance / range));
            }
          }
        }
      };

      /* Character silhouette halo: sample a blurred alpha mask of the active
         VV image and light the grid cells around it. */
      let charMask = null;
      const characterMask = (maskBlur) => {
        const img = getCharacter ? getCharacter() : null;
        if (!img || !img.complete || !img.naturalWidth) return null;
        if (charMask && charMask.src === img.src && charMask.blur === maskBlur) return charMask;
        const maskWidth = 320;
        const maskHeight = Math.max(1, Math.round(maskWidth * img.naturalHeight / img.naturalWidth));
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = maskWidth;
        maskCanvas.height = maskHeight;
        const maskContext = maskCanvas.getContext('2d', { willReadFrequently: true });
        if (!maskContext) return null;
        maskContext.clearRect(0, 0, maskWidth, maskHeight);
        try {
          maskContext.filter = `blur(${maskBlur}px)`;
          maskContext.drawImage(img, 0, 0, maskWidth, maskHeight);
          maskContext.filter = 'none';
          charMask = {
            src: img.src,
            blur: maskBlur,
            width: maskWidth,
            height: maskHeight,
            data: maskContext.getImageData(0, 0, maskWidth, maskHeight).data,
          };
        } catch (error) {
          charMask = null;
        }
        return charMask;
      };

      /* 角色光晕是静态的：按 (遮罩, 图片位置, 画布尺寸, 强度) 生成一次分档
         Path2D，之后每帧只 stroke；不再每帧逐像素重算 + 逐格 strokeRect。 */
      let charLightCache = null;
      const drawCharacterLight = () => {
        const img = getCharacter ? getCharacter() : null;
        if (!img || !img.complete || !img.naturalWidth) return;
        const cfg = getConfig ? getConfig() : null;
        if (cfg && cfg.vv && cfg.vv.mode === 'live2d') return;
        const light = cfg && cfg.vv && cfg.vv.light ? cfg.vv.light : {};
        if (light.enabled === false) return;
        const range = Math.max(0, Math.min(100, Number(light.radius) || 0));
        const strength = Math.max(0, Math.min(200, Number(light.brightness) || 0)) / 100;
        if (range <= 0 || strength <= 0) return;
        const maskBlur = Math.max(6, Math.min(40, Math.round((range * 0.14) / 4) * 4));
        const mask = characterMask(maskBlur);
        if (!mask) return;
        const rect = img.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) return;
        if (typeof Path2D === 'undefined') return;
        const bounds = measure();
        const signature = [
          mask.src, mask.blur,
          Math.round(rect.left), Math.round(rect.top), Math.round(rect.width), Math.round(rect.height),
          Math.round(bounds.left), Math.round(bounds.top),
          width, height, Math.round(strength * 100), range,
        ].join('|');
        if (!charLightCache || charLightCache.signature !== signature) {
          const paths = [];
          for (let level = 0; level < LIGHT_BUCKETS; level += 1) paths.push(null);
          const minCol = Math.floor((rect.left - range - bounds.left - 6) / STEP);
          const maxCol = Math.ceil((rect.right + range - bounds.left - 6) / STEP);
          const minRow = Math.floor((rect.top - range - bounds.top) / STEP);
          const maxRow = Math.ceil((rect.bottom + range - bounds.top) / STEP);
          for (let col = minCol; col <= maxCol; col += 1) {
            for (let row = minRow; row <= maxRow; row += 1) {
              const x = OX + col * STEP + CELL / 2;
              const y = row * STEP + CELL / 2;
              const u = (bounds.left + x - rect.left) / rect.width;
              const v = (bounds.top + y - rect.top) / rect.height;
              if (u < 0 || u > 1 || v < 0 || v > 1) continue;
              const mx = Math.min(mask.width - 1, Math.max(0, Math.floor(u * mask.width)));
              const my = Math.min(mask.height - 1, Math.max(0, Math.floor(v * mask.height)));
              const alpha = mask.data[(my * mask.width + mx) * 4 + 3] / 255;
              if (alpha <= 0.02) continue;
              const value = Math.min(1, alpha * strength * 0.95);
              if (value <= 0.012) continue;
              const level = Math.min(LIGHT_BUCKETS - 1, Math.floor(value * LIGHT_BUCKETS));
              if (!paths[level]) paths[level] = new Path2D();
              paths[level].rect(OX + col * STEP + CELL_HALF, row * STEP + CELL_HALF, CELL - CELL_EDGE, CELL - CELL_EDGE);
            }
          }
          charLightCache = { signature, paths };
        }
        context.lineWidth = CELL_EDGE;
        for (let level = 0; level < LIGHT_BUCKETS; level += 1) {
          const path = charLightCache.paths[level];
          if (!path) continue;
          context.strokeStyle = paint(((level + 0.5) / LIGHT_BUCKETS) * 0.95);
          context.stroke(path);
        }
      };

      /* 思考泛光的网格照明：只照亮 composer 外侧，脉动和 CSS 的 3.2s 呼吸同频。
         公式与 client.js 里的 dsh-thinking-ring 对齐（同一时刻起跳，视觉上同频）。 */
      const drawComposerLight = (now) => {
        if (now - composerProbeAt > 600) {
          composerProbeAt = now;
          const el = document.querySelector('[data-dsh-composer]');
          const thinking = Boolean(el && el.hasAttribute('data-dsh-thinking'));
          if (thinking !== composerThinking) {
            composerThinking = thinking;
            composerThinkingAt = now;
          }
          composerRect = el ? el.getBoundingClientRect() : null;
        }
        if (!composerThinking || !composerRect) return;
        const rect = composerRect;
        if (rect.width < 40 || rect.height < 20) return;
        const bounds = measure();
        const left = rect.left - bounds.left;
        const top = rect.top - bounds.top;
        const right = left + rect.width;
        const bottom = top + rect.height;
        /* CSS 是 3.2s + alternate，一个完整呼吸来回是 6.4s；这里用同周期余弦对齐 */
        const pulse = 0.5 - 0.5 * Math.cos(((now - composerThinkingAt) / 6400) * Math.PI * 2);
        const reach = 46 + 86 * pulse;
        const peak = 0.10 + 0.24 * pulse;
        const minCol = Math.floor((left - reach) / STEP);
        const maxCol = Math.ceil((right + reach) / STEP);
        const minRow = Math.floor((top - reach) / STEP);
        const maxRow = Math.ceil((bottom + reach) / STEP);
        for (let col = minCol; col <= maxCol; col += 1) {
          for (let row = minRow; row <= maxRow; row += 1) {
            const x = OX + col * STEP;
            const y = row * STEP;
            /* 卡片里面的格子不点亮：泛光只对外侧起效 */
            if (x + CELL > left - 2 && x < right + 2 && y + CELL > top - 2 && y < bottom + 2) continue;
            const cx = x + CELL / 2;
            const cy = y + CELL / 2;
            const dx = cx < left ? left - cx : cx > right ? cx - right : 0;
            const dy = cy < top ? top - cy : cy > bottom ? cy - bottom : 0;
            const distance = Math.hypot(dx, dy);
            if (distance > reach) continue;
            queueCell(col, row, peak * (1 - distance / reach));
          }
        }
      };

      /* 2.3.1 全 1 余晖：头部经过的格子按 2D 扫描波的方式点亮（描边格），
         每格按自己的 trailSeconds 线性衰减；长度由速度 × 随机余晖时长决定。
         只在新跨过一行时写一次，画布上不会出现整列同时刷新。 */
      const stampPhosphor = (string, now) => {
        const col = Math.round((string.x - 6) / STEP);
        const row = Math.round(string.y / STEP);
        const maxCol = Math.floor((width - CELL) / STEP);
        const maxRow = Math.floor((height - CELL) / STEP);
        if (col < 0 || col > maxCol) return;
        if (!Number.isFinite(string.stampRow) || row < string.stampRow) {
          string.stampRow = row;
          return;
        }
        /* 掉帧/大跳时最多补 16 行，避免一帧点亮一整列 */
        const from = Math.max(string.stampRow + 1, row - 16);
        for (let r = from; r <= row; r += 1) {
          if (r < 0 || r > maxRow) continue;
          const key = col + ':' + r;
          const cell = litCells.get(key);
          if (cell) {
            cell.t = now;
            cell.trail = string.trailSeconds;
            cell.sink = 0;
            cell.threeD = false;
            if (string.phosphorAlpha > cell.a) cell.a = string.phosphorAlpha;
          } else if (litCells.size < LIT_CELL_HARD_CAP) {
            litCells.set(key, {
              x: OX + col * STEP,
              y: r * STEP,
              t: now,
              a: string.phosphorAlpha,
              trail: string.trailSeconds,
              sink: 0,
              threeD: false,
            });
          }
        }
        string.stampRow = row;
      };

      /* 随机 01 / 全 0 / 全 1 余晖共用同一份头部：白色实心方块 + 泛光。
         头部光环排进亮度桶，白色方块和光晕可以在余晖之后最后盖上去。
         2.7.1：光晕三档——none 只画头部方块；glow 是原来的圆形泛光；
         streak 在发光之上再拉一条左右散开的细长光束（类似全局后效里的光晕）。 */
      const queueHeadLight = (string) => {
        if (!gridOn()) return;
        strokeHalo(string.x + CELL / 2, string.y + CELL / 2, STEP * 2.4, 0.30);
      };
      /* 2.7.1：强光的横向拉丝。和头部光晕一样预渲染成一张方形径向渐变，
         画的时候横向拉长、纵向压扁，边缘本来就是透明的，所以不会出现硬边。 */
      let headStreakCanvas = null;
      const headStreakSprite = () => {
        if (headStreakCanvas) return headStreakCanvas;
        const size = 256;
        const surface = document.createElement('canvas');
        surface.width = size;
        surface.height = size;
        const streakContext = surface.getContext('2d');
        const gradient = streakContext.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, accentRgba(0.62));
        gradient.addColorStop(0.22, accentRgba(0.34));
        gradient.addColorStop(0.6, accentRgba(0.10));
        gradient.addColorStop(1, accentRgba(0));
        streakContext.fillStyle = gradient;
        streakContext.fillRect(0, 0, size, size);
        headStreakCanvas = surface;
        return surface;
      };
      const drawHeadStreakAt = (headX, headY) => {
        const reach = STEP * 4.6;
        const thickness = Math.max(4, STEP * 0.62);
        context.save();
        context.globalCompositeOperation = 'lighter';
        context.drawImage(
          headStreakSprite(),
          headX + CELL / 2 - reach,
          headY + CELL / 2 - thickness / 2,
          reach * 2,
          thickness,
        );
        context.restore();
      };
      /* 2.7.1：头部绘制抽成「按坐标画」，代码雨的雨丝头和流星雨的流星头共用一套光晕/拉丝逻辑。 */
      const drawHeadAt = (headX, headY, glow, glowRadius, glowMode) => {
        if (glow && glowMode !== 'none') {
          context.drawImage(
            glow,
            headX + CELL / 2 - glowRadius,
            headY + CELL / 2 - glowRadius,
            glowRadius * 2,
            glowRadius * 2,
          );
        }
        if (glowMode === 'streak') drawHeadStreakAt(headX, headY);
        context.fillStyle = headPaint(1);
        context.fillRect(headX, headY, CELL, CELL);
      };
      const drawHeadBlock = (string, glow, glowRadius, glowMode) => drawHeadAt(string.x, string.y, glow, glowRadius, glowMode);

      /* ---- 2.7.1：流星雨（和代码雨互斥）------------------------------------
         只有「头」、没有身体方块；斜着落下；落过的格点像全屏扫描波那样留下
         线性衰减的余晖（写进 litCells，由网格层统一绘制）。
         · 火力网（net）：掉出屏幕就立刻从入口重新来，连绵不断。
         · 集束（volley）：从一小片区域同时射出、朝不同方向散开（像集束炸弹
           分裂出来的子弹）；这一波必须全部飞出画面才算结束，然后才开始
           下一轮倒计时——绝不半路把还在飞的弹头挪走。
         每个弹头有一个写死的亮度档差（0.85–1.15，体现在光晕大小上），
         行进中光晕还会以随机小间隔短暂缩到 30%：模拟大气不均匀折射的闪烁。 */
      const meteors = [];
      let volleyAt = 0;
      const meteorConfig = () => (config().rain || {});
      const meteorCount = () => {
        const cfg = meteorConfig();
        const density = Math.max(25, Math.min(200, Number(cfg.density) || 100)) / 100;
        const cols = Math.max(1, Math.floor(width / STEP));
        const rows = Math.max(1, Math.floor(height / STEP));
        return Math.max(1, Math.min(90, Math.round(cols * rows * 0.0012 * density)));
      };
      const meteorSpread = (minRaw, maxRaw, min, max, fallbackLo, fallbackHi) => {
        const lo = Math.min(clampNumber(minRaw, min, max, fallbackLo), clampNumber(maxRaw, min, max, fallbackHi));
        const hi = Math.max(clampNumber(minRaw, min, max, fallbackLo), clampNumber(maxRaw, min, max, fallbackHi));
        return [lo, hi];
      };
      /* 集束的子弹是「被炸出去」的，整体比火力网快一截：速度基准 ×1.5 */
      const METEOR_VOLLEY_SPEED_BOOST = 1.5;
      const meteorSpeedNow = () => (STEP * 22 * clampNumber(meteorConfig().meteorSpeed, 25, 300, 100)) / 100;
      const meteorFresh = () => ({
        done: false,
        glowScale: 0.85 + Math.random() * 0.3,
        glowPulse: 1,
        flickerAt: 0,
      });
      const spawnMeteor = () => {
        const cfg = meteorConfig();
        const angles = meteorSpread(cfg.meteorAngleMin, cfg.meteorAngleMax, 15, 90, 55, 75);
        const angle = (angles[0] + Math.random() * (angles[1] - angles[0])) * (Math.PI / 180);
        const speed = meteorSpeedNow();
        const vy = Math.sin(angle) * speed;
        const vx = Math.cos(angle) * speed;
        /* 入口在屏幕上方：全部从「上边缘」进来，左侧再留出一整段横向漂移量，
           保证不同入射角的流星都能铺满整幅画面。 */
        const drift = vy > 0 ? height / Math.tan(angle) : width;
        const x = -drift + Math.random() * (width + drift);
        const y = -CELL * 2 - Math.random() * height * 0.12;
        return Object.assign(meteorFresh(), { x, y, vx, vy, trailX: x, trailY: y });
      };
      /* 集束：一小片区域内同时起飞，左右两侧各一半，角度在基础区间上抖动后
         向左右镜像散开，形成「分裂」的锥形。 */
      const fireVolley = () => {
        const cfg = meteorConfig();
        const originX = width * (0.25 + Math.random() * 0.5);
        const originY = -CELL * 2;
        const angles = meteorSpread(cfg.meteorAngleMin, cfg.meteorAngleMax, 15, 90, 55, 75);
        const speed = meteorSpeedNow() * METEOR_VOLLEY_SPEED_BOOST;
        for (const meteor of meteors) {
          const base = angles[0] + Math.random() * (angles[1] - angles[0]);
          const jitter = (Math.random() - 0.5) * 26;
          const mirrored = Math.random() < 0.5;
          const angle = Math.max(18, Math.min(162, mirrored ? 180 - base + jitter : base + jitter)) * (Math.PI / 180);
          const localSpeed = speed * (0.82 + Math.random() * 0.36);
          const x = originX + (Math.random() - 0.5) * width * 0.06;
          const y = originY - Math.random() * height * 0.05;
          Object.assign(meteor, meteorFresh(), {
            x,
            y,
            vx: Math.cos(angle) * localSpeed,
            vy: Math.sin(angle) * localSpeed,
            trailX: x,
            trailY: y,
          });
        }
      };
      const updateMeteors = (now, delta) => {
        const cfg = meteorConfig();
        const target = meteorCount();
        while (meteors.length < target) meteors.push(spawnMeteor());
        while (meteors.length > target) meteors.pop();
        const volley = cfg.meteorMode === 'volley';
        for (const meteor of meteors) {
          if (meteor.done) continue;
          /* 大气不均匀折射的闪烁：随机小间隔，短暂把光晕缩到 30% */
          if (!meteor.flickerAt || now >= meteor.flickerAt) {
            meteor.flickerAt = now + 18 + Math.random() * 72;
            meteor.glowPulse = Math.random() < 0.34 ? 0.3 : 1;
          }
        }
        if (volley) {
          /* 一波全部飞出画面之后才开始倒计时；倒计时到了再齐射。
             刚切到集束、或者刚 resize 过（volleyAt === 0）时立刻先来一波。 */
          const alive = meteors.some((meteor) => !meteor.done);
          if (volleyAt === 0) {
            fireVolley();
            volleyAt = -1;
          } else if (!alive) {
            if (volleyAt > 0 && now >= volleyAt) {
              fireVolley();
              volleyAt = -1;
            } else if (volleyAt < 0) {
              volleyAt = now + 4200 + Math.random() * 2600;
            }
          }
        }
        for (const meteor of meteors) {
          if (meteor.done) continue;
          meteor.x += meteor.vx * delta;
          meteor.y += meteor.vy * delta;
          if (meteor.x > width + CELL * 3 || meteor.x < -CELL * 3 || meteor.y > height + CELL * 3) {
            meteor.done = true;
            if (!volley) Object.assign(meteor, spawnMeteor());
          }
        }
        return volley;
      };
      /* 尾迹：沿这一帧走过的线段按半格步长补格，写成扫描波那种「余晖时长」的 litCells。
         这样高速流星不会跳格，低速流星也不会一段一段断开。 */
      const stampMeteorTrail = (meteor, now, brightness) => {
        if (!gridOn()) return;
        /* 兜底：极端参数（超长尾迹 + 高超速）下别把余晖格子堆到内存爆炸 */
        if (litCells.size > 20000) return;
        const raw = Number(meteorConfig().meteorTrail);
        const seconds = Number.isFinite(raw) ? Math.max(0, Math.min(4, Math.round(raw * 10) / 10)) : 0.9;
        if (seconds <= 0.02) return;
        const startX = Number.isFinite(meteor.trailX) ? meteor.trailX : meteor.x;
        const startY = Number.isFinite(meteor.trailY) ? meteor.trailY : meteor.y;
        const dx = meteor.x - startX;
        const dy = meteor.y - startY;
        const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / (STEP * 0.5)));
        const alpha = 0.55 * brightness;
        for (let index = 0; index <= steps; index += 1) {
          const px = startX + (dx * index) / steps + CELL / 2;
          const py = startY + (dy * index) / steps + CELL / 2;
          if (py < -STEP || py > height + STEP || px < -STEP || px > width + STEP) continue;
          const col = Math.round((px - OX) / STEP);
          const row = Math.round(py / STEP);
          const key = col + ',' + row;
          const existing = litCells.get(key);
          if (existing && existing.a >= alpha) continue;
          litCells.set(key, { x: OX + col * STEP, y: row * STEP, t: now, a: alpha, trail: seconds });
        }
        meteor.trailX = meteor.x;
        meteor.trailY = meteor.y;
      };
      const drawMeteors = (now, glow, glowRadius, glowMode) => {
        for (const meteor of meteors) {
          if (meteor.done) continue;
          /* 亮度档差 + 闪烁都作用在光晕大小上，弹头方块本身不变 */
          const glowScale = (Number.isFinite(meteor.glowScale) ? meteor.glowScale : 1)
            * (Number.isFinite(meteor.glowPulse) ? meteor.glowPulse : 1);
          drawHeadAt(meteor.x, meteor.y, glow, glowRadius * glowScale, glowMode);
          stampMeteorTrail(meteor, now, 1);
        }
      };

      const draw = () => {
        const rainCfg = config().rain || {};
        const showRain = rainOn();
        const showGrid = gridOn();
        const now = performance.now();
        const glowMode = ['none', 'glow', 'streak'].indexOf(rainCfg.headGlow) >= 0 ? rainCfg.headGlow : 'glow';
        /* 2.7.1：全 0 模式 = 身体全部空心（头部仍是实心亮块） */
        const zeroMode = rainCfg.charMode === 'zero';
        const glow = showRain && glowMode !== 'none' ? headGlowSprite() : null;
        const glowRadius = STEP * 2.4;
        /* ---- 代码雨层：字符、余晖、荧光屏灯 ---- */
        context = rainContext;
        context.clearRect(0, 0, width, height);
        let phosphor = false;
        if (showRain && rainCfg.effect === 'meteor') {
          /* 流星雨：只有头（光晕/拉丝沿用代码雨那三档），尾迹交给网格层 */
          drawMeteors(now, glow, glowRadius, glowMode);
        } else if (showRain) {
          phosphor = rainCfg.charMode === 'phosphor';
          if (phosphor !== lastCharMode) {
            /* 切模式不补历史：从当前行开始积累余晖，避免一上来点亮整列 */
            for (const string of strings) string.stampRow = Math.round(string.y / STEP);
            lastCharMode = phosphor;
          }
          for (const string of strings) {
            if (phosphor && showGrid) stampPhosphor(string, now);
            for (let index = 0; index < string.len; index += 1) {
              const y = string.y - index * STEP;
              if (y < -CELL || y > height + CELL) continue;
              const square = string.squares[index];
              if (index === 0) {
                if (glowMode !== 'none') queueHeadLight(string);
                /* 随机 01：头部照旧在当前这一遍画完；全 1 余晖：等余晖画完再盖上去 */
                if (!phosphor) drawHeadBlock(string, glow, glowRadius, glowMode);
                continue;
              }
              if (phosphor) {
                /* 全 1：身体是实心方块，比网格余晖的边框暗一档 */
                context.fillStyle = paint(square.alpha * 0.52);
                context.fillRect(string.x, y, CELL, CELL);
                continue;
              }
              if (zeroMode || square.hollow) {
                context.strokeStyle = paint(square.alpha);
                context.lineWidth = CELL_EDGE;
                context.strokeRect(string.x + CELL_HALF, y + CELL_HALF, CELL - CELL_EDGE, CELL - CELL_EDGE);
              } else {
                context.fillStyle = paint(square.alpha);
                context.fillRect(string.x, y, CELL, CELL);
              }
            }
          }
        }
        /* ---- 背景网格层：点亮、涟漪、扫描波、各种照明 ---- */
        context = gridContext;
        context.clearRect(0, 0, width, height);
        if (showGrid) {
          context.shadowBlur = 0;
          context.globalCompositeOperation = 'lighter';
          drawPointerLight();
          drawPointerPressLight();
          drawWidgetLight();
          drawComposerLight(now);
          flushLightCells();
          drawCharacterLight();
          drawWaves(now);
          context.globalCompositeOperation = 'source-over';
        }
        /* 全 1 余晖：白色头部最后盖在代码雨层上 */
        if (showRain && phosphor) {
          context = rainContext;
          for (const string of strings) {
            if (string.y < -CELL || string.y > height + CELL) continue;
            drawHeadBlock(string, glow, glowRadius, glowMode);
          }
        }
      };

      const tick = (now) => {
        try {
          if (window.__dshExvDebug) window.__dshExvDebug.rainFrames += 1;
          const rainCfg = config().rain || {};
          const showRain = rainOn();
          /* 背景层统一帧率（UI 里的「背景网格帧率」）：网格的点亮 / 涟漪 / 扫描波 / 各种照明
             和代码雨同处一个循环，共用这一档。以前代码雨关掉时会被强制拉到 60fps，
             导致那一档在关雨状态下完全不起作用，现在按设置走。 */
          const fps = Math.max(1, Math.min(120, Number(rainCfg.fps) || 60));
          if (!lastFrame || now - lastFrame >= 1000 / fps - 0.5) {
            lastFrame = now;
            /* 2.7.1：速度回到单值滑条（每串仍保留自己的基础速度差，整体乘这一档） */
            const speedScale = Math.max(0.25, Math.min(2, (Number(rainCfg.speed) || 100) / 100));
            const delta = last ? Math.min(0.06, (now - last) / 1000) : 0.016;
            last = now;
            if (showRain) {
              if (rainCfg.effect === 'meteor') {
                updateMeteors(now, delta);
              } else {
                for (const string of strings) {
                  string.remainder += string.speed * speedScale * delta;
                  if (string.remainder >= STEP) {
                    const steps = Math.floor(string.remainder / STEP);
                    string.y += steps * STEP;
                    string.remainder -= steps * STEP;
                  }
                  if (string.y - string.len * STEP > height) {
                    Object.assign(string, spawn(false));
                  }
                }
              }
            }
            draw();
          }
        } catch (error) {
          /* 单帧异常不能杀死循环，否则背景会永久停住 */
          if (!tick.reported) {
            tick.reported = true;
            console.error('[dsh-exv] rain frame failed', error);
          }
        }
        raf = requestAnimationFrame(tick);
      };

      const stop = () => {
        cancelAnimationFrame(raf);
        raf = 0;
      };

      const start = () => {
        if (raf || !enabled || !active) return;
        last = 0;
        lastFrame = 0;
        raf = requestAnimationFrame(tick);
      };

      const syncStringCount = () => {
        const rainCfg = config().rain || {};
        const density = Math.max(0.25, Math.min(2, (Number(rainCfg.density) || 100) / 100));
        const count = Math.max(2, Math.floor(width / STEP / 4.0 * density));
        while (strings.length < count) strings.push(spawn(true));
        while (strings.length > count) strings.pop();
      };

      const resize = () => {
        width = canvas.clientWidth || gridCanvas.clientWidth || window.innerWidth;
        height = canvas.clientHeight || gridCanvas.clientHeight || window.innerHeight;
        const rainCfg = config().rain || {};
        const cap = [720, 1080, 1440, 2160].includes(Number(rainCfg.resolution)) ? Number(rainCfg.resolution) : 1440;
        resolution = cap;
        const ratio = Math.max(0.25, Math.min(window.devicePixelRatio || 1, 2, cap / Math.max(1, height)));
        /* 两块画布用同一份尺寸/缩放，保证两层逐像素对齐 */
        for (const surface of [canvas, gridCanvas]) {
          surface.width = Math.round(width * ratio);
          surface.height = Math.round(height * ratio);
          const surfaceContext = surface.getContext('2d');
          if (surfaceContext) surfaceContext.setTransform(ratio, 0, 0, ratio, 0, 0);
        }
        deviceRatio = ratio;
        strings = [];
        /* 2.7.1：流星雨也清空，按新画布尺寸重新铺 */
        meteors.length = 0;
        volleyAt = 0;
        syncStringCount();
        draw();
        start();
      };

      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resize, 160);
      };
      const onVisibility = () => {
        if (document.hidden) stop();
        else start();
      };

      const onPointerMove = (event) => {
        const rect = measure();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
      };
      const onPointerDown = (event) => {
        if (event.button !== 0 && event.button !== 2) return;
        if (event.button === 0) pressing = true;
        /* 网格层关掉时没有可点亮的格子：别把涟漪堆在数组里 */
        if (!gridOn()) return;
        const ripple = pointerConfig().ripple;
        if (ripple && ripple.enabled === false) return;
        const rect = measure();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const born = performance.now();
        const rawSpeed = Number(ripple && ripple.speed);
        const speedScale = Math.max(0.25, Math.min(2, (Number.isFinite(rawSpeed) ? rawSpeed : 100) / 100));
        const mode = ripple && ripple.mode ? ripple.mode : '2d';
        if (mode === '3d') {
          /* 3D 涟漪复用扫描波的抬升/余辉逻辑；扩散距离按涟漪范围减半 */
          const maxRadius = Math.max(0, (Number(ripple && ripple.radius) || 0) * CLICK3D_RADIUS_FACTOR);
          if (maxRadius <= 0) return;
          waves.push({
            kind: 'scan',
            click: true,
            x,
            y,
            born,
            speed: 560 * speedScale,
            maxRadius,
            threeD: true,
            trailSeconds: CLICK3D_TRAIL_SECONDS / speedScale,
            sinkSeconds: CLICK3D_SINK_SECONDS / speedScale,
          });
          return;
        }
        waves.push({ x, y, born, speed: 560 * speedScale });
      };
      const onPointerUp = () => {
        pressing = false;
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
      window.addEventListener('blur', onPointerUp);
      window.addEventListener('resize', onResize);
      document.addEventListener('visibilitychange', onVisibility);
      resize();

      return {
        dispose() {
          stop();
          window.clearTimeout(resizeTimer);
          window.removeEventListener('resize', onResize);
          document.removeEventListener('visibilitychange', onVisibility);
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerdown', onPointerDown);
          window.removeEventListener('pointerup', onPointerUp);
          window.removeEventListener('pointercancel', onPointerUp);
          window.removeEventListener('blur', onPointerUp);
          window.removeEventListener('dsh-exv-thinking', onThinking);
        },
        setEnabled(value) {
          enabled = Boolean(value);
          if (enabled) start();
          else stop();
        },
        setActive(value) {
          active = Boolean(value);
          if (active) start();
          else stop();
        },
        setResolution(value) {
          const next = [720, 1080, 1440, 2160].includes(Number(value)) ? Number(value) : 1440;
          if (resolution === next) return;
          resize();
        },
        setDensity() {
          syncStringCount();
        },
        /* 2.7.1：格子大小改了要立刻换几何——清掉按旧像素坐标记下的余晖/涟漪/雨丝，
           再用新几何重排。界面比例的间距是启动常量，这里不重算它。
           传入 cfg 是必须的：store 的通知比 applyConfig 早，闭包里那份还是旧的。 */
        setGeometry(cfg) {
          applyGeometry(cfg);
          litCells.clear();
          waves.length = 0;
          strings = [];
          syncStringCount();
          draw();
        },
        geometry() {
          return { cell: CELL, gap: GAP, step: STEP, ox: OX, edge: CELL_EDGE };
        },
      };
    }

    function mount() {
      const style = document.createElement('style');
      style.dataset.dshParallax = '';
      style.textContent = css;
      document.head.appendChild(style);

      window.__dshExvDebug = { rainFrames: 0, parallaxFrames: 0 };
      const root = document.createElement('div');
      root.id = 'dsh-parallax';
      root.setAttribute('aria-hidden', 'true');
      const pressGlow = document.createElement('div');
      pressGlow.className = 'pl-press-glow';
      root.appendChild(pressGlow);

      const layer = (name, depth) => {
        const el = document.createElement('div');
        el.className = 'pl';
        el.dataset.layer = name;
        el.dataset.depth = String(depth);
        return el;
      };

      const background = layer('bg', 6);
      const bg = document.createElement('div');
      bg.className = 'pl-bg';
      background.appendChild(bg);
      /* 2.7.1：背景压暗遮罩。放在同一个壳里、DOM 顺序在本体背景之后，
         所以增强包插进来的 #dsh-visual-bg（插在 .pl-bg 后面）也在它下面，
         一层遮罩同时压暗两种背景；格阵在另一个 depth 更高的壳里，不受影响。 */
      const bgDim = document.createElement('div');
      bgDim.className = 'pl-bg-dim';
      background.appendChild(bgDim);

      /* 2.5.0：网格层与代码雨层分开，但都挂在这一个 .pl 壳里 —— 同一个视差深度、
         同一个 transform，所以两层永远逐格重合。 */
      const rain = layer('rain', 14);
      const gridLayer = document.createElement('div');
      gridLayer.className = 'pl-grid-layer';
      const grid = document.createElement('div');
      grid.className = 'pl-grid';
      const gridCanvas = document.createElement('canvas');
      gridLayer.append(grid, gridCanvas);
      const rainLayer = document.createElement('div');
      rainLayer.className = 'pl-rain-layer';
      const canvas = document.createElement('canvas');
      rainLayer.appendChild(canvas);
      rain.append(gridLayer, rainLayer);

      const logos = layer('logos', 22);
      const logoInner = document.createElement('div');
      logoInner.className = 'pl-logos';
      const logo = document.createElement('img');
      logo.className = 'pl-logo';
      logo.src = ASSETS.logo;
      logo.alt = '';
      logo.draggable = false;
      const wordmark = document.createElement('img');
      wordmark.className = 'pl-wordmark';
      wordmark.src = ASSETS.wordmark;
      wordmark.alt = '';
      wordmark.draggable = false;
      logoInner.append(logo, wordmark);
      logos.appendChild(logoInner);

      const vvLayer = layer('vv', 34);
      const vvWrap = document.createElement('div');
      vvWrap.className = 'pl-vv-wrap';
      const vv = document.createElement('img');
      vv.className = 'pl-vv';
      vv.src = ASSETS.vv;
      vv.alt = '';
      vv.draggable = false;
      vvWrap.appendChild(vv);
      const live2dCanvas = document.createElement('canvas');
      live2dCanvas.className = 'pl-live2d';
      live2dCanvas.style.display = 'none';
      vvWrap.appendChild(live2dCanvas);
      vvLayer.appendChild(vvWrap);

      root.append(background, rain, logos, vvLayer);
      document.body.insertBefore(root, document.body.firstChild);

      const store = window.__DSH_EXV__;
      let config = store ? store.get() : null;
      /* 主色只在启动时读一次：换色要重启 DSH 才生效（与 cyan 一致）；
         2.7.1 起界面比例也一样，是启动常量。 */
      accentHexNow = accentHexOf(config);
      /* 2.7.1：格阵几何在启动时算一次（格子大小 + 界面比例决定的间距），
         点阵规则跟着它走；界面比例换档仍然要重启 DSH。 */
      gridGeomNow = gridGeometryOf(config);
      /* 网格点阵跟着主色与格子几何走（CSS 里的 data URL 不能吃变量，只能整条规则重写） */
      syncGridAccent();

      const rainControl = startRain(canvas, gridCanvas, () => config, () => (config && config.vv.mode !== 'none' ? vv : null));

      /* 格子大小是即时滑条：不重建视图，只换几何 + 重排雨丝 + 重写点阵规则 */
      if (store && typeof store.subscribe === 'function') {
        let lastCellSize = Number(config && config.rain ? config.rain.cellSize : 16);
        store.subscribe((next) => {
          const cellSize = Number(next && next.rain ? next.rain.cellSize : 16);
          if (cellSize === lastCellSize) return;
          lastCellSize = cellSize;
          try {
            if (rainControl.setGeometry) rainControl.setGeometry(next);
            gridGeomNow = rainControl.geometry ? rainControl.geometry() : gridGeometryOf(next);
            syncGridAccent();
          } catch (error) { /* 单次换档失败不影响背景 */ }
        });
      }

      /* 2.7.1：每层的基准位移（px，targetX/Y 是 -1..1），配置里的 strength 是它的百分比 */
      /* 组件层（HUD）单独一份基准位移：不再寄生在 LOGO 层上，关掉 LOGO 视差它也能自己跟鼠标 */
      const PARALLAX_BASE = { bg: 8, rain: 16, logos: 18, vv: 48, widget: 18 };
      const strengths = PARALLAX_BASE;
      const damping = { bg: 0.05, rain: 0.07, logos: 0.14, vv: 0.035 };
      /* 层名 → 配置键：格阵和代码雨是同一个壳（rain），配置里叫 grid */
      const PARALLAX_KEY = { bg: 'bg', rain: 'grid', logos: 'logos', vv: 'vv', widget: 'widget' };
      const parallaxEntry = (cfg, layer) => {
        const item = cfg && cfg[PARALLAX_KEY[layer] || layer];
        return item && typeof item === 'object' ? item : null;
      };
      const nodeLayerEnabled = (cfg, layer) => {
        const item = parallaxEntry(cfg, layer);
        return !item || item.enabled !== false;
      };
      const layerPercent = (cfg, layer) => {
        const item = parallaxEntry(cfg, layer);
        const value = item ? Number(item.strength) : 100;
        return Number.isFinite(value) ? Math.max(0, Math.min(200, value)) : 100;
      };
      const nodes = Array.from(root.querySelectorAll('.pl')).map((el) => ({
        el,
        strength: strengths[el.dataset.layer] || 0,
        ease: damping[el.dataset.layer] || 0.08,
        x: 0,
        y: 0,
      }));

      const LIVE2D_CACHE_LIMIT = 2;
      /* 2.3.1：微表情只碰脸。运行时按模型实际存在的参数建动作池，
         不支持的参数直接跳过；UMP45 的池子里因此没有眉毛相关。 */
      const FACE_PARAM_IDS = [
        'ParamBrowLY', 'ParamBrowRY', 'ParamBrowLForm', 'ParamBrowRForm',
        'ParamEyeLSmile', 'ParamEyeRSmile', 'ParamMouthForm',
        'ParamEyeBallX', 'ParamEyeBallY',
      ];
      /* 2.3.1 按模型微调：pool 限定可用动作，furrowScale 调整皱眉幅度，
         invertSmile 用于绑定方向相反的模型。 */
      const FACE_PROFILES = {
        ar15_4508: { pool: ['browOne', 'browBoth'] },
        ar15mod_n: { invertSmile: true },
        hk416_805: { pool: ['browOne', 'browBoth', 'browFurrow', 'lookAround'], furrowScale: 0.55 },
        m4a1mod: { pool: ['browFurrow', 'smile', 'lookAround'] },
        ro635_4504: { pool: ['browFurrow', 'lookAround'] },
        ro635mod: { pool: ['browOne', 'browBoth', 'lookAround'] },
        ump45mod_n: { pool: ['lookAround'] },
        vector_1901: { pool: [] },
        vector_6701_n: { pool: ['browOne', 'browBoth', 'smile', 'lookAround'] },
      };
      const live2d = {
        app: null,
        model: null,
        currentEntry: null,
        cache: new Map(),
        pending: new Map(),
        loaded: false,
        loading: false,
        failed: false,
        token: 0,
        currentId: '',
        targetId: '',
        /* 2.7.1：视差位移改成「画布内位移」——见 applyLive2DOffset 的注释 */
        anchorX: 0,
        anchorY: 0,
        offsetX: 0,
        offsetY: 0,
        playEntrance: null,
        manager: null,
        startIdle: null,
        entrancePending: false,
        idleStarting: false,
        idleTimer: 0,
        head: { active: false, startX: 0, startY: 0, x: 0, y: 0, tx: 0, ty: 0 },
        focusX: 0,
        focusY: 0,
        eyeX: 0,
        eyeY: 0,
        eyeEnabled: true,
        /* 2.2：待机时偶尔朝屏幕中心瞟一眼。lastMoveAt 记录最后一次指针活动，
           glance 是这一次“看屏幕前的人”的短动作状态。 */
        lastMoveAt: 0,
        glance: { active: false, start: 0, dur: 0, x: 0, y: 0, nextAt: 0 },
        /* 2.3.1：一次瞟一眼最多带一个微表情 */
        face: { active: false, model: null, id: '', start: 0, dur: 0, attack: 0, release: 0, side: 'L', dir: 1 },
        faceLastId: '',
      };

      /* Rewrite all file references to data URLs so the model loads without
         needing a static file server next to the plugin bundle. */
      const live2dSettings = (build) => {
        const settings = JSON.parse(JSON.stringify(build.settings));
        const file = settings.FileReferences || (settings.FileReferences = {});
        file.Moc = `data:application/octet-stream;base64,${build.moc3}`;
        file.Textures = (build.textures || []).map((texture) => `data:image/webp;base64,${texture}`);
        if (build.physics) file.Physics = `data:application/json;base64,${build.physics}`;
        else if (file.Physics) file.Physics = null;
        if (file.Pose) file.Pose = null;
        if (file.DisplayInfo) file.DisplayInfo = null;
        if (file.Expressions) file.Expressions = [];
        if (file.UserData) file.UserData = null;
        if (file.Motions) {
          for (const group of Object.values(file.Motions)) {
            for (const item of group) {
              if (!item || !item.File) continue;
              const name = item.File.split(/[\\/]/).pop();
              const data = (build.motions && build.motions[name]) || build.motion;
              item.File = `data:application/json;base64,${data}`;
            }
          }
        }
        return settings;
      };

      /* 2.7.1：Live2D 的视差位移画在画布「里面」，不再平移整块画布。
         以前 vv 层会被 translate3d 推来推去，画布下边缘跟着抬进屏幕，于是
         「位置 / 大小」把下半身裁到屏幕外时，鼠标移到上半屏就能看见一条把角色
         切断的硬边。模型在画布坐标里本来就画到约 1.5 屏高（全身都在渲染），
         把它在画布内挪同样的像素，观感完全一样，但裁切线永远停在窗口底边。 */
      const applyLive2DOffset = () => {
        if (!live2d.model) return;
        live2d.model.position.set(live2d.anchorX + live2d.offsetX, live2d.anchorY + live2d.offsetY);
      };
      const layoutLive2D = () => {
        if (!live2d.app || !live2d.model) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        live2d.app.renderer.resize(width, height);
        const iw = live2d.model.internalModel.width || 1;
        const ih = live2d.model.internalModel.height || 1;
        const id = live2d.currentId || (config && config.vv ? config.vv.live2d : 'ar15_4508');
        const item = (config && config.vv && config.vv.live2dConfig && config.vv.live2dConfig[id])
          || { scale: 180, x: -9, y: 52, eye: true };
        const base = Math.min((height * 0.94) / ih, (width * 0.96) / iw);
        live2d.eyeEnabled = item.eye !== false;
        live2d.model.scale.set(base * (item.scale / 100));
        live2d.anchorX = width / 2 + (item.x / 100) * width;
        live2d.anchorY = height + (item.y / 100) * height;
        applyLive2DOffset();
      };

      const readFaceSupport = (model) => {
        const support = {};
        const core = model && model.internalModel && model.internalModel.coreModel;
        if (!core || typeof core.getParameterIndex !== 'function') return support;
        for (const id of FACE_PARAM_IDS) {
          try {
            const index = core.getParameterIndex(id);
            if (!Number.isFinite(index) || index < 0) continue;
            const min = core.getParameterMinimumValue(index);
            const max = core.getParameterMaximumValue(index);
            if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) continue;
            support[id] = { index, min, max };
          } catch (error) {
            /* parameter absent */
          }
        }
        return support;
      };

      const buildFacePool = (support, profile) => {
        const has = (id) => Boolean(support && support[id]);
        const pool = [];
        if (has('ParamBrowLY') || has('ParamBrowRY')) pool.push({ id: 'browOne' });
        if (has('ParamBrowLY') && has('ParamBrowRY')) pool.push({ id: 'browBoth' });
        if (has('ParamBrowLForm') || has('ParamBrowRForm')) pool.push({ id: 'browFurrow' });
        if (has('ParamEyeLSmile') || has('ParamEyeRSmile') || has('ParamMouthForm')) pool.push({ id: 'smile' });
        if (has('ParamEyeBallX') || has('ParamEyeBallY')) pool.push({ id: 'lookAround' });
        const allowed = profile && Array.isArray(profile.pool) ? profile.pool : null;
        return allowed ? pool.filter((entry) => allowed.indexOf(entry.id) >= 0) : pool;
      };

      const clearGlanceFace = () => {
        live2d.face.active = false;
        live2d.face.model = null;
        live2d.face.id = '';
      };

      const startGlanceFace = (model, now, enabled) => {
        clearGlanceFace();
        if (!enabled || !model) return;
        const pool = model.__dshFacePool || [];
        if (pool.length === 0) return;
        let candidates = pool;
        if (pool.length > 1 && live2d.faceLastId) {
          const filtered = pool.filter((item) => item.id !== live2d.faceLastId);
          if (filtered.length > 0) candidates = filtered;
        }
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        const support = model.__dshFaceSupport || {};
        let side = Math.random() < 0.5 ? 'L' : 'R';
        if (!support.ParamBrowLY && support.ParamBrowRY) side = 'R';
        if (support.ParamBrowLY && !support.ParamBrowRY) side = 'L';
        const glance = live2d.glance;
        const startRatio = 0.26 + Math.random() * 0.10;
        const maxDur = Math.max(180, glance.dur * (0.94 - startRatio));
        const wanted = pick.id === 'lookAround'
          ? 1200 + Math.random() * 300
          : 900 + Math.random() * 600;
        live2d.face = {
          active: true,
          model,
          id: pick.id,
          start: glance.start + glance.dur * startRatio,
          dur: Math.min(wanted, maxDur),
          attack: 220,
          release: 320,
          side,
          dir: Math.random() < 0.5 ? -1 : 1,
        };
        live2d.faceLastId = pick.id;
      };

      const faceOffsetsAt = (model, now) => {
        const face = live2d.face;
        if (!face.active || face.model !== model) return null;
        const elapsed = now - face.start;
        if (elapsed <= 0 || elapsed >= face.dur) return null;
        const attack = face.attack > 0 ? Math.min(1, elapsed / face.attack) : 1;
        const release = face.release > 0 ? Math.min(1, (face.dur - elapsed) / face.release) : 1;
        let weight = Math.min(attack, release);
        weight = weight * weight * (3 - 2 * weight);
        const progress = Math.max(0, Math.min(1, elapsed / face.dur));
        const support = model.__dshFaceSupport || {};
        const profile = model.__dshFaceProfile || {};
        const eyeSmileSign = profile.invertSmile === true ? -1 : 1;
        const mouthSign = profile.invertSmile === true ? -1 : 1;
        const furrowAmp = 0.45 * (Number.isFinite(profile.furrowScale) ? profile.furrowScale : 1);
        const out = { params: {}, eyeX: 0, eyeY: 0, headX: 0 };
        const range = (id) => (support[id] ? support[id].max - support[id].min : 0);
        const put = (id, delta) => {
          if (!support[id] || Math.abs(delta) <= 1e-4) return;
          out.params[id] = delta * weight;
        };
        const left = face.side === 'L';
        if (face.id === 'browOne') {
          put(left ? 'ParamBrowLY' : 'ParamBrowRY', 0.24 * range(left ? 'ParamBrowLY' : 'ParamBrowRY'));
          put(left ? 'ParamBrowLForm' : 'ParamBrowRForm', 0.10 * range(left ? 'ParamBrowLForm' : 'ParamBrowRForm'));
        } else if (face.id === 'browBoth') {
          put('ParamBrowLY', 0.28 * range('ParamBrowLY'));
          put('ParamBrowRY', 0.28 * range('ParamBrowRY'));
          put('ParamBrowLForm', 0.10 * range('ParamBrowLForm'));
          put('ParamBrowRForm', 0.10 * range('ParamBrowRForm'));
        } else if (face.id === 'browFurrow') {
          put('ParamBrowLForm', furrowAmp * range('ParamBrowLForm'));
          put('ParamBrowRForm', furrowAmp * range('ParamBrowRForm'));
        } else if (face.id === 'smile') {
          put('ParamEyeLSmile', eyeSmileSign * 0.70 * range('ParamEyeLSmile'));
          put('ParamEyeRSmile', eyeSmileSign * 0.70 * range('ParamEyeRSmile'));
          put('ParamMouthForm', mouthSign * 0.40 * range('ParamMouthForm'));
        } else if (face.id === 'lookAround') {
          /* 一次完整的左右环顾：0 → 左 → 右 → 0，眼睛接近鼠标横扫，头也跟着小幅转 */
          const sweep = Math.sin(progress * Math.PI * 2) * face.dir;
          out.eyeX = sweep * 0.40 * range('ParamEyeBallX') * weight;
          out.headX = sweep * 0.50 * weight;
          out.eyeY = 0;
        }
        return out;
      };

      const applyEyeAndHead = (model) => {
        const now = performance.now();
        if (!live2d.lastMoveAt) live2d.lastMoveAt = now;
        const glance = live2d.glance;
        const vvConfig = (config && config.vv) || {};
        const glanceConfig = vvConfig.glance && typeof vvConfig.glance === 'object' ? vvConfig.glance : {};
        const glanceEnabled = glanceConfig.enabled !== false;
        const expressionEnabled = glanceConfig.expression !== false;
        if (!glanceEnabled) {
          glance.active = false;
          glance.nextAt = now + 8000;
          clearGlanceFace();
        } else if (glance.active && now - glance.start >= glance.dur) {
          glance.active = false;
          glance.nextAt = now + 8000 + Math.random() * 8000;
          clearGlanceFace();
        } else if (!glance.active && !live2d.head.active
          && now >= glance.nextAt && now - live2d.lastMoveAt > 7000) {
          /* 鼠标安静 7 秒后，每隔 8–16 秒随机瞟一眼屏幕中心：像不经意看屏幕前的人一眼 */
          glance.active = true;
          glance.start = now;
          glance.dur = 2400 + Math.random() * 2400;
          glance.x = (Math.random() * 2 - 1) * 0.12;
          glance.y = (Math.random() * 2 - 1) * 0.08;
          startGlanceFace(model, now, expressionEnabled);
        } else if (!expressionEnabled && live2d.face.active) {
          clearGlanceFace();
        }
        if (live2d.face.active && live2d.face.model !== model) clearGlanceFace();
        let baseX = live2d.eyeEnabled ? live2d.focusX : 0;
        let baseY = live2d.eyeEnabled ? live2d.focusY : 0;
        if (glance.active) {
          const progress = Math.min(1, Math.max(0, (now - glance.start) / glance.dur));
          /* 前 22% 转过去，中间停住看一会儿，最后 32% 转回鼠标方向 */
          const weight = progress < 0.22
            ? progress / 0.22
            : progress > 0.68
              ? Math.max(0, (1 - progress) / 0.32)
              : 1;
          baseX = baseX * (1 - weight) + glance.x * weight;
          baseY = baseY * (1 - weight) + glance.y * weight;
        }
        const targetX = baseX;
        const targetY = baseY;
        live2d.eyeX += (targetX - live2d.eyeX) * 0.12;
        live2d.eyeY += (targetY - live2d.eyeY) * 0.12;
        live2d.head.x += (live2d.head.tx - live2d.head.x) * 0.18;
        live2d.head.y += (live2d.head.ty - live2d.head.y) * 0.18;
        const core = model.internalModel.coreModel;
        const applied = model.__dshAppliedOffsets || (model.__dshAppliedOffsets = {});
        const add = (param, value) => {
          try {
            const info = model.__dshFaceSupport && model.__dshFaceSupport[param];
            if (info) {
              const current = core.getParameterValueById(param);
              const next = Math.min(info.max, Math.max(info.min, current + value));
              const actual = next - current;
              if (Math.abs(actual) < 1e-6) return;
              core.setParameterValueById(param, next);
              applied[param] = actual;
              return;
            }
            core.setParameterValueById(param, core.getParameterValueById(param) + value);
            applied[param] = value;
          } catch (error) { /* parameter absent */ }
        };
        const face = faceOffsetsAt(model, now);
        const faceHeadX = face ? face.headX : 0;
        add('ParamEyeBallX', live2d.eyeX + (face ? face.eyeX : 0));
        add('ParamEyeBallY', -live2d.eyeY + (face ? face.eyeY : 0));
        add('ParamAngleX', live2d.eyeX * 18 + live2d.head.x * 30 + faceHeadX * 18);
        add('ParamAngleY', -live2d.eyeY * 18 - live2d.head.y * 20);
        add('ParamAngleZ', live2d.eyeX * 3 + live2d.head.x * 6 + faceHeadX * 3);
        add('ParamBodyAngleX', live2d.eyeX * 5 + live2d.head.x * 10 + faceHeadX * 5);
        add('ParamBodyAngleY', -live2d.head.y * 6);
        if (face) {
          for (const [param, delta] of Object.entries(face.params)) add(param, delta);
        }
      };

      const live2dSettingsUrl = (build) => URL.createObjectURL(new Blob(
        [JSON.stringify(live2dSettings(build))],
        { type: 'application/json' },
      ));

      /* Build the per-model runtime wrapper exactly once. The wrapper owns the
         focus offsets for that model, so cached models cannot subtract a
         different model's offsets when they become current again. */
      const prepareLive2DModel = (id, model, build) => {
        const entry = { id, model, build, manager: null, startIdle: null, playEntrance: null };
        const manager = model.internalModel.motionManager;
        if (!manager) return entry;
        const core = model.internalModel.coreModel;
        model.__dshAppliedOffsets = {};
        model.__dshFaceSupport = readFaceSupport(model);
        model.__dshFaceProfile = FACE_PROFILES[id] || {};
        model.__dshFacePool = buildFacePool(model.__dshFaceSupport, model.__dshFaceProfile);
        const originalMotionUpdate = manager.update.bind(manager);
        manager.update = (...args) => {
          const offsets = model.__dshAppliedOffsets || (model.__dshAppliedOffsets = {});
          for (const [param, value] of Object.entries(offsets)) {
            try { core.setParameterValueById(param, core.getParameterValueById(param) - value); } catch (error) { /* parameter absent */ }
          }
          for (const key of Object.keys(offsets)) delete offsets[key];
          originalMotionUpdate(...args);
          applyEyeAndHead(model);
        };
        entry.manager = manager;

        const startIdle = () => {
          if (live2d.model !== model || live2d.idleStarting) return;
          window.clearTimeout(live2d.idleTimer);
          const prepareIdleMotion = (motion) => {
            if (!motion) return;
            if (motion.setIsLoop) motion.setIsLoop(true);
            if (motion.setIsLoopFadeIn) motion.setIsLoopFadeIn(false);
            if (motion.setFadeInTime) motion.setFadeInTime(0);
            if (motion.setFadeOutTime) motion.setFadeOutTime(0);
          };
          const beginIdle = (motion) => {
            if (live2d.model !== model) {
              live2d.idleStarting = false;
              return;
            }
            prepareIdleMotion(motion);
            const started = manager.startMotion(build.idle.group, build.idle.index, 2);
            Promise.resolve(started).finally(() => {
              if (live2d.model === model) live2d.idleStarting = false;
            });
          };
          if (build.idle) {
            live2d.idleStarting = true;
            const loadedIdle = manager.motionGroups
              && manager.motionGroups[build.idle.group]
              && manager.motionGroups[build.idle.group][build.idle.index];
            if (loadedIdle) {
              beginIdle(loadedIdle);
            } else {
              Promise.resolve(manager.loadMotion(build.idle.group, build.idle.index))
                .then((motion) => { beginIdle(motion); })
                .catch(() => { if (live2d.model === model) live2d.idleStarting = false; });
            }
          } else {
            manager.startRandomMotion('', 2);
            live2d.idleStarting = false;
          }
          const idleSeconds = Math.max(1, Number(build.idleDuration) || 8);
          const checkIdle = () => {
            if (live2d.model !== model) return;
            if (manager.isFinished && manager.isFinished()) startIdle();
            else live2d.idleTimer = window.setTimeout(checkIdle, idleSeconds * 1000);
          };
          live2d.idleTimer = window.setTimeout(checkIdle, idleSeconds * 1000);
        };
        manager.on('motionFinish', () => {
          if (live2d.model === model) startIdle();
        });
        entry.startIdle = startIdle;
        entry.playEntrance = () => {
          if (live2d.model !== model) return;
          /* 2.7.1：入场动画开关（vv.entrance）。关掉后切到动态模式直接进待机，
             不播 login 动作；模型本身没有 login 动作时本来就走这个分支。 */
          const entranceOn = !(config && config.vv && config.vv.entrance === false);
          if (build.entrance && entranceOn) {
            window.clearTimeout(live2d.idleTimer);
            live2d.entrancePending = true;
            const started = manager.startMotion(build.entrance.group, build.entrance.index, 2);
            Promise.resolve(started).then(() => {
              const entranceMotion = manager.motionGroups
                && manager.motionGroups[build.entrance.group]
                && manager.motionGroups[build.entrance.group][build.entrance.index];
              if (entranceMotion && entranceMotion.setFadeOutTime) entranceMotion.setFadeOutTime(0);
            }).finally(() => {
              if (live2d.model === model) live2d.entrancePending = false;
            });
            const entranceSeconds = Math.max(1, Number(build.entranceDuration) || 3);
            live2d.idleTimer = window.setTimeout(() => {
              if (live2d.model !== model) return;
              if (manager.isFinished && manager.isFinished()) {
                live2d.entrancePending = false;
                startIdle();
              }
            }, entranceSeconds * 1000);
          } else {
            live2d.entrancePending = false;
            startIdle();
          }
        };
        return entry;
      };

      const createLive2DModel = async (id) => {
        const build = LIVE2D_ASSETS[id] || LIVE2D_ASSETS.ar15_4508;
        const settingsUrl = live2dSettingsUrl(build);
        let model;
        try {
          model = await PIXI.live2d.Live2DModel.from(settingsUrl, {
            autoInteract: false,
            autoUpdate: false,
          });
        } finally {
          URL.revokeObjectURL(settingsUrl);
        }
        if (model.anchor) model.anchor.set(0.5, 1);
        model.autoUpdate = false;
        return prepareLive2DModel(id, model, build);
      };

      const rememberLive2DEntry = (id, entry) => {
        if (!id || !entry) return;
        if (live2d.cache.get(id) === entry) live2d.cache.delete(id);
        live2d.cache.set(id, entry);
      };

      const disposeLive2DEntry = (entry) => {
        if (!entry || !entry.model) return;
        try {
          if (entry.model.parent) entry.model.parent.removeChild(entry.model);
        } catch (error) { /* already removed */ }
        try {
          entry.model.autoUpdate = false;
          entry.model.destroy();
        } catch (error) { /* already gone */ }
      };

      const trimLive2DCache = () => {
        while (live2d.cache.size > LIVE2D_CACHE_LIMIT) {
          let victim = null;
          for (const [id, entry] of live2d.cache) {
            if (id === live2d.currentId || id === live2d.targetId) continue;
            victim = [id, entry];
            break;
          }
          if (!victim) break;
          live2d.cache.delete(victim[0]);
          disposeLive2DEntry(victim[1]);
        }
      };

      const setLive2DActive = (active) => {
        if (!live2d.app) return;
        if (active && live2d.model) {
          live2d.app.start();
          if (!live2d.model.autoUpdate) live2d.model.autoUpdate = true;
        } else {
          window.clearTimeout(live2d.idleTimer);
          live2d.idleTimer = 0;
          if (live2d.model && live2d.model.autoUpdate) live2d.model.autoUpdate = false;
          live2d.app.stop();
          live2d.glance.active = false;
          clearGlanceFace();
        }
      };

      const applyLive2DFps = () => {
        const raw = Number(config && config.vv ? config.vv.fps : 120);
        const fps = [30, 60, 90, 120].includes(raw) ? raw : 120;
        if (window.PIXI && PIXI.Ticker && PIXI.Ticker.shared) PIXI.Ticker.shared.maxFPS = fps;
        if (live2d.app && live2d.app.ticker) live2d.app.ticker.maxFPS = fps;
      };

      const activateLive2DModel = (id, entry) => {
        if (!entry || !entry.model || !live2d.app) return;
        const previous = live2d.model;
        if (previous && previous !== entry.model) {
          try { live2d.app.stage.removeChild(previous); } catch (error) { /* already removed */ }
          previous.autoUpdate = false;
          if (live2d.currentEntry) rememberLive2DEntry(live2d.currentId, live2d.currentEntry);
        }
        window.clearTimeout(live2d.idleTimer);
        live2d.idleTimer = 0;
        live2d.entrancePending = false;
        live2d.idleStarting = false;
        live2d.model = entry.model;
        live2d.currentEntry = entry;
        live2d.currentId = id;
        live2d.targetId = id;
        live2d.manager = entry.manager;
        live2d.startIdle = entry.startIdle;
        live2d.playEntrance = entry.playEntrance;
        if (entry.model.parent !== live2d.app.stage) live2d.app.stage.addChild(entry.model);
        rememberLive2DEntry(id, entry);
        trimLive2DCache();
        const live = Boolean(config && config.vv.mode === 'live2d' && !document.hidden);
        setLive2DActive(live);
        layoutLive2D();
        live2d.loaded = true;
        live2d.loading = false;
        if (live) {
          live2dCanvas.style.display = '';
          vv.style.display = 'none';
          if (entry.playEntrance) entry.playEntrance();
        }
      };

      const loadLive2DModel = (id) => {
        if (!live2d.app) return;
        const token = ++live2d.token;
        live2d.targetId = id;
        window.clearTimeout(live2d.idleTimer);
        live2d.idleTimer = 0;
        live2d.entrancePending = false;
        live2d.idleStarting = false;
        const cached = live2d.cache.get(id);
        if (cached) {
          live2d.loading = false;
          activateLive2DModel(id, cached);
          return;
        }
        live2d.loading = true;
        let task = live2d.pending.get(id);
        if (!task) {
          task = createLive2DModel(id).finally(() => {
            live2d.pending.delete(id);
          });
          live2d.pending.set(id, task);
        }
        task.then((entry) => {
          if (!live2d.app) {
            disposeLive2DEntry(entry);
            return;
          }
          rememberLive2DEntry(id, entry);
          if (token !== live2d.token) {
            trimLive2DCache();
            return;
          }
          activateLive2DModel(id, entry);
        }).catch((error) => {
          if (token !== live2d.token) return;
          live2d.loading = false;
          console.warn('[dsh-theme] Live2D model failed', id, error);
          if (!live2d.model) {
            live2dCanvas.style.display = 'none';
            vv.style.display = '';
          }
        });
      };


      /* 2.7.1：Live2D 渲染倍率。auto = 跟屏幕 DPR（上限 2×），其余就是字面倍率。 */
      const live2dResolution = () => {
        const raw = config && config.vv ? config.vv.renderScale : 'auto';
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        if (raw === undefined || raw === 'auto') return dpr;
        const value = Number(raw);
        return Number.isFinite(value) && value > 0 ? Math.min(3, Math.max(0.5, value)) : dpr;
      };
      const ensureLive2D = () => {
        if (live2d.app || live2d.failed) return;
        try {
          if (!window.PIXI || !PIXI.live2d || !PIXI.live2d.Live2DModel) {
            throw new Error('Live2D runtime unavailable');
          }
          const app = new PIXI.Application({
            view: live2dCanvas,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundAlpha: 0,
            antialias: true,
            autoDensity: true,
            resolution: live2dResolution(),
          });
          live2d.app = app;
          applyLive2DFps();
          loadLive2DModel((config && config.vv.live2d) || 'ar15_4508');
        } catch (error) {
          live2d.failed = true;
          console.warn('[dsh-theme] Live2D runtime failed', error);
          live2dCanvas.style.display = 'none';
          vv.style.display = '';
        }
      };

      window.addEventListener('pointermove', (event) => {
        if (!live2d.loaded) return;
        live2d.lastMoveAt = performance.now();
        if (live2d.glance.active) {
          live2d.glance.active = false;
          live2d.glance.nextAt = live2d.lastMoveAt + 8000 + Math.random() * 8000;
        }
        if (live2d.face.active) clearGlanceFace();
        live2d.focusX = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth) * 2 - 1));
        live2d.focusY = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight) * 2 - 1));
        if (live2d.head.active) {
          live2d.head.tx = Math.max(-1, Math.min(1, (event.clientX - live2d.head.startX) / 180));
          live2d.head.ty = Math.max(-1, Math.min(1, (event.clientY - live2d.head.startY) / 180));
        }
      });
      window.addEventListener('pointerdown', (event) => {
        if (!live2d.loaded || !config || config.vv.mode !== 'live2d') return;
        if (event.button !== 0) return;
        const desktop = document.body.hasAttribute('data-dsh-desktop');
        if (!desktop && !event.altKey) return;
        if (desktop) {
          const target = event.target;
          if (target && target.closest && target.closest('button, a, input, textarea, select, [contenteditable="true"], [role="button"], [data-dsh-composer], .dsh-tools, .dsh-bg-panel, .dsh-widget.is-editing')) return;
        }
        live2d.head.active = true;
        live2d.head.startX = event.clientX;
        live2d.head.startY = event.clientY;
        live2d.head.tx = 0;
        live2d.head.ty = 0;
        document.body.style.cursor = 'grabbing';
        event.preventDefault();
      });
      window.addEventListener('pointerup', () => {
        if (!live2d.head.active) return;
        live2d.head.active = false;
        live2d.head.tx = 0;
        live2d.head.ty = 0;
        document.body.style.cursor = '';
      });
      window.addEventListener('resize', layoutLive2D);

      const applyConfig = (next) => {
        const wasLive = Boolean(config && config.vv.mode === 'live2d');
        config = next;
        const preset = BACKGROUND_PRESETS[next.background.preset] || BACKGROUND_PRESETS.default;
        bg.style.backgroundImage = preset.image;
        bg.style.backgroundSize = preset.size;
        bg.style.backgroundColor = next.background.preset === 'solid' ? solidColorOf(next.background.solidColor) : '';
        /* 2.7.1：背景亮度 = 黑色遮罩不透明度（100 → 0，0 → 1） */
        const bgBrightness = Number.isFinite(Number(next.background.brightness)) ? Number(next.background.brightness) : 100;
        bgDim.style.opacity = String(Math.max(0, Math.min(100, 100 - bgBrightness)) / 100);
        /* 2.5.0：两层各管各的开关；循环只要有一层开着就继续跑 */
        rainLayer.style.display = next.rain.enabled ? '' : 'none';
        /* 2.7.1：代码雨整层不透明度（0 = 只剩格阵，100 = 原样） */
        const rainOpacityRaw = Number.isFinite(Number(next.rain.opacity)) ? Number(next.rain.opacity) : 100;
        rainLayer.style.opacity = String(Math.max(0, Math.min(100, rainOpacityRaw)) / 100);
        gridLayer.style.display = next.rain.grid ? '' : 'none';
        rainControl.setEnabled(next.rain.enabled || next.rain.grid);
        rainControl.setResolution(next.rain.resolution);
        rainControl.setDensity(next.rain.density);
        applyLive2DFps();
        logoInner.style.display = next.logos.enabled ? '' : 'none';
        logoInner.style.transform = `scale(${next.logos.size / 150})`;
        logoInner.dataset.corner = ['tr', 'tl', 'br', 'bl'].indexOf(next.logos.corner) >= 0 ? next.logos.corner : 'tr';
        logo.style.display = next.logos.preset === 'text' ? 'none' : '';
        wordmark.style.display = next.logos.preset === 'mark' ? 'none' : '';
        vvWrap.style.display = next.vv.mode === 'none' ? 'none' : '';
        vvWrap.dataset.mode = next.vv.mode;
        const live = next.vv.mode === 'live2d';
        vv.style.display = live && live2d.loaded ? 'none' : '';
        live2dCanvas.style.display = live && live2d.loaded ? '' : 'none';
        if (live) {
          ensureLive2D();
          if (live2d.app && (live2d.targetId || live2d.currentId) && (live2d.targetId || live2d.currentId) !== next.vv.live2d) {
            loadLive2DModel(next.vv.live2d);
          } else if (!wasLive && live2d.loaded && !live2d.loading && !document.hidden && live2d.playEntrance) {
            live2d.playEntrance();
          }
          if (live2d.model) setLive2DActive(!document.hidden);
        } else {
          setLive2DActive(false);
        }
        const vvImage = VV_PRESETS[next.vv.preset] || VV_PRESETS.vv;
        if (vv.src !== vvImage) vv.src = vvImage;
        /* 静态主人物的位置与大小（2.5）：100% = 原来的 94vh，x/y 为视口百分比 */
        const staticCfg = next.vv.staticConfig || { scale: 100, x: 0, y: 0 };
        vv.style.setProperty('--vv-scale', String(Math.max(0.5, Math.min(2, (Number(staticCfg.scale) || 100) / 100))));
        vv.style.setProperty('--vv-x', String(Number(staticCfg.x) || 0));
        vv.style.setProperty('--vv-y', String(Number(staticCfg.y) || 0));
        if (live2d.loaded) layoutLive2D();
      };

      if (store) {
        applyConfig(config);
        var unsubscribe = store.subscribe(applyConfig);
      }

      let targetX = 0;
      let targetY = 0;
      let raf = 0;
      let gridLast = 0;
      let pressActive = false;
      let lastPointerAt = 0;
      let lastLayerWrite = 0;
      /* 不再读取 prefers-reduced-motion，理由见 startRain 顶部注释。 */

      const updatePressGlow = () => {
        const press = (config && config.pointer && config.pointer.press) || { enabled: true, brightness: 100, radius: 108 };
        const brightness = Math.max(0, Math.min(200, Number(press.brightness) || 0));
        const radius = Math.max(40, Math.min(600, Number(press.radius) || 108));
        /* 光斑直径跟着「拖拽范围」走，透明度和「拖拽亮度」走 */
        const size = Math.max(120, radius * 2);
        pressGlow.style.width = `${size}px`;
        pressGlow.style.height = `${size}px`;
        pressGlow.style.margin = `-${size / 2}px 0 0 -${size / 2}px`;
        pressGlow.style.opacity = press.enabled === false ? '0' : String(Math.min(0.55, 0.10 + (brightness / 200) * 0.5));
      };

      const onPointerMove = (event) => {
        lastPointerAt = performance.now();
        targetX = (event.clientX / window.innerWidth - 0.5) * 2;
        targetY = (event.clientY / window.innerHeight - 0.5) * 2;
        pressGlow.style.left = `${event.clientX}px`;
        pressGlow.style.top = `${event.clientY}px`;
        if (pressActive) updatePressGlow();
      };
      const onPointerLeave = () => {
        targetX = 0;
        targetY = 0;
      };
      const onPressDown = (event) => {
        if (event.button !== 0) return;
        pressActive = true;
        pressGlow.style.left = `${event.clientX}px`;
        pressGlow.style.top = `${event.clientY}px`;
        updatePressGlow();
      };
      const onPressUp = () => {
        pressActive = false;
        pressGlow.style.opacity = '0';
      };

      const tick = () => {
        raf = requestAnimationFrame(tick);
        try {
        if (window.__dshExvDebug) window.__dshExvDebug.parallaxFrames += 1;
        const nowMs = performance.now();
        const time = nowMs / 1000;
        /* 指针静止时只有“呼吸”在动，15fps 足够（肉眼看不出来）；
           每帧写 transform 会让下面的毛玻璃面板反复重算背景模糊，代价很高。 */
        const pointerActive = pressActive || nowMs - lastPointerAt < 600;
        if (!pointerActive && nowMs - lastLayerWrite < 66) return;
        lastLayerWrite = nowMs;
        let widgetX = 0;
        let widgetY = 0;
        const rainConfig = config && config.rain ? config.rain : null;
        if (rainConfig && rainConfig.grid && time - gridLast >= 0.1) {
          gridLast = time;
          const strength = rainConfig.gridBreathing && rainConfig.gridBreathing.enabled !== false ? rainConfig.gridBreathing.amplitude / 100 : 0;
          const phase = 1 - 0.5 * strength * (0.5 - 0.5 * Math.cos(time * (Math.PI * 2 / 6)));
          grid.style.opacity = String((rainConfig.gridBrightness / 200) * phase);
        }
        const parallaxConfig = (config && config.parallax) || {};
        const layerStrength = (layer) => {
          if (!nodeLayerEnabled(parallaxConfig, layer)) return 0;
          return ((PARALLAX_BASE[layer] || 0) * layerPercent(parallaxConfig, layer)) / 100;
        };
        for (const node of nodes) {
          const layer = node.el.dataset.layer;
          const baseStrength = layerStrength(layer);
          const nextX = targetX * baseStrength;
          const nextY = targetY * baseStrength;
          node.x += (nextX - node.x) * node.ease;
          node.y += (nextY - node.y) * node.ease;
          const group = BREATH_GROUP[layer];
          const breathing = config && group && config[group] ? config[group].breathing : null;
          const amplitude = !breathing || breathing.enabled === false ? 0 : breathing.amplitude;
          const breatheX = Math.sin(time * 0.22) * amplitude;
          const breatheY = Math.cos(time * 0.27) * amplitude * (8 / 12);
          const direction = layer === 'vv' ? 1 : -1;
          const x = direction * (node.x + breatheX);
          const y = direction * (node.y + breatheY);
          /* 2.7.1：Live2D 模式下 vv 层不整体平移——平移会把画布下边缘推进屏幕，
             露出切断角色的硬边。改成同一份位移画在画布内（applyLive2DOffset）。 */
          if (layer === 'vv' && live2d.model && config && config.vv && config.vv.mode === 'live2d') {
            live2d.offsetX = x;
            live2d.offsetY = y;
            applyLive2DOffset();
            if (node.el.style.transform) node.el.style.transform = '';
            continue;
          }
          node.el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
        }
        /* 组件层：用自己的开关 + 强度直接跟鼠标（独立于 LOGO 层），
           再叠上 LOGO 层的呼吸位移（组件层没有单独的呼吸设置）。
           2.7.1 修：以前这份位移是从 LOGO 层缩放来的，LOGO 视差关掉就整层失效。 */
        const widgetOn = nodeLayerEnabled(parallaxConfig, 'widget');
        const widgetStrength = (PARALLAX_BASE.widget * layerPercent(parallaxConfig, 'widget')) / 100;
        const widgetTargetX = widgetOn ? targetX * widgetStrength : 0;
        const widgetTargetY = widgetOn ? targetY * widgetStrength : 0;
        widgetX += (widgetTargetX - widgetX) * 0.09;
        widgetY += (widgetTargetY - widgetY) * 0.09;
        const logosBreathing = config && config.logos ? config.logos.breathing : null;
        const logosAmplitude = !logosBreathing || logosBreathing.enabled === false ? 0 : logosBreathing.amplitude;
        const widgetBreatheX = Math.sin(time * 0.22) * logosAmplitude;
        const widgetBreatheY = Math.cos(time * 0.27) * logosAmplitude * (8 / 12);
        window.__dshWidgetMotion = { x: -(widgetX + widgetBreatheX), y: -(widgetY + widgetBreatheY) };
        } catch (error) {
          /* 单帧异常不能杀死背景循环 */
          if (!tick.reported) {
            tick.reported = true;
            console.error('[dsh-exv] parallax frame failed', error);
          }
        }
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerLeave);
      window.addEventListener('pointerdown', onPressDown);
      window.addEventListener('pointerup', onPressUp);
      window.addEventListener('pointercancel', onPressUp);
      window.addEventListener('blur', onPressUp);
      let pageActive = !document.hidden;
      const syncPageActivity = () => {
        /* 窗口有焦点时用户一定在看，即使 Chromium 把页面误判为 hidden 也照常跑 */
        pageActive = !document.hidden || document.hasFocus();
        if (window.__dshExvDebug) {
          window.__dshExvDebug.hidden = document.hidden;
          window.__dshExvDebug.focus = document.hasFocus();
          window.__dshExvDebug.pageActive = pageActive;
          window.__dshExvDebug.parallaxRaf = Boolean(raf);
        }
        if (pageActive) {
          if (!raf) tick();
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        rainControl.setActive(pageActive);
        setLive2DActive(pageActive && Boolean(config && config.vv.mode === 'live2d'));
        if (pageActive && live2d.model && config && config.vv.mode === 'live2d'
          && live2d.manager && live2d.manager.isFinished && live2d.manager.isFinished()
          && live2d.startIdle) {
          live2d.startIdle();
        }
      };
      document.addEventListener('visibilitychange', syncPageActivity);
      syncPageActivity();
      /* 自愈：窗口可见但循环停了（单帧异常或漏掉的可见性事件）时自动拉起 */
      const activityTimer = window.setInterval(syncPageActivity, 1500);

      return () => {
        cancelAnimationFrame(raf);
        window.clearInterval(activityTimer);
        document.removeEventListener('visibilitychange', syncPageActivity);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('pointerdown', onPressDown);
        window.removeEventListener('pointerup', onPressUp);
        window.removeEventListener('pointercancel', onPressUp);
        window.removeEventListener('blur', onPressUp);
        if (unsubscribe) unsubscribe();
        delete window.__dshWidgetMotion;
        delete window.__dshExvDebug;
        window.clearTimeout(live2d.idleTimer);
        for (const [, entry] of live2d.cache) disposeLive2DEntry(entry);
        live2d.cache.clear();
        live2d.model = null;
        live2d.currentEntry = null;
        if (live2d.app) {
          try { live2d.app.destroy(true, { children: true }); } catch (error) { /* already gone */ }
          live2d.app = null;
        }
        rainControl.dispose();
        root.remove();
        style.remove();
      };
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.effect(() => {
          try {
            return mount();
          } catch (error) {
            /* 挂载异常会被宿主吞掉，这里留一份可查的现场 */
            window.__dshExvDebug = window.__dshExvDebug || {};
            window.__dshExvDebug.mountError = String((error && error.stack) || error);
            console.error('[dsh-exv] parallax mount failed', error);
            return () => {};
          }
        });
      },
    };
  },
});

