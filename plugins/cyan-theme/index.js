/**
 * Host half of the cyan HUD theme bundle.
 *
 * The Client module owns the tokens, styling and HUD widgets. The only Host
 * service the theme needs is the notebook store: the user's notepad text and
 * todo list live as plain files under the DSH home, so any later session can
 * read them without the client running.
 *
 * Files (2.4.0, migrated from the retired @local/notepad bundle):
 *   <dsh home>/notepad/小本本.txt   raw UTF-8 text, the shared notebook
 *   <dsh home>/notepad/todo.json    [{ id, text, done }, ...] in display order
 */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const LOAD_PATH = '/dsh-exv-notepad/load';
const SAVE_PATH = '/dsh-exv-notepad/save';
const MAX_BODY_BYTES = 1024 * 1024;
const MAX_TEXT_CHARS = 200 * 1024;
const MAX_TODOS = 500;
const MAX_TODO_CHARS = 2000;
const NOTE_FILE = '小本本.txt';
const TODO_FILE = 'todo.json';

export const inject = ['webServer'];

function notebookHome() {
  const home = process.env.DSH_HOME || path.join(os.homedir(), '.dsh');
  return path.join(home, 'notepad');
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(body),
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      size += Buffer.byteLength(chunk, 'utf8');
      if (size > MAX_BODY_BYTES) {
        reject(new Error('too-large'));
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

/* 客户端只负责显示顺序，这里只把数据收干净：丢空行、去重、夹长度。
   空待办条不入库——新加一条还没写字就刷新，不该留下一条空行。 */
function normalizeTodos(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const todos = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    if (todos.length >= MAX_TODOS) break;
    const text = typeof item.text === 'string' ? item.text.slice(0, MAX_TODO_CHARS) : '';
    if (!text.trim()) continue;
    let id = typeof item.id === 'string' ? item.id.trim() : '';
    if (!id || seen.has(id)) {
      id = 't' + (todos.length + 1).toString(36) + Date.now().toString(36);
    }
    seen.add(id);
    todos.push({ id, text, done: item.done === true });
  }
  return todos;
}

export function apply(ctx) {
  const dir = notebookHome();
  const noteFile = path.join(dir, NOTE_FILE);
  const todoFile = path.join(dir, TODO_FILE);

  const readText = async (file, fallback) => {
    try {
      return await fs.readFile(file, 'utf8');
    } catch (error) {
      if (error && error.code === 'ENOENT') return fallback;
      throw error;
    }
  };

  const writeFileAtomic = async (file, text) => {
    await fs.mkdir(dir, { recursive: true });
    /* Write-then-rename keeps the file valid if the app dies mid-save. */
    const temp = file + '.tmp';
    await fs.writeFile(temp, text, 'utf8');
    await fs.rename(temp, file);
  };

  const readTodos = async () => {
    const raw = await readText(todoFile, '');
    if (!raw.trim()) return [];
    try {
      return normalizeTodos(JSON.parse(raw));
    } catch (error) {
      /* 文件被手改坏了也不能让记事本打不开 */
      return [];
    }
  };

  const onLoad = async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { allow: 'GET, HEAD' });
      res.end();
      return;
    }
    try {
      const [text, todos] = await Promise.all([readText(noteFile, ''), readTodos()]);
      sendJson(res, 200, { text, todos, file: noteFile, todoFile });
    } catch (error) {
      sendJson(res, 500, {
        error: String((error && error.message) || error),
        file: noteFile,
        todoFile,
      });
    }
  };

  const onSave = async (req, res) => {
    if (req.method !== 'POST') {
      res.writeHead(405, { allow: 'POST' });
      res.end();
      return;
    }
    let payload = null;
    try {
      const raw = await readBody(req);
      payload = JSON.parse(raw || '{}');
    } catch (error) {
      sendJson(res, 400, { ok: false, error: 'bad-json' });
      return;
    }
    if (!payload || typeof payload !== 'object') {
      sendJson(res, 400, { ok: false, error: 'bad-json' });
      return;
    }
    const hasText = Object.prototype.hasOwnProperty.call(payload, 'text');
    const hasTodos = Object.prototype.hasOwnProperty.call(payload, 'todos');
    if (!hasText && !hasTodos) {
      sendJson(res, 400, { ok: false, error: 'nothing-to-save' });
      return;
    }
    if (hasText && typeof payload.text !== 'string') {
      sendJson(res, 400, { ok: false, error: 'text-required' });
      return;
    }
    try {
      const result = { ok: true, savedAt: Date.now(), file: noteFile, todoFile };
      if (hasText) {
        const text = payload.text.slice(0, MAX_TEXT_CHARS);
        await writeFileAtomic(noteFile, text);
        result.bytes = Buffer.byteLength(text, 'utf8');
      }
      if (hasTodos) {
        if (!Array.isArray(payload.todos)) {
          sendJson(res, 400, { ok: false, error: 'todos-required' });
          return;
        }
        const todos = normalizeTodos(payload.todos);
        await writeFileAtomic(todoFile, JSON.stringify(todos, null, 2) + '\n');
        result.todos = todos.length;
      }
      sendJson(res, 200, result);
    } catch (error) {
      sendJson(res, 500, {
        ok: false,
        error: String((error && error.message) || error),
        file: noteFile,
        todoFile,
      });
    }
  };

  ctx.effect(() => {
    const disposers = [
      ctx.webServer.register({ kind: 'exact', path: LOAD_PATH, handler: onLoad }),
      ctx.webServer.register({ kind: 'exact', path: SAVE_PATH, handler: onSave }),
    ];
    return () => {
      for (const dispose of disposers) {
        try {
          dispose();
        } catch (error) {
          /* already removed */
        }
      }
    };
  });
}
