const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('--- RUNNING JAT PWA VERIFICATION TESTS ---');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

// 1. Check Schema
try {
  const schemaCode = fs.readFileSync(path.join(__dirname, '../js/schema.js'), 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(schemaCode, sandbox);
  const schema = sandbox.window.JAT_SCHEMA;

  assert(schema && Array.isArray(schema.archetypes), 'Schema defines an array of archetypes');
  assert(schema.archetypes.length >= 3, `Archetypes count is ${schema.archetypes.length} (>= 3)`);

  let totalQuestions = 0;
  let customAllowedCount = 0;

  schema.archetypes.forEach(arch => {
    assert(arch.id && arch.name && Array.isArray(arch.sections), `Archetype "${arch.name}" has valid structure`);
    arch.sections.forEach(sec => {
      assert(sec.id && sec.name && Array.isArray(sec.questions), `Section "${sec.name}" in "${arch.name}" is valid`);
      sec.questions.forEach(q => {
        totalQuestions++;
        assert(q.id && q.label && Array.isArray(q.options), `Question "${q.id}" has valid options`);
        if (q.allowCustom) customAllowedCount++;
      });
    });
  });

  assert(totalQuestions >= 10, `Total questions configured across archetypes: ${totalQuestions} (>= 10)`);
  assert(customAllowedCount > 0, `Questions supporting dynamic custom answers: ${customAllowedCount}`);

  // Tech stack validation
  const ts = schema.techStack;
  assert(ts && ts.cssFrameworks && ts.iconLibraries && ts.httpClients && ts.reactivityEngines && ts.targetAgents, 'Tech stack options categories exist');
  assert(ts.javascriptFrameworks && Array.isArray(ts.javascriptFrameworks), 'JavaScript frameworks category exists in schema');
  const fwIds = (ts.javascriptFrameworks || ts.reactivityEngines).map(f => f.id);
  assert(fwIds.includes('alpine') && fwIds.includes('vue') && fwIds.includes('react') && fwIds.includes('angular') && fwIds.includes('svelte'), 'JavaScript frameworks include alpine, vue, react, angular, and svelte');
} catch (e) {
  assert(false, `Schema loading failed: ${e.message}`);
}

// 2. Check index.html
try {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  assert(html.includes('manifest.json'), 'index.html links to manifest.json');
  assert(html.includes('css/custom.css'), 'index.html links to custom.css');
  assert(html.includes('js/schema.js'), 'index.html loads js/schema.js');
  assert(html.includes('js/app.js'), 'index.html loads js/app.js');
  assert(html.includes('sw.js'), 'index.html registers service worker');
  assert(html.includes('step === 1'), 'index.html contains Step 1 archetype view');
  assert(html.includes('step === 2'), 'index.html contains Step 2 feature wizard view');
  assert(html.includes('step === 3'), 'index.html contains Step 3 tech stack view');
  assert(html.includes('step === 4'), 'index.html contains Step 4 compiled prompt view');
  assert(html.includes('allowCustom'), 'index.html renders dynamic custom input box for features');
  assert(html.includes('copyPrompt'), 'index.html contains copy prompt action');
  assert(html.includes('downloadPromptFile'), 'index.html contains download prompt action');
  assert(html.includes('<html lang="en">') && !html.includes('<html lang="en" class="dark">'), 'index.html defaults to light mode (no dark class on html root)');
  assert(html.includes('toggleTheme()'), 'index.html contains top navigation mode switcher button');
  assert(html.includes('darkMode ? \'Switch to Light Mode\' : \'Switch to Dark Mode\''), 'index.html has accessible mode switcher label/title');
  assert(html.includes('promptforge_theme'), 'index.html contains early synchronous theme persistence check');
  assert(html.includes('JavaScript Framework'), 'index.html contains JavaScript Framework configuration section');
  assert(html.includes('techSelections.reactivity'), 'index.html allows binding and selection of JavaScript framework');
  assert(html.includes('x-show="hasContinued"'), 'index.html hides reset button until continued (x-show="hasContinued")');
  assert(html.includes('toast.show'), 'index.html contains toast with toast.show binding');
  assert(html.includes('fixed top-5') && html.includes('justify-center'), 'index.html places toast at top and centered');
  assert(html.includes('rounded-full') && (html.includes('rose-600') || html.includes('red-600')), 'index.html styles toast as rounded with danger colour');
  assert(html.includes('min-w-0') && html.includes('truncate') && html.includes('whitespace-nowrap'), 'index.html has responsive copy button preventing mobile overflow');
  assert(html.includes('font-awesome') || html.includes('fontawesome'), 'index.html links to FontAwesome stylesheet');
  assert(html.includes('fa-solid'), 'index.html contains FontAwesome icon classes');
} catch (e) {
  assert(false, `index.html validation failed: ${e.message}`);
}

// 3. Check App Script & Prompt Compilation Simulation
try {
  const appCode = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
  assert(appCode.includes('compilePrompt'), 'app.js implements compilePrompt()');
  assert(appCode.includes('copyPrompt'), 'app.js implements copyPrompt()');
  assert(appCode.includes('downloadPromptFile'), 'app.js implements downloadPromptFile()');
  assert(appCode.includes('localStorage'), 'app.js implements localStorage offline persistence');
  assert(appCode.includes('darkMode: false'), 'app.js sets light mode (darkMode: false) as default');
  assert(appCode.includes('toggleTheme'), 'app.js implements toggleTheme() method');
  assert(appCode.includes('applyTheme'), 'app.js implements applyTheme() method');
  assert(appCode.includes('JavaScript Framework'), 'app.js includes JavaScript Framework in compiled prompt');
  assert(appCode.includes('hasContinued'), 'app.js manages hasContinued state');
  assert(appCode.includes('showToast'), 'app.js implements showToast() method');
  assert(appCode.includes('hideToast'), 'app.js implements hideToast() method');
  assert(appCode.includes('!this.selectedArchetypeId') && appCode.includes('showToast'), 'app.js validates category selection before continuing in nextStep()');
} catch (e) {
  assert(false, `app.js validation failed: ${e.message}`);
}

// 4. Check Stylesheet
try {
  const css = fs.readFileSync(path.join(__dirname, '../css/custom.css'), 'utf8');
  assert(css.includes(':root') && css.includes('html.dark'), 'custom.css defines light mode :root and dark mode html.dark overrides');
  assert(css.includes('[x-cloak]'), 'custom.css defines [x-cloak] to prevent unstyled flash');
} catch (e) {
  assert(false, `custom.css validation failed: ${e.message}`);
}

// 5. Check Service Worker
try {
  const swCode = fs.readFileSync(path.join(__dirname, '../sw.js'), 'utf8');
  assert(swCode.includes('./js/schema.js'), 'sw.js pre-caches js/schema.js');
  assert(swCode.includes('./js/app.js'), 'sw.js pre-caches js/app.js');
  assert(swCode.includes('./css/custom.css'), 'sw.js pre-caches css/custom.css');
  assert(swCode.includes('./icons/icon.svg'), 'sw.js pre-caches icons/icon.svg');
  assert(swCode.includes('font-awesome') && swCode.includes('all.min.css'), 'sw.js pre-caches FontAwesome CSS');
  assert(swCode.includes('fa-solid-900.woff2'), 'sw.js pre-caches FontAwesome solid webfonts for offline use');
} catch (e) {
  assert(false, `sw.js validation failed: ${e.message}`);
}

// 6. Check SVG and PNG Icons
try {
  const iconCode = fs.readFileSync(path.join(__dirname, '../icons/icon.svg'), 'utf8');
  assert(iconCode.includes('<svg') && iconCode.includes('</svg>'), 'icons/icon.svg is valid SVG markup');

  const iconsDir = path.join(__dirname, '../icons');
  ['icon-192.png', 'icon-512.png', 'icon-maskable-192.png', 'icon-maskable-512.png'].forEach(pngFile => {
    const pngPath = path.join(iconsDir, pngFile);
    assert(fs.existsSync(pngPath) && fs.statSync(pngPath).size > 1000, `icons/${pngFile} exists and is non-empty PNG`);
  });
} catch (e) {
  assert(false, `Icon validation failed: ${e.message}`);
}

// 7. Check Manifest.json PWA Compliance
try {
  const manifestRaw = fs.readFileSync(path.join(__dirname, '../manifest.json'), 'utf8');
  const manifest = JSON.parse(manifestRaw);
  assert(manifest.name && manifest.short_name, 'manifest.json defines name and short_name');
  assert(manifest.start_url === './index.html', 'manifest.json specifies relative start_url for GitHub Pages');
  assert(manifest.scope === './', 'manifest.json specifies relative scope for GitHub Pages');
  assert(manifest.id, 'manifest.json specifies explicit id for unique WebAPK identity');
  assert(manifest.display === 'standalone', 'manifest.json display is standalone');
  assert(Array.isArray(manifest.icons) && manifest.icons.length >= 4, 'manifest.json defines required raster and vector icons');

  const iconSizes = manifest.icons.map(i => `${i.sizes}:${i.type}:${i.purpose || 'any'}`);
  assert(iconSizes.some(s => s.includes('192x192') && s.includes('image/png')), 'manifest.json includes 192x192 PNG icon');
  assert(iconSizes.some(s => s.includes('512x512') && s.includes('image/png')), 'manifest.json includes 512x512 PNG icon');
  assert(iconSizes.some(s => s.includes('maskable') && s.includes('image/png')), 'manifest.json includes maskable PNG icon');
} catch (e) {
  assert(false, `manifest.json validation failed: ${e.message}`);
}

// 8. Check Mobile Meta Tags in index.html
try {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  assert(html.includes('mobile-web-app-capable'), 'index.html contains mobile-web-app-capable meta tag');
  assert(html.includes('apple-mobile-web-app-capable'), 'index.html contains apple-mobile-web-app-capable meta tag');
  assert(html.includes('icon-192.png'), 'index.html references icon-192.png for mobile app icon');
  assert(html.includes('apple-touch-icon'), 'index.html provides apple-touch-icon link');
} catch (e) {
  assert(false, `Mobile meta tag validation failed: ${e.message}`);
}

// 9. Check Install App Button & Lifecycle
try {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const appCode = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');

  assert(html.includes('promptInstall()'), 'index.html contains Install App button with promptInstall() action');
  assert(html.includes('!isAppInstalled'), 'index.html conditionally removes Install button when isAppInstalled is true');
  
  const themePos = html.indexOf('toggleTheme()');
  const installPos = html.indexOf('promptInstall()');
  const resetPos = html.indexOf('resetWizard()');
  assert(themePos !== -1 && installPos !== -1 && themePos < installPos && (resetPos === -1 || installPos < resetPos), 'Install button is placed next to the mode switcher on its right');

  // Verify style matches copy button
  const installBtnMatch = html.match(/<!-- Install App Button -->\s*<button[\s\S]*?<\/button>/);
  assert(installBtnMatch !== null, 'Found Install App button element');
  if (installBtnMatch) {
    const btnHtml = installBtnMatch[0];
    assert(btnHtml.includes('bg-indigo-600') && btnHtml.includes('dark:bg-[#6366f1]'), 'Install button uses copy button brand background colors');
    assert(btnHtml.includes('rounded-lg'), 'Install button uses rounded-lg matching copy button');
    assert(btnHtml.includes('text-white') && btnHtml.includes('text-xs font-semibold'), 'Install button uses white bold typography matching copy button');
    assert(btnHtml.includes('fa-download') || btnHtml.includes('fa-') || (btnHtml.includes('<svg') && btnHtml.includes('</svg>')), 'Install button contains related icon');
    assert(btnHtml.includes('Install App') || btnHtml.includes('Install'), 'Install button contains Install App label');
  }

  // Verify app.js lifecycle logic
  assert(appCode.includes('isAppInstalled: false'), 'app.js defines isAppInstalled state');
  assert(appCode.includes('checkInstalledState'), 'app.js implements checkInstalledState()');
  assert(appCode.includes('appinstalled'), 'app.js listens for appinstalled event to remove button');
  assert(appCode.includes('display-mode: standalone'), 'app.js detects standalone display mode');

  // Verify early PWA beforeinstallprompt capture and proxy avoidance
  assert(html.includes('deferredInstallPrompt'), 'index.html contains early deferredInstallPrompt capture script');
  assert(html.includes('beforeinstallprompt'), 'index.html captures beforeinstallprompt in head');
  assert(appCode.includes('deferredInstallPrompt'), 'app.js checks and syncs deferredInstallPrompt');
  assert(appCode.includes('rawPrompt'), 'app.js unproxies prompt event to prevent illegal invocation');
} catch (e) {
  assert(false, `Install App button validation failed: ${e.message}`);
}

console.log(`\nTEST SUMMARY: ${passed} Passed, ${failed} Failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY! 🎉');
}
