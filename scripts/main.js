import { readPreferences, savePreference, resolveTheme, normalizeTheme } from './preferences.js';
import { translations } from './translations.js';

let storage = null;
try { storage = window.localStorage; } catch (_) { /* Preferences still work for this visit. */ }

const preferences = readPreferences(storage);
// Reuse the validated default, saved choice, or preview appearance set before paint.
preferences.theme = normalizeTheme(document.documentElement.dataset.theme);
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const settings = document.querySelector('.settings');
const toggle = document.getElementById('settings-toggle');
const panel = document.getElementById('settings-panel');

function updateToggleLabel() {
  toggle.setAttribute('aria-label', translations[preferences.language][panel.hidden ? 'settings.open' : 'settings.close']);
}

function applyTheme() {
  document.documentElement.dataset.theme = preferences.theme;
  document.documentElement.dataset.resolvedTheme = resolveTheme(preferences.theme, systemTheme.matches);
  for (const radio of document.querySelectorAll('input[name="theme"]')) radio.checked = radio.value === preferences.theme;
}

function applyLanguage() {
  const dictionary = translations[preferences.language];
  document.documentElement.lang = preferences.language;
  for (const element of document.querySelectorAll('[data-i18n]')) element.textContent = dictionary[element.dataset.i18n];
  for (const element of document.querySelectorAll('[data-i18n-aria]')) element.setAttribute('aria-label', dictionary[element.dataset.i18nAria]);
  for (const radio of document.querySelectorAll('input[name="language"]')) radio.checked = radio.value === preferences.language;
  document.title = dictionary['meta.title'];
  document.querySelector('meta[name="description"]').content = dictionary['meta.description'];
  document.querySelector('.settings-current').textContent = preferences.language.toUpperCase();
  updateToggleLabel();
}

function setMenuOpen(open) {
  panel.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  updateToggleLabel();
}

for (const radio of document.querySelectorAll('input[name="theme"], input[name="language"]')) {
  radio.addEventListener('change', () => {
    preferences[radio.name] = radio.value;
    savePreference(storage, radio.name, radio.value);
    if (radio.name === 'theme') applyTheme();
    else applyLanguage();
  });
}

toggle.addEventListener('click', () => setMenuOpen(panel.hidden));
document.addEventListener('click', event => {
  if (!panel.hidden && !settings.contains(event.target)) setMenuOpen(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !panel.hidden) {
    setMenuOpen(false);
    toggle.focus();
  }
});
settings.addEventListener('focusout', event => {
  if (event.relatedTarget && !settings.contains(event.relatedTarget)) setMenuOpen(false);
});
systemTheme.addEventListener('change', applyTheme);

applyTheme();
applyLanguage();
toggle.hidden = false;
