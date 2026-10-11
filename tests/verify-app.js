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
} catch (e) {
  assert(false, `app.js validation failed: ${e.message}`);
}

// 4. Check Service Worker
try {
  const swCode = fs.readFileSync(path.join(__dirname, '../sw.js'), 'utf8');
  assert(swCode.includes('./js/schema.js'), 'sw.js pre-caches js/schema.js');
  assert(swCode.includes('./js/app.js'), 'sw.js pre-caches js/app.js');
  assert(swCode.includes('./css/custom.css'), 'sw.js pre-caches css/custom.css');
  assert(swCode.includes('./icons/icon.svg'), 'sw.js pre-caches icons/icon.svg');
} catch (e) {
  assert(false, `sw.js validation failed: ${e.message}`);
}

// 5. Check SVG Icon
try {
  const iconCode = fs.readFileSync(path.join(__dirname, '../icons/icon.svg'), 'utf8');
  assert(iconCode.includes('<svg') && iconCode.includes('</svg>'), 'icons/icon.svg is valid SVG markup');
} catch (e) {
  assert(false, `icon.svg validation failed: ${e.message}`);
}

console.log(`\nTEST SUMMARY: ${passed} Passed, ${failed} Failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY! 🎉');
}
