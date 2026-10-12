/**
 * Comprehensive Runtime & State Simulation Test Suite for PromptForge
 * Tests all interactive behaviors, state transitions, prompt generation,
 * persistence, validations, and edge cases.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('====================================================');
console.log('   PROMPTFORGE RUNTIME SIMULATION TEST SUITE');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assertTest(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${testName}${details ? ' - ' + details : ''}`);
    failedTests++;
  }
}

// Create a browser-like mock environment
function createMockEnvironment(initialLocalStorage = {}) {
  const storage = { ...initialLocalStorage };

  const localStorageMock = {
    getItem: (key) => (key in storage ? storage[key] : null),
    setItem: (key, val) => { storage[key] = String(val); },
    removeItem: (key) => { delete storage[key]; },
    clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
  };

  const documentElementMock = {
    classList: {
      classes: new Set(),
      add: function(c) { this.classes.add(c); },
      remove: function(c) { this.classes.delete(c); },
      contains: function(c) { return this.classes.has(c); }
    }
  };

  const themeMetaMock = {
    content: '',
    setAttribute: function(name, val) { if (name === 'content') this.content = val; },
    getAttribute: function(name) { return name === 'content' ? this.content : null; }
  };

  const listeners = {};

  const windowMock = {
    addEventListener: (evt, cb) => {
      listeners[evt] = listeners[evt] || [];
      listeners[evt].push(cb);
    },
    removeEventListener: (evt, cb) => {
      if (listeners[evt]) {
        listeners[evt] = listeners[evt].filter(fn => fn !== cb);
      }
    },
    dispatchEvent: (event) => {
      const type = event.type || event;
      if (listeners[type]) {
        listeners[type].forEach(fn => fn(event));
      }
    },
    scrollTo: () => {},
    matchMedia: () => ({ matches: false, addEventListener: () => {} }),
    navigator: {
      onLine: true,
      standalone: false,
      clipboard: {
        writeText: async () => true
      }
    },
    deferredInstallPrompt: null
  };

  const alpineMock = {
    dataRegistry: {},
    data: function(name, factory) {
      this.dataRegistry[name] = factory;
    },
    raw: function(obj) { return obj; }
  };
  windowMock.Alpine = alpineMock;

  const documentMock = {
    documentElement: documentElementMock,
    getElementById: (id) => (id === 'theme-color-meta' ? themeMetaMock : null),
    addEventListener: (evt, cb) => {
      listeners[evt] = listeners[evt] || [];
      listeners[evt].push(cb);
    },
    body: {
      appendChild: () => {},
      removeChild: () => {}
    },
    createElement: (tag) => ({
      tagName: tag,
      style: {},
      select: () => {},
      click: () => {}
    }),
    execCommand: () => true
  };

  const sandbox = {
    window: windowMock,
    document: documentMock,
    navigator: windowMock.navigator,
    localStorage: localStorageMock,
    Alpine: alpineMock,
    setTimeout: (fn, ms) => {
      // Don't auto-execute in mock unless triggered or if delay is 0
      return 123;
    },
    clearTimeout: () => {},
    console: console,
    Blob: class MockBlob { constructor(parts) { this.parts = parts; } },
    URL: { createObjectURL: () => 'blob:mock', revokeObjectURL: () => {} },
    CustomEvent: class MockCustomEvent { constructor(type, init) { this.type = type; this.detail = init?.detail; } }
  };

  vm.createContext(sandbox);

  // Load schema
  const schemaCode = fs.readFileSync(path.join(__dirname, '../js/schema.js'), 'utf8');
  vm.runInContext(schemaCode, sandbox);

  // Load app.js
  const appCode = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
  vm.runInContext(appCode, sandbox);

  // Trigger alpine:init
  sandbox.window.dispatchEvent({ type: 'alpine:init' });

  // Instantiate component
  const jatBuilderFactory = sandbox.window.Alpine.dataRegistry['jatBuilder'];
  if (!jatBuilderFactory) throw new Error('jatBuilder not registered with Alpine');
  const app = jatBuilderFactory();

  return { app, sandbox, storage };
}

async function runTestSuite() {
  // TEST SUITE 1: Initialization & Defaults
  console.log('Test Suite 1: Initialization & Default State');
  {
    const { app, sandbox } = createMockEnvironment();
    app.init();

    assertTest(app.step === 1, 'Component initializes at Step 1');
    assertTest(app.selectedArchetypeId === null, 'No archetype selected initially');
    assertTest(app.hasContinued === false, 'hasContinued is initially false');
    assertTest(app.darkMode === false, 'Default theme is Light Mode');
    assertTest(!sandbox.document.documentElement.classList.contains('dark'), 'HTML element does not have "dark" class by default');
    assertTest(app.isOnline === true, 'isOnline detects true from navigator');
    assertTest(app.isAppInstalled === false, 'isAppInstalled defaults to false');
    assertTest(app.schema.archetypes.length >= 6, `Schema loaded with ${app.schema.archetypes.length} archetypes`);
    assertTest(Object.keys(app.answers).length === app.schema.archetypes.length, 'Answer trees initialized for all archetypes');
  }

  // TEST SUITE 2: Validation on Step 1 Continuation
  console.log('\nTest Suite 2: Archetype Selection Validation & Toasts');
  {
    const { app } = createMockEnvironment();
    app.init();

    // Attempt to advance without selecting archetype
    app.nextStep();
    assertTest(app.step === 1, 'nextStep() prevents advancing past Step 1 when no archetype selected');
    assertTest(app.toast.show === true, 'Toast is triggered when continuing without selection');
    assertTest(app.toast.message === 'Please select a category before continuing.', 'Toast message matches validation prompt');
    assertTest(app.toast.type === 'danger', 'Toast type is danger');

    // Select archetype dismisses toast
    app.selectArchetype('dashboard');
    assertTest(app.selectedArchetypeId === 'dashboard', 'Archetype is selected');
    assertTest(app.toast.show === false, 'Selecting an archetype automatically hides the toast');

    // Now advance to step 2
    app.nextStep();
    assertTest(app.step === 2, 'nextStep() successfully advances to Step 2 when archetype is selected');
    assertTest(app.hasContinued === true, 'hasContinued becomes true after continuing');
  }

  // TEST SUITE 3: Direct "Select & Configure" Action
  console.log('\nTest Suite 3: Direct "Select & Configure" Action');
  {
    const { app } = createMockEnvironment();
    app.init();

    app.selectAndConfigure('ecommerce');
    assertTest(app.selectedArchetypeId === 'ecommerce', 'Selected archetype set to ecommerce');
    assertTest(app.step === 2, 'Instantly navigated to Step 2');
    assertTest(app.hasContinued === true, 'hasContinued is set to true');
    assertTest(app.activeSectionIndex === 0, 'activeSectionIndex reset to 0');
  }

  // TEST SUITE 4: Step 2 Section Traversal & Question Answering
  console.log('\nTest Suite 4: Step 2 Granular Feature Wizard Traversal');
  {
    const { app } = createMockEnvironment();
    app.init();
    app.selectArchetype('dashboard');
    app.nextStep(); // to Step 2

    const totalSections = app.currentSections.length;
    assertTest(totalSections >= 3, `SaaS Dashboard archetype has ${totalSections} sections (>= 3)`);

    // Answer first question in section 0
    const sec0 = app.currentSection;
    const q0 = sec0.questions[0];
    const originalAnswer = app.getAnswer(q0.id).selected;
    const newOption = q0.options[1];
    app.toggleOption(q0, newOption);
    assertTest(app.isOptionSelected(q0, newOption) === true, `Option changed to "${newOption}"`);
    assertTest(app.isOptionSelected(q0, originalAnswer) === false, 'Previous option unselected');

    // Add custom note
    const ansObj = app.getAnswer(q0.id);
    ansObj.custom = 'Must support WebSocket real-time telemetry';
    assertTest(app.getAnswer(q0.id).custom === 'Must support WebSocket real-time telemetry', 'Custom answer note recorded');

    // Traverse all sections
    for (let i = 0; i < totalSections - 1; i++) {
      const prevIdx = app.activeSectionIndex;
      app.nextStep();
      assertTest(app.step === 2 && app.activeSectionIndex === prevIdx + 1, `Advanced to section index ${prevIdx + 1}`);
    }

    // Next from last section advances to Step 3
    app.nextStep();
    assertTest(app.step === 3, 'Advancing past final section moves to Step 3 (Tech Stack)');

    // Step 2 backwards traversal
    app.prevStep();
    assertTest(app.step === 2 && app.activeSectionIndex === totalSections - 1, 'prevStep() from Step 3 returns to last section of Step 2');

    app.goToSection(0);
    assertTest(app.activeSectionIndex === 0, 'goToSection(0) jumps directly to first section');

    app.prevStep();
    assertTest(app.step === 1 && app.hasContinued === false, 'prevStep() from first section returns to Step 1 and resets hasContinued');
  }

  // TEST SUITE 5: Step 3 Tech Stack Customization & Prompt Compilation
  console.log('\nTest Suite 5: Tech Stack Customization & Prompt Compilation');
  {
    const { app } = createMockEnvironment();
    app.init();
    app.selectArchetype('ecommerce');
    app.step = 3;

    app.techSelections.reactivity = 'vue';
    app.techSelections.css = 'tailwind';
    app.techSelections.icons = 'lucide';
    app.techSelections.http = 'axios';
    app.techSelections.utilities = 'zod';
    app.techSelections.targetAgent = 'cursor';
    app.techSelections.customDependencies = 'stripe-js, @tanstack/vue-virtual';

    app.compilePrompt();
    assertTest(app.step === 4, 'compilePrompt() advances to Step 4');
    assertTest(app.finalPrompt.length > 500, `Generated prompt length is substantial (${app.finalPrompt.length} chars)`);
    assertTest(app.finalPrompt.includes('MASTER BUILDER SPECIFICATION & PROMPT'), 'Prompt contains Master Specification header');
    assertTest(app.finalPrompt.includes('E-Commerce Store'), 'Prompt identifies Target Application');
    assertTest(app.finalPrompt.includes('Vue 3') || app.finalPrompt.includes('Vue'), 'Prompt reflects Vue JavaScript Framework');
    assertTest(app.finalPrompt.includes('Tailwind CSS'), 'Prompt reflects Tailwind CSS');
    assertTest(app.finalPrompt.includes('Axios'), 'Prompt reflects Axios HTTP client');
    assertTest(app.finalPrompt.includes('TECHNICAL IMPLEMENTATION & EXECUTION RULES'), 'Prompt includes execution directives');
    assertTest(app.finalPrompt.includes('Zero-Placeholder Guarantee'), 'Prompt guarantees complete code with zero placeholders');
  }

  // TEST SUITE 6: Offline State Persistence & Restoration
  console.log('\nTest Suite 6: Offline State Persistence & Restoration');
  {
    const { app, storage } = createMockEnvironment();
    app.init();
    app.selectArchetype('landing');
    app.techSelections.reactivity = 'react';
    app.step = 3;
    app.saveState();

    assertTest(storage['promptforge_builder_state'] !== undefined, 'State saved to localStorage under promptforge_builder_state');
    assertTest(storage['jat_builder_state'] !== undefined, 'State saved to localStorage under jat_builder_state for backward compatibility');

    // Spin up new instance with identical storage
    const { app: restoredApp } = createMockEnvironment(storage);
    restoredApp.init();

    assertTest(restoredApp.selectedArchetypeId === 'landing', 'Restored archetype matches saved archetype');
    assertTest(restoredApp.techSelections.reactivity === 'react', 'Restored reactivity matches saved tech selection');
    assertTest(restoredApp.step === 3, 'Restored step matches saved step');
  }

  // TEST SUITE 7: Theme Mode Toggle & Persistence
  console.log('\nTest Suite 7: Theme Mode Toggle & Persistence');
  {
    const { app, sandbox, storage } = createMockEnvironment();
    app.init();

    assertTest(app.darkMode === false, 'Initially light mode');
    app.toggleTheme();
    assertTest(app.darkMode === true, 'toggleTheme() enables dark mode');
    assertTest(sandbox.document.documentElement.classList.contains('dark'), 'Dark class applied to documentElement');
    assertTest(storage['promptforge_theme'] === 'dark', 'Dark theme stored in localStorage');

    app.toggleTheme();
    assertTest(app.darkMode === false, 'toggleTheme() toggles back to light mode');
    assertTest(!sandbox.document.documentElement.classList.contains('dark'), 'Dark class removed from documentElement');
    assertTest(storage['promptforge_theme'] === 'light', 'Light theme stored in localStorage');
  }

  // TEST SUITE 8: Reset Wizard Workflow
  console.log('\nTest Suite 8: Reset Wizard Workflow');
  {
    const { app } = createMockEnvironment();
    app.init();
    app.selectArchetype('social');
    app.nextStep(); // step 2
    app.nextStep();
    app.step = 4;
    app.finalPrompt = 'Sample prompt';

    app.resetWizard();
    assertTest(app.step === 1, 'resetWizard resets step to 1');
    assertTest(app.selectedArchetypeId === null, 'selectedArchetypeId reset to null');
    assertTest(app.hasContinued === false, 'hasContinued reset to false');
    assertTest(app.finalPrompt === '', 'finalPrompt cleared');
    assertTest(app.activeSectionIndex === 0, 'activeSectionIndex reset to 0');
    assertTest(app.techSelections.reactivity === 'alpine', 'techSelections reset to defaults');
  }

  // TEST SUITE 9: PWA Lifecycle & Installation Actions
  console.log('\nTest Suite 9: PWA Lifecycle & Installation');
  {
    const { app, sandbox, storage } = createMockEnvironment();
    app.init();

    let promptCalled = false;

    const mockInstallEvent = {
      preventDefault: () => {},
      prompt: async () => { promptCalled = true; },
      userChoice: Promise.resolve({ outcome: 'accepted' })
    };

    sandbox.window.deferredInstallPrompt = mockInstallEvent;
    app.pwaInstallPrompt = mockInstallEvent;

    assertTest(app.isAppInstalled === false, 'Initially not marked as installed');

    await app.promptInstall();
    assertTest(promptCalled === true, 'promptInstall() calls native prompt()');
    assertTest(app.isAppInstalled === true, 'isAppInstalled set to true after accepted');
    assertTest(storage['promptforge_installed'] === 'true', 'Installation saved to localStorage');

    // Test appinstalled event listener
    const { app: app2, sandbox: sandbox2 } = createMockEnvironment();
    app2.init();
    sandbox2.window.dispatchEvent({ type: 'appinstalled' });
    assertTest(app2.isAppInstalled === true, 'appinstalled event updates isAppInstalled to true');
  }

  // TEST SUITE 10: Copy & Download Actions
  console.log('\nTest Suite 10: Copy & Download Actions');
  {
    const { app } = createMockEnvironment();
    app.init();
    app.finalPrompt = '# Test Prompt Content';

    await app.copyPrompt();
    assertTest(app.copied === true, 'copyPrompt sets copied flag to true');

    app.downloadPromptFile();
    assertTest(true, 'downloadPromptFile executes without throwing');
  }

  // SUMMARY
  console.log('\n====================================================');
  console.log(`SIMULATION RESULTS: ${passedTests} Passed, ${failedTests} Failed (Total ${totalTests})`);
  console.log('====================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    console.log('ALL RUNTIME SIMULATIONS PASSED PERFECTLY! 🚀\n');
  }
}

runTestSuite().catch(err => {
  console.error('Test suite uncaught error:', err);
  process.exit(1);
});
