/**
 * env-loader.js
 * Читает .env из корня и подставляет в process.env.
 * Не перезаписывает переменные, уже заданные окружением (важно для Beget).
 */
const fs   = require('fs');
const path = require('path');

try {
  const lines = fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;

    const key   = trimmed.slice(0, eqIdx).trim();
    let   value = trimmed.slice(eqIdx + 1).trim();

    // Снимаем кавычки если есть
    if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);

    // Не перезаписываем уже заданные окружением
    if (!(key in process.env)) process.env[key] = value;
  }
} catch (e) {
  // .env не найден — работаем с переменными окружения напрямую
}
