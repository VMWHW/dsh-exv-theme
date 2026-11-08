window.__ModuleLoader__.load({
  id: '@local/parallax-bg',
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
      vvScarh: 'data:image/webp;base64,__VV_SCARH__',
      vvHk416: 'data:image/webp;base64,__VV_HK416__',
      vvScarl: 'data:image/webp;base64,__VV_SCARL__',
      vvUmp45: 'data:image/webp;base64,__VV_UMP45__',
      vvVector: 'data:image/webp;base64,__VV_VECTOR__',
      vvAk12: 'data:image/webp;base64,__VV_AK12__',
      vvM200: 'data:image/webp;base64,__VV_M200__',
      vvAk74m: 'data:image/webp;base64,__VV_AK74M__',
    };

    const THEME_CONFIG_KEY = 'dsh-exv-theme.config.v1';
    const THEME_VERSION = 3;
    const LIVE2D_DEFAULTS = {"ar15_4508":{"scale":180,"x":-9,"y":52},"ar15mod_n":{"scale":150,"x":1,"y":59},"hk416_3401_n":{"scale":143,"x":3,"y":45},"hk416_3401_d":{"scale":148,"x":0,"y":33},"hk416_805":{"scale":135,"x":1,"y":37},"hk416mod_n":{"scale":155,"x":2,"y":8},"m4_sopmod_ii_4507_n":{"scale":165,"x":1,"y":53},"m4_sopmod_ii_4507_d":{"scale":114,"x":4,"y":0},"m4_sopmod_iimod":{"scale":135,"x":-1,"y":39},"m4a1mod":{"scale":142,"x":2,"y":49},"ro635_4504":{"scale":139,"x":3,"y":37},"ro635mod":{"scale":146,"x":3,"y":49},"ump45mod_n":{"scale":139,"x":0,"y":40},"vector_1901":{"scale":153,"x":16,"y":60},"vector_6701_n":{"scale":170,"x":5,"y":26}};
const THEME_DEFAULTS = {
      version: THEME_VERSION,
      background: { preset: 'default', breathing: { enabled: true, amplitude: 12 } },
      rain: {
        enabled: true,
        grid: true,
        gridBrightness: 100,
        gridBreathing: { enabled: true, strength: 50 },
        fps: 60,
        resolution: 1440,
        density: 100,
        speed: 100,
        breathing: { enabled: true, amplitude: 12 },
      },
      logos: { preset: 'default', enabled: true, size: 150, breathing: { enabled: true, amplitude: 12 } },
      vv: { mode: 'static', preset: 'vv', live2d: 'ar15_4508', fps: 120, light: { range: 50, strength: 50 }, live2dConfig: {"ar15_4508":{"scale":180,"x":-9,"y":52,"eye":true},"ar15mod_n":{"scale":150,"x":1,"y":59,"eye":true},"hk416_3401_n":{"scale":143,"x":3,"y":45,"eye":true},"hk416_3401_d":{"scale":148,"x":0,"y":33,"eye":true},"hk416_805":{"scale":135,"x":1,"y":37,"eye":true},"hk416mod_n":{"scale":155,"x":2,"y":8,"eye":true},"m4_sopmod_ii_4507_n":{"scale":165,"x":1,"y":53,"eye":false},"m4_sopmod_ii_4507_d":{"scale":114,"x":4,"y":0,"eye":false},"m4_sopmod_iimod":{"scale":135,"x":-1,"y":39,"eye":false},"m4a1mod":{"scale":142,"x":2,"y":49,"eye":true},"ro635_4504":{"scale":139,"x":3,"y":37,"eye":true},"ro635mod":{"scale":146,"x":3,"y":49,"eye":true},"ump45mod_n":{"scale":139,"x":0,"y":40,"eye":true},"vector_1901":{"scale":153,"x":16,"y":60,"eye":true},"vector_6701_n":{"scale":170,"x":5,"y":26,"eye":true}}, breathing: { enabled: true, amplitude: 12 } },
      pointer: {
        light: { enabled: true, brightness: 100, radius: 60 },
        ripple: { enabled: true, brightness: 100, radius: 550 },
        press: { enabled: true, strength: 100 },
      },
    };
    const THEME_ENUMS = {
      'background.preset': ['default', 'chips', 'cyberpunk', 'starsky', 'frankfurt'],
      'logos.preset': ['default', 'mark', 'text'],
      'vv.mode': ['none', 'static', 'live2d'],
      'vv.preset': ['vv', 'scarh', 'hk416', 'scarl', 'ump45', 'vector', 'ak12', 'm200', 'ak74m'],
      'vv.live2d': ["ar15_4508","ar15mod_n","hk416_3401_n","hk416_3401_d","hk416_805","hk416mod_n","m4_sopmod_ii_4507_n","m4_sopmod_ii_4507_d","m4_sopmod_iimod","m4a1mod","ro635_4504","ro635mod","ump45mod_n","vector_1901","vector_6701_n"],
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
      const rain = themeGroup(raw, 'rain');
      out.rain.enabled = rain.enabled !== false;
      out.rain.grid = rain.grid !== false;
      out.rain.gridBrightness = Math.round(themeNumber(rain.gridBrightness, 0, 200, 100));
      const rainFps = Number(rain.fps);
      out.rain.fps = rainFps === 30 ? 30 : 60;
      const rainResolution = Number(rain.resolution);
      out.rain.resolution = [720, 1080, 1440].includes(rainResolution) ? rainResolution : 1440;
      out.rain.density = Math.round(themeNumber(rain.density, 25, 200, 100));
      out.rain.speed = Math.round(themeNumber(rain.speed, 25, 200, 100));
      const gridBreathing = rain.gridBreathing && typeof rain.gridBreathing === 'object' ? rain.gridBreathing : {};
      out.rain.gridBreathing = {
        enabled: gridBreathing.enabled !== false,
        strength: Math.round(themeNumber(gridBreathing.strength, 0, 100, 50)),
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
      const vv = themeGroup(raw, 'vv');
      out.vv.mode = themeOneOf('vv.mode', vv.mode, out.vv.mode);
      out.vv.preset = themeOneOf('vv.preset', vv.preset, out.vv.preset);
      out.vv.live2d = themeOneOf('vv.live2d', vv.live2d, out.vv.live2d);
      const vvFps = Number(vv.fps);
      out.vv.fps = [30, 60, 90, 120].includes(vvFps) ? vvFps : 120;
      const live2dConfig = vv.live2dConfig && typeof vv.live2dConfig === 'object' ? vv.live2dConfig : {};
      out.vv.live2dConfig = {};
      for (const id of ["ar15_4508","ar15mod_n","hk416_3401_n","hk416_3401_d","hk416_805","hk416mod_n","m4_sopmod_ii_4507_n","m4_sopmod_ii_4507_d","m4_sopmod_iimod","m4a1mod","ro635_4504","ro635mod","ump45mod_n","vector_1901","vector_6701_n"]) {
        const def = LIVE2D_DEFAULTS[id] || { scale: 100, x: 0, y: 0 };
        const item = live2dConfig[id] && typeof live2dConfig[id] === 'object' ? live2dConfig[id] : {};
        out.vv.live2dConfig[id] = {
          scale: Math.round(themeNumber(item.scale, Math.max(0, def.scale - 100), def.scale + 100, def.scale)),
          x: Math.round(themeNumber(item.x, def.x - 50, def.x + 50, def.x)),
          y: Math.round(themeNumber(item.y, def.y - 80, def.y + 80, def.y)),
          eye: item.eye !== false,
        };
      }
      const vvLight = vv.light && typeof vv.light === 'object' ? vv.light : {};
      out.vv.light = {
        range: Math.round(themeNumber(vvLight.range, 0, 100, 50)),
        strength: Math.round(themeNumber(vvLight.strength, 0, 100, 50)),
      };
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
      const press = pointer.press && typeof pointer.press === 'object' ? pointer.press : {};
      const legacyPress = raw.version < 3 && Number(press.strength) === 200;
      out.pointer.press = {
        enabled: press.enabled !== false,
        strength: legacyPress ? 100 : Math.round(themeNumber(press.strength, 0, 200, 100)),
      };
      const motion = themeGroup(raw, 'motion');
      if (motion.breathing === false) {
        out.background.breathing.enabled = false;
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
      '#dsh-parallax .pl-grid { position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2722%27%20height=%2722%27%3E%3Crect%20x=%276.75%27%20y=%270.75%27%20width=%2714.5%27%20height=%2714.5%27%20fill=%27none%27%20stroke=%27%2300fff0%27%20stroke-opacity=%270.18%27%20stroke-width=%271.5%27/%3E%3C/svg%3E"); background-size: 22px 22px; transition: opacity .16s ease; }',
      '#dsh-parallax .pl-rain { position: absolute; inset: 0; }',
      '#dsh-parallax .pl-rain canvas { position: absolute; inset: 0; display: block; width: 100%; height: 100%; }',
      '#dsh-parallax .pl-logos { position: absolute; top: 64px; right: 36px; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; transform-origin: top right; }',
      '#dsh-parallax .pl-logo { display: block; width: 150px; height: auto; opacity: 1; filter: drop-shadow(0 0 10px rgba(0, 255, 240, 0.35)); }',
      '#dsh-parallax .pl-wordmark { display: block; width: 150px; height: auto; opacity: 1; }',
      '#dsh-parallax .pl-vv-wrap { position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; }',
      '#dsh-parallax .pl-vv { height: 94vh; width: auto; max-width: none; object-fit: contain; opacity: 1; transform: translateY(6vh); filter: drop-shadow(0 0 34px rgba(0, 255, 240, 0.16)); }',
      '#dsh-parallax .pl-live2d { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none; }',
      '#dsh-parallax .pl-press-glow { position: fixed; z-index: 60; left: -999px; top: -999px; width: 280px; height: 280px; margin: -140px 0 0 -140px; border-radius: 50%; pointer-events: none; opacity: 0; background: radial-gradient(circle, rgba(0, 255, 240, 0.42) 0%, rgba(0, 255, 240, 0.16) 34%, rgba(0, 255, 240, 0.05) 58%, transparent 72%); filter: blur(6px); mix-blend-mode: screen; transition: opacity .12s ease; }',
    ].join('\n');

    /**
     * Falling square "code rain". Each string drops head-first; the head is a
     * solid opaque square, the body mixes solid and hollow squares at random
     * opacity, and the trailing squares fade out.
     */
    function startRain(canvas, getConfig, getCharacter) {
      const context = canvas.getContext('2d');
      if (!context) return { dispose: () => {}, setEnabled: () => {} };
      const CELL = 16;
      const GAP = 6;
      const STEP = CELL + GAP;
      const paint = (alpha) => `rgba(0, 255, 240, ${alpha})`;
      const headPaint = (alpha) => `rgba(255, 255, 255, ${alpha})`;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

      let width = 0;
      let height = 0;
      let strings = [];
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

      const config = () => (getConfig ? getConfig() : null) || {};
      const pointerConfig = () => config().pointer || {};

      const spawn = (initial) => {
        const len = 14 + Math.floor(Math.random() * 19);
        const squares = [];
        for (let index = 0; index < len; index += 1) {
          const fade = len > 1 ? index / (len - 1) : 0;
          const alpha = index === 0 ? 1 : 1 - fade * 0.95;
          squares.push({ alpha, hollow: index === 0 ? false : Math.random() < 0.45 });
        }
        return {
          x: Math.floor(Math.random() * Math.max(1, Math.floor(width / STEP))) * STEP + 6,
          y: Math.round((initial ? Math.random() * height : -Math.random() * height * 0.3 - len * STEP) / STEP) * STEP,
          speed: 90 + Math.random() * 160,
          remainder: 0,
          len,
          squares,
        };
      };

      /** Draw a hollow cell outline at a grid position. */
      const strokeCell = (col, row, alpha) => {
        if (alpha <= 0.01) return;
        const x = 6 + col * STEP;
        const y = row * STEP;
        if (x < -STEP || x > width + STEP || y < -STEP || y > height + STEP) return;
        context.strokeStyle = paint(alpha);
        context.lineWidth = 1.5;
        context.strokeRect(x + 0.75, y + 0.75, CELL - 1.5, CELL - 1.5);
      };

      /** Light the hollow outlines around a point, fading with distance. */
      const strokeHalo = (centerX, centerY, radius, peak) => {
        const minCol = Math.floor((centerX - radius) / STEP);
        const maxCol = Math.ceil((centerX + radius) / STEP);
        const minRow = Math.floor((centerY - radius) / STEP);
        const maxRow = Math.ceil((centerY + radius) / STEP);
        for (let col = minCol; col <= maxCol; col += 1) {
          for (let row = minRow; row <= maxRow; row += 1) {
            const cx = 6 + col * STEP + CELL / 2;
            const cy = row * STEP + CELL / 2;
            const distance = Math.hypot(cx - centerX, cy - centerY);
            if (distance > radius) continue;
            strokeCell(col, row, peak * (1 - distance / radius));
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
        const light = pointerState.light || {};
        const normalRadius = Number.isFinite(light.radius) ? light.radius : 60;
        const radius = Math.max(80, normalRadius * 1.8);
        const strength = Math.max(0, Number(press.strength) || 0) / 100;
        strokeHalo(pointer.x, pointer.y, radius * 1.05, Math.min(0.8, 0.42 * strength));
        const minCol = Math.floor((pointer.x - radius) / STEP);
        const maxCol = Math.ceil((pointer.x + radius) / STEP);
        const minRow = Math.floor((pointer.y - radius) / STEP);
        const maxRow = Math.ceil((pointer.y + radius) / STEP);
        for (let col = minCol; col <= maxCol; col += 1) {
          for (let row = minRow; row <= maxRow; row += 1) {
            const cx = 6 + col * STEP + CELL / 2;
            const cy = row * STEP + CELL / 2;
            const distance = Math.hypot(cx - pointer.x, cy - pointer.y);
            if (distance > radius) continue;
            strokeCell(col, row, Math.min(1, (1 - distance / radius) * 0.95 * strength));
          }
        }
      };

      const drawWaves = (now) => {
        const ripple = pointerConfig().ripple;
        const rippleOn = !ripple || ripple.enabled !== false;
        if (!rippleOn) {
          for (let index = waves.length - 1; index >= 0; index -= 1) {
            if (waves[index].kind !== 'scan') waves.splice(index, 1);
          }
        }
        const brightness = ripple ? ripple.brightness / 100 : 1;
        const clickMaxRadius = ripple ? ripple.radius : 550;
        for (let index = waves.length - 1; index >= 0; index -= 1) {
          const wave = waves[index];
          const scan = wave.kind === 'scan';
          if (!scan && !rippleOn) {
            waves.splice(index, 1);
            continue;
          }
          const speed = scan ? (Number(wave.speed) || 320) : 560;
          const radius = ((now - wave.born) / 1000) * speed;
          let attenuation = 1;
          if (scan) {
            const maxRadius = Number(wave.maxRadius) || Math.hypot(width, height) + STEP * 2;
            if (radius > maxRadius) {
              waves.splice(index, 1);
              continue;
            }
          } else {
            attenuation = 1 - radius / clickMaxRadius;
            if (attenuation <= 0) {
              waves.splice(index, 1);
              continue;
            }
          }
          const inner = Math.max(0, radius - STEP * 0.9);
          const outer = radius + STEP * 0.9;
          const minCol = Math.floor((wave.x - outer) / STEP);
          const maxCol = Math.ceil((wave.x + outer) / STEP);
          const minRow = Math.floor((wave.y - outer) / STEP);
          const maxRow = Math.ceil((wave.y + outer) / STEP);
          for (let col = minCol; col <= maxCol; col += 1) {
            for (let row = minRow; row <= maxRow; row += 1) {
              const cx = 6 + col * STEP + CELL / 2;
              const cy = row * STEP + CELL / 2;
              const distance = Math.hypot(cx - wave.x, cy - wave.y);
              if (distance < inner || distance > outer) continue;
              strokeCell(col, row, 0.85 * attenuation * brightness);
            }
          }
        }
      };

      /* One-shot startup scan: same grid ring as a click ripple, but it runs
         from the tool cluster to the whole viewport with no distance fade. */
      window.__dshScanWave = (x, y) => {
        const w = width || window.innerWidth;
        const h = height || window.innerHeight;
        const diagonal = Math.hypot(w, h);
        waves.push({
          kind: 'scan',
          x: Number.isFinite(x) ? x : w / 2,
          y: Number.isFinite(y) ? y : h / 2,
          born: performance.now(),
          speed: Math.max(180, diagonal / 8),
          maxRadius: diagonal + STEP * 2,
        });
      };

      const drawWidgetLight = () => {
        const rects = window.__dshWidgetRects;
        if (!Array.isArray(rects) || rects.length === 0) return;
        const bounds = canvas.getBoundingClientRect();
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
              const cx = 6 + col * STEP + CELL / 2;
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
              strokeCell(col, row, 0.8 * (1 - distance / range));
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

      const drawCharacterLight = () => {
        const img = getCharacter ? getCharacter() : null;
        if (!img || !img.complete || !img.naturalWidth) return;
        const cfg = getConfig ? getConfig() : null;
        if (cfg && cfg.vv && cfg.vv.mode === 'live2d') return;
        const light = cfg && cfg.vv && cfg.vv.light ? cfg.vv.light : {};
        const range = Math.max(0, Math.min(100, Number(light.range) || 0));
        const strength = Math.max(0, Math.min(100, Number(light.strength) || 0)) / 100;
        if (range <= 0 || strength <= 0) return;
        const maskBlur = Math.max(6, Math.min(40, Math.round((range * 0.14) / 4) * 4));
        const mask = characterMask(maskBlur);
        if (!mask) return;
        const rect = img.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) return;
        const bounds = canvas.getBoundingClientRect();
        const minCol = Math.floor((rect.left - range - bounds.left - 6) / STEP);
        const maxCol = Math.ceil((rect.right + range - bounds.left - 6) / STEP);
        const minRow = Math.floor((rect.top - range - bounds.top) / STEP);
        const maxRow = Math.ceil((rect.bottom + range - bounds.top) / STEP);
        for (let col = minCol; col <= maxCol; col += 1) {
          for (let row = minRow; row <= maxRow; row += 1) {
            const x = 6 + col * STEP + CELL / 2;
            const y = row * STEP + CELL / 2;
            const u = (bounds.left + x - rect.left) / rect.width;
            const v = (bounds.top + y - rect.top) / rect.height;
            if (u < 0 || u > 1 || v < 0 || v > 1) continue;
            const mx = Math.min(mask.width - 1, Math.max(0, Math.floor(u * mask.width)));
            const my = Math.min(mask.height - 1, Math.max(0, Math.floor(v * mask.height)));
            const alpha = mask.data[(my * mask.width + mx) * 4 + 3] / 255;
            if (alpha <= 0.02) continue;
            strokeCell(col, row, Math.min(1, alpha * strength * 0.95));
          }
        }
      };

      const draw = () => {
        context.clearRect(0, 0, width, height);
        for (const string of strings) {
          for (let index = 0; index < string.len; index += 1) {
            const y = string.y - index * STEP;
            if (y < -CELL || y > height + CELL) continue;
            const square = string.squares[index];
            if (index === 0) {
              /* The same soft halo as the cursor, centered on the head. */
              context.shadowBlur = 0;
              strokeHalo(string.x + CELL / 2, string.y + CELL / 2, STEP * 2.4, 0.30);
              context.shadowBlur = 26;
              context.shadowColor = headPaint(1);
            } else {
              context.shadowBlur = 0;
            }
            if (square.hollow) {
              context.strokeStyle = paint(square.alpha);
              context.lineWidth = 1.5;
              context.strokeRect(string.x + 0.75, y + 0.75, CELL - 1.5, CELL - 1.5);
            } else {
              context.fillStyle = index === 0 ? headPaint(1) : paint(square.alpha);
              context.fillRect(string.x, y, CELL, CELL);
            }
          }
        }
        context.shadowBlur = 0;
        context.globalCompositeOperation = 'lighter';
        drawPointerLight();
        drawPointerPressLight();
        drawWidgetLight();
        drawCharacterLight();
        drawWaves(performance.now());
        context.globalCompositeOperation = 'source-over';
      };

      const tick = (now) => {
        const rainCfg = config().rain || {};
        const fps = Math.max(1, Math.min(60, Number(rainCfg.fps) || 60));
        if (lastFrame && now - lastFrame < 1000 / fps - 0.5) {
          raf = requestAnimationFrame(tick);
          return;
        }
        lastFrame = now;
        const speedScale = Math.max(0.25, Math.min(2, (Number(rainCfg.speed) || 100) / 100));
        const delta = last ? Math.min(0.06, (now - last) / 1000) : 0.016;
        last = now;
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
        draw();
        raf = requestAnimationFrame(tick);
      };

      const stop = () => {
        cancelAnimationFrame(raf);
        raf = 0;
      };

      const start = () => {
        if (raf || !enabled || !active || reduceMotion.matches) return;
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
        width = canvas.clientWidth || window.innerWidth;
        height = canvas.clientHeight || window.innerHeight;
        const rainCfg = config().rain || {};
        const cap = [720, 1080, 1440].includes(Number(rainCfg.resolution)) ? Number(rainCfg.resolution) : 1440;
        resolution = cap;
        const ratio = Math.max(0.25, Math.min(window.devicePixelRatio || 1, 2, cap / Math.max(1, height)));
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        strings = [];
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
        const rect = canvas.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
      };
      const onPointerDown = (event) => {
        if (event.button !== 0 && event.button !== 2) return;
        if (event.button === 0) pressing = true;
        const ripple = pointerConfig().ripple;
        if (ripple && ripple.enabled === false) return;
        const rect = canvas.getBoundingClientRect();
        waves.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, born: performance.now() });
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
          const next = [720, 1080, 1440].includes(Number(value)) ? Number(value) : 1440;
          if (resolution === next) return;
          resize();
        },
        setDensity() {
          syncStringCount();
        },
      };
    }

    function mount() {
      const style = document.createElement('style');
      style.dataset.dshParallax = '';
      style.textContent = css;
      document.head.appendChild(style);

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

      const rain = layer('rain', 14);
      const grid = document.createElement('div');
      grid.className = 'pl-grid';
      const rainInner = document.createElement('div');
      rainInner.className = 'pl-rain';
      const canvas = document.createElement('canvas');
      rainInner.appendChild(canvas);
      rain.append(grid, rainInner);

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

      const rainControl = startRain(canvas, () => config, () => (config && config.vv.mode !== 'none' ? vv : null));

      const strengths = { bg: 8, rain: 16, logos: 18, vv: 48 };
      const damping = { bg: 0.05, rain: 0.07, logos: 0.14, vv: 0.035 };
      const nodes = Array.from(root.querySelectorAll('.pl')).map((el) => ({
        el,
        strength: strengths[el.dataset.layer] || 0,
        ease: damping[el.dataset.layer] || 0.08,
        x: 0,
        y: 0,
      }));

      const LIVE2D_CACHE_LIMIT = 2;
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
        live2d.model.position.set(
          width / 2 + (item.x / 100) * width,
          height + (item.y / 100) * height,
        );
      };

      const applyEyeAndHead = (model) => {
        const targetX = live2d.eyeEnabled ? live2d.focusX : 0;
        const targetY = live2d.eyeEnabled ? live2d.focusY : 0;
        live2d.eyeX += (targetX - live2d.eyeX) * 0.12;
        live2d.eyeY += (targetY - live2d.eyeY) * 0.12;
        live2d.head.x += (live2d.head.tx - live2d.head.x) * 0.18;
        live2d.head.y += (live2d.head.ty - live2d.head.y) * 0.18;
        const core = model.internalModel.coreModel;
        const applied = model.__dshAppliedOffsets || (model.__dshAppliedOffsets = {});
        const add = (param, value) => {
          try {
            core.setParameterValueById(param, core.getParameterValueById(param) + value);
            applied[param] = value;
          } catch (error) { /* parameter absent */ }
        };
        add('ParamEyeBallX', live2d.eyeX);
        add('ParamEyeBallY', -live2d.eyeY);
        add('ParamAngleX', live2d.eyeX * 18 + live2d.head.x * 30);
        add('ParamAngleY', -live2d.eyeY * 18 - live2d.head.y * 20);
        add('ParamAngleZ', live2d.eyeX * 3 + live2d.head.x * 6);
        add('ParamBodyAngleX', live2d.eyeX * 5 + live2d.head.x * 10);
        add('ParamBodyAngleY', -live2d.head.y * 6);
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
          if (build.entrance) {
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
            resolution: Math.min(window.devicePixelRatio || 1, 2),
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
        rainInner.style.display = next.rain.enabled ? '' : 'none';
        rainControl.setEnabled(next.rain.enabled);
        rainControl.setResolution(next.rain.resolution);
        rainControl.setDensity(next.rain.density);
        applyLive2DFps();
        grid.style.display = next.rain.enabled && next.rain.grid ? '' : 'none';
        logoInner.style.display = next.logos.enabled ? '' : 'none';
        logoInner.style.transform = `scale(${next.logos.size / 150})`;
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
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

      const updatePressGlow = () => {
        const press = (config && config.pointer && config.pointer.press) || { enabled: true, strength: 100 };
        const strength = Math.max(0, Math.min(200, Number(press.strength) || 0));
        const size = 160 + strength * 0.6;
        pressGlow.style.width = `${size}px`;
        pressGlow.style.height = `${size}px`;
        pressGlow.style.margin = `-${size / 2}px 0 0 -${size / 2}px`;
        pressGlow.style.opacity = press.enabled === false ? '0' : String(Math.min(0.55, 0.10 + (strength / 200) * 0.5));
      };

      const onPointerMove = (event) => {
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
        if (reduceMotion.matches) {
          targetX = 0;
          targetY = 0;
        }
        const time = performance.now() / 1000;
        let widgetX = 0;
        let widgetY = 0;
        const rainConfig = config && config.rain ? config.rain : null;
        if (rainConfig && rainConfig.enabled && rainConfig.grid && time - gridLast >= 0.1) {
          gridLast = time;
          const strength = rainConfig.gridBreathing && rainConfig.gridBreathing.enabled !== false ? rainConfig.gridBreathing.strength / 100 : 0;
          const phase = reduceMotion.matches ? 1 : 1 - 0.5 * strength * (0.5 - 0.5 * Math.cos(time * (Math.PI * 2 / 6)));
          grid.style.opacity = String((rainConfig.gridBrightness / 200) * phase);
        }
        for (const node of nodes) {
          const nextX = targetX * node.strength;
          const nextY = targetY * node.strength;
          node.x += (nextX - node.x) * node.ease;
          node.y += (nextY - node.y) * node.ease;
          const group = BREATH_GROUP[node.el.dataset.layer];
          const breathing = config && group && config[group] ? config[group].breathing : null;
          const amplitude = reduceMotion.matches || !breathing || breathing.enabled === false ? 0 : breathing.amplitude;
          const breatheX = Math.sin(time * 0.22) * amplitude;
          const breatheY = Math.cos(time * 0.27) * amplitude * (8 / 12);
          const direction = node.el.dataset.layer === 'vv' ? 1 : -1;
          const x = direction * (node.x + breatheX);
          const y = direction * (node.y + breatheY);
          node.el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
          if (node.el.dataset.layer === 'logos') {
            widgetX = x;
            widgetY = y;
          }
        }
        window.__dshWidgetMotion = { x: widgetX, y: widgetY };
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerLeave);
      window.addEventListener('pointerdown', onPressDown);
      window.addEventListener('pointerup', onPressUp);
      window.addEventListener('pointercancel', onPressUp);
      window.addEventListener('blur', onPressUp);
      let pageActive = !document.hidden;
      const syncPageActivity = () => {
        pageActive = !document.hidden;
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

      return () => {
        cancelAnimationFrame(raf);
        document.removeEventListener('visibilitychange', syncPageActivity);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('pointerdown', onPressDown);
        window.removeEventListener('pointerup', onPressUp);
        window.removeEventListener('pointercancel', onPressUp);
        window.removeEventListener('blur', onPressUp);
        if (unsubscribe) unsubscribe();
        delete window.__dshWidgetMotion;
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
        ctx.effect(() => mount());
      },
    };
  },
});
