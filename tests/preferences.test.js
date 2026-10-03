import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTheme, normalizeLanguage, resolveTheme, readPreferences, savePreference } from '../scripts/preferences.js';
import { translations } from '../scripts/translations.js';

function memoryStorage(entries = []) {
  const values = new Map(entries);
  return {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
  };
}

test('the preference reader falls back to English and system appearance', () => {
  assert.deepEqual(readPreferences(null), { theme: 'system', language: 'en' });
  assert.deepEqual(readPreferences(memoryStorage()), { theme: 'system', language: 'en' });
});

test('invalid preferences cannot change the supported theme or language', () => {
  for (const value of [undefined, null, '', 'invalid', 'DARK', 2, {}]) assert.equal(normalizeTheme(value), 'system');
  for (const value of [undefined, null, '', 'fr', 'DE', 2, {}]) assert.equal(normalizeLanguage(value), 'en');
  for (const value of ['system', 'dark', 'light']) assert.equal(normalizeTheme(value), value);
  for (const value of ['en', 'de']) assert.equal(normalizeLanguage(value), value);
  assert.deepEqual(readPreferences(memoryStorage([['patrick-portfolio.theme', 'invalid'], ['patrick-portfolio.language', 'fr']])), { theme: 'system', language: 'en' });
});

test('system follows the device while an explicit appearance overrides it', () => {
  assert.equal(resolveTheme('system', true), 'dark');
  assert.equal(resolveTheme('system', false), 'light');
  assert.equal(resolveTheme('light', true), 'light');
  assert.equal(resolveTheme('dark', false), 'dark');
  assert.equal(resolveTheme('invalid', true), 'dark');
});

test('saved dark and German preferences survive a new read', () => {
  const storage = memoryStorage();
  assert.equal(savePreference(storage, 'theme', 'dark'), true);
  assert.equal(savePreference(storage, 'language', 'de'), true);
  assert.equal(storage.getItem('patrick-portfolio.theme'), 'dark');
  assert.equal(storage.getItem('patrick-portfolio.language'), 'de');
  assert.deepEqual(readPreferences(storage), { theme: 'dark', language: 'de' });
});

test('unsupported writes cannot replace a previously valid preference', () => {
  const storage = memoryStorage([['patrick-portfolio.theme', 'light']]);
  assert.equal(savePreference(storage, 'theme', 'invalid'), false);
  assert.equal(savePreference(storage, 'language', 'fr'), false);
  assert.equal(savePreference(storage, '__proto__', 'dark'), false);
  assert.deepEqual(readPreferences(storage), { theme: 'light', language: 'en' });
});

test('unavailable storage does not prevent in-session preference changes', () => {
  const storage = { getItem() { throw new Error('Storage blocked'); }, setItem() { throw new Error('Storage blocked'); } };
  assert.deepEqual(readPreferences(storage), { theme: 'system', language: 'en' });
  assert.equal(savePreference(storage, 'language', 'de'), false);
  assert.equal(savePreference(null, 'theme', 'dark'), false);
  assert.equal(resolveTheme('dark', false), 'dark');
});

test('sepia persists across visits and overrides either system appearance', () => {
  const storage = memoryStorage();
  assert.equal(normalizeTheme('sepia'), 'sepia');
  assert.equal(savePreference(storage, 'theme', 'sepia'), true);
  assert.equal(readPreferences(storage).theme, 'sepia');
  assert.equal(resolveTheme(readPreferences(storage).theme, true), 'sepia');
  assert.equal(resolveTheme(readPreferences(storage).theme, false), 'sepia');
});

test('each language can translate every content and accessibility key', () => {
  assert.deepEqual(Object.keys(translations.en).sort(), Object.keys(translations.de).sort());
  for (const dictionary of Object.values(translations)) {
    for (const [key, value] of Object.entries(dictionary)) {
      assert.equal(typeof value, 'string', key);
      assert.ok(value.trim().length > 0, key);
    }
    assert.ok(dictionary['meta.title']);
    assert.ok(dictionary['meta.description']);
    assert.ok(dictionary['settings.open']);
    assert.ok(dictionary['settings.close']);
  }
});
