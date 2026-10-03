const themes = ['system', 'dark', 'light', 'sepia'];
const languages = ['en', 'de'];

export function normalizeTheme(value) {
  return themes.includes(value) ? value : 'system';
}

export function normalizeLanguage(value) {
  return languages.includes(value) ? value : 'en';
}

export function resolveTheme(theme, systemIsDark) {
  const mode = normalizeTheme(theme);
  return mode === 'system' ? (systemIsDark ? 'dark' : 'light') : mode;
}

export function readPreferences(storage) {
  let theme = 'system';
  let language = 'en';
  try { theme = normalizeTheme(storage?.getItem('patrick-portfolio.theme')); } catch (_) { /* Use default. */ }
  try { language = normalizeLanguage(storage?.getItem('patrick-portfolio.language')); } catch (_) { /* Use default. */ }
  return { theme, language };
}

export function savePreference(storage, key, value) {
  if (!storage || (key !== 'theme' && key !== 'language')) return false;
  if (key === 'theme' && !themes.includes(value)) return false;
  if (key === 'language' && !languages.includes(value)) return false;
  try {
    storage.setItem(`patrick-portfolio.${key}`, value);
    return true;
  } catch (_) {
    return false;
  }
}
