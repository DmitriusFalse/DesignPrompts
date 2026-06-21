document.addEventListener('alpine:init', () => {
  Alpine.data('dropdown', () => ({
    open: false,
    openUp: false,
    panelStyle: {},
    toggle() {
      this.open = !this.open;
      if (this.open) {
        this.$nextTick(() => this._position());
      } else {
        this.panelStyle = {};
        this.openUp = false;
      }
    },
    close() {
      this.open = false;
      this.panelStyle = {};
      this.openUp = false;
    },
    _position() {
      const btn = this.$el.querySelector('button');
      const panel = this.$el.querySelector('[x-show="open"]');
      if (!btn || !panel) return;
      const br = btn.getBoundingClientRect();
      const ph = panel.scrollHeight;
      const sb = window.innerHeight - br.bottom;
      const sa = br.top;
      const up = sb < ph && sa > sb;
      const mh = up ? Math.min(ph, sa - 4) : Math.min(ph, sb - 4);
      this.openUp = up;
      this.panelStyle = {
        top: up ? 'auto' : '100%',
        bottom: up ? '100%' : 'auto',
        maxHeight: Math.max(mh, 40) + 'px',
      };
    },
  }));

});

const BLOCK_IDS = { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9 };
const BLOCK_COLORS = [null, '#60cdff', '#6ccb6c', '#e8b84a', '#4ecdc4', '#aa7be0', '#87b6ff', '#d48ebd', '#ff6b6b', '#f59a44', '#ff8c00'];

const PROMPT_STRUCTURES = [
  {
    id: 'standard',
    labelKey: 'structure.standard',
    negativeBlockId: 9,
    blocks: [
      { id: 1, labelKey: 'block.1' },
      { id: 2, labelKey: 'block.2' },
      { id: 3, labelKey: 'block.3' },
      { id: 4, labelKey: 'block.4' },
      { id: 5, labelKey: 'block.5' },
      { id: 6, labelKey: 'block.6' },
      { id: 7, labelKey: 'block.7' },
      { id: 8, labelKey: 'block.8' },
    ],
    renderPositive(blocks, t) {
      return blocks.filter(b => b.items.length > 0).map(b => b.items.join(', ')).join(', ');
    },
    renderNegative(chips, t) {
      return chips.map(ch => ch.prompt_text || ch.name).join(', ');
    }
  },
  {
    id: 'midjourney',
    labelKey: 'structure.midjourney',
    negativeBlockId: 9,
    blocks: [
      { id: 1, labelKey: 'structure.mj.b1' },
      { id: 2, labelKey: 'structure.mj.b2' },
      { id: 3, labelKey: 'structure.mj.b3' },
      { id: 4, labelKey: 'structure.mj.b4' },
      { id: 5, labelKey: 'structure.mj.b5' },
      { id: 6, labelKey: 'structure.mj.b6' },
      { id: 7, labelKey: 'structure.mj.b7' },
      { id: 8, labelKey: 'structure.mj.b8' },
      { id: 9, labelKey: 'structure.mj.b9' },
      { id: 10, labelKey: 'structure.mj.b10' },
    ],
    renderPositive(blocks, t) {
      const content = [];
      let ar = '', v = '', style = '', s = '';
      for (const b of blocks) {
        if (b.items.length === 0) continue;
        const text = b.items.join(', ');
        if (b.id <= 6) { content.push(text); }
        else if (b.id === 7) { ar = text; }
        else if (b.id === 8) { s = text; }
        else if (b.id === 9) { v = text; }
        else if (b.id === 10) { style = text; }
      }
      let result = content.join(', ');
      if (ar) result += ' --ar ' + ar;
      if (v) result += ' --v ' + v;
      if (style) result += ' --style ' + style;
      if (s) result += ' --s ' + s;
      return result;
    },
    renderNegative(chips, t) {
      if (!chips.length) return '';
      return '--no ' + chips.map(ch => ch.prompt_text || ch.name).join(', ');
    }
  },
  {
    id: 'dalle3',
    labelKey: 'structure.dalle3',
    negativeBlockId: 9,
    blocks: [
      { id: 1, labelKey: 'structure.d3.b1' },
      { id: 2, labelKey: 'structure.d3.b2' },
      { id: 3, labelKey: 'structure.d3.b3' },
      { id: 4, labelKey: 'structure.d3.b4' },
      { id: 5, labelKey: 'structure.d3.b5' },
      { id: 6, labelKey: 'structure.d3.b6' },
      { id: 7, labelKey: 'structure.d3.b7' },
    ],
    renderPositive(blocks, t) {
      const p = blocks.filter(b => b.items.length > 0).map(b => b.items.join(', '));
      return p.map(s => s.endsWith('.') ? s : s + '.').join(' ');
    },
    renderNegative(chips, t) {
      return '';
    }
  },
  {
    id: 'sd',
    labelKey: 'structure.sd',
    negativeBlockId: 9,
    blocks: [
      { id: 1, labelKey: 'structure.sd.b1' },
      { id: 2, labelKey: 'structure.sd.b2' },
      { id: 3, labelKey: 'structure.sd.b3' },
      { id: 4, labelKey: 'structure.sd.b4' },
      { id: 5, labelKey: 'structure.sd.b5' },
      { id: 6, labelKey: 'structure.sd.b6' },
      { id: 7, labelKey: 'structure.sd.b7' },
      { id: 8, labelKey: 'structure.sd.b8' },
    ],
    renderPositive(blocks, t) {
      return blocks.filter(b => b.items.length > 0).map(b => b.items.join(', ')).join(' + ');
    },
    renderNegative(chips, t) {
      return chips.map(ch => ch.prompt_text || ch.name).join(', ');
    }
  },
  {
    id: 'flux',
    labelKey: 'structure.flux',
    negativeBlockId: 9,
    blocks: [
      { id: 1, labelKey: 'structure.flux.b1' },
      { id: 2, labelKey: 'structure.flux.b2' },
      { id: 3, labelKey: 'structure.flux.b3' },
      { id: 4, labelKey: 'structure.flux.b4' },
      { id: 5, labelKey: 'structure.flux.b5' },
      { id: 6, labelKey: 'structure.flux.b6' },
    ],
    renderPositive(blocks, t) {
      return blocks.filter(b => b.items.length > 0).map(b => b.items.join(', ')).join(', ');
    },
    renderNegative(chips, t) {
      return chips.map(ch => ch.prompt_text || ch.name).join(', ');
    }
  },
  {
    id: 'novelai',
    labelKey: 'structure.novelai',
    negativeBlockId: 10,
    blocks: [
      { id: 1, labelKey: 'structure.novelai.b1' },
      { id: 2, labelKey: 'structure.novelai.b2' },
      { id: 3, labelKey: 'structure.novelai.b3' },
      { id: 4, labelKey: 'structure.novelai.b4' },
      { id: 5, labelKey: 'structure.novelai.b5' },
      { id: 6, labelKey: 'structure.novelai.b6' },
      { id: 7, labelKey: 'structure.novelai.b7' },
      { id: 8, labelKey: 'structure.novelai.b8' },
      { id: 9, labelKey: 'structure.novelai.b9' },
    ],
    renderPositive(blocks, t) {
      return blocks.filter(b => b.items.length > 0).map(b => b.items.join(', ')).join(', ');
    },
    renderNegative(chips, t) {
      return chips.map(ch => ch.prompt_text || ch.name).join(', ');
    }
  },
  {
    id: 'anime',
    labelKey: 'structure.anime',
    negativeBlockId: 9,
    blocks: [
      { id: 1, labelKey: 'structure.anime.b1' },
      { id: 2, labelKey: 'structure.anime.b2' },
      { id: 3, labelKey: 'structure.anime.b3' },
      { id: 4, labelKey: 'structure.anime.b4' },
      { id: 5, labelKey: 'structure.anime.b5' },
      { id: 6, labelKey: 'structure.anime.b6' },
      { id: 7, labelKey: 'structure.anime.b7' },
      { id: 8, labelKey: 'structure.anime.b8' },
    ],
    renderPositive(blocks, t) {
      return blocks.filter(b => b.items.length > 0).map(b => b.items.join(', ')).join(', ');
    },
    renderNegative(chips, t) {
      return chips.map(ch => ch.prompt_text || ch.name).join(', ');
    }
  }
];

function app() {
  return {
    pwaInstallable: false,
    _pwaDeferredPrompt: null,

    // Theme: 'auto', 'dark', 'light'
    theme: localStorage.getItem('theme') || 'auto',

    // i18n
    lang: localStorage.getItem('lang') || ((navigator.language || '').startsWith('ru') ? 'ru' : 'en'),
    translations: {},

    t(key) {
      return this.translations[key] || key;
    },

    async loadTranslations() {
      try {
        const res = await fetch(`/static/i18n/${this.lang}.json`);
        this.translations = await res.json();
      } catch (e) {
        console.error('Failed to load translations:', e);
        this.translations = {};
      }
    },

    async loadPresets() {
      try {
        const res = await fetch('/static/presets.json');
        this.presetData = await res.json();
      } catch (e) {
        console.error('Failed to load presets:', e);
        this.presetData = {};
      }
    },

    async loadConstants() {
      this.tagBlockMap = {};
      this.tagInfoMap = {};
      try {
        const res = await fetch('/static/constants.json');
        if (!res.ok) { console.error('loadConstants status:', res.status); return; }
        this.constantTags = await res.json();
        for (const group of this.constantTags) {
          const tkey = group.tkey || '';
          const parts = tkey.split('.');
          const cat = parts.length >= 2 ? parts[1] : '';
          const blockId = BLOCK_IDS[cat];
          if (!blockId) continue;
          const subcatKey = group.subcat || cat;
          if (group.tags) {
            for (const tag of group.tags) {
              this.tagBlockMap[tag] = blockId;
              this.tagInfoMap[tag] = { category: 'const', subcategory: subcatKey };
            }
          }
          if (group.subcategories) {
            for (const sub of group.subcategories) {
              if (sub.tags) {
                for (const tag of sub.tags) {
                  this.tagBlockMap[tag] = blockId;
                  this.tagInfoMap[tag] = { category: 'const', subcategory: subcatKey };
                }
              }
            }
          }
        }
      } catch (e) {
        console.error('Failed to load constants:', e);
        this.constantTags = [];
      }
    },

    // Toast
    toastText: '',
    toastVisible: false,
    toastTimer: null,

    // Fast lookup sets (rebuilt on chip mutations)
    posNames: {},
    negNames: {},
    _autoSaveTimer: null,

    // Packs
    packs: [],
    selectedPackId: '',
    syncing: false,

    get currentPack() {
      const p = this.packs.find(p => p.id === this.selectedPackId);
      if (!p) return { name: '', icon: '📦' };
      return {
        ...p,
        name: this.lang === 'ru' && p.name_ru ? p.name_ru : p.name
      };
    },

    tCat(categoryName) {
      const p = this.packs.find(p => p.id === this.selectedPackId);
      if (!p || !p.categories_list) return categoryName;
      const cat = p.categories_list.find(c => c.name === categoryName);
      if (this.lang === 'ru' && cat && cat.name_ru) return cat.name_ru;
      return categoryName;
    },

    // Sidebar
    sideOpen: false,
    activePanel: '',
    activePackId: null,
    sidebarTab: 'const',

    // Tree
    tree: [],
    treeOpen: {},

    treeModal: false,
    treeModalProgress: 0,
    _treeLoading: null,

    // Constant tags
    constOpen: {},
    constSubOpen: {},
    constantTags: [],
    categoryColor: {},
    tagBlockMap: {},
    tagInfoMap: {},
    version: '',

    // ComfyUI
    comfyEnabled: false,
    resolutions: [],

    promptsOpen: false,
    workflows: [],
    selectedWorkflow: '',
    checkpoints: [],
    selectedCheckpoint: '',
    steps: 20,
    cfg: 7,
    samplers: [],
    selectedSampler: 'euler',
    schedulers: [],
    selectedScheduler: 'normal',
    selectedResolution: '512x512',
    generating: false,
    generationProgress: 0,
    generationStatus: '',
    generationResult: null,
    generationHistory: [],
    previewPerPage: 25,
    previewPage: 1,
    viewerImage: null,
    viewerIndex: -1,
    _genDataLoaded: false,
    seed: 0,
    seedFixed: false,
    nodeTitles: {},
    tagToCategory: {},

    // Layout
    leftRatio: parseInt(localStorage.getItem('layout_left') || '20'),
    rightWidth: parseInt(localStorage.getItem('layout_right') || '400'),
    workNoComfyRatio: parseInt(localStorage.getItem('layout_work_nc') || '75'),
    workComfyRatio: parseInt(localStorage.getItem('layout_work_c') || '30'),
    resizing: null,

    // Prompt structure
    promptStructure: 'standard',
    blockOrder: null,
    blockDragState: null,
    blockDropTarget: null,
    showStructureConfirm: false,
    _pendingStructureId: null,

    // Chips as objects: { name, category, subcategory, block_id }
    positiveChips: [],
    negativeChips: [],
    dragState: null,
    dropTarget: null,
    _ignoreNextClick: false,

    // Custom main tags
    customMainTags: [],
    mainTagGroups: [],
    mainTagModal: false,
    mainTagForm: { tag_name: '', full_text: '', block_id: 1, subcategory: '', structures: [] },
    _editingMainTagId: null,
    _mainTagAnchor: null,
    mainGroupModal: false,
    mainGroupForm: { name: '', block_id: 1, structures: [] },
    _mainGroupAnchor: null,

    // Edit chip on canvas
    editChipModal: false,
    editChipForm: { name: '', prompt_text: '', block_id: 1 },
    _editChipRef: null,

    // Custom input

    // Presets
    presetData: {},

    // Save canvas
    canvasName: '',
    canvasId: null,
    saveModal: false,
    saveForm: { name: '', duplicate: false, showDuplicateCheckbox: false },
    renameModal: false,
    renameForm: { name: '' },

    // Manager prompts
    managerModal: false,
    savedPrompts: [],

    // Preview panel
    previewTab: 'images',
    restoreWarnings: [],

    // ─── Init ───

    async init() {
      this.loadPresets();
      await this.loadTranslations();
      await this.loadConstants();
      this.assignColors();
      await this.loadPacks();
      document.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this._pwaDeferredPrompt = e;
        this.pwaInstallable = true;
      });
      try {
        const r = await fetch('/api/version');
        if (r.ok) { const d = await r.json(); this.version = d.version; }
      } catch(e) {}
      await this.loadCustomMainTags();
      await this.loadMainTagGroups();
      await this.loadSavedPrompts();
      this.$watch('saveForm.name', () => {
        const n = this.saveForm.name.trim();
        if (n && this.savedPrompts.some(p => p.name === n && p.id !== this.canvasId)) {
          this.saveForm.showDuplicateCheckbox = true;
        } else {
          this.saveForm.showDuplicateCheckbox = false;
          this.saveForm.duplicate = false;
        }
      });
      this.$watch('promptStructure', (newVal, oldVal) => {
        if (oldVal && newVal !== oldVal) this.onStructureChange(oldVal, newVal);
      });
      await this.loadComfyConfig();
      this.loadGenerationHistory();
      window.addEventListener('pageshow', (e) => {
        if (e.persisted) this.loadGenerationHistory();
      });
    },

    // ─── PWA ───

    installPwa() {
      if (!this._pwaDeferredPrompt) return;
      this._pwaDeferredPrompt.prompt();
      this._pwaDeferredPrompt.userChoice.then(() => {
        this._pwaDeferredPrompt = null;
        this.pwaInstallable = false;
      });
    },

    // ─── Packs ───

    async loadPacks() {
      try {
        const res = await fetch('/api/packs');
        if (!res.ok) { console.error('loadPacks status:', res.status); return; }
        const list = await res.json();
        for (const p of list) {
          try {
            p.categories_list = JSON.parse(p.categories || '[]');
          } catch(e) {
            p.categories_list = [];
          }
        }
        this.packs = list;
        if (this.packs.length > 0 && !this.selectedPackId) {
          this.selectedPackId = this.packs[0].id;
          await this.refreshFreshCategories(this.selectedPackId);
          this.loadAll();
        }
      } catch (e) {
        console.error('loadPacks:', e);
      }
    },

    async refreshFreshCategories(packId) {
      try {
        const res = await fetch(`/api/pack/info?id=${packId}`);
        if (!res.ok) return;
        const info = await res.json();
        const pack = this.packs.find(p => p.id === packId);
        if (pack && info.categories) {
          pack.categories_list = info.categories;
        }
      } catch (e) {
        console.error('refreshFreshCategories:', e);
      }
    },

    async syncTags() {
      if (this.syncing) return;
      this.syncing = true;
      try {
        const res = await fetch('/api/sync', { method: 'POST' });
        if (res.ok) {
          await this.loadPacks();
          this.loadAll();
        } else {
          const data = await res.json().catch(() => ({}));
          this.showToast(data.error || 'Sync failed: ' + res.status, 5000);
        }
      } catch (e) {
        console.error('sync:', e);
        this.showToast('Sync error: ' + e.message, 5000);
      } finally {
        this.syncing = false;
      }
    },

    // ─── Tree ───

    async loadTree() {
      if (!this.selectedPackId) return;
      try {
        const res = await fetch(`/api/tags/tree?pack_id=${this.selectedPackId}`);
        if (!res.ok) { console.error('loadTree status:', res.status); return; }
        this.tree = await res.json();
        this.treeOpen = {};
        this.assignColors();
      } catch (e) {
        console.error('loadTree:', e);
      }
    },

    async toggleCategory(cat) {
      if (!cat) return;
      const name = typeof cat === 'string' ? cat : cat.name;
      this.treeOpen[name] = !this.treeOpen[name];
      if (this.treeOpen[name]) {
        const treeCat = this.tree.find(c => c.name === name);
        if (treeCat && !treeCat._tags) {
          if (this._treeLoading) return;
          this._treeLoading = name;
          this.treeModal = true;
          this.treeModalProgress = 0;
          try {
            const res = await fetch(`/api/tags/tree?pack_id=${this.selectedPackId}&category=${encodeURIComponent(name)}&offset=0&limit=99999`);
            const page = await res.json();
            treeCat._tags = page.tags || [];
            for (const t of treeCat._tags) {
              this.tagToCategory[t.tag_name] = name;
              this.tagInfoMap[t.tag_name] = { category: name, subcategory: '' };
            }
            this.treeModalProgress = 100;
          } catch (e) {
            console.error('toggleCategory:', e);
            treeCat._tags = [];
          } finally {
            this._treeLoading = null;
            this.treeModal = false;
          }
        }
      }
    },

    treeByBlock(blockId) {
      if (!this.currentPack?.categories_list) return [];
      return this.tree.filter(cat => {
        const cfg = this.currentPack.categories_list.find(c => c.name === cat.name);
        return cfg && cfg.block_id === blockId;
      });
    },

    // ─── Chips ───

    resolveBlockId(category, subcategory) {
      if (category === 'const') {
        return BLOCK_IDS[subcategory] || 1;
      }
      return 1;
    },

    resolveBlockIdByName(tagName) {
      return this.tagBlockMap[tagName] || 1;
    },

    _chipKey() {
      return 'ch-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
    },
    makeChip(tag) {
      const category = tag.category_name || '';
      const subcategory = tag.subcategory_name || '';
      let block_id = this.resolveBlockId(category, subcategory);
      const pack = this.packs.find(p => p.id === this.selectedPackId);
      if (pack && pack.categories_list) {
        const catCfg = pack.categories_list.find(c => c.name === category);
        if (catCfg && catCfg.block_id) block_id = catCfg.block_id;
      }
      return { name: tag.tag_name, category, subcategory, block_id, _groupChildren: [], _key: this._chipKey(), weight: null };
    },
    _chipFromTagData(tagData) {
      if (!tagData) return null;
      if (tagData._category === 'group') {
        return { _key: this._chipKey(), name: tagData.name, category: 'group', subcategory: '', block_id: 4, _groupChildren: (tagData._groupChildren || []).map(c => ({ ...c })), weight: null };
      }
      if (tagData._category === 'dynamic') {
        return { _key: this._chipKey(), name: tagData.name, category: 'dynamic', subcategory: '', block_id: 4, from_tag: tagData.from_tag || null, to_tag: tagData.to_tag || null, when: tagData.when || 0.5, weight: null };
      }
      return { name: tagData.name, prompt_text: tagData.prompt_text || tagData.name, category: '', subcategory: '', block_id: 4, _groupChildren: [], _key: this._chipKey(), weight: null };
    },
    _ensureChipKeys() {
      for (const c of this.positiveChips) { if (!c._key) c._key = this._chipKey(); }
      for (const c of this.negativeChips) { if (!c._key) c._key = this._chipKey(); }
    },

    addTag(tag) {
      this._toggleChip(this.makeChip(tag), this.positiveChips);
    },

    addNegativeTag(tag) {
      const ch = this.makeChip(tag);
      ch.block_id = this.currentStructure.negativeBlockId;
      this._toggleChip(ch, this.negativeChips);
    },

    removeChip(type, name) {
      if (this._ignoreNextClick) { this._ignoreNextClick = false; return; }
      const arr = type === 'positive' ? this.positiveChips : this.negativeChips;
      const idx = arr.findIndex(c => c.name === name);
      if (idx !== -1) arr.splice(idx, 1);
      this.notifyChipChange();
    },

    // ─── Drag & drop ───

    onDragStart(ev, ch) {
      const key = ch._key || this._chipKey();
      this.dragState = { key, name: ch.name };
      ev.dataTransfer.effectAllowed = 'move';
      ev.dataTransfer.setData('text/plain', key);
      ev.currentTarget.classList.add('chip-dragging');
    },

    dragBreakSource(ev) {
      const key = 'brk-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
      this.dragState = { key, name: 'BREAK', isBreakSource: true };
      ev.dataTransfer.setData('text/plain', key);
      ev.currentTarget.classList.add('chip-dragging');
    },

    dragGroupSource(ev) {
      const key = 'grp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
      this.dragState = { key, name: 'GROUP', isGroupSource: true };
      ev.dataTransfer.setData('text/plain', key);
      ev.currentTarget.classList.add('chip-dragging');
    },

    dragDynamicSource(ev) {
      const key = 'dyn-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
      this.dragState = { key, name: 'DYNAMIC', isDynamicSource: true };
      ev.dataTransfer.setData('text/plain', key);
      ev.currentTarget.classList.add('chip-dragging');
    },

    _clearDropVisuals() {
      document.querySelectorAll('.drag-over, .drop-before, .drop-after')
        .forEach(el => el.classList.remove('drag-over', 'drop-before', 'drop-after'));
    },

    onDragEnd(ev) {
      ev.currentTarget.classList.remove('chip-dragging');
      this._clearDropVisuals();
      this.dragState = null;
      this.dropTarget = null;
    },

    onDragOver(ev) {
      if (this.blockDragState) return;
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
      const dragKey = this.dragState?.key;
      if (!dragKey) return;
      const blockEl = ev.currentTarget.closest('[data-block-id]') || ev.currentTarget;
      const chipEls = [...blockEl.querySelectorAll('[data-chip-key]')]
        .filter(el => el.dataset.chipKey !== dragKey);
      // Find closest chip by Euclidean distance to center
      let closestEl = null, closestDist = Infinity;
      for (const el of chipEls) {
        const r = el.getBoundingClientRect();
        const dx = ev.clientX - (r.left + r.width / 2);
        const dy = ev.clientY - (r.top + r.height / 2);
        const d = dx * dx + dy * dy;
        if (d < closestDist) { closestDist = d; closestEl = el; }
      }
      // Compute new drop target
      let newInsertBeforeKey = null, newInsertAfterKey = null;
      if (closestEl) {
        const r = closestEl.getBoundingClientRect();
        if (ev.clientX < r.left + r.width / 2) {
          newInsertBeforeKey = closestEl.dataset.chipKey;
        } else {
          newInsertAfterKey = closestEl.dataset.chipKey;
        }
      }
      // Update visual if changed
      const prev = this.dropTarget;
      if (!prev || prev.before !== newInsertBeforeKey || prev.after !== newInsertAfterKey) {
        // Clear old visuals on all chips
        blockEl.querySelectorAll('.drop-before, .drop-after')
          .forEach(el => el.classList.remove('drop-before', 'drop-after'));
        // Apply new visual
        if (newInsertBeforeKey) {
          const el = blockEl.querySelector(`[data-chip-key="${CSS.escape(newInsertBeforeKey)}"]`);
          if (el) el.classList.add('drop-before');
        }
        if (newInsertAfterKey) {
          const el = blockEl.querySelector(`[data-chip-key="${CSS.escape(newInsertAfterKey)}"]`);
          if (el) el.classList.add('drop-after');
        }
        this.dropTarget = { before: newInsertBeforeKey, after: newInsertAfterKey };
      }
    },

    onDragEnter(ev) {
      ev.preventDefault();
      if (!ev.currentTarget.contains(ev.relatedTarget)) {
        ev.currentTarget.classList.add('drag-over');
      }
    },

    onDragLeave(ev) {
      if (!ev.currentTarget.contains(ev.relatedTarget)) {
        ev.currentTarget.classList.remove('drag-over');
      }
    },

    onDrop(ev, targetType) {
      if (this.blockDragState) return;
      ev.preventDefault();
      this._clearDropVisuals();
      this._ignoreNextClick = true;
      const key = this.dragState?.key;
      if (!key) return;
      const name = this.dragState?.name;
      const allChips = [...this.positiveChips, ...this.negativeChips];
      let chip = allChips.find(c => c._key === key);
      const raw = parseInt(ev.currentTarget.dataset.blockId);
      const targetBlockId = isNaN(raw) ? 4 : raw;
      const ds = this.dragState;

      // Handle group child drag-out
      if (ds.isGroupChildDrag) {
        const srcGroup = allChips.find(c => c._key === ds.key);
        if (!srcGroup) { this.dragState = null; this.dropTarget = null; return; }
        const childData = srcGroup._groupChildren.find(c => c.name === ds.childName);
        if (childData) {
          srcGroup._groupChildren = srcGroup._groupChildren.filter(c => c.name !== ds.childName);
          chip = this._chipFromTagData(childData);
          if (chip) chip.block_id = targetBlockId;
        }
      }

      // Handle dynamic child drag-out
      if (ds.isDynamicChildDrag) {
        const srcDyn = allChips.find(c => c._key === ds.key);
        if (!srcDyn) { this.dragState = null; this.dropTarget = null; return; }
        const tagData = srcDyn[ds.slot === 'from' ? 'from_tag' : 'to_tag'];
        if (tagData) {
          srcDyn[ds.slot === 'from' ? 'from_tag' : 'to_tag'] = null;
          chip = this._chipFromTagData(tagData);
          if (chip) chip.block_id = targetBlockId;
        }
      }

      const isNewChip = !chip || ds.isBreakSource || ds.isGroupSource || ds.isDynamicSource;
      if (isNewChip) {
        if (name === 'BREAK') {
          chip = { name: 'BREAK', prompt_text: 'BREAK', category: 'meta', subcategory: '', block_id: 1, _key: 'brk-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6) };
        } else if (name === 'GROUP') {
          chip = { _key: 'grp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), name: 'группа', category: 'group', prompt_text: null, subcategory: '', block_id: targetBlockId, _groupChildren: [], weight: null };
        } else if (name === 'DYNAMIC') {
          chip = { _key: 'dyn-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), name: 'dynamic', category: 'dynamic', block_id: targetBlockId, from_tag: null, to_tag: null, when: 0.5, weight: null };
        } else {
          return;
        }
      }
      const tgtArr = targetType === 'positive' ? this.positiveChips : this.negativeChips;
      if (chip.category === 'group' && tgtArr === this.negativeChips) return;
      const dt = this.dropTarget;

      if (!isNewChip && !ds.isGroupChildDrag && !ds.isDynamicChildDrag) {
        const srcArr = this.positiveChips.includes(chip) ? this.positiveChips : this.negativeChips;
        const oldIdx = srcArr.indexOf(chip);
        if (oldIdx >= 0) srcArr.splice(oldIdx, 1);
      }

      chip.block_id = targetBlockId;

      if (dt && dt.before) {
        const idx = tgtArr.findIndex(c => c._key === dt.before);
        tgtArr.splice(idx < 0 ? 0 : idx, 0, chip);
      } else if (dt && dt.after) {
        const idx = tgtArr.findIndex(c => c._key === dt.after);
        tgtArr.splice(idx < 0 ? tgtArr.length : idx + 1, 0, chip);
      } else {
        const blockChips = tgtArr.filter(c => (c.block_id || 1) === targetBlockId);
        if (blockChips.length > 0) {
          const lastInBlock = blockChips[blockChips.length - 1];
          tgtArr.splice(tgtArr.indexOf(lastInBlock) + 1, 0, chip);
        } else {
          let insertIdx = 0;
          for (let i = 0; i < tgtArr.length; i++) {
            if ((tgtArr[i].block_id || 1) < targetBlockId) insertIdx = i + 1;
          }
          tgtArr.splice(insertIdx, 0, chip);
        }
      }
      this.positiveChips = this.positiveChips.slice();
      this.negativeChips = this.negativeChips.slice();
      this.dragState = null;
      this.dropTarget = null;
      this.notifyChipChange();
    },

    // ─── Group chip DnD ───

    onGroupDragOver(ev, group) {
      if (this.blockDragState) return;
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
      ev.currentTarget.classList.add('group-drag-over');
    },

    onGroupDragEnter(ev) {
      ev.preventDefault();
      ev.currentTarget.classList.add('group-drag-over');
    },

    onGroupDragLeave(ev) {
      ev.currentTarget.classList.remove('group-drag-over');
    },

    onGroupChildDragStart(ev, group, child) {
      this.dragState = { key: group._key, name: child.name, childName: child.name, isGroupChildDrag: true };
      ev.dataTransfer.effectAllowed = 'move';
      ev.dataTransfer.setData('text/plain', group._key + ':' + child.name);
      ev.currentTarget.classList.add('chip-dragging');
    },

    onGroupDrop(ev, group) {
      if (this.blockDragState) return;
      ev.preventDefault();
      ev.currentTarget.classList.remove('group-drag-over');
      this._clearDropVisuals();
      const ds = this.dragState;
      if (!ds) return;

      // Group child dragged between groups or reorder within same group
      if (ds.isGroupChildDrag) {
        const srcGroup = [...this.positiveChips, ...this.negativeChips].find(c => c._key === ds.key);
        if (srcGroup) {
          const childData = srcGroup._groupChildren.find(c => c.name === ds.childName);
          if (childData) {
            srcGroup._groupChildren = srcGroup._groupChildren.filter(c => c.name !== ds.childName);
            const childCopy = { name: childData.name, prompt_text: childData.prompt_text || childData.name, weight: childData.weight || null };
            if (childData._category) { childCopy._category = childData._category; }
            if (childData._category === 'dynamic') { childCopy.from_tag = childData.from_tag; childCopy.to_tag = childData.to_tag; childCopy.when = childData.when; }
            if (childData._category === 'group') { childCopy._groupChildren = (childData._groupChildren || []).map(c => ({ ...c })); }
            group._groupChildren = [...(group._groupChildren || []), childCopy];
          }
        }
        this.dragState = null;
        this.dropTarget = null;
        this.notifyChipChange();
        return;
      }

      // Regular chip drop onto group
      const name = ds.name;
      if (!name || name === 'BREAK' || name === 'GROUP' || name === 'DYNAMIC') return;
      const chip = [...this.positiveChips, ...this.negativeChips].find(c => c.name === name);
      if (!chip || chip.category === 'group') {
        // Reorder: insert chip after target group
        const srcChip = [...this.positiveChips, ...this.negativeChips].find(c => c._key === ds.key);
        if (srcChip && srcChip !== group) {
          const srcArr = this.positiveChips.includes(srcChip) ? this.positiveChips : this.negativeChips;
          const srcIdx = srcArr.indexOf(srcChip);
          if (srcIdx >= 0) srcArr.splice(srcIdx, 1);
          const tgtIdx = this.positiveChips.indexOf(group);
          if (tgtIdx >= 0) this.positiveChips.splice(tgtIdx + 1, 0, srcChip);
          this.positiveChips = this.positiveChips.slice();
          if (srcArr !== this.positiveChips) this.negativeChips = this.negativeChips.slice();
        }
        this.dragState = null;
        this.dropTarget = null;
        this.notifyChipChange();
        return;
      }
      const srcArr = this.positiveChips.includes(chip) ? this.positiveChips : this.negativeChips;
      const idx = srcArr.indexOf(chip);
      if (idx >= 0) srcArr.splice(idx, 1);
      if (chip.category === 'dynamic') {
        group._groupChildren = [...(group._groupChildren || []), { name: chip.name, prompt_text: chip.prompt_text || chip.name, weight: chip.weight || null, _category: 'dynamic', from_tag: chip.from_tag, to_tag: chip.to_tag, when: chip.when }];
      } else {
        group._groupChildren = [...(group._groupChildren || []), { name: chip.name, prompt_text: chip.prompt_text || chip.name, weight: chip.weight || null }];
      }
      this.dragState = null;
      this.dropTarget = null;
      this.notifyChipChange();
    },

    removeGroupChip(group) {
      const idx = this.positiveChips.findIndex(c => c._key === group._key);
      if (idx >= 0) {
        this.positiveChips.splice(idx, 1);
        this.notifyChipChange();
      }
    },

    removeChildFromGroup(group, childName) {
      group._groupChildren = (group._groupChildren || []).filter(c => c.name !== childName);
      this.notifyChipChange();
    },

    // ─── Dynamic Prompt DnD ───

    onDynamicDrop(ev, dynChip, slot) {
      if (this.blockDragState) return;
      ev.preventDefault();
      ev.stopPropagation();
      const ds = this.dragState;
      if (!ds) return;
      const allChips = [...this.positiveChips, ...this.negativeChips];

      // Dragging from another dynamic chip's slot
      if (ds.isDynamicChildDrag) {
        const srcDyn = allChips.find(c => c._key === ds.key);
        if (!srcDyn) { this.dragState = null; return; }
        const tagData = srcDyn[ds.slot === 'from' ? 'from_tag' : 'to_tag'];
        if (tagData) {
          srcDyn[ds.slot === 'from' ? 'from_tag' : 'to_tag'] = null;
          const newTag = { name: tagData.name, prompt_text: tagData.prompt_text || tagData.name };
          if (tagData._category) { newTag._category = tagData._category; }
          if (tagData._category === 'dynamic') { newTag.from_tag = tagData.from_tag; newTag.to_tag = tagData.to_tag; newTag.when = tagData.when; }
          if (tagData._category === 'group') { newTag._groupChildren = (tagData._groupChildren || []).map(c => ({ name: c.name, prompt_text: c.prompt_text || c.name })); }
          dynChip[slot === 'from' ? 'from_tag' : 'to_tag'] = newTag;
        }
        this.dragState = null;
        this.notifyChipChange();
        return;
      }

      // Dragging a group child
      if (ds.isGroupChildDrag) {
        const srcGroup = allChips.find(c => c._key === ds.key);
        if (!srcGroup) { this.dragState = null; return; }
        const childData = srcGroup._groupChildren.find(c => c.name === ds.childName);
        if (childData) {
          srcGroup._groupChildren = srcGroup._groupChildren.filter(c => c.name !== ds.childName);
          const newTag = { name: childData.name, prompt_text: childData.prompt_text || childData.name };
          if (childData._category) { newTag._category = childData._category; }
          if (childData._category === 'dynamic') { newTag.from_tag = childData.from_tag; newTag.to_tag = childData.to_tag; newTag.when = childData.when; }
          if (childData._category === 'group') { newTag._groupChildren = (childData._groupChildren || []).map(c => ({ name: c.name, prompt_text: c.prompt_text || c.name })); }
          dynChip[slot === 'from' ? 'from_tag' : 'to_tag'] = newTag;
        }
        this.dragState = null;
        this.notifyChipChange();
        return;
      }

      // Regular chip drop
      const name = ds.name;
      if (!name || name === 'BREAK' || name === 'GROUP' || name === 'DYNAMIC') return;
      const chip = allChips.find(c => c.name === name);
      if (chip && chip.category !== 'group' && chip.category !== 'dynamic') {
        const srcArr = this.positiveChips.includes(chip) ? this.positiveChips : this.negativeChips;
        const idx = srcArr.indexOf(chip);
        if (idx >= 0) srcArr.splice(idx, 1);
        dynChip[slot === 'from' ? 'from_tag' : 'to_tag'] = { name: chip.name, prompt_text: chip.prompt_text || chip.name };
        this.dragState = null;
        this.notifyChipChange();
        return;
      }
      // Drop group chip into dynamic slot
      if (chip && chip.category === 'group') {
        const srcArr = this.positiveChips.includes(chip) ? this.positiveChips : this.negativeChips;
        const idx = srcArr.indexOf(chip);
        if (idx >= 0) srcArr.splice(idx, 1);
        dynChip[slot === 'from' ? 'from_tag' : 'to_tag'] = { name: chip.name, prompt_text: chip.prompt_text || chip.name, _category: 'group', _groupChildren: (chip._groupChildren || []).map(c => ({ name: c.name, prompt_text: c.prompt_text || c.name })) };
        this.dragState = null;
        this.notifyChipChange();
        return;
      }
      // Fallback: reorder chip after target dynamic chip
      const srcChip = allChips.find(c => c._key === ds.key);
      if (srcChip && srcChip !== dynChip) {
        const srcArr = this.positiveChips.includes(srcChip) ? this.positiveChips : this.negativeChips;
        const srcIdx = srcArr.indexOf(srcChip);
        if (srcIdx >= 0) srcArr.splice(srcIdx, 1);
        const tgtIdx = this.positiveChips.indexOf(dynChip);
        if (tgtIdx >= 0) this.positiveChips.splice(tgtIdx + 1, 0, srcChip);
        this.positiveChips = this.positiveChips.slice();
        if (srcArr !== this.positiveChips) this.negativeChips = this.negativeChips.slice();
      }
      this.dragState = null;
      this.notifyChipChange();
    },

    onDynamicChildDragStart(ev, dynChip, slot) {
      this.dragState = { key: dynChip._key, name: dynChip[slot === 'from' ? 'from_tag' : 'to_tag']?.name, slot, isDynamicChildDrag: true };
      ev.dataTransfer.effectAllowed = 'move';
      ev.dataTransfer.setData('text/plain', dynChip._key + ':' + slot);
      ev.currentTarget.classList.add('chip-dragging');
    },

    // ─── Block (section) drag & drop ───

    onBlockDragStart(ev, block) {
      this.blockDragState = { id: block.id };
      ev.dataTransfer.effectAllowed = 'move';
      ev.dataTransfer.setData('text/plain', 'block:' + block.id);
    },

    onBlockDragEnd() {
      this.blockDragState = null;
      this.blockDropTarget = null;
    },

    onBlockDragOver(ev, block) {
      ev.preventDefault();
      if (!this.blockDragState || this.blockDragState.id === block.id) {
        if (this.blockDropTarget) this.blockDropTarget = null;
        return;
      }
      const rect = ev.currentTarget.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      if (ev.clientY < midY) {
        this.blockDropTarget = { before: block.id, after: null };
      } else {
        const sections = [...ev.currentTarget.parentElement.querySelectorAll('.block-section')];
        const idx = sections.indexOf(ev.currentTarget);
        if (idx < sections.length - 1) {
          const nextId = parseInt(sections[idx + 1].dataset.blockId);
          this.blockDropTarget = { before: nextId, after: null };
        } else {
          this.blockDropTarget = { before: null, after: block.id };
        }
      }
    },

    onBlockDrop(ev, block) {
      ev.preventDefault();
      if (!this.blockDragState || this.blockDragState.id === block.id) {
        this.blockDropTarget = null;
        return;
      }
      const fromId = this.blockDragState.id;
      const s = this.currentStructure;
      const defaultOrder = s.blocks.map(b => b.id);
      const currentOrder = this.blockOrder ? [...this.blockOrder] : [...defaultOrder];
      const fromIdx = currentOrder.indexOf(fromId);
      if (fromIdx === -1) { this.blockDropTarget = null; return; }

      const [item] = currentOrder.splice(fromIdx, 1);

      let insertIdx = currentOrder.length;
      if (this.blockDropTarget?.before != null) {
        const t = currentOrder.indexOf(this.blockDropTarget.before);
        if (t >= 0) insertIdx = t;
      } else if (this.blockDropTarget?.after != null) {
        const t = currentOrder.indexOf(this.blockDropTarget.after);
        if (t >= 0) insertIdx = t + 1;
      }

      currentOrder.splice(insertIdx, 0, item);
      this.blockOrder = currentOrder;
      this.blockDropTarget = null;
      this.blockDragState = null;
    },

    removeDynamicTag(dynChip, slot) {
      dynChip[slot === 'from' ? 'from_tag' : 'to_tag'] = null;
      this.notifyChipChange();
    },

    clearPositiveChips() {
      this.clearChips('positive');
    },

    clearNegativeChips() {
      this.clearChips('negative');
    },

    // ─── Sidebar panel toggle ───

    togglePanel(panel, packId) {
      if (this.activePanel === panel && this.activePackId === (packId ?? null)) {
        this.sideOpen = !this.sideOpen;
        return;
      }
      this.activePanel = panel;
      this.activePackId = packId ?? null;
      this.sideOpen = true;
      if (panel === 'main') {
        this.sidebarTab = 'main';
      } else if (panel === 'pack') {
        this.sidebarTab = 'tree';
        this.selectedPackId = packId;
        this.loadTree();
      } else if (panel === 'const') {
        this.sidebarTab = 'const';
      }
    },

    selectedClass(tagName) {
      if (this.posNames[tagName]) return 'selected-pos';
      if (this.negNames[tagName]) return 'selected-neg';
      return '';
    },

    selectedCountInCategory(cat) {
      let count = 0;
      if (cat.tags) {
        for (const t of cat.tags) {
          if (this.posNames[t] || this.negNames[t]) count++;
        }
      }
      if (cat.subcategories) {
        for (const sub of cat.subcategories) {
          if (sub.tags) {
            for (const t of sub.tags) {
              if (this.posNames[t] || this.negNames[t]) count++;
            }
          }
        }
      }
      return count;
    },

    selectedCountInSub(sub) {
      let count = 0;
      if (sub.tags) {
        for (const t of sub.tags) {
          if (this.posNames[t] || this.negNames[t]) count++;
        }
      }
      return count;
    },

    selectedCountInTree(cat) {
      let count = 0;
      for (const ch of this.positiveChips) {
        if (ch.category === cat.name || this.tagToCategory[ch.name] === cat.name) count++;
        else if (cat._tags && cat._tags.some(t => t.tag_name === ch.name)) count++;
      }
      for (const ch of this.negativeChips) {
        if (ch.category === cat.name || this.tagToCategory[ch.name] === cat.name) count++;
        else if (cat._tags && cat._tags.some(t => t.tag_name === ch.name)) count++;
      }
      return count;
    },

    counterColorClass(count) {
      if (count === 0) return 'text-gray-400 dark:text-dark-400';
      return 'text-yellow-500 dark:text-yellow-500 font-semibold';
    },

    totalInCategory(cat) {
      let total = cat.tags ? cat.tags.length : 0;
      if (cat.subcategories) {
        for (const sub of cat.subcategories) {
          total += sub.tags ? sub.tags.length : 0;
        }
      }
      return total;
    },

    totalInSub(sub) {
      return sub.tags ? sub.tags.length : 0;
    },

    updateChipNames() {
      const p = {}, n = {};
      for (const c of this.positiveChips) {
        p[c.name] = true;
        if (c.category === 'group' && c._groupChildren) {
          for (const child of c._groupChildren) p[child.name] = true;
        }
        if (c.category === 'dynamic') {
          if (c.from_tag) p[c.from_tag.name] = true;
          if (c.to_tag) p[c.to_tag.name] = true;
        }
      }
      for (const c of this.negativeChips) n[c.name] = true;
      this.posNames = p;
      this.negNames = n;
      const tc = {};
      for (const c of this.positiveChips) { if (c.category) tc[c.name] = c.category; }
      for (const c of this.negativeChips) { if (c.category) tc[c.name] = c.category; }
      this.tagToCategory = tc;
    },

    notifyChipChange() {
      Promise.resolve().then(() => {
        this.updateChipNames();
        this.autoSavePrompt();
      });
    },

    _toggleChip(chip, targetArr) {
      const targetIdx = targetArr.findIndex(c => c.name === chip.name);
      if (targetIdx !== -1) {
        targetArr.splice(targetIdx, 1);
        this.notifyChipChange();
        return;
      }
      const oppositeArr = targetArr === this.positiveChips ? this.negativeChips : this.positiveChips;
      const oppIdx = oppositeArr.findIndex(c => c.name === chip.name);
      if (oppIdx !== -1) oppositeArr.splice(oppIdx, 1);
      targetArr.push(chip);
      this.notifyChipChange();
    },

    clearChips(type) {
      const arr = type === 'positive' ? this.positiveChips : this.negativeChips;
      arr.splice(0);
      this.notifyChipChange();
    },

    removeChipsByName(name) {
      this.positiveChips = this.positiveChips.filter(c => c.name !== name);
      this.negativeChips = this.negativeChips.filter(c => c.name !== name);
      this.notifyChipChange();
    },

    assignColors() {
      const map = {};
      let i = 1;
      for (const cat of this.tree) {
        const idx = i++ % 7 + 1;
        map[cat.name] = BLOCK_COLORS[idx];
      }
      for (const cat of this.constantTags) {
        const key = cat.tkey?.split('.').pop() || cat.name;
        if (!map[key]) {
          const idx = i++ % 7 + 1;
          map[key] = BLOCK_COLORS[idx];
        }
      }
      this.categoryColor = map;
    },

    getColorForChip(chip) {
      return BLOCK_COLORS[chip.block_id] || null;
    },

    getCategoryColor(cat) {
      const key = cat.tkey?.split('.').pop() || cat.name;
      if (this.categoryColor[key]) return this.categoryColor[key];
      const blockId = BLOCK_IDS[key];
      if (blockId) return BLOCK_COLORS[blockId];
      return null;
    },

    chipCategoryName(chip) {
      let catName = '';
      let isConst = false;
      if (chip.category === 'const') {
        catName = chip.subcategory;
        isConst = true;
      } else if (chip.category === 'meta' && this.tagInfoMap[chip.name]) {
        const info = this.tagInfoMap[chip.name];
        catName = info.subcategory;
        isConst = info.category === 'const';
      } else if (chip.category && chip.category !== 'meta') {
        catName = chip.category;
      }
      if (!catName) return '';
      if (isConst) {
        const group = this.constantTags.find(g => (g.tkey?.split('.').pop() || g.name) === catName);
        return group ? this.t(group.tkey || group.name) : catName;
      }
      return this.tCat(catName) || catName;
    },

    childDisplayName(child) {
      if (!child) return '';
      if (child._category === 'dynamic') {
        let from = '';
        if (child.from_tag) {
          if (child.from_tag._category === 'group') {
            from = (child.from_tag._groupChildren || []).map(c => c.prompt_text || c.name).join(' ');
          } else {
            from = child.from_tag.prompt_text || child.from_tag.name;
          }
        }
        let to = '';
        if (child.to_tag) {
          if (child.to_tag._category === 'group') {
            to = (child.to_tag._groupChildren || []).map(c => c.prompt_text || c.name).join(' ');
          } else {
            to = child.to_tag.prompt_text || child.to_tag.name;
          }
        }
        return '[' + from + ':' + to + ':' + (child.when || 0.5) + ']';
      }
      if (child._category === 'group') {
        let inner = (child._groupChildren || []).map(c => c.name).join(' ');
        return '(' + inner + ')';
      }
      return child.name;
    },
    groupLabelText(group) {
      return (group._groupChildren || []).map(c => this.childDisplayName(c)).join(' ');
    },

    enrichChips() {
      let dirty = false;
      for (const ch of this.positiveChips) {
        if (ch.category === 'meta' && this.tagInfoMap[ch.name]) {
          ch.category = this.tagInfoMap[ch.name].category;
          ch.subcategory = this.tagInfoMap[ch.name].subcategory;
          dirty = true;
        }
      }
      for (const ch of this.negativeChips) {
        if (ch.category === 'meta' && this.tagInfoMap[ch.name]) {
          ch.category = this.tagInfoMap[ch.name].category;
          ch.subcategory = this.tagInfoMap[ch.name].subcategory;
          dirty = true;
        }
      }
      if (dirty) {
        this.positiveChips = this.positiveChips.slice();
        this.negativeChips = this.negativeChips.slice();
      }
    },

    // ─── Custom Main Tags ───

    async loadCustomMainTags() {
      try {
        const res = await fetch('/api/custom-main-tags');
        if (!res.ok) { console.error('loadCustomMainTags status:', res.status); return; }
        this.customMainTags = await res.json();
      } catch (e) {
        console.error('loadCustomMainTags:', e);
        this.customMainTags = [];
      }
    },

    async loadMainTagGroups() {
      try {
        const res = await fetch('/api/main-tag-groups');
        if (!res.ok) { console.error('loadMainTagGroups status:', res.status); return; }
        this.mainTagGroups = await res.json();
      } catch (e) {
        console.error('loadMainTagGroups:', e);
        this.mainTagGroups = [];
      }
    },

    groupsByBlock(blockId) {
      return this.mainTagGroups.filter(g => {
        if (g.block_id !== blockId) return false;
        if (!g.structures || !g.structures.length) return true;
        return g.structures.includes(this.promptStructure);
      });
    },

    groupExists(blockId, name) {
      return this.mainTagGroups.some(g =>
        g.block_id === blockId && g.name === name &&
        (!g.structures || !g.structures.length || g.structures.includes(this.promptStructure))
      );
    },

    tagsWithInactiveGroup(blockId) {
      return this.customMainTags.filter(t => {
        if (t.block_id !== blockId) return false;
        if (!t.subcategory) return false;
        if (!t.structures || !t.structures.length) return true;
        if (!t.structures.includes(this.promptStructure)) return false;
        return !this.groupExists(blockId, t.subcategory);
      });
    },

    openMainGroupAdd(blockId, event) {
      const rect = event.target.getBoundingClientRect();
      this._mainGroupAnchor = { top: rect.bottom + 4, left: rect.left };
      this.mainGroupForm = {
        name: '',
        block_id: blockId,
        structures: PROMPT_STRUCTURES.map(s => s.id)
      };
      this.mainGroupModal = true;
    },

    closeMainGroupModal() {
      this.mainGroupModal = false;
    },

    async saveMainGroup() {
      const name = this.mainGroupForm.name.trim();
      if (!name) return;
      try {
        const res = await fetch('/api/main-tag-groups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            block_id: this.mainGroupForm.block_id,
            name: name,
            structures: this.mainGroupForm.structures
          })
        });
        if (!res.ok) { this.showToast('Save group failed: ' + res.status); return; }
        const group = await res.json();
        this.mainTagGroups.push(group);
        this.closeMainGroupModal();
      } catch (e) {
        console.error('saveMainGroup:', e);
        this.showToast('Save group error: ' + e.message);
      }
    },

    async deleteMainTagGroup(group) {
      if (!confirm(this.t('main.confirm_delete_group').replace('{name}', group.name))) return;
      try {
        const res = await fetch('/api/main-tag-groups?id=' + group.id, { method: 'DELETE' });
        if (!res.ok) { this.showToast('Delete group failed: ' + res.status); return; }
        this.mainTagGroups = this.mainTagGroups.filter(g => g.id !== group.id);
      } catch (e) {
        console.error('deleteMainTagGroup:', e);
        this.showToast('Delete group error: ' + e.message);
      }
    },

    openMainTagAdd(blockId, subcategory, event) {
      const rect = event.target.getBoundingClientRect();
      this._mainTagAnchor = { top: rect.bottom + 4, left: rect.left };
      this._editingMainTagId = null;
      this.mainTagForm = {
        tag_name: '',
        full_text: '',
        block_id: blockId,
        subcategory: subcategory || '',
        structures: PROMPT_STRUCTURES.map(s => s.id)
      };
      this.mainTagModal = true;
    },

    openEditMainTag(item) {
      this._editingMainTagId = item.id;
      this._mainTagAnchor = null;
      this.mainTagForm = {
        tag_name: item.tag_name || '',
        full_text: item.full_text || '',
        block_id: item.block_id,
        subcategory: item.subcategory || '',
        structures: item.structures && item.structures.length ? item.structures.slice() : PROMPT_STRUCTURES.map(s => s.id)
      };
      this.mainTagModal = true;
    },

    closeMainTagModal() {
      this.mainTagModal = false;
      this._editingMainTagId = null;
      this._mainTagAnchor = null;
    },

    async saveMainTag() {
      const name = this.mainTagForm.tag_name.trim();
      if (!name) return;
      try {
        const body = {
          tag_name: name,
          full_text: this.mainTagForm.full_text,
          block_id: this.mainTagForm.block_id,
          subcategory: this.mainTagForm.subcategory,
          structures: this.mainTagForm.structures
        };
        if (this._editingMainTagId) body.id = this._editingMainTagId;
        const res = await fetch('/api/custom-main-tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!res.ok) { this.showToast('Save failed: ' + res.status); return; }
        const updatedStructs = this.mainTagForm.structures;
        if (this._editingMainTagId && updatedStructs.length > 0 && !updatedStructs.includes(this.promptStructure)) {
          this.removeChipsByName(name);
        }
        await this.loadCustomMainTags();
        this.closeMainTagModal();
      } catch (e) {
        console.error('saveMainTag:', e);
        this.showToast('Save error: ' + e.message);
      }
    },

    async deleteMainTag(item) {
      try {
        const res = await fetch('/api/custom-main-tags?id=' + item.id, { method: 'DELETE' });
        if (!res.ok) { this.showToast('Delete failed: ' + res.status); return; }
        this.removeChipsByName(item.tag_name);
        await this.loadCustomMainTags();
      } catch (e) {
        console.error('deleteMainTag:', e);
        this.showToast('Delete error: ' + e.message);
      }
    },

    addCustomMainTag(item) {
      if (item.structures && item.structures.length && !item.structures.includes(this.promptStructure)) return;
      const negBlock = this.currentStructure.negativeBlockId;
      const ch = {
        name: item.tag_name,
        prompt_text: item.full_text || item.tag_name,
        category: 'custom_main',
        subcategory: item.subcategory || '',
        block_id: item.block_id
      };
      this._toggleChip(ch, item.block_id === negBlock ? this.negativeChips : this.positiveChips);
    },

    addCustomMainTagNegative(item) {
      if (item.structures && item.structures.length && !item.structures.includes(this.promptStructure)) return;
      const ch = {
        name: item.tag_name,
        prompt_text: item.full_text || item.tag_name,
        category: 'custom_main',
        subcategory: item.subcategory || '',
        block_id: this.currentStructure.negativeBlockId
      };
      this._toggleChip(ch, this.negativeChips);
    },

    mainTagsByBlock(blockId) {
      return this.customMainTags.filter(t => {
        if (t.block_id !== blockId) return false;
        if (!t.structures || !t.structures.length) return true;
        return t.structures.includes(this.promptStructure);
      });
    },

    mainTagsByBlockAndSubcat(blockId, subcat) {
      if (subcat && !this.groupExists(blockId, subcat)) return [];
      return this.customMainTags.filter(t => {
        if (t.block_id !== blockId) return false;
        if ((t.subcategory || '') !== subcat) return false;
        if (!t.structures || !t.structures.length) return true;
        return t.structures.includes(this.promptStructure);
      });
    },

    // ─── Edit Chip ───

    openEditChip(chip) {
      // Если чип из кастомного тега — открываем Main tag modal (с полным редактированием)
      if (chip.category === 'custom_main') {
        const tag = this.customMainTags.find(t => t.tag_name === chip.name);
        if (tag) {
          this.openEditMainTag(tag);
          return;
        }
      }
      this._editChipRef = chip;
      this.editChipForm = {
        name: chip.name,
        prompt_text: chip.prompt_text || chip.name,
        block_id: chip.block_id || 1
      };
      this.editChipModal = true;
    },

    closeEditChipModal() {
      this.editChipModal = false;
      this._editChipRef = null;
    },

    saveEditChip() {
      if (!this._editChipRef) return;
      const name = this.editChipForm.name.trim();
      if (!name) return;
      this._editChipRef.name = name;
      this._editChipRef.prompt_text = this.editChipForm.prompt_text || name;
      this._editChipRef.block_id = this.editChipForm.block_id;
      this.notifyChipChange();
      this.closeEditChipModal();
    },

    // ─── Save / Manager ───

    openSaveModal() {
      this.saveForm = { name: this.canvasName || '', duplicate: false, showDuplicateCheckbox: false };
      this.saveModal = true;
    },

    closeSaveModal() {
      this.saveModal = false;
    },

    async saveCanvas() {
      const name = this.saveForm.name.trim();
      if (!name) return;
      const chipsData = JSON.stringify({
        positiveChips: this.positiveChips,
        negativeChips: this.negativeChips,
        promptStructure: this.promptStructure,
        blockOrder: this.blockOrder
      });
      try {
        const body = {
          name,
          positive_text: this.positivePrompt,
          negative_text: this.negativePrompt,
          chips_data: chipsData
        };
        const conflict = this.savedPrompts.find(p => p.name === name && p.id !== this.canvasId);
        if (conflict && !this.saveForm.duplicate) {
          body.id = conflict.id;
        } else if (!conflict && this.canvasId) {
          body.id = this.canvasId;
        }
        const res = await fetch('/api/prompts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!res.ok) { this.showToast('Save failed: ' + res.status); return; }
        const saved = await res.json();
        this.canvasName = name;
        this.canvasId = saved.id;
        this.showToast(this.t('canvas.save_success') || 'Saved');
        this.closeSaveModal();
        await this.loadSavedPrompts();
        if (this._pendingStructureId) {
          const id = this._pendingStructureId;
          this._pendingStructureId = null;
          this.promptStructure = id;
        }
      } catch (e) {
        console.error('saveCanvas:', e);
        this.showToast('Save error: ' + e.message);
      }
    },

    newCanvas() {
      this.positiveChips = [];
      this.negativeChips = [];
      this.canvasName = '';
      this.canvasId = null;
      this.promptStructure = 'standard';
      this.blockOrder = null;
      this.updateChipNames();
      this.showToast(this.t('canvas.new_done') || 'New canvas');
    },

    openRenameModal() {
      this.renameForm = { name: this.canvasName || '' };
      this.renameModal = true;
    },

    closeRenameModal() {
      this.renameModal = false;
    },

    async renameCanvas() {
      const name = this.renameForm.name.trim();
      if (!name || !this.canvasId) return;
      try {
        const res = await fetch('/api/prompts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: this.canvasId, name })
        });
        if (!res.ok) { this.showToast('Rename failed: ' + res.status); return; }
        this.canvasName = name;
        this.closeRenameModal();
        await this.loadSavedPrompts();
      } catch (e) {
        console.error('renameCanvas:', e);
        this.showToast('Rename error: ' + e.message);
      }
    },

    openManager() {
      this.managerModal = true;
    },

    closeManager() {
      this.managerModal = false;
    },

    async loadSavedPrompts() {
      try {
        const res = await fetch('/api/prompts');
        if (!res.ok) { console.error('loadSavedPrompts status:', res.status); return; }
        this.savedPrompts = await res.json();
      } catch (e) {
        console.error('loadSavedPrompts:', e);
        this.savedPrompts = [];
      }
    },

    restoreFromSaved(item) {
      if (!item.chips_data) {
        this.showToast('No chip data in this save');
        return;
      }
      try {
        const data = JSON.parse(item.chips_data);
        if (data.positiveChips) this.positiveChips = data.positiveChips;
        if (data.negativeChips) this.negativeChips = data.negativeChips;
        this._ensureChipKeys();
        if (data.promptStructure && PROMPT_STRUCTURES.some(s => s.id === data.promptStructure)) {
          this.promptStructure = data.promptStructure;
        }
        this.blockOrder = data.blockOrder || null;
        this.canvasName = item.name;
        this.canvasId = item.id;
        this.notifyChipChange();
        this.closeManager();
        this.showToast(item.name + ' restored');
      } catch (e) {
        console.error('restoreFromSaved:', e);
        this.showToast('Restore error: ' + e.message);
      }
    },

    async deleteSavedPrompt(item) {
      try {
        const res = await fetch('/api/prompts?id=' + item.id, { method: 'DELETE' });
        if (!res.ok) { this.showToast('Delete failed: ' + res.status); return; }
        if (this.canvasId === item.id) {
          this.canvasName = '';
          this.canvasId = null;
        }
        this.showToast(item.name + ' deleted');
        await this.loadSavedPrompts();
      } catch (e) {
        console.error('deleteSavedPrompt:', e);
        this.showToast('Delete error: ' + e.message);
      }
    },

    // ─── Presets ───

    applyPreset(name) {
      const data = this.presetData[name];
      if (!data) return;
      this.positiveChips.splice(0);
      this.negativeChips.splice(0);

      const structId = this.currentStructure?.id;
      const posParts = this.splitAtBreak(data.positive);
      const posSubs = ['artist', 'general'];
      for (let i = 0; i < posParts.length; i++) {
        const sub = posSubs[i] || 'general';
        for (const n of posParts[i]) {
          if (!this._presetTagFilter(n, structId)) continue;
          let blockId = this.resolveBlockIdByName(n);
          blockId = this._overridePresetBlockId(n, blockId, structId);
          const ch = { name: n, category: 'meta', subcategory: sub, block_id: blockId, _key: this._chipKey() };
          if (!this.positiveChips.some(c => c.name === ch.name)) {
            this.positiveChips.push(ch);
          }
        }
      }

      for (const n of data.negative) {
        const ch = { name: n, category: 'meta', subcategory: 'general', block_id: 9, _key: this._chipKey() };
        if (!this.negativeChips.some(c => c.name === ch.name)) {
          this.negativeChips.push(ch);
        }
      }
      this.enrichChips();
      this.notifyChipChange();
    },

    _presetTagFilter(tagName, structId) {
      const ponyTags = new Set(['score_9', 'score_8_up', 'score_7_up', 'score_6_up', 'score_5_up']);
      if (ponyTags.has(tagName)) {
        return structId === 'novelai' || structId === 'anime';
      }
      return true;
    },

    _overridePresetBlockId(tagName, blockId, structId) {
      const ponyTags = new Set(['score_9', 'score_8_up', 'score_7_up', 'score_6_up', 'score_5_up']);
      if (ponyTags.has(tagName) && (structId === 'novelai' || structId === 'anime')) {
        return 1;
      }
      if (structId === 'midjourney' && blockId >= 7) {
        return 1;
      }
      if (structId === 'flux' && blockId > 6) return 1;
      if (structId === 'dalle3' && blockId > 7) return 1;
      return blockId;
    },

    splitAtBreak(arr) {
      const parts = [[]];
      for (const item of arr) {
        if (item === 'BREAK') {
          parts.push([]);
        } else {
          parts[parts.length - 1].push(item);
        }
      }
      return parts;
    },

    saveGenerationHistory() {
      try {
        localStorage.setItem('generation_history', JSON.stringify(this.generationHistory));
      } catch(_) {}
    },

    loadGenerationHistory() {
      try {
        const raw = localStorage.getItem('generation_history');
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) this.generationHistory = arr;
        }
      } catch(_) {}
    },

    paginatedItems() {
      const start = (this.previewPage - 1) * this.previewPerPage;
      return this.generationHistory.slice(start, start + this.previewPerPage).map((url, i) => ({ url, idx: start + i }));
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.generationHistory.length / this.previewPerPage));
    },

    prevPreviewPage() {
      if (this.previewPage > 1) this.previewPage--;
    },

    nextPreviewPage() {
      if (this.previewPage < this.totalPages()) this.previewPage++;
    },

    // ─── Prompt actions ───

    async copyTagName(name) {
      if (!name) return;
      try {
        await navigator.clipboard.writeText(name);
        this.showToast((this.t('toast.copied') || 'Скопировано') + ': ' + name);
      } catch (e) {
        console.error('copyTagName:', e);
      }
    },

    showToast(text, duration = 1500) {
      this.toastText = text;
      this.toastVisible = true;
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => { this.toastVisible = false; }, duration);
    },

    async copyPrompt(type) {
      if (type !== 'positive' && type !== 'negative') return;
      const text = type === 'positive' ? this.positivePrompt : this.negativePrompt;
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        this.showToast((this.t('toast.copied') || 'Скопировано: ') + text.substring(0, 30) + (text.length > 30 ? '…' : ''));
      } catch (e) {
        console.error('copy:', e);
      }
    },

    autoSavePrompt() {
      if (this._autoSaveTimer) clearTimeout(this._autoSaveTimer);
      this._autoSaveTimer = setTimeout(() => {
        const data = {
          positive_text: this.positivePrompt,
          negative_text: this.negativePrompt
        };
        try {
          localStorage.setItem('autosave_prompt', JSON.stringify(data));
          localStorage.setItem('autosave_chips', JSON.stringify({
            positiveChips: this.positiveChips,
            negativeChips: this.negativeChips,
            blockOrder: this.blockOrder
          }));
        } catch (_) {}
      }, 150);
    },

    loadAutoSave() {
      try {
        const chips = localStorage.getItem('autosave_chips');
        if (chips) {
          const data = JSON.parse(chips);
          if (data.positiveChips?.length || data.negativeChips?.length) {
            this.positiveChips = data.positiveChips || [];
            this.negativeChips = data.negativeChips || [];
            this._ensureChipKeys();
            this.blockOrder = data.blockOrder || null;
            return;
          }
        }
      } catch(_) {}
      try {
        const raw = localStorage.getItem('autosave_prompt');
        if (raw) {
          const data = JSON.parse(raw);
          if (data.positive_text || data.negative_text) {
            const posTags = parsePromptData(data.positive_text || '');
            const negTags = parsePromptData(data.negative_text || '');
            for (const n of posTags) {
              const ch = { name: n, category: 'meta', subcategory: 'autosave', block_id: this.resolveBlockIdByName(n) };
              if (!this.positiveChips.some(c => c.name === n)) {
                this.positiveChips.push(ch);
              }
            }
            for (const n of negTags) {
              const ch = { name: n, category: 'meta', subcategory: 'autosave', block_id: this.resolveBlockIdByName(n) };
              if (!this.negativeChips.some(c => c.name === n)) {
                this.negativeChips.push(ch);
              }
            }
          }
        }
      } catch (_) {}
      if (!localStorage.getItem('first_launch_done')) {
        localStorage.setItem('first_launch_done', '1');
        const data = this.presetData?.['Quality Only'];
        if (data) {
          const structId = this.currentStructure?.id;
          for (const n of data.positive) {
            if (n === 'BREAK') continue;
            if (!this._presetTagFilter(n, structId)) continue;
            let blockId = this.resolveBlockIdByName(n);
            blockId = this._overridePresetBlockId(n, blockId, structId);
            const ch = { name: n, category: 'meta', subcategory: 'quality', block_id: blockId, _key: this._chipKey() };
            if (!this.positiveChips.some(c => c.name === n)) {
              this.positiveChips.push(ch);
            }
          }
          for (const n of data.negative) {
            const ch = { name: n, category: 'meta', subcategory: 'quality', block_id: 9, _key: this._chipKey() };
            if (!this.negativeChips.some(c => c.name === n)) {
              this.negativeChips.push(ch);
            }
          }
          this.enrichChips();
          this.notifyChipChange();
        }
      }
    },

    // ─── ComfyUI ───

    async loadComfyConfig() {
      try {
        const r = await fetch('/api/config');
        if (!r.ok) return;
        const c = await r.json();
        this._config = c;
        this.comfyEnabled = c.comfy_enabled;
        this.resolutions = (c.resolutions || 'Square 1:1#512x512').split('\n').map(s => s.trim()).filter(s => s.length > 0).map(s => {
          const parts = s.split('#');
          return parts.length === 2 ? { name: parts[0], dims: parts[1] } : { name: s, dims: s };
        });
        this.selectedResolution = this.resolutions[0]?.dims || '512x512';
      } catch(_) {}
    },

    async loadWorkflows() {
      try {
        const r = await fetch('/api/comfy/workflows');
        if (!r.ok) return;
        this.workflows = await r.json();
        if (this.workflows.length > 0) this.selectedWorkflow = this.workflows[0].name;
      } catch(e) { console.error('loadWorkflows:', e); }
    },

    async loadCheckpoints() {
      try {
        const r = await fetch('/api/comfy/object_info/CheckpointLoaderSimple');
        if (!r.ok) return;
        const data = await r.json();
        const ckpts = data?.CheckpointLoaderSimple?.input?.required?.ckpt_name?.[0];
        if (ckpts) {
          this.checkpoints = ckpts;
          if (ckpts.length > 0) this.selectedCheckpoint = ckpts[0];
        }
      } catch(e) { console.error('loadCheckpoints:', e); }
    },

    async loadSamplers() {
      try {
        const r = await fetch('/api/comfy/object_info/KSampler');
        if (!r.ok) return;
        const data = await r.json();
        const samplerList = data?.KSampler?.input?.required?.sampler_name?.[0];
        if (samplerList) { this.samplers = samplerList; this.selectedSampler = samplerList[0] || 'euler'; }
        const schedList = data?.KSampler?.input?.required?.scheduler?.[0];
        if (schedList) { this.schedulers = schedList; this.selectedScheduler = schedList[0] || 'normal'; }
      } catch(e) { console.error('loadSamplers:', e); }
    },

    async loadGenerationData() {
      if (this._genDataLoaded) return;
      this._genDataLoaded = true;
      await this.loadWorkflows();
      await this.loadNodeTitles();
      await this.loadCheckpoints();
      await this.loadSamplers();
      this.loadGenSettings();
    },

    async refreshGenerationData() {
      this._genDataLoaded = false;
      await this.loadGenerationData();
    },

    async toggleComfy() {
      if (this._config) {
        this._config.comfy_enabled = this.comfyEnabled;
        try {
          await fetch('/api/config', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this._config)
          });
        } catch(e) { console.error('toggleComfy:', e); }
      }
    },

    async loadNodeTitles() {
      if (!this.selectedWorkflow) return;
      try {
        const r = await fetch('/api/comfy/workflows?name=' + encodeURIComponent(this.selectedWorkflow));
        if (!r.ok) return;
        const data = await r.json();
        this.nodeTitles = {};
        for (const [id, node] of Object.entries(data)) {
          if (node._meta?.title) {
            this.nodeTitles[id] = node._meta.title;
          }
        }
      } catch(_) {}
    },

    async generate() {
      if (this.generating) return;
      if (!this.selectedWorkflow) { this.generationStatus = this.t('comfy.no_workflow'); return; }
      this.saveGenSettings();
      this.generating = true;
      this.generationProgress = 0;
      this.generationStatus = '';
      this.generationResult = null;

      if (!this.seedFixed) {
        this.seed = Math.floor(Math.random() * 2147483647);
      }

      const clientId = crypto.randomUUID();
      const parts = this.selectedResolution.split('x');
      const width = parts[0];
      const height = parts[1];

      const wsUrl = 'ws://' + window.location.host + '/api/comfy/ws?clientId=' + clientId;
      let ws;
      try { ws = new WebSocket(wsUrl); } catch (e) {
        this.generationStatus = this.t('comfy.error') + ': WebSocket ' + e.message;
        this.generating = false;
        return;
      }

      ws.onopen = () => {
        fetch('/api/comfy/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: clientId,
            workflow: this.selectedWorkflow,
            macros: {
              STEPS: String(this.steps),
              CFG: String(this.cfg),
              SAMPLER_NAME: this.selectedSampler,
              SCHEDULER: this.selectedScheduler,
              CKPT: this.selectedCheckpoint,
              SEED: String(this.seed),
              WIDTH: width,
              HEIGHT: height,
              PROMPT_POSITIVE: this.positivePrompt,
              PROMPT_NEGATIVE: this.negativePrompt
            }
          })
        }).then(r => {
          if (!r.ok) {
            r.json().then(d => {
              this.generationStatus = this.t('comfy.error') + ': ' + (d.error || r.status);
              ws.close();
            }).catch(() => {
              this.generationStatus = this.t('comfy.error') + ': ' + r.status;
              ws.close();
            });
          }
        }).catch(e => {
          this.generationStatus = this.t('comfy.error') + ': ' + e.message;
          ws.close();
        });
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'progress') {
            this.generationProgress = (msg.data.value / msg.data.max) * 100;
            this.generationStatus = msg.data.value + '/' + msg.data.max + ' (' + Math.round(this.generationProgress) + '%)';
          } else if (msg.type === 'executed' && msg.data?.output?.images?.length > 0) {
            const img = msg.data.output.images[0];
            const params = new URLSearchParams({
              filename: img.filename,
              subfolder: img.subfolder || '',
              type: img.type || 'output'
            });
            const url = '/api/comfy/image?' + params.toString();
            this.generationResult = url;
            this.generationHistory.unshift(url);
            if (this.generationHistory.length > 1000) this.generationHistory.length = 1000;
            this.saveGenerationHistory();
            this.generationProgress = 100;
            this.generationStatus = this.t('comfy.result') || 'Done';
            fetch('/api/comfy/save-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ filename: img.filename, subfolder: img.subfolder || '', type: img.type || 'output' })
            }).catch(() => {});
          } else if (msg.type === 'execution_error') {
            this.generationStatus = this.t('comfy.error') + ': ' + (msg.data?.exception_message || 'unknown');
            ws.close();
          } else if (msg.type === 'executing' && msg.data?.node === null) {
            ws.close();
          } else if (msg.type === 'executing' && msg.data?.node) {
            const name = this.nodeTitles[msg.data.node] || 'Node ' + msg.data.node;
            this.generationStatus = name + '...';
          }
        } catch(_) {}
      };

      ws.onerror = () => {
        this.generationStatus = this.t('comfy.error') + ': WebSocket';
        this.generating = false;
      };

      ws.onclose = () => {
        this.generating = false;
      };
    },

    // ─── Prompt Structure ───

    get currentStructure() {
      return PROMPT_STRUCTURES.find(s => s.id === this.promptStructure) || PROMPT_STRUCTURES[0];
    },

    get currentStructureBlocks() {
      const s = this.currentStructure;
      if (this.blockOrder) {
        const validIds = new Set(s.blocks.map(b => b.id));
        const ordered = this.blockOrder
          .map(id => s.blocks.find(b => b.id === id))
          .filter(Boolean);
        if (ordered.length === s.blocks.length) return ordered;
      }
      return s.blocks;
    },

    get currentStructureAllBlocks() {
      const s = this.currentStructure;
      return [...s.blocks, { id: s.negativeBlockId, labelKey: 'block.' + s.negativeBlockId, isNegative: true }];
    },

    structureBlockLabel(block) {
      if (this.currentStructure.labelKey === 'structure.standard') {
        return this.t(block.labelKey);
      }
      return this.t(block.labelKey) || block.labelKey;
    },

    switchStructure(newId) {
      if (this.promptStructure === newId) return;
      const hasChanges = this.positiveChips.length > 0 || this.negativeChips.length > 0;
      if (!hasChanges) {
        this.promptStructure = newId;
        return;
      }
      this._pendingStructureId = newId;
      this.showStructureConfirm = true;
    },

    discardAndSwitch() {
      this.showStructureConfirm = false;
      const id = this._pendingStructureId;
      this._pendingStructureId = null;
      this.promptStructure = id;
    },

    saveAndSwitch() {
      this.showStructureConfirm = false;
      this.openSaveModal();
    },

    onStructureChange(oldId, newId) {
      this.blockOrder = null;
      this.positiveChips = [];
      this.negativeChips = [];
      this.notifyChipChange();
    },

    // ─── Computed ───

    get positivePrompt() {
      const s = this.currentStructure;
      const effectBlocks = this.currentStructureBlocks;
      const blocks = effectBlocks.map(b => ({
        id: b.id,
        items: this.positiveByBlock(b.id).map(c => {
          if (c.category === 'group') {
            const children = c._groupChildren || [];
            let parts = children.map(ch => {
              if (ch._category === 'dynamic') {
                let f = '';
                if (ch.from_tag) {
                  if (ch.from_tag._category === 'group') {
                    f = (ch.from_tag._groupChildren || []).map(gc => gc.prompt_text || gc.name).join(' ');
                  } else {
                    f = ch.from_tag.prompt_text || ch.from_tag.name;
                  }
                }
                let t = '';
                if (ch.to_tag) {
                  if (ch.to_tag._category === 'group') {
                    t = (ch.to_tag._groupChildren || []).map(gc => gc.prompt_text || gc.name).join(' ');
                  } else {
                    t = ch.to_tag.prompt_text || ch.to_tag.name;
                  }
                }
                let v = '[' + f + ':' + t + ':' + parseFloat(ch.when || 0.5).toFixed(1) + ']';
                if (ch.weight != null && ch.weight > 0) v = '(' + v + ':' + parseFloat(ch.weight).toFixed(1) + ')';
                return v;
              }
              if (ch._category === 'group') {
                let inner = (ch._groupChildren || []).map(gc => gc.prompt_text || gc.name).join(' ');
                let v = '(' + inner + ')';
                if (ch.weight != null && ch.weight > 0) v = '(' + v + ':' + parseFloat(ch.weight).toFixed(1) + ')';
                return v;
              }
              let val = ch.prompt_text || ch.name;
              if (ch.weight != null && ch.weight > 0) {
                val = '(' + val + ':' + parseFloat(ch.weight).toFixed(1) + ')';
              }
              return val;
            }).join(' ');
            if (c.weight != null && c.weight > 0) parts += ':' + parseFloat(c.weight).toFixed(1);
            return '(' + parts + ')';
          }
          if (c.category === 'dynamic') {
            let from = '';
            if (c.from_tag) {
              if (c.from_tag._category === 'group') {
                let inner = (c.from_tag._groupChildren || []).map(gc => gc.prompt_text || gc.name).join(' ');
                from = inner;
              } else {
                from = c.from_tag.prompt_text || c.from_tag.name;
              }
            }
            let to = '';
            if (c.to_tag) {
              if (c.to_tag._category === 'group') {
                let inner = (c.to_tag._groupChildren || []).map(gc => gc.prompt_text || gc.name).join(' ');
                to = inner;
              } else {
                to = c.to_tag.prompt_text || c.to_tag.name;
              }
            }
            return '[' + from + ':' + to + ':' + parseFloat(c.when).toFixed(1) + ']';
          }
          let val = c.prompt_text || c.name;
          if (c.weight != null && c.weight > 0) val = '(' + val + ':' + parseFloat(c.weight).toFixed(1) + ')';
          return val;
        })
      }));
      return s.renderPositive(blocks, this.t);
    },

    get selectedResolutionText() {
      const r = this.resolutions.find(x => x.dims === this.selectedResolution);
      return r ? r.name + ' - ' + r.dims : this.selectedResolution;
    },

    get negativePrompt() {
      const s = this.currentStructure;
      return s.renderNegative(this.negativeChips, this.t);
    },

    positiveByBlock(blockId) {
      return this.positiveChips.filter(c => (c.block_id || 1) === blockId);
    },

    // ─── Bulk ───

    get isDark() {
      if (this.theme === 'dark') return true;
      if (this.theme === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    },

    async loadAllTreeTags() {
      if (!this.selectedPackId || !this.tree.length) return;
      await Promise.all(this.tree.map(cat =>
          fetch(`/api/tags/tree?pack_id=${this.selectedPackId}&category=${encodeURIComponent(cat.name)}&offset=0&limit=99999`)
            .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
            .then(page => {
              cat._tags = page.tags || [];
              for (const t of cat._tags) {
                this.tagInfoMap[t.tag_name] = { category: cat.name, subcategory: '' };
                this.tagToCategory[t.tag_name] = cat.name;
              }
            })
            .catch(e => console.error('loadTreeTags:', cat.name, e))
        ));
      this.enrichChips();
      this.notifyChipChange();
    },

    async loadAll() {
      await this.loadTree();
      this.assignColors();
      this.loadAutoSave();
      if (this.currentStructure?.id === 'midjourney') {
        const defaults = { 7: '16:9', 8: '250', 9: '6', 10: 'raw' };
        for (const [blockId, val] of Object.entries(defaults)) {
          const bid = parseInt(blockId);
          if (!this.positiveChips.some(c => c.block_id === bid)) {
            this.positiveChips.push({ name: val, category: 'meta', subcategory: '', block_id: bid, _key: this._chipKey() });
          }
        }
      }
      this.enrichChips();
      this.updateChipNames();
      this.loadAllTreeTags();
    },

    get leftStyle() {
      return 'width:' + this.leftRatio + '%';
    },

    // ─── Resizer ───
    resizerStart(e, type) {
      this.resizing = type;
      const self = this;
      const body = document.body;
      body.classList.add(type === 'work' ? 'resizing-y' : 'resizing');
      const move = (e) => {
        if (!self.resizing) return;
        const rect = document.getElementById('layout-body').getBoundingClientRect();
        if (self.resizing === 'left') {
          self.leftRatio = Math.max(20, Math.min(80, Math.round((e.clientX - rect.left) / rect.width * 100)));
        } else if (self.resizing === 'right') {
          self.rightWidth = Math.max(300, Math.min(rect.width * 0.5, rect.right - e.clientX));
        } else if (self.resizing === 'work') {
          const pct = Math.round((e.clientY - rect.top) / rect.height * 100);
          const key = self.comfyEnabled ? 'workComfyRatio' : 'workNoComfyRatio';
          self[key] = Math.max(10, Math.min(90, pct));
        }
      };
      const up = () => {
        self.resizing = null;
        body.classList.remove('resizing', 'resizing-y');
        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', up);
        localStorage.setItem('layout_left', self.leftRatio);
        localStorage.setItem('layout_right', self.rightWidth);
        localStorage.setItem('layout_work_nc', self.workNoComfyRatio);
        localStorage.setItem('layout_work_c', self.workComfyRatio);
      };
      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', up);
      e.preventDefault();
    },

    // ─── Persistence ───
    loadGenSettings() {
      try {
        const d = JSON.parse(localStorage.getItem('gen_settings') || '{}');
        if (d.selectedWorkflow) this.selectedWorkflow = d.selectedWorkflow;
        if (d.selectedCheckpoint) this.selectedCheckpoint = d.selectedCheckpoint;
        if (d.selectedResolution) this.selectedResolution = d.selectedResolution;
        if (d.selectedSampler) this.selectedSampler = d.selectedSampler;
        if (d.selectedScheduler) this.selectedScheduler = d.selectedScheduler;
        if (d.steps) this.steps = d.steps;
        if (d.cfg) this.cfg = d.cfg;
        if (d.seed !== undefined) this.seed = d.seed;
        if (d.seedFixed !== undefined) this.seedFixed = d.seedFixed;
      } catch(_) {}
    },
    saveGenSettings() {
      try {
        localStorage.setItem('gen_settings', JSON.stringify({
          selectedWorkflow: this.selectedWorkflow,
          selectedCheckpoint: this.selectedCheckpoint,
          selectedResolution: this.selectedResolution,
          selectedSampler: this.selectedSampler,
          selectedScheduler: this.selectedScheduler,
          steps: this.steps, cfg: this.cfg,
          seed: this.seed, seedFixed: this.seedFixed
        }));
      } catch(_) {}
    },

    // ─── Viewer ───
    openViewer(index) {
      if (index < 0 || index >= this.generationHistory.length) return;
      this.viewerIndex = index;
      this.viewerImage = this.generationHistory[index];
    },
    closeViewer() {
      this.viewerImage = null;
      this.viewerIndex = -1;
    },
    prevImage() {
      if (!this.viewerImage || this.generationHistory.length < 2) return;
      this.viewerIndex = (this.viewerIndex - 1 + this.generationHistory.length) % this.generationHistory.length;
      this.viewerImage = this.generationHistory[this.viewerIndex];
    },
    nextImage() {
      if (!this.viewerImage || this.generationHistory.length < 2) return;
      this.viewerIndex = (this.viewerIndex + 1) % this.generationHistory.length;
      this.viewerImage = this.generationHistory[this.viewerIndex];
    },

    async _restoreFromUrl(url) {
      if (!url) return;
      const qs = url.split('?')[1];
      if (!qs) return;
      try {
        const r = await fetch('/api/comfy/prompt-info?' + qs);
        if (!r.ok) return;
        const data = await r.json();
        this.restoreFromWorkflow(data.prompt);
      } catch(e) { console.error('restore:', e); }
    },

    async restoreFromGenerationHistory(idx) {
      if (idx < 0 || idx >= this.generationHistory.length) return;
      await this._restoreFromUrl(this.generationHistory[idx]);
    },

    async restoreFromCurrentImage() {
      await this._restoreFromUrl(this.viewerImage);
    },

    async restoreFromWorkflow(wf) {
      this.restoreWarnings = [];
      const makeWarning = (field, value) => {
        if (!this.restoreWarnings.some(w => w.field === field)) {
          this.restoreWarnings.push({ field, value });
        }
      };
      for (const node of Object.values(wf)) {
        if (node.class_type === 'CLIPTextEncode') {
          const text = node.inputs?.text;
          if (!text) continue;
          const title = node._meta?.title || '';
          const chips = (title.toLowerCase().includes('positive') || this.positiveChips.length === 0)
            ? 'positiveChips' : 'negativeChips';
          const arr = this[chips];
          arr.splice(0);
          for (const n of parsePromptData(text)) {
            if (!arr.some(c => c.name === n)) {
              arr.push({ name: n, category: 'meta', subcategory: 'restored', block_id: this.resolveBlockIdByName(n) });
            }
          }
        } else if (node.class_type === 'KSampler') {
          const inp = node.inputs || {};
          if (inp.steps !== undefined) this.steps = inp.steps;
          if (inp.cfg !== undefined) this.cfg = inp.cfg;
          if (inp.seed !== undefined) { this.seed = inp.seed; this.seedFixed = true; }
          if (inp.sampler_name && !this.samplers.includes(inp.sampler_name)) {
            makeWarning('sampler_name', inp.sampler_name);
          }
          if (inp.sampler_name) this.selectedSampler = inp.sampler_name;
          if (inp.scheduler && !this.schedulers.includes(inp.scheduler)) {
            makeWarning('scheduler', inp.scheduler);
          }
          if (inp.scheduler) this.selectedScheduler = inp.scheduler;
        } else if (node.class_type === 'CheckpointLoaderSimple') {
          const ckptName = node.inputs?.ckpt_name;
          if (ckptName) {
            if (!this.checkpoints.includes(ckptName)) {
              makeWarning('checkpoint', ckptName);
            }
            this.selectedCheckpoint = ckptName;
          }
        }
      }
      this.enrichChips();
      this.notifyChipChange();
    },
  };
}

function parsePromptData(text) {
  if (!text) return [];
  return text.split(/BREAK|,\s*/).map(s => s.trim()).filter(s => s.length > 0);
}
