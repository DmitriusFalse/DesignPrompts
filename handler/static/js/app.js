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

const CHIP_COLORS = Array.from({ length: 100 }, (_, i) => {
  const h = (i * 137.508) % 360;
  return `hsl(${h.toFixed(1)}, 55%, 80%)`;
});

const ENGLISH = {
  "app.title": "Design Prompts",
  "tools.special": "Tools:",
  "tooltip.break_btn": "Break",
  "tooltip.grouping_btn": "Group",
  "theme.auto": "Auto",
  "theme.dark": "Dark",
  "theme.light": "Light",
  "settings.title": "Settings",
  "settings.app_settings": "App Settings",
  "settings.port": "Port",
  "settings.tags_path": "Tags Path",
  "settings.db_path": "DB Path",
  "settings.log_level": "Log Level",
  "settings.logs_dir": "Logs Dir",
  "settings.back": "Back",
  "settings.save": "Save",
  "settings.saved": "Settings saved (restart required for some changes)",
  "tag.copy": "Copy",
  "tag.neg": "Negative",
  "workspace.canvas": "Canvas",
  "workspace.positive_prompt": "Positive Prompt",
  "workspace.prompts": "Prompts",
  "prompt.positive": "Positive",
  "prompt.negative": "Negative",
  "prompt.copy": "📋",
  "actions.clear_tags": "Clear",
  "modal.loading.title": "Loading tags...",
  "toast.copied": "Copied",
  "block.1": "Subject",
  "block.2": "Action, Pose & Expression",
  "block.3": "Environment & Background",
  "block.4": "Lighting",
  "block.5": "Style & Medium",
  "block.6": "Camera, Angle & Composition",
  "block.7": "Color Palette & Mood",
  "block.8": "Quality Boosters",
  "block.9": "Negative Prompt",
  "block.10": "Negative Prompt",
  "comfy.enable": "Enable ComfyUI Generation",
  "comfy.address": "ComfyUI Address",
  "comfy.save_path": "Save Path",
  "comfy.resolutions": "Resolutions (one per line)",
  "comfy.resolutions_hint": "Format: Name#WIDTHxHEIGHT, e.g. Square#512x512",
  "comfy.workflow": "Workflow",
  "comfy.checkpoint": "Model (CKPT)",
  "comfy.steps": "Steps (STEPS)",
  "comfy.cfg": "CFG",
  "comfy.sampler": "Sampler",
  "comfy.scheduler": "Scheduler",
  "comfy.resolution": "Resolution",
  "comfy.generate": "Generate",
  "comfy.generating": "Generating...",
  "comfy.error": "Error",
  "comfy.no_workflow": "No workflows",
  "comfy.result": "Result",
  "comfy.seed": "Seed",
  "comfy.seed_fix": "Fixed Seed",
  "comfy.group_main": "Main",
  "comfy.group_extra": "Extra",
  "comfy.restore_history": "Restore History",
  "comfy.restore_history_hint": "Scans the save folder for PNGs with generation metadata",
  "comfy.restore_history_btn": "Scan",
  "comfy.restoring": "Scanning...",
  "comfy.restore_history_done": "Added {n} images",
  "comfy.restore_history_empty": "No PNGs with metadata found",
  "preview.title": "Past Generations",
  "preview.placeholder": "Click Generate",
  "preview.viewer.close": "Close",
  "main.add_tag": "+Tag",
  "main.modal_title": "Add Tag",
  "main.edit_title": "Edit Tag",
  "main.tag_name": "Tag Name",
  "main.full_text": "Full Text (optional)",
  "main.category": "Category",
  "main.subcategory": "Subcategory",
  "main.group_empty": "— Empty —",
  "main.add_group": "+Group",
  "main.add_group_title": "Add Group",
  "main.group_name": "Group Name",
  "main.confirm_delete_group": "Delete group \"{name}\"? Tags will remain without a group.",
  "main.save": "Save",
  "main.cancel": "Cancel",
  "main.delete": "Delete",
  "main.edit": "Edit",
  "tooltip.new_canvas": "Create a new empty canvas",
  "tooltip.save_canvas": "Save current canvas",
  "tooltip.rename_canvas": "Rename canvas",
  "tooltip.break_title": "BREAK Separator",
  "tooltip.break_desc": "Drag onto the canvas between tags. Tags before BREAK form one block, after — another.",
  "tooltip.grouping_title": "Tag Grouping",
  "tooltip.grouping_desc": "Drag onto canvas, then drop tags inside. Wraps tags in parentheses: (tag1 tag2 ...)",
  "tooltip.dynamic_btn": "Dynamic Prompt",
  "tooltip.dynamic_title": "Dynamic Prompt",
  "tooltip.dynamic_desc": "Drag onto canvas. Drop tags into from/to slots. [from:to:when] — switch tag at when (0.0-1.0).",
  "dynamic.from": "from",
  "tooltip.manager": "Manage saved canvases",
  "tooltip.theme": "Change theme",
  "tooltip.lang": "Switch language",
  "tooltip.settings": "App settings",
  "tooltip.comfy": "Enable ComfyUI generation",
  "tooltip.clear_pos": "Clear all tags from positive prompt",
  "tooltip.clear_neg": "Clear all tags from negative prompt",
  "tooltip.prompts_toggle": "Expand/collapse prompt editor",
  "tooltip.copy_pos": "Copy positive prompt",
  "tooltip.copy_neg": "Copy negative prompt",
  "tooltip.generate": "Run generation",
  "tooltip.comfy_refresh": "Refresh generation data",
  "tooltip.main_add_tag": "Add a custom tag to this category",
  "tooltip.main_add_group": "Create a tag group in this category",
  "tooltip.install": "Install app",
  "tooltip.sidebar_main": "Main — custom tags",
  "tooltip.edit_chip": "Edit tag",
  "tooltip.weight": "Chip weight",
  "tooltip.restore": "Restore prompt from this image",
  "tooltip.log_level": "Log level: debug for verbose output",
  "tooltip.structure": "Switch prompt structure",
  "tooltip.save_as": "Save canvas as new",
  "canvas.save_title": "Save",
  "canvas.save_name": "Name",
  "canvas.save": "Save",
  "canvas.save_as": "Save As",
  "canvas.cancel": "Cancel",
  "canvas.save_success": "Saved",
  "canvas.manager": "Canvases",
  "canvas.manager_title": "Canvases",
  "canvas.empty": "No saved canvases",
  "canvas.rename_title": "Rename Canvas",
  "canvas.rename": "Rename",
  "canvas.new_title": "New Canvas",
  "canvas.new_done": "New canvas created",
  "canvas.copied": "Prompt copied",
  "canvas.select_prompt": "Select a canvas from the list",
  "chip.edit_title": "Edit Tag",
  "chip.tag_name": "Tag Name",
  "chip.full_text": "Full Text",
  "chip.category": "Group",
  "chip.save": "Save",
  "chip.cancel": "Cancel",
  "donate.title": "This simple app was made just for fun. Want to support the author? Toss a coin on Boosty",
  "donate.short1": "Toss a coin",
  "donate.short2": "on Boosty",
};

function app() {
  return {
    pwaInstallable: false,
    _pwaDeferredPrompt: null,

    // Theme: 'dark' or 'light' (init follows OS preference)
    theme: (() => {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    })(),

    translations: ENGLISH,

    t(key) {
      return this.translations[key] || key;
    },


    // Toast
    toastText: '',
    toastVisible: false,
    toastTimer: null,

    // Fast lookup sets (rebuilt on chip mutations)
    posNames: {},
    negNames: {},
    _autoSaveTimer: null,

    // Addons
    addons: [],
    selectedAddonName: '',
    addonTreeOpen: {},
    _addonLoading: null,
    _virtualAddons: {},

    userTemplates: [],

    // Template editor form
    templateEditForm: { id: 0, name: '', separator: ', ', enabled: true, categories: [] },
    templateEditCategoryEditIdx: -1,
    treeModal: false,
    treeModalProgress: 0,

    get currentAddon() {
      return this.addons.find(a => a.info.name === this.selectedAddonName) ||
             (this._virtualAddons && this._virtualAddons[this.selectedAddonName]) || null;
    },

    get sidebarAddon() {
      return this.addons.find(a => a.info.name === this.sidebarAddonName) || null;
    },

    get sortedAddons() {
      return [...this.addons].sort((a, b) => {
        const da = this.isAddonDisabled(a.info.name) ? 1 : 0;
        const db = this.isAddonDisabled(b.info.name) ? 1 : 0;
        return da - db;
      });
    },

    disabledAddonNames: new Set(),

    isAddonDisabled(name) {
      return this.disabledAddonNames.has(name);
    },

    toggleAddonDisabled(name) {
      if (this.disabledAddonNames.has(name)) {
        this.disabledAddonNames.delete(name);
      } else {
        this.disabledAddonNames.add(name);
      }
      localStorage.setItem('addon_disabled', JSON.stringify([...this.disabledAddonNames]));
    },

    addonType(name) {
      const a = this.addons.find(a => a.info.name === name);
      return a?.info?.type || 'any';
    },

    loadDisabledAddons() {
      try {
        const raw = localStorage.getItem('addon_disabled');
        if (raw) {
          const arr = JSON.parse(raw);
          this.disabledAddonNames = new Set(arr);
        }
      } catch(e) {
        this.disabledAddonNames = new Set();
      }
    },

    // Sidebar
    sideOpen: false,
    activePanel: '',
    activeAddonName: '',
    sidebarAddonName: '',
    sidebarTab: 'main',
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
    promptStructure: null,
    blockOrder: null,
    blockDragState: null,
    blockDropTarget: null,

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

    // Save canvas
    canvasName: '',
    canvasId: null,
    saveModal: false,
    saveForm: { name: '', mode: 'save' },
    renameModal: false,
    renameForm: { name: '' },

    // Manager prompts
    managerModal: false,
    savedPrompts: [],
    selectedPrompt: null,
    selectedGenParams: null,
    searchQuery: '',
    canvasGenData: '',

    // Template editor
    templateEditorOpen: false,

    // Preview panel
    previewTab: 'images',
    restoreWarnings: [],

    // ─── Init ───

    async init() {
      this.loadDisabledAddons();
      await this.loadAddons();
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

    // ─── Addons ───

    async loadAddons() {
      try {
        const res = await fetch('/api/addons');
        if (!res.ok) { console.error('loadAddons status:', res.status); return; }
        this.addons = await res.json();
        if (this.addons.length > 0 && !this.selectedAddonName) {
          this.selectedAddonName = this.addons[0].info.name;
          this.loadAll();
        }
      } catch (e) {
        console.error('loadAddons:', e);
      }
    },

    // ─── Addon tree helpers ───

    toggleAddonCategory(catName) {
      this.addonTreeOpen[catName] = !this.addonTreeOpen[catName];
    },

    addonCatsByBlock(blockId) {
      const a = this.currentAddon;
      if (!a?.info?.categories) return [];
      return a.info.categories.filter(c => c.block_id === blockId);
    },

    addonTagsForCategory(catName) {
      const a = this.currentAddon;
      if (!a?.tagFiles) return [];
      const groups = a.tagFiles[catName] || [];
      return groups.flatMap(g => g.tags || []);
    },

    addonTagGroups(catName) {
      const a = this.sidebarAddon;
      if (!a?.tagFiles) return [];
      return (a.tagFiles[catName] || []).filter(g => g.tags?.length > 0);
    },

    fileGroupOpen: {},

    toggleFileGroup(catName, fileName) {
      const key = catName + '|' + fileName;
      this.fileGroupOpen[key] = !this.fileGroupOpen[key];
    },

    tAddonCat(catName) {
      // for future translation of addon category names
      return catName;
    },

    // ─── Chips ───

    resolveBlockId(category, subcategory) {
      const s = this.currentStructure;
      const block = s?.blocks?.find(b => b.customLabel === category);
      return block?.id || 1;
    },

    resolveBlockIdByName(tagName) {
      return 1;
    },

    _chipKey() {
      return 'ch-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
    },
    makeChip(tag) {
      const category = tag.category_name || '';
      const subcategory = tag.subcategory_name || '';
      const block_id = this.resolveBlockId(category, subcategory);
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
      if (window._dndDebug) console.log('DnD:onDragStart', ch?.name, ch?._key);
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
      document.querySelectorAll('.drag-over, .drop-before, .drop-after, .drop-above, .drop-below')
        .forEach(el => el.classList.remove('drag-over', 'drop-before', 'drop-after', 'drop-above', 'drop-below'));
    },

    onDragEnd(ev) {
      if (window._dndDebug) console.log('DnD:onDragEnd');
      ev.currentTarget.classList.remove('chip-dragging');
      this._clearDropVisuals();
      this.dragState = null;
      this.dropTarget = null;
    },

    onTagDragStart(ev, tagData) {
      if (window._dndDebug) console.log('DnD:onTagDragStart', tagData?.tag_name || tagData?.name);
      const key = 'tag-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
      ev.dataTransfer.effectAllowed = 'copy';
      ev.dataTransfer.setData('text/plain', key);
      this.dragState = { key, name: tagData.tag_name || tagData.name, tagData, isTagSource: true, isBreakSource: false, isGroupSource: false, isDynamicSource: false, isGroupChildDrag: false, isDynamicChildDrag: false };
    },

    onDragOver(ev) {
      if (this.blockDragState) return;
      ev.preventDefault();
      ev.dataTransfer.dropEffect = this.dragState?.isTagSource ? 'copy' : 'move';
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
      // Compute new drop target with 2D quadrant logic
      let newInsertBeforeKey = null, newInsertAfterKey = null, newDir = '';
      if (closestEl) {
        const r = closestEl.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = ev.clientX - cx;
        const dy = ev.clientY - cy;
        if (Math.abs(dy) > Math.abs(dx)) {
          // Vertical dominant — insert above/below
          newDir = dy < 0 ? 'above' : 'below';
          if (dy < 0) {
            newInsertBeforeKey = closestEl.dataset.chipKey;
          } else {
            newInsertAfterKey = closestEl.dataset.chipKey;
          }
        } else {
          // Horizontal dominant — insert left/right
          newDir = dx < 0 ? 'left' : 'right';
          if (dx < 0) {
            newInsertBeforeKey = closestEl.dataset.chipKey;
          } else {
            newInsertAfterKey = closestEl.dataset.chipKey;
          }
        }
      }
      // Update visual if changed
      const prev = this.dropTarget;
      if (!prev || prev.before !== newInsertBeforeKey || prev.after !== newInsertAfterKey || prev.dir !== newDir) {
        // Clear old visuals on all chips
        blockEl.querySelectorAll('.drop-before, .drop-after, .drop-above, .drop-below')
          .forEach(el => el.classList.remove('drop-before', 'drop-after', 'drop-above', 'drop-below'));
        // Apply new visual
        if (newInsertBeforeKey) {
          const el = blockEl.querySelector(`[data-chip-key="${CSS.escape(newInsertBeforeKey)}"]`);
          if (el) el.classList.add(newDir === 'above' ? 'drop-above' : 'drop-before');
        }
        if (newInsertAfterKey) {
          const el = blockEl.querySelector(`[data-chip-key="${CSS.escape(newInsertAfterKey)}"]`);
          if (el) el.classList.add(newDir === 'below' ? 'drop-below' : 'drop-after');
        }
        this.dropTarget = { before: newInsertBeforeKey, after: newInsertAfterKey, dir: newDir };
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
      if (window._dndDebug) console.log('DnD:onDrop', targetType, this.dragState?.key, this.dragState?.name);
      if (this.blockDragState) return;
      ev.preventDefault();
      this._clearDropVisuals();
      this._ignoreNextClick = true;
      const key = this.dragState?.key;
      if (!key) return;
      const name = this.dragState?.name;
      const allChips = [...this.positiveChips, ...this.negativeChips];
      let chip = allChips.find(c => c._key === key);
      const raw = parseInt(ev.currentTarget.closest('[data-block-id]')?.dataset.blockId);
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

      const isNewChip = !chip || ds.isBreakSource || ds.isGroupSource || ds.isDynamicSource || ds.isTagSource;
      if (isNewChip) {
        if (name === 'BREAK') {
          chip = { name: 'BREAK', prompt_text: 'BREAK', category: 'meta', subcategory: '', block_id: 1, _key: 'brk-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6) };
        } else if (name === 'GROUP') {
          chip = { _key: 'grp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), name: 'group', category: 'group', prompt_text: null, subcategory: '', block_id: targetBlockId, _groupChildren: [], weight: null };
        } else if (name === 'DYNAMIC') {
          chip = { _key: 'dyn-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), name: 'dynamic', category: 'dynamic', block_id: targetBlockId, from_tag: null, to_tag: null, when: 0.5, weight: null };
        } else if (ds.isTagSource && ds.tagData) {
          if (ds.tagData.full_text !== undefined) {
            chip = { _key: this._chipKey(), name: ds.tagData.tag_name, prompt_text: ds.tagData.full_text || ds.tagData.tag_name, category: 'custom_main', subcategory: ds.tagData.subcategory || '', block_id: targetBlockId, weight: null };
          } else {
            chip = this.makeChip(ds.tagData);
            chip._key = this._chipKey();
            chip.block_id = targetBlockId;
          }
          const tgtArr = targetType === 'positive' ? this.positiveChips : this.negativeChips;
          if (tgtArr.find(c => c.name === chip.name)) { this.dragState = null; this.dropTarget = null; return; }
          tgtArr.push(chip);
          this.dragState = null;
          this.dropTarget = null;
          this.notifyChipChange();
          return;
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
        // If it's a chip/tag drag (not a block), delegate to onDrop
        if (this.dragState && !this.blockDragState) {
          this.onDrop(ev, 'positive');
          return;
        }
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

    togglePanel(panel, addonName) {
      if (this.activePanel === panel && this.activeAddonName === (addonName ?? '')) {
        this.sideOpen = !this.sideOpen;
        return;
      }
      this.activePanel = panel;
      this.activeAddonName = addonName ?? '';
      this.sideOpen = true;
      if (panel === 'main') {
        this.sidebarTab = 'main';
      } else if (panel === 'addon') {
        this.sidebarTab = 'addon';
        this.sidebarAddonName = addonName;
      }
    },

    selectedClass(tagName) {
      if (this.posNames[tagName]) return 'selected-pos';
      if (this.negNames[tagName]) return 'selected-neg';
      return '';
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

    getColorForChip(chip) {
      const blocks = this.currentStructureAllBlocks;
      const idx = blocks.findIndex(b => b.id === chip.block_id);
      if (idx === -1) return null;
      return CHIP_COLORS[idx % CHIP_COLORS.length];
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

    _tagVisibleForCurrent(structures) {
      if (!structures || !structures.length) return true;
      if (structures.includes(this.promptStructure)) return true;
      if (!/^\d+$/.test(this.promptStructure)) return true;
      return false;
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
        return this._tagVisibleForCurrent(g.structures);
      });
    },

    groupExists(blockId, name) {
      return this.mainTagGroups.some(g =>
        g.block_id === blockId && g.name === name &&
        (!g.structures || !g.structures.length || this._tagVisibleForCurrent(g.structures))
      );
    },

    tagsWithInactiveGroup(blockId) {
      return this.customMainTags.filter(t => {
        if (t.block_id !== blockId) return false;
        if (!t.subcategory) return false;
        if (!this._tagVisibleForCurrent(t.structures)) return false;
        return !this.groupExists(blockId, t.subcategory);
      });
    },

    openMainGroupAdd(blockId, event) {
      const rect = event.target.getBoundingClientRect();
      this._mainGroupAnchor = { top: rect.bottom + 4, left: rect.left };
      this.mainGroupForm = {
        name: '',
        block_id: blockId,
        structures: []
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
        structures: []
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
        structures: item.structures?.slice() || []
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
        if (this._editingMainTagId && updatedStructs.length > 0 && !this._tagVisibleForCurrent(updatedStructs)) {
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
      if (!this._tagVisibleForCurrent(item.structures)) return;
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
      if (!this._tagVisibleForCurrent(item.structures)) return;
      const ch = {
        name: item.tag_name,
        prompt_text: item.full_text || item.tag_name,
        category: 'custom_main',
        subcategory: item.subcategory || '',
        block_id: this.currentStructure.negativeBlockId
      };
      this._toggleChip(ch, this.negativeChips);
    },

    mainTagsByBlockAndSubcat(blockId, subcat) {
      if (subcat && !this.groupExists(blockId, subcat)) return [];
      return this.customMainTags.filter(t => {
        if (t.block_id !== blockId) return false;
        if ((t.subcategory || '') !== subcat) return false;
        return this._tagVisibleForCurrent(t.structures);
      });
    },

    // ─── Edit Chip ───

    openEditChip(chip) {
      // If chip is a custom tag — open Main tag modal (full editing)
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

    openSaveModal(mode) {
      this.saveForm = { name: this.canvasName || '', mode: mode || 'save' };
      this.saveModal = true;
    },

    openSaveAsModal() {
      this.saveForm = { name: this.canvasName || '', mode: 'saveAs' };
      this.saveModal = true;
    },

    handleSave() {
      if (this.canvasId) {
        this.saveForm = { name: this.canvasName, mode: 'save' };
        this.saveCanvas();
      } else {
        this.openSaveModal('save');
      }
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
        aiTypeId: null,
        templateName: this.currentAddon?.info?.name || '',
        templateSnapshot: JSON.stringify(this.currentAddon?.info?.categories || []),
        blockOrder: this.blockOrder
      });
      try {
        const body = {
          name,
          positive_text: this.positivePrompt,
          negative_text: this.negativePrompt,
          chips_data: chipsData,
          gen_data: this.canvasGenData || ''
        };
        if (this.saveForm.mode !== 'saveAs' && this.canvasId) {
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
      this.selectedPrompt = null;
      this.managerModal = true;
    },

    selectPrompt(item) {
      this.selectedPrompt = item;
      this.selectedGenParams = null;
      if (item.gen_data) this.loadGenParams(item);
    },

    async loadGenParams(item) {
      if (!item.gen_data) return;
      const parts = item.gen_data.split(/[\\/]/);
      const filename = parts[parts.length - 1];
      if (!filename) return;
      try {
        const r = await fetch('/api/comfy/prompt-info?filename=' + encodeURIComponent(filename));
        if (!r.ok) return;
        const data = await r.json();
        this.selectedGenParams = this._extractGenParams(data.prompt);
      } catch(e) {
        console.error('loadGenParams:', e);
      }
    },

    _extractGenParams(wf) {
      const p = {};
      for (const node of Object.values(wf)) {
        if (node.class_type === 'KSampler') {
          const inp = node.inputs || {};
          if (inp.steps !== undefined) p.steps = inp.steps;
          if (inp.cfg !== undefined) p.cfg = inp.cfg;
          if (inp.seed !== undefined) p.seed = inp.seed;
          if (inp.sampler_name) p.sampler = inp.sampler_name;
          if (inp.scheduler) p.scheduler = inp.scheduler;
        } else if (node.class_type === 'CheckpointLoaderSimple') {
          if (node.inputs?.ckpt_name) p.model = node.inputs.ckpt_name;
        } else if (node.class_type === 'EmptyLatentImage') {
          if (node.inputs?.width && node.inputs?.height)
            p.resolution = node.inputs.width + '×' + node.inputs.height;
        }
      }
      return Object.keys(p).length ? p : null;
    },

    formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr.replace(' ', 'T'));
      if (isNaN(d.getTime())) return dateStr;
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yy = d.getFullYear();
      const hh = String(d.getHours()).padStart(2, '0');
      const mi = String(d.getMinutes()).padStart(2, '0');
      return dd + '.' + mm + '.' + yy + ' ' + hh + ':' + mi;
    },

    get selectedImageSrc() {
      if (!this.selectedPrompt?.gen_data) return null;
      const parts = this.selectedPrompt.gen_data.split(/[\\/]/);
      const filename = parts[parts.length - 1];
      if (!filename) return null;
      return '/api/comfy/image?filename=' + encodeURIComponent(filename);
    },

    get filteredSavedPrompts() {
      if (!this.searchQuery) return this.savedPrompts;
      const q = this.searchQuery.toLowerCase();
      return this.savedPrompts.filter(p => p.name.toLowerCase().includes(q));
    },

    deleteSelectedPrompt() {
      if (!this.selectedPrompt) return;
      this.deleteSavedPrompt(this.selectedPrompt);
      this.selectedPrompt = null;
      this.selectedGenParams = null;
    },

    get allTemplates() {
      const addonItems = this.addons
        .filter(a => this.addonType(a.info.name) !== 'menu')
        .map(a => ({ type: 'addon', id: a.info.name, name: a.info.name, disabled: false }));
      const userItems = (this.userTemplates || [])
        .filter(t => !this.addons.some(a => a.info.name === t.name))
        .map(t => ({ type: 'user', id: t.name, name: t.name, disabled: !t.enabled }));
      const all = [...addonItems, ...userItems];
      all.sort((a, b) => (a.disabled ? 1 : 0) - (b.disabled ? 1 : 0));
      return all;
    },

    isCurrentTemplate(t) {
      return this.currentAddon?.info.name === t.id;
    },

    selectTemplate(item) {
      if (this.currentAddon?.info.name === item.id) return;
      this._virtualAddons = {};
      this.selectedAddonName = item.id;
      this.promptStructure = item.id;
      this.blockOrder = null;
      this.positiveChips = [];
      this.negativeChips = [];
      this.notifyChipChange();
    },

    // ─── Template editor (v2) ───

    selectedEditName: null,
    selectedEditIsUser: false,

    async openTemplateEditor() {
      this.templateEditForm = { id: 0, name: '', separator: ', ', enabled: true, categories: [] };
      this.selectedEditName = null;
      this.selectedEditIsUser = false;
      this.templateEditCategoryEditIdx = -1;
      this.userTemplates = [];
      this.templateEditorOpen = true;
    },

    selectEditTemplate(name, isUser) {
      this.selectedEditName = name;
      this.selectedEditIsUser = isUser;
      this.templateEditCategoryEditIdx = -1;
      if (isUser) {
        const tpl = (this.userTemplates || []).find(t => t.name === name);
        if (tpl) {
          let cats;
          try { cats = JSON.parse(tpl.categories || '[]'); } catch(e) { cats = []; }
          this.templateEditForm = {
            id: tpl.id,
            name: tpl.name,
            separator: tpl.separator || ', ',
            enabled: tpl.enabled,
            categories: cats.map((c, i) => ({
              name: c.name || c.category || '',
              tags: c.tags || '',
              order: c.order ?? i
            }))
          };
        }
      } else {
        this.templateEditForm = { id: 0, name: '', separator: ', ', enabled: true, categories: [] };
      }
    },

    newUserTemplate() {
      this.selectedEditIsUser = true;
      this.templateEditCategoryEditIdx = -1;
      const tpl = (this.userTemplates || []).find(t => t.name === this.currentAddon?.info?.name);
      if (tpl) {
        this.selectedEditName = tpl.name;
        let cats;
        try { cats = JSON.parse(tpl.categories || '[]'); } catch(e) { cats = []; }
        this.templateEditForm = {
          id: tpl.id,
          name: tpl.name,
          separator: tpl.separator || ', ',
          enabled: tpl.enabled,
          categories: cats.map((c, i) => ({
            name: c.name || c.category || '',
            tags: c.tags || '',
            order: c.order ?? i
          }))
        };
      } else {
        this.selectedEditName = null;
        this.templateEditForm = { id: 0, name: '', separator: ', ', enabled: true, categories: [] };
      }
    },

    addTemplateCategory() {
      this.templateEditForm.categories.push({ name: '', tags: '', order: this.templateEditForm.categories.length });
      this.templateEditCategoryEditIdx = this.templateEditForm.categories.length - 1;
    },

    removeTemplateCategory(idx) {
      this.templateEditForm.categories.splice(idx, 1);
      if (this.templateEditCategoryEditIdx === idx) this.templateEditCategoryEditIdx = -1;
      if (this.templateEditCategoryEditIdx > idx) this.templateEditCategoryEditIdx--;
    },

    moveTemplateCategory(idx, dir) {
      const cats = this.templateEditForm.categories;
      const target = idx + dir;
      if (target < 0 || target >= cats.length) return;
      [cats[idx], cats[target]] = [cats[target], cats[idx]];
      cats.forEach((c, i) => c.order = i);
    },

    get templatePreview() {
      const cats = this.templateEditForm?.categories || [];
      if (!cats.length) return '';
      const sep = this.templateEditForm.separator || ', ';
      return cats.map(c => c.tags || '[' + c.name + ']').join(sep);
    },

    // ─── Download / copy manager prompt ───

    async copyManagerPrompt() {
      const text = this.selectedPrompt?.positive_text;
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        this.showToast(this.t('canvas.copied') || 'Prompt copied');
      } catch (e) {
        console.error('copy manager prompt:', e);
      }
    },

    openSelectedPrompt() {
      if (!this.selectedPrompt) return;
      this.restoreFromSaved(this.selectedPrompt);
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
        this.blockOrder = data.blockOrder || null;
        this.canvasName = item.name;
        this.canvasId = item.id;
        // Restore template - try addon first, then fallback to snapshot
        if (data.templateName && this.addons.find(a => a.info.name === data.templateName)) {
          this.selectedAddonName = data.templateName;
          this.promptStructure = data.templateName;
        } else if (data.templateName && data.templateSnapshot) {
          // Template/addon no longer exists, use snapshot
          this.selectedAddonName = data.templateName;
          // Create a temporary addon-like object from snapshot
          let snapCats;
          try { snapCats = JSON.parse(data.templateSnapshot); } catch(e) { snapCats = []; }
          if (!this.addons.find(a => a.info.name === data.templateName)) {
            // Inject a virtual addon
            this.addons.push({
              info: { name: data.templateName, categories: snapCats, icon: '📦' },
              tagFiles: {}
            });
          }
        }
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
        this.showToast((this.t('toast.copied') || 'Copied') + ': ' + name);
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

    openExternal(url) {
      fetch('/api/open-url?url=' + encodeURIComponent(url));
    },

    async copyPrompt(type) {
      if (type !== 'positive' && type !== 'negative') return;
      const text = type === 'positive' ? this.positivePrompt : this.negativePrompt;
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        this.showToast((this.t('toast.copied') || 'Copied: ') + text.substring(0, 30) + (text.length > 30 ? '…' : ''));
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
            this.canvasGenData = url;
            if (this.canvasId) {
              const gdBody = {
                id: this.canvasId,
                name: this.canvasName,
                positive_text: this.positivePrompt,
                negative_text: this.negativePrompt,
                chips_data: JSON.stringify({
                  positiveChips: this.positiveChips,
                  negativeChips: this.negativeChips,
                  aiTypeId: this.currentAddon?.info?.name ?? '',
                  blockOrder: this.blockOrder
                }),
                gen_data: url
              };
              fetch('/api/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gdBody)
              }).catch(() => {});
            }
            this.generationHistory.unshift(url);
            if (this.generationHistory.length > 1000) this.generationHistory.length = 1000;
            this.saveGenerationHistory();
            this.generationProgress = 100;
            this.generationStatus = this.t('comfy.result') || 'Done';
            fetch('/api/comfy/save-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ filename: img.filename, subfolder: img.subfolder || '', type: img.type || 'output' })
            }).then(r => r.json()).then(data => {
              if (data.path) {
                this.canvasGenData = data.path;
                if (this.canvasId) {
                  fetch('/api/prompts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: this.canvasId,
                      name: this.canvasName,
                      positive_text: this.positivePrompt,
                      negative_text: this.negativePrompt,
                      chips_data: JSON.stringify({
                        positiveChips: this.positiveChips,
                        negativeChips: this.negativeChips,
                        aiTypeId: this.currentAddon?.info?.name ?? '',
                        blockOrder: this.blockOrder
                      }),
                      gen_data: data.path
                    })
                  }).catch(() => {});
                }
              }
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

    _buildStructureFromAddon(a) {
      if (!a) return null;
      const cats = a.info?.categories || [];
      return {
        id: a.info.name,
        negativeBlockId: cats.length + 1,
        blocks: cats.map((c, i) => ({ id: i + 1, customLabel: c.category })),
        renderPositive(blocks, t) {
          return blocks.filter(b => b.items.length > 0).map(b => b.items.join(', ')).join(', ');
        },
        renderNegative(chips, t) {
          return chips.map(ch => ch.prompt_text || ch.name).join(', ');
        }
      };
    },

    get currentStructure() {
      const a = this.currentAddon;
      if (a) return this._buildStructureFromAddon(a);
      // Fallback if no addon is selected
      return { id: 0, negativeBlockId: 1, blocks: [{ id: 1, customLabel: 'Prompt' }], renderPositive(blocks) { return ''; }, renderNegative() { return ''; } };
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
      return [...s.blocks, { id: s.negativeBlockId, customLabel: 'Negative', isNegative: true }];
    },

    structureBlockLabel(block) {
      return block.customLabel || '';
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

    async loadAll() {
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
      this.updateChipNames();
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
      this.notifyChipChange();
    },
  };
}

function parsePromptData(text) {
  if (!text) return [];
  return text.split(/BREAK|,\s*/).map(s => s.trim()).filter(s => s.length > 0);
}
