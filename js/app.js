/**
 * PromptForge - Alpine.js AI Prompt Architect Engine
 * Orchestrates multi-step interactive wizard, dynamic questionnaires,
 * tech stack selection, offline persistence, and prompt compilation.
 */

document.addEventListener('alpine:init', () => {
  Alpine.data('jatBuilder', () => ({
    // Navigation & Wizard State
    step: 1, // 1: Archetype, 2: Granular UI Sections, 3: Tech Stack, 4: Compiled Prompt
    activeSectionIndex: 0,
    selectedArchetypeId: null,
    hasContinued: false,

    // Toast Notification State
    toast: {
      show: false,
      message: '',
      type: 'danger'
    },
    toastTimer: null,

    // Schema Data
    schema: window.JAT_SCHEMA || { archetypes: [], techStack: {} },

    // User Selections & Answers
    // Structure: answers[archetypeId][sectionId][questionId] = { selected: "...", custom: "" }
    answers: {},

    // Tech Stack Selections
    techSelections: {
      css: "tailwind",
      icons: "fontawesome",
      http: "fetch",
      utilities: "none",
      targetAgent: "claude_code",
      reactivity: "alpine",
      customDependencies: ""
    },

    // Output State
    finalPrompt: "",
    copied: false,
    pwaInstallPrompt: null,
    isAppInstalled: false,
    isOnline: navigator.onLine,

    // Theme Mode State (Default is Light Mode)
    darkMode: false,

    init() {
      // Setup network connectivity listeners
      window.addEventListener('online', () => this.isOnline = true);
      window.addEventListener('offline', () => this.isOnline = false);

      // Check if already installed / standalone mode
      this.checkInstalledState();

      // Listen for PWA installation event
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.pwaInstallPrompt = e;
      });

      // Listen for app installed event
      window.addEventListener('appinstalled', () => {
        this.isAppInstalled = true;
        this.pwaInstallPrompt = null;
        try {
          localStorage.setItem('promptforge_installed', 'true');
        } catch (e) {}
      });

      // Initialize theme: Default to Light mode unless user saved 'dark'
      const savedTheme = localStorage.getItem('promptforge_theme');
      this.darkMode = savedTheme === 'dark';
      this.applyTheme();

      // Initialize default answer trees for all archetypes
      this.initAnswerTrees();

      // Load saved state from LocalStorage if available
      this.loadSavedState();
    },

    checkInstalledState() {
      try {
        const isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
                             (window.navigator && window.navigator.standalone === true) ||
                             (document.referrer && document.referrer.includes('android-app://'));
        const storedInstalled = localStorage.getItem('promptforge_installed') === 'true';
        this.isAppInstalled = !!isStandalone || storedInstalled;

        if (window.matchMedia) {
          window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
            if (e.matches) {
              this.isAppInstalled = true;
            }
          });
        }
      } catch (e) {
        console.warn('[PromptForge] Check installed state error:', e);
      }
    },

    toggleTheme() {
      this.darkMode = !this.darkMode;
      this.applyTheme();
      try {
        localStorage.setItem('promptforge_theme', this.darkMode ? 'dark' : 'light');
      } catch (e) {
        console.warn('[PromptForge] Could not save theme preference:', e);
      }
      this.saveState();
    },

    applyTheme() {
      const root = document.documentElement;
      const themeMeta = document.getElementById('theme-color-meta');
      if (this.darkMode) {
        root.classList.add('dark');
        if (themeMeta) themeMeta.setAttribute('content', '#080c14');
      } else {
        root.classList.remove('dark');
        if (themeMeta) themeMeta.setAttribute('content', '#f8fafc');
      }
    },

    showToast(message = 'Please select a category before continuing.', type = 'danger') {
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toast.message = message;
      this.toast.type = type;
      this.toast.show = true;
      this.toastTimer = setTimeout(() => {
        this.toast.show = false;
      }, 4000);
    },

    hideToast() {
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toast.show = false;
    },

    initAnswerTrees() {
      if (!this.schema.archetypes) return;

      this.schema.archetypes.forEach(arch => {
        if (!this.answers[arch.id]) {
          this.answers[arch.id] = {};
        }
        arch.sections.forEach(sec => {
          if (!this.answers[arch.id][sec.id]) {
            this.answers[arch.id][sec.id] = {};
          }
          sec.questions.forEach(q => {
            if (!this.answers[arch.id][sec.id][q.id]) {
              this.answers[arch.id][sec.id][q.id] = {
                selected: (q.options && q.options.length > 0) ? q.options[0] : '',
                custom: ''
              };
            }
          });
        });
      });
    },

    loadSavedState() {
      try {
        const saved = localStorage.getItem('promptforge_builder_state') || localStorage.getItem('jat_builder_state');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.selectedArchetypeId) this.selectedArchetypeId = parsed.selectedArchetypeId;
          if (parsed.answers) this.answers = Object.assign(this.answers, parsed.answers);
          if (parsed.techSelections) this.techSelections = Object.assign(this.techSelections, parsed.techSelections);
          if (parsed.activeSectionIndex !== undefined) this.activeSectionIndex = parsed.activeSectionIndex;
          if (parsed.step) this.step = parsed.step;
          if (parsed.hasContinued !== undefined) {
            this.hasContinued = !!parsed.hasContinued;
          } else {
            this.hasContinued = this.step > 1;
          }
          if (parsed.finalPrompt) this.finalPrompt = parsed.finalPrompt;
          if (parsed.isAppInstalled !== undefined) {
            this.isAppInstalled = this.isAppInstalled || !!parsed.isAppInstalled;
          }
          if (parsed.darkMode !== undefined && !localStorage.getItem('promptforge_theme')) {
            this.darkMode = !!parsed.darkMode;
            this.applyTheme();
          }
        }
      } catch (e) {
        console.warn('[PromptForge] Could not parse saved state:', e);
      }
    },

    saveState() {
      try {
        const payload = {
          selectedArchetypeId: this.selectedArchetypeId,
          activeSectionIndex: this.activeSectionIndex,
          answers: this.answers,
          techSelections: this.techSelections,
          step: this.step,
          hasContinued: this.hasContinued,
          finalPrompt: this.finalPrompt,
          darkMode: this.darkMode,
          isAppInstalled: this.isAppInstalled
        };
        localStorage.setItem('promptforge_builder_state', JSON.stringify(payload));
        // Also save for backward compatibility
        localStorage.setItem('jat_builder_state', JSON.stringify(payload));
      } catch (e) {
        console.warn('[PromptForge] Could not save state:', e);
      }
    },

    // Archetype selection
    selectArchetype(id) {
      this.selectedArchetypeId = id;
      if (this.toast.show) {
        this.hideToast();
      }
      this.saveState();
    },

    selectAndConfigure(id) {
      this.selectedArchetypeId = id;
      this.hasContinued = true;
      this.activeSectionIndex = 0;
      this.step = 2;
      if (this.toast.show) {
        this.hideToast();
      }
      this.saveState();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    get currentArchetype() {
      if (!this.schema.archetypes) return null;
      if (!this.selectedArchetypeId && this.schema.archetypes.length > 0) {
        return this.schema.archetypes[0];
      }
      return this.schema.archetypes.find(a => a.id === this.selectedArchetypeId) || this.schema.archetypes[0] || null;
    },

    get currentSections() {
      const arch = this.currentArchetype;
      return arch ? arch.sections : [];
    },

    get currentSection() {
      const sections = this.currentSections;
      if (this.activeSectionIndex >= 0 && this.activeSectionIndex < sections.length) {
        return sections[this.activeSectionIndex];
      }
      return sections[0] || null;
    },

    // Question options
    getAnswer(questionId) {
      const arch = this.currentArchetype;
      const sec = this.currentSection;
      if (!arch || !sec || !this.answers[arch.id] || !this.answers[arch.id][sec.id]) return null;
      return this.answers[arch.id][sec.id][questionId];
    },

    isOptionSelected(question, optionText) {
      const ans = this.getAnswer(question.id);
      if (!ans) return false;
      return ans.selected === optionText;
    },

    toggleOption(question, optionText) {
      const arch = this.currentArchetype;
      const sec = this.currentSection;
      if (!arch || !sec) return;
      if (!this.answers[arch.id]) this.answers[arch.id] = {};
      if (!this.answers[arch.id][sec.id]) this.answers[arch.id][sec.id] = {};
      if (!this.answers[arch.id][sec.id][question.id]) {
        this.answers[arch.id][sec.id][question.id] = { selected: '', custom: '' };
      }

      this.answers[arch.id][sec.id][question.id].selected = optionText;
      this.saveState();
    },

    // Section Switching
    goToSection(idx) {
      this.activeSectionIndex = idx;
      this.saveState();
      window.scrollTo({ top: 80, behavior: 'smooth' });
    },

    // Navigation Step Controls
    nextStep() {
      if (this.step === 1) {
        if (!this.selectedArchetypeId) {
          this.showToast('Please select a category before continuing.');
          return;
        }
        this.hasContinued = true;
        this.activeSectionIndex = 0;
        this.step = 2;
      } else if (this.step === 2) {
        if (this.activeSectionIndex < this.currentSections.length - 1) {
          this.activeSectionIndex++;
          window.scrollTo({ top: 80, behavior: 'smooth' });
          this.saveState();
          return;
        } else {
          this.step = 3;
        }
      } else if (this.step === 3) {
        this.compilePrompt();
        return;
      }

      this.saveState();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    prevStep() {
      if (this.step === 2) {
        if (this.activeSectionIndex > 0) {
          this.activeSectionIndex--;
          window.scrollTo({ top: 80, behavior: 'smooth' });
          this.saveState();
          return;
        } else {
          this.step = 1;
          this.hasContinued = false;
        }
      } else if (this.step === 3) {
        this.step = 2;
        this.activeSectionIndex = Math.max(0, this.currentSections.length - 1);
      } else if (this.step === 4) {
        this.step = 3;
      }

      this.saveState();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Prompt Compilation Engine matching Screenshot 5
    compilePrompt() {
      const arch = this.currentArchetype;
      if (!arch) return;

      const tech = this.techSelections;
      const fwList = (this.schema.techStack.javascriptFrameworks || this.schema.techStack.reactivityEngines || []);
      const fwObj = fwList.find(f => f.id === tech.reactivity) || { name: "Alpine.js 3" };
      const cssObj = this.schema.techStack.cssFrameworks.find(c => c.id === tech.css) || { name: "Tailwind CSS v3/v4" };
      const iconObj = this.schema.techStack.iconLibraries.find(i => i.id === tech.icons) || { name: "FontAwesome / Lucide Icons" };
      const httpObj = this.schema.techStack.httpClients.find(h => h.id === tech.http) || { name: "Vanilla JS / Fetch API" };
      const utilObj = (this.schema.techStack.utilities && this.schema.techStack.utilities.find(u => u.id === tech.utilities)) || { name: "None" };
      const agentObj = this.schema.techStack.targetAgents.find(a => a.id === tech.targetAgent) || { name: "Claude Code / Cursor" };

      let p = `# MASTER BUILDER SPECIFICATION & PROMPT\n`;
      p += `## Target Application: ${arch.name}\n`;
      p += `## Objective: Build a fully functional, production-ready, highly polished web application adhering strictly to the specifications below.\n\n`;
      p += `---\n\n`;

      // 1. Core Architecture & Tech Stack
      p += `### 1. CORE ARCHITECTURE & TECH STACK\n`;
      p += `- **App Category**: ${arch.name} (${arch.subtitle})\n`;
      p += `- **JavaScript Framework**: ${fwObj.name}\n`;
      p += `- **CSS Framework**: ${cssObj.name}\n`;
      p += `- **Icon Library**: ${iconObj.name}\n`;
      p += `- **HTTP & State**: ${httpObj.name}\n`;
      p += `- **Utilities**: ${utilObj.name}\n`;
      p += `- **Target AI Agent**: ${agentObj.name}\n\n`;
      p += `---\n\n`;

      // 2. Detailed Section & Feature Specifications
      p += `### 2. DETAILED SECTION & FEATURE SPECIFICATIONS\n\n`;

      arch.sections.forEach(sec => {
        p += `#### [Section: ${sec.name}]\n`;
        sec.questions.forEach(q => {
          const ans = this.answers[arch.id]?.[sec.id]?.[q.id];
          const val = (ans && ans.selected) ? ans.selected : (q.options[0] || 'Default');
          p += `- **${q.label}**: ${val}\n`;
          if (ans && ans.custom && ans.custom.trim()) {
            p += `  - *Custom Note*: ${ans.custom.trim()}\n`;
          }
        });
        p += `\n`;
      });

      // 3. Technical Implementation & Execution Directives
      p += `---\n\n`;
      p += `### 3. TECHNICAL IMPLEMENTATION & EXECUTION RULES\n`;
      p += `1. **Visual Polish & Styling Integrity**: Adhere strictly to modern clean aesthetic with responsive light & dark mode support, polished accents, smooth micro-interactions, responsive flex/grid layouts, and pixel-perfect element spacing.\n`;
      p += `2. **Component Modularity**: Structure code into clean, decoupled, maintainable components with zero dead code or placeholder stubbing.\n`;
      p += `3. **State & Reactive Logic**: Ensure instantaneous state synchronization, resilient offline-first persistence where appropriate, and elegant feedback states (loaders, toasts, error boundaries).\n`;
      p += `4. **Zero-Placeholder Guarantee**: Write fully completed, ready-to-deploy code adhering strictly to the selected dependencies and requirements above.\n`;

      this.finalPrompt = p;
      this.step = 4;
      this.saveState();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Copying Prompt to Clipboard
    async copyPrompt() {
      if (!this.finalPrompt) return;
      try {
        await navigator.clipboard.writeText(this.finalPrompt);
        this.copied = true;
        setTimeout(() => this.copied = false, 2500);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = this.finalPrompt;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.copied = true;
        setTimeout(() => this.copied = false, 2500);
      }
    },

    // Download Prompt as Markdown file
    downloadPromptFile() {
      if (!this.finalPrompt) return;
      const blob = new Blob([this.finalPrompt], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'master_builder_prompt.md';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },

    // Reset Wizard to step 1
    resetWizard() {
      this.step = 1;
      this.selectedArchetypeId = null;
      this.hasContinued = false;
      this.activeSectionIndex = 0;
      this.finalPrompt = '';
      if (this.toast.show) {
        this.hideToast();
      }
      this.techSelections = {
        css: "tailwind",
        icons: "fontawesome",
        http: "fetch",
        utilities: "none",
        targetAgent: "claude_code",
        reactivity: "alpine",
        customDependencies: ""
      };
      this.initAnswerTrees();
      this.saveState();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Trigger PWA Installation prompt
    async promptInstall() {
      if (this.pwaInstallPrompt) {
        try {
          this.pwaInstallPrompt.prompt();
          const choiceResult = await this.pwaInstallPrompt.userChoice;
          if (choiceResult && choiceResult.outcome === 'accepted') {
            this.isAppInstalled = true;
            try {
              localStorage.setItem('promptforge_installed', 'true');
            } catch (e) {}
          }
        } catch (err) {
          console.warn('[PromptForge] PWA install prompt error:', err);
        } finally {
          this.pwaInstallPrompt = null;
        }
      } else {
        this.showToast('To install PromptForge, use your browser address bar or menu ("Install PromptForge").', 'info');
      }
    }
  }));
});
