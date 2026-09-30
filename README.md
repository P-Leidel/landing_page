# Patrick Leidel — portfolio

A responsive portfolio built with HTML, CSS, and JavaScript. No dependencies or build step are needed.

## Repository contents

Everything needed to run the website is included in this folder:

```text
index.html                 Homepage (Signal design)
styles.css                 Shared layout and responsive styles
scripts/                   Site behavior, preferences, and translations
designs/                   Signal, Editorial, and Studio styles
assets/                    Favicon and design preview images
compare.html               Optional design comparison page
tests/                     Preference and translation checks
package.json               JavaScript module configuration and npm test command
.gitignore                 Excludes local files and internal working notes
.gitattributes             Consistent source-file line endings
.nojekyll                  Allows plain static hosting on GitHub Pages
README.md                  Setup and editing instructions
```

All site assets and scripts use relative paths, so the website can also run under a repository subdirectory. Fonts use local system font stacks. Node is only needed to run tests; Python is one option for serving the website locally.

## Create your GitHub repository

Create an empty repository on GitHub. From this folder, run the following, replacing `YOUR-USERNAME` and `YOUR-REPOSITORY` with your repository details:

```powershell
git init -b main
git add .
git commit -m "Initial portfolio website"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

The ignore file keeps internal working notes and old design documents out of the repository. The website does not need them. No license has been selected; add a license if you want to grant others permission to reuse your code.

## Preview

From this folder, run:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. Keep the terminal running while you view the page; press Ctrl+C to stop the server. Use the local server rather than double-clicking the HTML file, because browsers load JavaScript modules over HTTP.

## Settings

The header settings button opens both English/Deutsch and System/Dark/Light choices. English and Dark are the first-visit defaults. Valid choices are remembered on this browser; if storage is blocked, they still work for the current visit. System follows the device's appearance. The page respects reduced motion.

## Add your content

- **Copy:** update the English baseline in `index.html` and both dictionaries in `scripts/translations.js`. Keep each `data-i18n` key present in both dictionaries. Use plain text; the page safely inserts translations as text.
- **Projects:** replace each placeholder article with your real project title, description, image, and links. Give new translated text its own dictionary key. Remove the placeholder badge and status once the content is real. Do not attach a translation key to an element containing a nested icon or other markup; put it on a text span instead.
- **Skills:** replace the skills placeholder with your actual skills. Add corresponding English/German entries and update the baseline HTML.
- **Socials:** replace `.social-placeholder` with real links after you have the profile URLs. Use descriptive labels (such as your profile name or platform). For links opening a new tab, add `rel="noopener noreferrer"` alongside `target="_blank"`.
- **Appearance:** Signal is the selected homepage design. Edit its light, dark, and system-dark tokens in `designs/signal.css`; shared layout rules remain in `styles.css`. Keep the explicit dark and system-dark values aligned.
- **Identity/metadata:** title and description live in both the HTML head and the translation dictionaries. Age and birth year are omitted.

## Design previews

Open `http://127.0.0.1:4173/compare.html` to compare three visual directions. Each preview uses the same HTML, translations, responsive layout, and settings:

- **01 Editorial:** Georgia / Verdana, parchment and terracotta. `/?design=editorial&appearance=light`
- **02 Signal:** Bahnschrift / Cascadia Code, midnight blue and cyan. `/?design=signal&appearance=dark`
- **03 Studio:** Trebuchet MS, lavender, plum, and mint. `/?design=studio&appearance=light`

Each direction also supports System/Dark/Light. The `appearance` parameter only sets the starting appearance for that preview; opening a preview does not change stored preferences. Fonts are local font stacks, so no external font service is needed. Signal is the homepage default, with no dot after the name heading. Style overrides live in `designs/`; comparison images live in `assets/design-previews/`.

## Tests

With Node installed:

```powershell
node --test
```

The tests cover preference defaults, validation, theme resolution, persistence, blocked storage, and translation coverage. No npm installation is required.

Projects, skills, and social destinations intentionally remain placeholders until real content is supplied.
