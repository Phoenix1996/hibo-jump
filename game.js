(function () {
  "use strict";

  // Pattern IDs remain stable across themes, so theme swaps never alter board state.
  const THEMES = {
    ocean: {
      id: "ocean",
      name: "海洋主题",
      patterns: [
        { id: "p1", name: "贝壳", glyph: "🐚", color: "#e5a769" },
        { id: "p2", name: "小鱼", glyph: "🐟", color: "#5aa7cd" },
        { id: "p3", name: "螃蟹", glyph: "🦀", color: "#e88373" },
        { id: "p4", name: "水母", glyph: "🪼", color: "#a184d0" },
        { id: "p5", name: "海星", glyph: "⭐", color: "#e6b84f" },
        { id: "p6", name: "海龟", glyph: "🐢", color: "#61aa83" },
        { id: "p7", name: "海豚", glyph: "🐬", color: "#62a9d4" }
      ]
    },
    fruit: {
      id: "fruit",
      name: "水果主题",
      patterns: [
        { id: "p1", name: "草莓", glyph: "🍓", color: "#e47a83" },
        { id: "p2", name: "柠檬", glyph: "🍋", color: "#d8b63f" },
        { id: "p3", name: "葡萄", glyph: "🍇", color: "#927dc1" },
        { id: "p4", name: "西瓜", glyph: "🍉", color: "#58a77d" },
        { id: "p5", name: "橙子", glyph: "🍊", color: "#e59b4c" },
        { id: "p6", name: "樱桃", glyph: "🍒", color: "#ca5f6a" },
        { id: "p7", name: "梨子", glyph: "🍐", color: "#85ad57" }
      ]
    },
    pokemon: {
      id: "pokemon",
      name: "宝可梦主题",
      patterns: [
        { id: "p1", name: "超梦", glyph: "💜", color: "#a078c8", image: "assets/themes/pokemon/超梦.png" },
        { id: "p2", name: "杰尼龟", glyph: "💧", color: "#65a9d1", image: "assets/themes/pokemon/杰尼龟.png" },
        { id: "p3", name: "可达鸭", glyph: "🦆", color: "#e8bd4e", image: "assets/themes/pokemon/可达鸭.png" },
        { id: "p4", name: "妙蛙种子", glyph: "🌱", color: "#67a66b", image: "assets/themes/pokemon/妙蛙种子 (2).png" },
        { id: "p5", name: "皮卡丘", glyph: "⚡", color: "#e5bb43", image: "assets/themes/pokemon/皮卡丘.png" },
        { id: "p6", name: "仙子伊布", glyph: "🎀", color: "#cb8cba", image: "assets/themes/pokemon/仙子伊布.png" },
        { id: "p7", name: "小火龙", glyph: "🔥", color: "#e58b55", image: "assets/themes/pokemon/小火龙.png" }
      ]
    },
    "pokemon-2": {
      id: "pokemon-2",
      name: "宝可梦徽章主题",
      patterns: [
        { id: "p1", name: "徽章伙伴 01", glyph: "🐉", color: "#d8aa62", image: "assets/themes/pokemon-2/10662101-a808-4b0b-80e0-83e38c90b9ca.png" },
        { id: "p2", name: "徽章伙伴 02", glyph: "🍃", color: "#78b77a", image: "assets/themes/pokemon-2/32dfc1c7-085d-462a-a9ab-502df96fd390.png" },
        { id: "p3", name: "徽章伙伴 03", glyph: "😴", color: "#7bb6c4", image: "assets/themes/pokemon-2/340914f4-d72f-4568-b705-46a3c206f744.png" },
        { id: "p4", name: "徽章伙伴 04", glyph: "🌙", color: "#8f7fbd", image: "assets/themes/pokemon-2/677d193c-1e67-44b5-a854-1e5eae5970bf.png" },
        { id: "p5", name: "徽章伙伴 05", glyph: "🔥", color: "#dc7452", image: "assets/themes/pokemon-2/74ea19f1-43bc-496f-965d-6f4472eda4c5.png" },
        { id: "p6", name: "徽章伙伴 06", glyph: "✨", color: "#d783b7", image: "assets/themes/pokemon-2/7695ac6b-e28d-4404-8bb9-e6e5ed611fbd.png" },
        { id: "p7", name: "徽章伙伴 07", glyph: "💙", color: "#628ac3", image: "assets/themes/pokemon-2/d7a28cea-f41a-4579-9e25-ee6070c7429c.png" }
      ]
    },
    digimon: {
      id: "digimon",
      name: "数码宝贝主题",
      patterns: [
        { id: "p1", name: "数码伙伴 01", glyph: "🌿", color: "#81aa67", image: "assets/themes/digimon/01c6440d-c38e-4a00-ba88-f68bc7a3ffc1.png" },
        { id: "p2", name: "数码伙伴 02", glyph: "🦊", color: "#daa955", image: "assets/themes/digimon/0cbedb23-3712-4f74-8bbf-31f2116362eb.png" },
        { id: "p3", name: "数码伙伴 03", glyph: "🔥", color: "#dc9857", image: "assets/themes/digimon/8baa6bc8-d4a5-492f-bec5-5721c9a1985c.png" },
        { id: "p4", name: "数码伙伴 04", glyph: "🌸", color: "#d98eb0", image: "assets/themes/digimon/932aab38-b902-4451-9689-8dde7b6ce3a7.png" },
        { id: "p5", name: "数码伙伴 05", glyph: "🐺", color: "#8e9db2", image: "assets/themes/digimon/9b8da726-e7d9-44f9-8832-f5fcdcd962b2.png" },
        { id: "p6", name: "数码伙伴 06", glyph: "⚪", color: "#afc5dc", image: "assets/themes/digimon/b78e61e2-7d47-45ef-8467-a1c6163931fe.png" },
        { id: "p7", name: "数码伙伴 07", glyph: "💗", color: "#dd8cae", image: "assets/themes/digimon/ff3a266e-fcbc-40e2-9615-666a457124c3.png" }
      ]
    }
  };

  const PRESETS = {
    easy: { label: "简单", patternCount: 3, capacity: 4, reserveCount: 4, shuffleSteps: 20, mysteryCount: 0, fixedCount: 0 },
    normal: { label: "普通", patternCount: 4, capacity: 4, reserveCount: 2, shuffleSteps: 45, mysteryCount: 4, fixedCount: 1 },
    hard: { label: "困难", patternCount: 7, capacity: 12, reserveCount: 8, shuffleSteps: 1000, mysteryCount: 12, fixedCount: 3 }
  };

  const DEFAULT_SETTINGS = { difficulty: "hard", patternCount: 7, capacity: 12, reserveCount: 8, shuffleSteps: 1000, mysteryCount: 12, fixedCount: 3 };
  const STORAGE_KEY = "haibao-jump.local.v1";
  const SAVE_SLOT_COUNT = 3;
  const ui = {
    themeSelect: document.getElementById("themeSelect"),
    floatingToken: document.getElementById("floatingToken"),
    settingsButton: document.getElementById("settingsButton"),
    difficultyBadge: document.getElementById("levelBadge"),
    boardCaption: document.getElementById("boardCaption"),
    moveCount: document.getElementById("moveCount"),
    capacityLabel: document.getElementById("capacityLabel"),
    columns: document.getElementById("columns"),
    reserveSection: document.getElementById("reserveSection"),
    reserveSlots: document.getElementById("reserveSlots"),
    gameMessage: document.getElementById("gameMessage"),
    cancelSelectionButton: document.getElementById("cancelSelectionButton"),
    restartButton: document.getElementById("restartButton"),
    newGameButton: document.getElementById("newGameButton"),
    victoryBanner: document.getElementById("victoryBanner"),
    victoryNewGameButton: document.getElementById("victoryNewGameButton"),
    settingsDialog: document.getElementById("settingsDialog"),
    closeSettingsButton: document.getElementById("closeSettingsButton"),
    cancelSettingsButton: document.getElementById("cancelSettingsButton"),
    applySettingsButton: document.getElementById("applySettingsButton"),
    difficultySelect: document.getElementById("difficultySelect"),
    difficultyHint: document.getElementById("difficultyHint"),
    patternCountInput: document.getElementById("patternCountInput"),
    capacityInput: document.getElementById("capacityInput"),
    reserveCountInput: document.getElementById("reserveCountInput"),
    shuffleStepsInput: document.getElementById("shuffleStepsInput"),
    mysteryCountInput: document.getElementById("mysteryCountInput"),
    fixedCountInput: document.getElementById("fixedCountInput"),
    vibrationToggle: document.getElementById("vibrationToggle"),
    vibrationHint: document.getElementById("vibrationHint"),
    undoButton: document.getElementById("undoButton"),
    shuffleButton: document.getElementById("shuffleButton"),
    flightLayer: document.getElementById("flightLayer"),
    celebrationLayer: document.getElementById("celebrationLayer"),
    soundToggle: document.getElementById("soundToggle"),
    soundLabel: document.getElementById("soundLabel"),
    saveButton: document.getElementById("saveButton"),
    saveButtonLabel: document.getElementById("saveButtonLabel"),
    saveDialog: document.getElementById("saveDialog"),
    closeSaveButton: document.getElementById("closeSaveButton"),
    closeSaveFooterButton: document.getElementById("closeSaveFooterButton"),
    saveSlotsList: document.getElementById("saveSlotsList"),
    saveStorageStatus: document.getElementById("saveStorageStatus")
  };

  let settings = Object.assign({}, DEFAULT_SETTINGS);
  let currentThemeId = "ocean";
  let board = null;
  let initialBoard = null;
  let selected = null;
  let moveCount = 0;
  let moveHistory = [];
  let isAnimating = false;
  let suppressClickUntil = 0;
  let activeSaveId = 0;
  let saveSlots = new Array(SAVE_SLOT_COUNT).fill(null);
  let soundEnabled = true;
  let vibrationEnabled = true;
  let audioContext = null;
  let victoryCelebrated = false;
  let storageAvailable = true;

  function getTheme() {
    return THEMES[currentThemeId] || THEMES.ocean;
  }

  function getPattern(patternId) {
    patternId = actualPatternId(patternId);
    const theme = getTheme();
    for (let i = 0; i < theme.patterns.length; i += 1) {
      if (theme.patterns[i].id === patternId) return theme.patterns[i];
    }
    return theme.patterns[0];
  }

  function actualPatternId(token) {
    if (isBlankToken(token)) return null;
    return typeof token === "string" && /^[?!#]/.test(token) ? token.slice(1) : token;
  }

  function isBlankToken(token) {
    return token === "blank";
  }

  function isMysteryToken(token) {
    return typeof token === "string" && token.charAt(0) === "?";
  }

  function isFixedToken(token) {
    return isBlankToken(token) || (typeof token === "string" && token.charAt(0) === "#");
  }

  function revealTopToken(column) {
    if (!column.length) return;
    const topIndex = column.length - 1;
    if (isMysteryToken(column[topIndex])) column[topIndex] = actualPatternId(column[topIndex]);
  }

  function columnIsSortedForCapacity(column, capacity) {
    if (!column || column.length !== capacity) return false;
    if (column.some(isMysteryToken)) return false;
    const patternTokens = column.filter(function (token) { return !isBlankToken(token); });
    if (!patternTokens.length) return false;
    const targetPattern = actualPatternId(patternTokens[0]);
    return Boolean(targetPattern) && patternTokens.every(function (token) {
      return actualPatternId(token) === targetPattern;
    });
  }

  function wouldCompleteColumnAfterAdding(column, patternId, capacity) {
    if (!column || column.length + 1 !== capacity) return false;
    const patternTokens = column.filter(function (token) { return !isBlankToken(token); });
    return patternTokens.every(function (token) {
      return actualPatternId(token) === patternId;
    });
  }

  function columnIsSorted(column) {
    return columnIsSortedForCapacity(column, settings.capacity);
  }

  function cloneBoard(source) {
    return {
      columns: source.columns.map(function (column) { return column.slice(); }),
      reserve: source.reserve.slice()
    };
  }

  function hasLegacyGuessCells(sourceBoard) {
    return Boolean(sourceBoard && Array.isArray(sourceBoard.columns) &&
      sourceBoard.columns.some(function (column) {
        return Array.isArray(column) && column.some(function (token) {
          return typeof token === "string" && token.charAt(0) === "!";
        });
      }));
  }

  function normalizeSettings(source) {
    source = source && typeof source === "object" ? source : DEFAULT_SETTINGS;
    function bounded(value, fallback, min, max) {
      const parsed = Number.parseInt(value, 10);
      return Number.isFinite(parsed) ? Math.max(min, Math.min(max, parsed)) : fallback;
    }
    const difficulty = PRESETS[source.difficulty] ? source.difficulty : "custom";
    if (difficulty === "hard") {
      return {
        difficulty: "hard",
        patternCount: PRESETS.hard.patternCount,
        capacity: PRESETS.hard.capacity,
        reserveCount: PRESETS.hard.reserveCount,
        shuffleSteps: PRESETS.hard.shuffleSteps,
        mysteryCount: PRESETS.hard.mysteryCount,
        fixedCount: PRESETS.hard.fixedCount
      };
    }
    const patternCount = bounded(source.patternCount, DEFAULT_SETTINGS.patternCount, 2, 7);
    const capacity = bounded(source.capacity, DEFAULT_SETTINGS.capacity, 2, 12);
    return {
      difficulty: difficulty,
      patternCount: patternCount,
      capacity: capacity,
      reserveCount: bounded(source.reserveCount, DEFAULT_SETTINGS.reserveCount, 0, 8),
      shuffleSteps: bounded(source.shuffleSteps, DEFAULT_SETTINGS.shuffleSteps, 10, 2400),
      mysteryCount: bounded(source.mysteryCount, DEFAULT_SETTINGS.mysteryCount, 0, 24),
      fixedCount: bounded(source.fixedCount, DEFAULT_SETTINGS.fixedCount, 0, Math.min(3, capacity - 1, patternCount))
    };
  }

  function normalizeBoard(source, boardSettings) {
    if (!source || !Array.isArray(source.columns) || !Array.isArray(source.reserve)) return null;
    const reserve = source.reserve.slice();
    if (boardSettings.difficulty === "hard" && reserve.length < boardSettings.reserveCount) {
      while (reserve.length < boardSettings.reserveCount) reserve.push(null);
    }
    if (source.columns.length !== boardSettings.patternCount + 1 || reserve.length !== boardSettings.reserveCount) return null;
    const validToken = function (token) {
      if (isBlankToken(token)) return true;
      if (typeof token !== "string") return false;
      const match = token.match(/^([?!#]?)(p[1-7])$/);
      return Boolean(match && Number(match[2].slice(1)) <= boardSettings.patternCount);
    };
    const columns = source.columns.map(function (column) {
      return Array.isArray(column) && column.length <= boardSettings.capacity && column.every(validToken)
        ? column.map(function (token) { return typeof token === "string" && token.charAt(0) === "!" ? "blank" : token; })
        : null;
    });
    if (columns.some(function (column) { return !column; })) return null;
    if (!reserve.every(function (token) { return token === null || (validToken(token) && !isBlankToken(token) && !/^[?!#]/.test(token)); })) return null;
    return { columns: columns, reserve: reserve };
  }

  function countBlankTiles(snapshotBoard) {
    return snapshotBoard.columns.reduce(function (total, column) {
      return total + column.filter(isBlankToken).length;
    }, 0);
  }

  function countPatternTiles(snapshotBoard, patternId) {
    let count = 0;
    snapshotBoard.columns.forEach(function (column) {
      column.forEach(function (token) {
        if (!isBlankToken(token) && actualPatternId(token) === patternId) count += 1;
      });
    });
    snapshotBoard.reserve.forEach(function (token) {
      if (token && actualPatternId(token) === patternId) count += 1;
    });
    return count;
  }

  function migrateMissingBlankTiles(currentBoard, startBoard, boardSettings) {
    const currentBlankCount = countBlankTiles(currentBoard);
    const startBlankCount = countBlankTiles(startBoard);
    const missingCount = boardSettings.fixedCount - Math.min(currentBlankCount, startBlankCount);
    if (missingCount <= 0 || currentBlankCount !== startBlankCount) return false;

    let migratedCount = 0;
    for (let patternIndex = 1; patternIndex <= boardSettings.patternCount && migratedCount < missingCount; patternIndex += 1) {
      const patternId = "p" + patternIndex;
      if (countPatternTiles(currentBoard, patternId) !== boardSettings.capacity ||
          countPatternTiles(startBoard, patternId) !== boardSettings.capacity) continue;

      for (let columnIndex = 0; columnIndex < currentBoard.columns.length; columnIndex += 1) {
        const currentColumn = currentBoard.columns[columnIndex];
        const startColumn = startBoard.columns[columnIndex];
        const currentBase = currentColumn[0];
        const startBase = startColumn[0];
        if (currentBase !== patternId || startBase !== patternId || isFixedToken(currentBase) || isFixedToken(startBase)) continue;
        currentColumn[0] = "blank";
        startColumn[0] = "blank";
        migratedCount += 1;
        break;
      }
    }
    return migratedCount > 0;
  }

  function normalizeSnapshot(source) {
    if (!source || typeof source !== "object") return null;
    const snapshotSettings = normalizeSettings(source.settings);
    let snapshotBoard = normalizeBoard(source.board, snapshotSettings);
    const snapshotInitial = normalizeBoard(source.initialBoard, snapshotSettings);
    if (!snapshotBoard) return null;
    const moveCount = Math.max(0, Math.min(999999, Number.parseInt(source.moveCount, 10) || 0));
    let initialBoard = snapshotInitial || cloneBoard(snapshotBoard);
    let migratedBlankLayout = false;
    if (moveCount === 0 && JSON.stringify(snapshotBoard) === JSON.stringify(initialBoard) && hasLegacyGuessCells(source.board)) {
      snapshotBoard = buildSolvableBoard(snapshotSettings);
      initialBoard = cloneBoard(snapshotBoard);
      migratedBlankLayout = true;
    }
    migratedBlankLayout = migrateMissingBlankTiles(snapshotBoard, initialBoard, snapshotSettings) || migratedBlankLayout;
    return {
      settings: snapshotSettings,
      themeId: THEMES[source.themeId] ? source.themeId : "ocean",
      board: snapshotBoard,
      initialBoard: initialBoard,
      moveCount: moveCount,
      migratedBlankLayout: migratedBlankLayout,
      savedAt: Number(source.savedAt) || Date.now()
    };
  }

  function currentSnapshot() {
    return {
      settings: Object.assign({}, settings),
      themeId: currentThemeId,
      board: cloneBoard(board),
      initialBoard: cloneBoard(initialBoard || board),
      moveCount: moveCount,
      savedAt: Date.now()
    };
  }

  function restoreSnapshot(snapshot) {
    const normalized = normalizeSnapshot(snapshot);
    if (!normalized) return false;
    settings = normalized.settings;
    currentThemeId = normalized.themeId;
    board = normalized.board;
    initialBoard = normalized.initialBoard;
    moveCount = normalized.moveCount;
    selected = null;
    moveHistory = [];
    victoryCelebrated = isVictory();
    return true;
  }

  function loadLocalData() {
    let stored = null;
    try { stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null"); } catch (error) { stored = null; }
    if (!stored || typeof stored !== "object") return false;
    settings = normalizeSettings(stored.settings);
    currentThemeId = THEMES[stored.themeId] ? stored.themeId : "ocean";
    soundEnabled = stored.soundEnabled !== false;
    vibrationEnabled = stored.vibrationEnabled !== false;
    activeSaveId = Math.max(0, Math.min(SAVE_SLOT_COUNT - 1, Number.parseInt(stored.activeSaveId, 10) || 0));
    saveSlots = Array.from({ length: SAVE_SLOT_COUNT }, function (_, index) {
      return normalizeSnapshot(Array.isArray(stored.saveSlots) ? stored.saveSlots[index] : null);
    });
    const activeLayoutMigrated = Boolean(saveSlots[activeSaveId] && saveSlots[activeSaveId].migratedBlankLayout);
    const restored = Boolean(saveSlots[activeSaveId] && restoreSnapshot(saveSlots[activeSaveId]));
    if (restored && activeLayoutMigrated) persistLocalData(true);
    return restored;
  }

  function persistLocalData(saveCurrentGame) {
    if (saveCurrentGame && board && initialBoard) saveSlots[activeSaveId] = currentSnapshot();
    const payload = {
      version: 1,
      activeSaveId: activeSaveId,
      settings: Object.assign({}, settings),
      themeId: currentThemeId,
      soundEnabled: soundEnabled,
      vibrationEnabled: vibrationEnabled,
      saveSlots: saveSlots.map(function (snapshot) {
        if (!snapshot) return null;
        const storedSnapshot = Object.assign({}, snapshot);
        delete storedSnapshot.migratedBlankLayout;
        return storedSnapshot;
      })
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      storageAvailable = true;
    } catch (error) {
      storageAvailable = false;
    }
    ui.saveStorageStatus.textContent = storageAvailable ? "本机自动保存已开启" : "浏览器未允许本机保存";
    updateSaveButton();
  }

  function updateSaveButton() {
    ui.saveButtonLabel.textContent = "存档 " + (activeSaveId + 1);
    ui.saveButton.setAttribute("aria-label", "选择存档，当前存档 " + (activeSaveId + 1));
    ui.soundToggle.setAttribute("aria-pressed", String(soundEnabled));
    ui.soundToggle.setAttribute("aria-label", soundEnabled ? "关闭音效" : "开启音效");
    ui.soundToggle.title = soundEnabled ? "关闭音效" : "开启音效";
    ui.soundLabel.textContent = soundEnabled ? "音效" : "静音";
    const vibrationSupported = typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
    ui.vibrationToggle.checked = vibrationEnabled;
    ui.vibrationToggle.disabled = !vibrationSupported;
    ui.vibrationToggle.setAttribute("aria-label", vibrationSupported
      ? (vibrationEnabled ? "关闭移动震动" : "开启移动震动")
      : "此浏览器不支持移动震动");
    ui.vibrationHint.textContent = vibrationSupported
      ? "图案落格时双震；请确认手机系统震动已开启"
      : "当前网页浏览器未开放手机震动功能";
  }

  function formatSaveDate(timestamp) {
    try {
      return new Date(timestamp).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch (error) {
      return "本机存档";
    }
  }

  function renderSaveDialog() {
    ui.saveSlotsList.innerHTML = saveSlots.map(function (snapshot, index) {
      const isCurrent = index === activeSaveId;
      const slotClass = "save-slot-card" + (isCurrent ? " is-current" : "") + (snapshot ? " has-save" : " is-empty");
      const title = "存档 " + (index + 1) + (isCurrent ? " · 当前" : "");
      let details = "空存档 · 可从当前进度另存，或开一局新的挑战";
      if (snapshot) {
        const savedDifficulty = snapshot.settings.difficulty === "custom"
          ? "自定义"
          : PRESETS[snapshot.settings.difficulty].label;
        details = savedDifficulty + " · " + THEMES[snapshot.themeId].name + " · " +
          snapshot.moveCount + " 步 · " + formatSaveDate(snapshot.savedAt);
      }
      const status = isCurrent ? "正在游玩" : (snapshot ? "已保存" : "空存档");
      const primaryLabel = !snapshot ? "另存当前进度" : (isCurrent ? "继续当前游戏" : "读取此存档");
      const primaryAction = !snapshot ? "copy" : "load";
      let actions = '<button class="save-slot-action save-primary" type="button" data-save-action="' + primaryAction + '" data-save-index="' + index + '">' + primaryLabel + '</button>';
      if (!snapshot) {
        actions += '<button class="save-slot-action" type="button" data-save-action="new" data-save-index="' + index + '">以当前设置新开</button>';
      } else if (!isCurrent) {
        actions += '<button class="save-slot-action" type="button" data-save-action="copy" data-save-index="' + index + '">覆盖为当前进度</button>' +
          '<button class="save-slot-delete" type="button" data-save-action="delete" data-save-index="' + index + '" aria-label="删除存档 ' + (index + 1) + '">删除</button>';
      } else {
        actions += '<button class="save-slot-action" type="button" data-save-action="new" data-save-index="' + index + '">本档重新开局</button>';
      }
      return '<article class="' + slotClass + '" role="listitem"><div class="save-slot-top"><div><strong>' + title +
        '</strong><small>' + escapeHtml(details) + '</small></div><span class="save-slot-status">' + status +
        '</span></div><div class="save-slot-actions">' + actions + '</div></article>';
    }).join("");
    ui.saveStorageStatus.textContent = storageAvailable ? "本机自动保存已开启" : "浏览器未允许本机保存";
  }

  function openSaveDialog() {
    if (isAnimating) return;
    renderSaveDialog();
    if (typeof ui.saveDialog.showModal === "function") ui.saveDialog.showModal();
    else ui.saveDialog.setAttribute("open", "");
  }

  function closeSaveDialog() {
    if (typeof ui.saveDialog.close === "function") ui.saveDialog.close();
    else ui.saveDialog.removeAttribute("open");
  }

  function createGameInSlot(index) {
    activeSaveId = index;
    selected = null;
    moveCount = 0;
    moveHistory = [];
    board = buildSolvableBoard(settings);
    initialBoard = cloneBoard(board);
    victoryCelebrated = false;
    clearCelebration();
    closeSaveDialog();
    render();
    persistLocalData(true);
    announce("已在存档 " + (index + 1) + " 开始新一局。");
  }

  function loadSaveSlot(index) {
    if (index === activeSaveId) {
      closeSaveDialog();
      announce("这就是当前正在游玩的存档。");
      return;
    }
    const snapshot = saveSlots[index];
    if (!snapshot || !restoreSnapshot(snapshot)) return;
    activeSaveId = index;
    closeSaveDialog();
    render();
    persistLocalData(true);
    announce("已读取存档 " + (index + 1) + "，接着上次继续。");
  }

  function handleSaveSlotAction(event) {
    const button = event.target.closest("[data-save-action]");
    if (!button || !ui.saveSlotsList.contains(button) || isAnimating) return;
    const index = Number(button.dataset.saveIndex);
    if (index < 0 || index >= SAVE_SLOT_COUNT) return;
    const action = button.dataset.saveAction;
    if (action === "load") {
      loadSaveSlot(index);
    } else if (action === "copy") {
      if (saveSlots[index] && !window.confirm("要用当前进度覆盖存档 " + (index + 1) + " 吗？")) return;
      saveSlots[index] = currentSnapshot();
      persistLocalData(false);
      renderSaveDialog();
      announce("当前进度已保存到存档 " + (index + 1) + "。");
    } else if (action === "new") {
      if (saveSlots[index] && !window.confirm("在存档 " + (index + 1) + " 重新开局会替换这份进度，继续吗？")) return;
      createGameInSlot(index);
    } else if (action === "delete") {
      if (!window.confirm("删除存档 " + (index + 1) + "？此操作无法撤回。")) return;
      saveSlots[index] = null;
      if (index === activeSaveId) {
        const nextIndex = saveSlots.findIndex(function (slot) { return Boolean(slot); });
        if (nextIndex >= 0) {
          activeSaveId = nextIndex;
          restoreSnapshot(saveSlots[nextIndex]);
        } else {
          activeSaveId = (index + 1) % SAVE_SLOT_COUNT;
          board = buildSolvableBoard(settings);
          initialBoard = cloneBoard(board);
          moveCount = 0;
          moveHistory = [];
          victoryCelebrated = false;
          clearCelebration();
        }
        render();
        persistLocalData(true);
      } else {
        persistLocalData(false);
      }
      renderSaveDialog();
    }
  }

  function prepareAudioContext() {
    if (!soundEnabled) return null;
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) return null;
    try {
      if (!audioContext) audioContext = new AudioContextConstructor();
      if (audioContext.state === "suspended") {
        const resume = audioContext.resume();
        if (resume && typeof resume.catch === "function") resume.catch(function () {});
      }
      return audioContext;
    } catch (error) {
      return null;
    }
  }

  function playSound(kind, variant) {
    if (!soundEnabled) return;
    const context = prepareAudioContext();
    if (!context) return;
    try {
      const tileNotes = [392, 440, 523.25, 587.33, 659.25, 783.99, 880];
      const tileIndex = kind === "tile"
        ? Math.max(0, getTheme().patterns.findIndex(function (pattern) { return pattern.id === actualPatternId(variant); }))
        : 0;
      const notes = kind === "win" ? [523.25, 659.25, 783.99, 1046.5] :
        kind === "wrong" ? [246.94, 196] :
        kind === "stash" ? [493.88] :
        kind === "reveal" ? [587.33, 783.99] :
        kind === "tile" ? [tileNotes[tileIndex % tileNotes.length]] : [659.25];
      const peakVolume = kind === "win" ? 0.055 : kind === "tile" ? 0.018 : 0.035;
      const noteLength = kind === "win" ? 0.28 : kind === "tile" ? 0.085 : 0.16;
      notes.forEach(function (frequency, index) {
        const start = context.currentTime + index * (kind === "win" ? 0.115 : 0.07);
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = kind === "wrong" ? "triangle" : "sine";
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(peakVolume, start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + noteLength);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + noteLength + 0.015);
      });
    } catch (error) {
      // Audio is optional; gameplay remains available if the browser blocks Web Audio.
    }
  }

  function vibrateOnLanding() {
    if (!vibrationEnabled || typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
    try {
      const accepted = navigator.vibrate([32, 18, 42]);
      if (!accepted) ui.vibrationHint.textContent = "设备未接受震动请求，请检查系统设置";
    } catch (error) {
      ui.vibrationHint.textContent = "设备未接受震动请求，请检查系统设置";
    }
  }

  function clearCelebration() {
    ui.celebrationLayer.innerHTML = "";
  }

  function showVictoryCelebration() {
    if (victoryCelebrated) return;
    victoryCelebrated = true;
    clearCelebration();
    playSound("win");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#ffcf63", "#ff8c78", "#65c9af", "#80a9f4", "#d897d2", "#fff1b4"];
    const pieces = 52;
    for (let index = 0; index < pieces; index += 1) {
      const piece = document.createElement("span");
      const delay = Math.random() * 0.42;
      const duration = 2.4 + Math.random() * 1.45;
      piece.className = "confetti-piece" + (index % 4 === 0 ? " is-round" : "");
      piece.style.left = (3 + Math.random() * 94) + "vw";
      piece.style.backgroundColor = colors[randomIndex(colors.length)];
      piece.style.width = (6 + Math.random() * 7) + "px";
      piece.style.height = (9 + Math.random() * 9) + "px";
      piece.style.setProperty("--drift", ((Math.random() * 2 - 1) * 155) + "px");
      piece.style.setProperty("--spin", ((Math.random() * 2 - 1) * 900) + "deg");
      piece.style.animationDuration = duration + "s";
      piece.style.animationDelay = delay + "s";
      ui.celebrationLayer.appendChild(piece);
      window.setTimeout(function () { piece.remove(); }, (delay + duration) * 1000 + 120);
    }
  }

  function randomIndex(max) {
    return Math.floor(Math.random() * max);
  }

  function topGroupSize(column) {
    if (!column.length) return 0;
    const topToken = column[column.length - 1];
    if (isFixedToken(topToken)) return 0;
    if (isMysteryToken(topToken)) return 1;
    const patternId = actualPatternId(topToken);
    let count = 1;
    for (let index = column.length - 2; index >= 0; index -= 1) {
      if (isFixedToken(column[index]) || isMysteryToken(column[index]) || actualPatternId(column[index]) !== patternId) break;
      count += 1;
    }
    return count;
  }

  function scrambleQuality(columns, capacity) {
    let score = 0;
    let largestRun = 0;
    let solvedColumns = 0;
    columns.forEach(function (column) {
      if (!column.length) return;
      const colors = new Set();
      let previousPattern = null;
      let runLength = 0;
      let runCount = 0;
      column.forEach(function (token) {
        if (isBlankToken(token)) {
          previousPattern = null;
          runLength = 0;
          return;
        }
        const patternId = actualPatternId(token);
        colors.add(patternId);
        if (patternId === previousPattern) {
          runLength += 1;
        } else {
          previousPattern = patternId;
          runLength = 1;
          runCount += 1;
        }
        largestRun = Math.max(largestRun, runLength);
      });
      if (colors.size > 1) score += colors.size * 15;
      score += runCount * 3;
      if (columnIsSortedForCapacity(column, capacity)) solvedColumns += 1;
    });
    return score - largestRun * 5 - solvedColumns * 60;
  }

  function buildSolvableBoard(currentSettings) {
    const fixedCount = Math.min(currentSettings.fixedCount, currentSettings.capacity - 1, currentSettings.patternCount);
    // Compare several solvable reverse walks so hard boards are less likely to leave
    // large same-pattern runs connected just because one shuffle happened to do so.
    const attemptCount = currentSettings.difficulty === "hard" ? 12 : 1;
    const reverseLookback = Math.min(16, Math.max(10, currentSettings.patternCount * 2));
    let bestColumns = null;
    let bestQuality = -Infinity;

    for (let attempt = 0; attempt < attemptCount; attempt += 1) {
      const availablePatterns = [];
      for (let index = 0; index < currentSettings.patternCount; index += 1) availablePatterns.push(index + 1);
      for (let index = availablePatterns.length - 1; index > 0; index -= 1) {
        const swapIndex = randomIndex(index + 1);
        const value = availablePatterns[index];
        availablePatterns[index] = availablePatterns[swapIndex];
        availablePatterns[swapIndex] = value;
      }
      const blankPatternIds = new Set(availablePatterns.slice(0, fixedCount).map(function (index) { return "p" + index; }));
      const columns = [];
      for (let patternIndex = 0; patternIndex < currentSettings.patternCount; patternIndex += 1) {
        const patternId = "p" + (patternIndex + 1);
        const column = [];
        if (blankPatternIds.has(patternId)) column.push("blank");
        while (column.length < currentSettings.capacity) column.push(patternId);
        columns.push(column);
      }
      columns.push([]);

      const recentReverseMoves = [];
      for (let step = 0; step < currentSettings.shuffleSteps; step += 1) {
        const candidates = [];
        for (let donorIndex = 0; donorIndex < columns.length; donorIndex += 1) {
          const donor = columns[donorIndex];
          if (!donor.length) continue;
          const patternId = actualPatternId(donor[donor.length - 1]);
          if (!patternId || !topGroupSize(donor)) continue;

          for (let targetIndex = 0; targetIndex < columns.length; targetIndex += 1) {
            if (targetIndex === donorIndex) continue;
            const target = columns[targetIndex];
            // Keep the reverse path invertible and split same-pattern runs into smaller groups.
            if (target.length && actualPatternId(target[target.length - 1]) === patternId) continue;
            if (target.length >= currentSettings.capacity) continue;
            // A column that becomes complete during reverse scrambling would be locked
            // before the earlier reverse moves could be undone in normal play.
            if (wouldCompleteColumnAfterAdding(target, patternId, currentSettings.capacity)) continue;
            candidates.push({ donorIndex: donorIndex, targetIndex: targetIndex, patternId: patternId, count: 1 });
          }
        }

        const choices = candidates.filter(function (candidate) {
          return !recentReverseMoves.some(function (previousMove) {
            return candidate.donorIndex === previousMove.targetIndex &&
              candidate.targetIndex === previousMove.donorIndex &&
              candidate.patternId === previousMove.patternId;
          });
        });
        const availableChoices = choices.length ? choices : candidates;
        if (!availableChoices.length) break;

        const chosen = availableChoices[randomIndex(availableChoices.length)];
        const donor = columns[chosen.donorIndex];
        const group = donor.splice(donor.length - chosen.count, chosen.count);
        columns[chosen.targetIndex].push.apply(columns[chosen.targetIndex], group);
        recentReverseMoves.push(chosen);
        if (recentReverseMoves.length > reverseLookback) recentReverseMoves.shift();
      }

      const alreadySolved = columns.filter(function (column) {
        return columnIsSortedForCapacity(column, currentSettings.capacity);
      }).length === currentSettings.patternCount;
      if (alreadySolved) {
        const emptyIndex = columns.findIndex(function (column) { return column.length === 0; });
        const sourceIndex = columns.findIndex(function (column) {
          return column.length === currentSettings.capacity && topGroupSize(column) > 0;
        });
        if (emptyIndex >= 0 && sourceIndex >= 0) {
          const patternId = columns[sourceIndex].pop();
          columns[emptyIndex].push(patternId);
        }
      }

      const quality = scrambleQuality(columns, currentSettings.capacity);
      if (quality > bestQuality) {
        bestQuality = quality;
        bestColumns = columns;
      }
    }

    const columns = bestColumns || [[]];

    const mysteryCandidates = [];
    columns.forEach(function (column, columnIndex) {
      for (let level = 0; level < column.length - 1; level += 1) {
        if (!isFixedToken(column[level])) mysteryCandidates.push({ columnIndex: columnIndex, level: level });
      }
    });
    for (let index = mysteryCandidates.length - 1; index > 0; index -= 1) {
      const swapIndex = randomIndex(index + 1);
      const candidate = mysteryCandidates[index];
      mysteryCandidates[index] = mysteryCandidates[swapIndex];
      mysteryCandidates[swapIndex] = candidate;
    }
    mysteryCandidates.slice(0, Math.min(currentSettings.mysteryCount, mysteryCandidates.length)).forEach(function (candidate) {
      const column = columns[candidate.columnIndex];
      column[candidate.level] = "?" + actualPatternId(column[candidate.level]);
    });
    columns.forEach(revealTopToken);

    return {
      columns: columns,
      reserve: Array(currentSettings.reserveCount).fill(null)
    };
  }

  function isVictory() {
    if (!board || board.reserve.some(function (item) { return item !== null; }) ||
        board.columns.some(function (column) { return column.some(isMysteryToken); })) return false;
    const completed = board.columns.filter(columnIsSorted);
    const emptyColumns = board.columns.filter(function (column) { return column.length === 0; });
    return completed.length === settings.patternCount && emptyColumns.length === 1;
  }

  function announce(message) {
    ui.gameMessage.textContent = message;
  }

  function nudgeTarget(targetKind, targetIndex) {
    const container = targetKind === "column" ? ui.columns : ui.reserveSlots;
    const target = container.querySelector('[data-kind="' + targetKind + '"][data-index="' + targetIndex + '"]');
    if (!target) return;
    target.classList.remove("is-invalid-flash");
    void target.offsetWidth;
    target.classList.add("is-invalid-flash");
    window.setTimeout(function () { target.classList.remove("is-invalid-flash"); }, 300);
  }

  function flightKeyframes(sourceRect, targetRect) {
    const deltaX = targetRect.left - sourceRect.left;
    const deltaY = targetRect.top - sourceRect.top;
    const lift = Math.max(sourceRect.height * 0.9, Math.min(88, Math.abs(deltaX) * 0.12 + Math.abs(deltaY) * 0.08));
    const turn = deltaX === 0 ? 0 : Math.sign(deltaX) * 5;
    return [
      { transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)", filter: "drop-shadow(0 2px 2px rgba(36, 70, 68, .13))", offset: 0 },
      { transform: "translate3d(0, " + (-lift) + "px, 0) scale(1.07) rotate(" + (-turn) + "deg)", filter: "drop-shadow(0 10px 7px rgba(36, 70, 68, .2))", offset: 0.16 },
      { transform: "translate3d(" + (deltaX * 0.52) + "px, " + (deltaY * 0.52 - lift * 1.15) + "px, 0) scale(1.08) rotate(" + turn + "deg)", filter: "drop-shadow(0 10px 7px rgba(36, 70, 68, .18))", offset: 0.56 },
      { transform: "translate3d(" + (deltaX * 0.88) + "px, " + (deltaY * 0.88 - lift * 0.36) + "px, 0) scale(.99) rotate(" + (turn * 0.35) + "deg)", offset: 0.84 },
      { transform: "translate3d(" + deltaX + "px, " + (deltaY + 3) + "px, 0) scale(1.04, .94) rotate(0deg)", offset: 0.94 },
      { transform: "translate3d(" + deltaX + "px, " + deltaY + "px, 0) scale(1) rotate(0deg)", filter: "drop-shadow(0 3px 4px rgba(36, 70, 68, .12))", offset: 1 }
    ];
  }

  function flightDuration(sourceRect, targetRect, reducedMotion) {
    if (reducedMotion) return 90;
    const distance = Math.hypot(targetRect.left - sourceRect.left, targetRect.top - sourceRect.top);
    return Math.max(250, Math.min(360, 235 + distance * 0.16));
  }

  async function animateFlightTile(tile, sourceRect, targetRect, reducedMotion) {
    const image = tile.querySelector("img");
    if (image && typeof image.decode === "function") await image.decode().catch(function () {});
    const duration = flightDuration(sourceRect, targetRect, reducedMotion);
    const deltaX = targetRect.left - sourceRect.left;
    const deltaY = targetRect.top - sourceRect.top;
    if (typeof tile.animate === "function") {
      const keyframes = reducedMotion
        ? [{ transform: "translate3d(0, 0, 0)" }, { transform: "translate3d(" + deltaX + "px, " + deltaY + "px, 0)" }]
        : flightKeyframes(sourceRect, targetRect);
      const animation = tile.animate(keyframes, {
        duration: duration,
        easing: reducedMotion ? "ease-out" : "cubic-bezier(.18,.78,.22,1)",
        fill: "forwards"
      });
      await animation.finished.catch(function () {});
      return;
    }

    tile.style.transition = "transform " + duration + "ms cubic-bezier(.18,.78,.22,1)";
    await new Promise(function (resolve) {
      window.requestAnimationFrame(function () {
        tile.style.transform = "translate3d(" + deltaX + "px, " + deltaY + "px, 0)";
        window.setTimeout(resolve, duration);
      });
    });
  }

  async function revealFlightTile(tile, patternId, sourceRect, targetRect, reducedMotion) {
    if (!isMysteryToken(patternId)) return;
    const deltaX = targetRect.left - sourceRect.left;
    const deltaY = targetRect.top - sourceRect.top;
    const travel = "perspective(700px) translate3d(" + deltaX + "px, " + deltaY + "px, 0) ";
    const duration = reducedMotion ? 70 : 170;
    if (typeof tile.animate === "function") {
      const close = tile.animate([
        { transform: travel + "rotateY(0deg) scale(1)", opacity: 1 },
        { transform: travel + "rotateY(88deg) scale(.92)", opacity: .82 }
      ], { duration: duration / 2, easing: "ease-in", fill: "forwards" });
      await close.finished.catch(function () {});
    }

    const pattern = getPattern(actualPatternId(patternId));
    tile.classList.remove("mystery-hidden");
    if (pattern.image) tile.classList.add("has-art");
    else tile.classList.remove("has-art");
    tile.style.setProperty("--pattern-color", pattern.color);
    tile.innerHTML = patternVisualHtml(pattern);

    if (typeof tile.animate === "function") {
      const image = tile.querySelector("img");
      if (image && typeof image.decode === "function") await image.decode().catch(function () {});
      const open = tile.animate([
        { transform: travel + "rotateY(-88deg) scale(.92)", opacity: .82 },
        { transform: travel + "rotateY(0deg) scale(1)", opacity: 1 }
      ], { duration: duration / 2, easing: "cubic-bezier(.2,.8,.25,1)", fill: "forwards" });
      await open.finished.catch(function () {});
    }
  }

  async function animateLandingCell(cell, reducedMotion) {
    if (!cell || typeof cell.animate !== "function") return;
    const animation = cell.animate([
      { transform: "scale(1)" },
      { transform: "scale(1.045, .96)", offset: .48 },
      { transform: "scale(.985, 1.025)", offset: .72 },
      { transform: "scale(1)" }
    ], {
      duration: reducedMotion ? 75 : 135,
      easing: "cubic-bezier(.2,.75,.25,1)",
      fill: "none"
    });
    await animation.finished.catch(function () {});
  }

  function centeredFlightRect(sourceRect, targetRect) {
    return {
      left: targetRect.left + (targetRect.width - sourceRect.width) / 2,
      top: targetRect.top + (targetRect.height - sourceRect.height) / 2,
      width: sourceRect.width,
      height: sourceRect.height
    };
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return map[character];
    });
  }

  function patternVisualHtml(pattern) {
    if (!pattern.image) return escapeHtml(pattern.glyph);
    return '<img class="pattern-art" src="' + escapeHtml(encodeURI(pattern.image)) + '" alt="' +
      escapeHtml(pattern.glyph) + '" draggable="false">';
  }

  function columnDescription(column, index) {
    if (!column.length) return "第 " + (index + 1) + " 列，空列，可接收任何图案";
    const topToken = column[column.length - 1];
    const topLabel = isBlankToken(topToken)
      ? "白色空格"
      : (isMysteryToken(topToken) ? "未知元素" : getPattern(topToken).name);
    const fixedCount = column.filter(isBlankToken).length;
    return "第 " + (index + 1) + " 列，顶部是" + topLabel + "，共 " + column.length + " 格；固定白格 " + fixedCount + " 个";
  }

  function canMoveToColumn(source, targetIndex) {
    if (!board || targetIndex < 0 || targetIndex >= board.columns.length) return false;
    if (source.kind === "column" && source.index === targetIndex) return false;
    if (columnIsSorted(board.columns[targetIndex])) return false;
    if (source.kind === "column" && columnIsSorted(board.columns[source.index])) return false;
    const target = board.columns[targetIndex];
    const movingCount = source.kind === "column"
      ? Math.min(topGroupSize(board.columns[source.index]), settings.capacity - target.length)
      : 1;
    const sourcePattern = source.kind === "column"
      ? board.columns[source.index][board.columns[source.index].length - 1]
      : board.reserve[source.index];
    if (!movingCount || !sourcePattern) return false;
    if (target.length + movingCount > settings.capacity) return false;
    const targetPattern = target.length ? actualPatternId(target[target.length - 1]) : null;
    return !targetPattern || actualPatternId(sourcePattern) === targetPattern;
  }

  function targetIsValid(source, targetKind, targetIndex) {
    if (!source || !board) return false;
    if (targetKind === "column") return canMoveToColumn(source, targetIndex);
    return source.kind === "column" &&
      !columnIsSorted(board.columns[source.index]) &&
      targetKind === "reserve" &&
      targetIndex >= 0 &&
      targetIndex < board.reserve.length &&
      board.reserve[targetIndex] === null;
  }

  function render() {
    if (!board) return;
    ui.themeSelect.value = currentThemeId;
    const featuredPattern = getPattern("p1");
    ui.floatingToken.classList.toggle("has-art", Boolean(featuredPattern.image));
    ui.floatingToken.innerHTML = patternVisualHtml(featuredPattern);
    ui.columns.innerHTML = board.columns.map(function (column, columnIndex) {
      const isComplete = columnIsSorted(column);
      const groupSize = topGroupSize(column);
      const slots = [];
      for (let level = 0; level < settings.capacity; level += 1) {
        if (level < column.length) {
          const token = column[level];
          const isBlank = isBlankToken(token);
          const pattern = isBlank ? null : getPattern(token);
          const isTopGroup = level >= column.length - groupSize;
          const isHidden = isMysteryToken(token);
          const isFixed = isFixedToken(token);
          const tileClass = "stack-cell tile" + (isTopGroup ? " top-group" : "") +
            (isFixed ? " is-fixed-cell" : "") + (isBlank ? " is-blank-cell" : "") +
            (isHidden ? " mystery-hidden" : "") + (!isHidden && pattern && pattern.image ? " has-art" : "");
          slots.push(
            '<span class="' + tileClass + '" ' +
            'data-pattern-id="' + (isHidden || isBlank ? "" : escapeHtml(pattern.id)) + '" data-level="' + level + '" ' +
            'style="grid-row:' + (settings.capacity - level) + ';' +
              (isHidden || isBlank ? "" : '--pattern-color:' + escapeHtml(pattern.color) + ';') + '" aria-hidden="true">' +
            (isHidden ? "?" : (isBlank ? "" : patternVisualHtml(pattern))) + "</span>"
          );
        } else {
          slots.push('<span class="stack-cell is-empty" data-level="' + level + '" style="grid-row:' +
            (settings.capacity - level) + '" aria-hidden="true"></span>');
        }
      }

      const isSelected = selected && selected.kind === "column" && selected.index === columnIndex;
      const canDrag = !isComplete && topGroupSize(column) > 0;
      const title = column.length
        ? (isComplete ? "此列不能接收或移出图案" : (canDrag ? "移动顶部图案组" : "只有固定格，不能移动"))
        : "空列";
      return (
        '<button class="column' + (column.length ? "" : " is-empty") +
          (isComplete ? " is-complete" : "") +
          (isSelected ? " is-selected" : "") + '" ' +
          'type="button" data-kind="column" data-index="' + columnIndex + '" draggable="' + canDrag + '" ' +
          'aria-label="' + escapeHtml(columnDescription(column, columnIndex)) + '" title="' + escapeHtml(title) + '">' +
          '<span class="column-meta"><span>列 ' + (columnIndex + 1) + '</span><span class="column-count">' +
          column.length + "/" + settings.capacity + '</span></span>' +
          '<span class="column-stack" style="--cell-count:' + settings.capacity + '">' + slots.join("") + "</span></button>"
      );
    }).join("");

    if (board.reserve.length) {
      ui.reserveSection.hidden = false;
      ui.reserveSlots.innerHTML = board.reserve.map(function (patternId, reserveIndex) {
        const isSelected = selected && selected.kind === "reserve" && selected.index === reserveIndex;
        if (patternId) {
          const pattern = getPattern(patternId);
          return (
            '<button class="reserve-slot is-filled' + (isSelected ? " is-selected" : "") +
              '" type="button" data-kind="reserve" data-index="' + reserveIndex + '" draggable="true" ' +
              'aria-label="暂存位 ' + (reserveIndex + 1) + "，" + escapeHtml(pattern.name) + '，点选后放回棋盘" title="点选后放回棋盘">' +
              '<span class="tile reserve-glyph' + (pattern.image ? " has-art" : "") + '" style="--pattern-color:' + escapeHtml(pattern.color) + '" aria-hidden="true">' +
                patternVisualHtml(pattern) + "</span></button>"
          );
        }
        return (
          '<button class="reserve-slot" type="button" ' +
            'data-kind="reserve" data-index="' + reserveIndex + '" aria-label="暂存位 ' + (reserveIndex + 1) + "，空位" + '" title="空暂存位">' +
            '<span class="reserve-placeholder" aria-hidden="true">＋</span></button>'
        );
      }).join("");
    } else {
      ui.reserveSection.hidden = true;
      ui.reserveSlots.innerHTML = "";
    }

    ui.moveCount.textContent = String(moveCount);
    ui.capacityLabel.textContent = String(settings.capacity);
    ui.difficultyBadge.textContent = settings.difficulty === "custom" ? "自定义" : PRESETS[settings.difficulty].label;
    ui.boardCaption.textContent = "每列最多 " + settings.capacity + " 格 · " + settings.shuffleSteps + " 步打乱" + (settings.fixedCount ? " · 固定白格会随机分散" : "");
    ui.cancelSelectionButton.hidden = !selected || isAnimating;
    ui.victoryBanner.hidden = isAnimating || !isVictory();
    ui.undoButton.disabled = isAnimating || moveHistory.length === 0;
    ui.saveButton.disabled = isAnimating;
    ui.soundToggle.setAttribute("aria-pressed", String(soundEnabled));
    updateSaveButton();
    ui.columns.style.setProperty("--column-count", board.columns.length);
  }

  function clearSelection() {
    selected = null;
    render();
  }

  function selectSource(kind, index) {
    if (isAnimating || isVictory()) return;
    if (kind === "column" && columnIsSorted(board.columns[index])) {
      announce("这一列已经完成，暂时不能再移动。");
      return;
    }
    if (kind === "column" && (!board.columns[index] || !topGroupSize(board.columns[index]))) {
      announce("先点选一列顶部有图案的列。");
      return;
    }
    if (kind === "reserve" && !board.reserve[index]) {
      announce("这个暂存位还是空的，可以把列顶的单个图案放到这里。");
      return;
    }
    selected = { kind: kind, index: index };
    const description = kind === "column"
      ? "已选第 " + (index + 1) + " 列。再点一列试试。"
      : "已选暂存位。再点一列试试。";
    announce(description);
    render();
  }

  function handleTarget(targetKind, targetIndex) {
    if (isAnimating || isVictory()) return;
    if (!selected) {
      selectSource(targetKind, targetIndex);
      return;
    }

    if (selected.kind === targetKind && selected.index === targetIndex) {
      clearSelection();
      announce("已取消选择。");
      return;
    }

    const move = createMove(selected, { kind: targetKind, index: targetIndex });
    if (!move) {
      nudgeTarget(targetKind, targetIndex);
      return;
    }

    performMove(move);
  }

  function createMove(source, target) {
    if (!targetIsValid(source, target.kind, target.index)) return null;
    if (source.kind === "column" && target.kind === "column") {
      const sourceColumn = board.columns[source.index];
      const count = Math.min(topGroupSize(sourceColumn), settings.capacity - board.columns[target.index].length);
      return {
        source: source,
        target: target,
        type: "column-group",
        count: count,
        patternIds: sourceColumn.slice(sourceColumn.length - count)
      };
    }
    if (source.kind === "column" && target.kind === "reserve") {
      return {
        source: source,
        target: target,
        type: "to-reserve",
        count: 1,
        patternIds: [board.columns[source.index][board.columns[source.index].length - 1]]
      };
    }
    if (source.kind === "reserve" && target.kind === "column") {
      return {
        source: source,
        target: target,
        type: "from-reserve",
        count: 1,
        patternIds: [board.reserve[source.index]]
      };
    }
    return null;
  }

  function elementsForColumnLevels(columnIndex, startLevel, count) {
    const columnElement = ui.columns.querySelector('[data-kind="column"][data-index="' + columnIndex + '"]');
    if (!columnElement) return [];
    const elements = [];
    for (let offset = 0; offset < count; offset += 1) {
      const cell = columnElement.querySelector('.stack-cell[data-level="' + (startLevel + offset) + '"]');
      if (cell) elements.push(cell);
    }
    return elements;
  }

  function sourceElements(move) {
    if (move.source.kind === "reserve") {
      const sourceButton = ui.reserveSlots.querySelector('[data-kind="reserve"][data-index="' + move.source.index + '"]');
      return sourceButton ? [sourceButton.querySelector(".reserve-glyph")] : [];
    }
    const column = board.columns[move.source.index];
    return elementsForColumnLevels(move.source.index, column.length - move.count, move.count);
  }

  function destinationElements(move) {
    if (move.target.kind === "reserve") {
      const target = ui.reserveSlots.querySelector('[data-kind="reserve"][data-index="' + move.target.index + '"]');
      return target ? [target] : [];
    }
    const column = board.columns[move.target.index];
    return elementsForColumnLevels(move.target.index, column.length, move.count);
  }

  function createFlightTile(patternId, sourceRect) {
    const pattern = getPattern(patternId);
    const tile = document.createElement("span");
    tile.className = "flight-tile tile" + (isMysteryToken(patternId) ? " mystery-hidden" : "") +
      (!isMysteryToken(patternId) && pattern.image ? " has-art" : "");
    tile.style.left = sourceRect.left + "px";
    tile.style.top = sourceRect.top + "px";
    tile.style.width = sourceRect.width + "px";
    tile.style.height = sourceRect.height + "px";
    if (!isMysteryToken(patternId)) tile.style.setProperty("--pattern-color", pattern.color);
    tile.innerHTML = isMysteryToken(patternId) ? "?" : patternVisualHtml(pattern);
    ui.flightLayer.appendChild(tile);
    return tile;
  }

  async function animateMove(move) {
    const fromElements = sourceElements(move).filter(Boolean);
    const toElements = destinationElements(move).filter(Boolean);
    if (!fromElements.length || !toElements.length) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (let step = 0; step < fromElements.length; step += 1) {
      const index = fromElements.length - 1 - step;
      const source = fromElements[index];
      const destination = toElements[Math.min(index, toElements.length - 1)];
      const sourceRect = source.getBoundingClientRect();
      const targetRect = centeredFlightRect(sourceRect, destination.getBoundingClientRect());
      const flight = createFlightTile(move.patternIds[index], sourceRect);
      source.classList.add("is-flying");
      if (move.target.kind === "reserve") destination.classList.add("is-flying");
      await animateFlightTile(flight, sourceRect, targetRect, reducedMotion);
      await revealFlightTile(flight, move.patternIds[index], sourceRect, targetRect, reducedMotion);
      flight.remove();
      source.classList.remove("is-flying");
      destination.classList.remove("is-flying");
      playSound("tile", move.patternIds[index]);
      vibrateOnLanding();
    }
    ui.flightLayer.innerHTML = "";
    fromElements.forEach(function (element) { element.classList.remove("is-flying"); });
  }

  async function animateGroupMove(move) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sourceIndex = move.source.index;
    const targetIndex = move.target.index;

    for (let step = 0; step < move.count; step += 1) {
      const sourceColumn = board.columns[sourceIndex];
      const targetColumn = board.columns[targetIndex];
      const sourceLevel = sourceColumn.length - 1;
      const sourceCell = ui.columns.querySelector(
        '[data-kind="column"][data-index="' + sourceIndex + '"] .stack-cell[data-level="' + sourceLevel + '"]'
      );
      const sourceRect = sourceCell ? sourceCell.getBoundingClientRect() : null;
      const token = sourceColumn.pop();
      targetColumn.push(actualPatternId(token));
      const revealedLevel = sourceColumn.length - 1;
      const revealedMystery = revealedLevel >= 0 && isMysteryToken(sourceColumn[revealedLevel]);
      revealTopToken(sourceColumn);
      render();

      const revealedCell = revealedMystery ? ui.columns.querySelector(
        '[data-kind="column"][data-index="' + sourceIndex + '"] .stack-cell[data-level="' + revealedLevel + '"]'
      ) : null;
      const revealAnimation = revealedCell && typeof revealedCell.animate === "function"
        ? revealedCell.animate([
          { transform: "perspective(360px) rotateY(88deg) scale(.86)", opacity: .72 },
          { transform: "perspective(360px) rotateY(0) scale(1)", opacity: 1 }
        ], { duration: reducedMotion ? 70 : 210, easing: "cubic-bezier(.2,.75,.25,1)", fill: "both" })
        : null;

      const targetCell = ui.columns.querySelector(
        '[data-kind="column"][data-index="' + targetIndex + '"] .stack-cell[data-level="' + (targetColumn.length - 1) + '"]'
      );
      const targetBounds = targetCell ? targetCell.getBoundingClientRect() : null;
      const targetRect = sourceRect && targetBounds ? centeredFlightRect(sourceRect, targetBounds) : null;
      if (!sourceRect || !targetRect) continue;

      const flight = createFlightTile(token, sourceRect);
      targetCell.classList.add("is-flying");
      if (revealAnimation) await revealAnimation.finished.catch(function () {});
      await animateFlightTile(flight, sourceRect, targetRect, reducedMotion);
      await revealFlightTile(flight, token, sourceRect, targetRect, reducedMotion);
      flight.remove();
      targetCell.classList.remove("is-flying");
      playSound("tile", token);
      vibrateOnLanding();
      await animateLandingCell(targetCell, reducedMotion);
    }
  }

  async function performMove(move) {
    if (isAnimating) return;
    prepareAudioContext();
    isAnimating = true;
    ui.columns.classList.add("is-animating");
    ui.reserveSlots.classList.add("is-animating");
    ui.cancelSelectionButton.hidden = true;
    ui.themeSelect.disabled = true;
    ui.settingsButton.disabled = true;
    ui.newGameButton.disabled = true;
    ui.restartButton.disabled = true;
    ui.shuffleButton.disabled = true;
    ui.undoButton.disabled = true;
    ui.saveButton.disabled = true;
    ui.columns.querySelectorAll(".column").forEach(function (element) { element.setAttribute("aria-disabled", "true"); });
    ui.reserveSlots.querySelectorAll(".reserve-slot").forEach(function (element) { element.setAttribute("aria-disabled", "true"); });

    moveHistory.push({ board: cloneBoard(board), moveCount: moveCount });
    if (move.type !== "column-group" && move.type !== "to-reserve" && move.type !== "from-reserve") playSound("move");
    if (move.type === "column-group") await animateGroupMove(move);
    else await animateMove(move);

    if (move.type === "column-group") {
      announce("已从列顶依次移动 " + move.count + " 个图案。");
    } else if (move.type === "to-reserve") {
      board.columns[move.source.index].pop();
      board.reserve[move.target.index] = actualPatternId(move.patternIds[0]);
      revealTopToken(board.columns[move.source.index]);
      announce("已暂存一个图案。");
    } else {
      board.reserve[move.source.index] = null;
      board.columns[move.target.index].push(move.patternIds[0]);
      revealTopToken(board.columns[move.target.index]);
      announce("图案已放回列中。");
    }

    moveCount += 1;
    selected = null;
    render();
    if (move.type !== "column-group") {
      let landedElement = null;
      if (move.target.kind === "column") {
        const landedColumn = board.columns[move.target.index];
        landedElement = elementsForColumnLevels(move.target.index, landedColumn.length - 1, 1)[0] || null;
      } else {
        const reserveButton = ui.reserveSlots.querySelector('[data-kind="reserve"][data-index="' + move.target.index + '"]');
        landedElement = reserveButton ? reserveButton.querySelector(".reserve-glyph") : null;
      }
      await animateLandingCell(landedElement, window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
    isAnimating = false;
    ui.columns.classList.remove("is-animating");
    ui.reserveSlots.classList.remove("is-animating");
    ui.themeSelect.disabled = false;
    ui.settingsButton.disabled = false;
    ui.newGameButton.disabled = false;
    ui.restartButton.disabled = false;
    ui.shuffleButton.disabled = false;
    render();
    persistLocalData(true);
    if (isVictory()) {
      announce("整理完成！所有图案都回到了自己的列里。");
      showVictoryCelebration();
    } else if (victoryCelebrated) {
      victoryCelebrated = false;
      clearCelebration();
    }
  }

  function setNewGame(message) {
    if (isAnimating) return;
    if (typeof message !== "string") message = "";
    selected = null;
    moveCount = 0;
    moveHistory = [];
    board = buildSolvableBoard(settings);
    initialBoard = cloneBoard(board);
    victoryCelebrated = false;
    clearCelebration();
    render();
    persistLocalData(true);
    announce(message || "新的一局开始啦。点一列，再点目标列；顶部连续相同的图案会逐个飞过去。");
  }

  function restartGame() {
    if (!initialBoard || isAnimating) return;
    selected = null;
    moveCount = 0;
    moveHistory = [];
    board = cloneBoard(initialBoard);
    victoryCelebrated = false;
    clearCelebration();
    render();
    persistLocalData(true);
    announce("已重新开始这局。");
  }

  function undoMove() {
    if (isAnimating || !moveHistory.length) return;
    const previous = moveHistory.pop();
    board = cloneBoard(previous.board);
    moveCount = previous.moveCount;
    selected = null;
    if (!isVictory()) {
      victoryCelebrated = false;
      clearCelebration();
    }
    render();
    persistLocalData(true);
    announce("已后退一步。");
  }

  function applyTheme(themeId) {
    if (isAnimating) {
      ui.themeSelect.value = currentThemeId;
      return;
    }
    if (!THEMES[themeId]) return;
    currentThemeId = themeId;
    render();
    persistLocalData(true);
    announce("已切换到" + getTheme().name + "，棋盘进度保留。");
  }

  function setFormValues(value) {
    ui.difficultySelect.value = value.difficulty;
    ui.patternCountInput.value = value.patternCount;
    ui.capacityInput.value = value.capacity;
    ui.reserveCountInput.value = value.reserveCount;
    ui.shuffleStepsInput.value = value.shuffleSteps;
    ui.mysteryCountInput.value = value.mysteryCount;
    ui.fixedCountInput.value = value.fixedCount;
    updateCustomControls();
  }

  function selectedPresetSettings(difficulty) {
    const preset = PRESETS[difficulty];
    return {
      difficulty: difficulty,
      patternCount: preset.patternCount,
      capacity: preset.capacity,
      reserveCount: preset.reserveCount,
      shuffleSteps: preset.shuffleSteps,
      mysteryCount: preset.mysteryCount,
      fixedCount: preset.fixedCount
    };
  }

  function updateCustomControls() {
    const isCustom = ui.difficultySelect.value === "custom";
    const capacity = Number.parseInt(ui.capacityInput.value, 10) || settings.capacity;
    const patternCount = Number.parseInt(ui.patternCountInput.value, 10) || settings.patternCount;
    const maxFixedCount = Math.min(3, capacity - 1, patternCount);
    ui.fixedCountInput.max = String(maxFixedCount);
    if (Number.parseInt(ui.fixedCountInput.value, 10) > maxFixedCount) {
      ui.fixedCountInput.value = String(maxFixedCount);
    }
    [
      ui.patternCountInput,
      ui.capacityInput,
      ui.reserveCountInput,
      ui.shuffleStepsInput,
      ui.mysteryCountInput,
      ui.fixedCountInput
    ].forEach(function (input) { input.disabled = !isCustom; });
    if (isCustom) {
      ui.difficultyHint.textContent = "自定义图案种类、列容量、暂存位、问号和打乱强度；固定白格会分散在不同列底部。";
    } else {
      const preset = PRESETS[ui.difficultySelect.value];
      const fixedHint = preset.fixedCount ? "；固定白格分散在不同列底部" : "";
      ui.difficultyHint.textContent = preset.label + "：" + preset.shuffleSteps + " 步打乱 · " + preset.reserveCount + " 个暂存位" + fixedHint + "。";
    }
  }

  function clampInteger(input, min, max, fallback) {
    const parsed = Number.parseInt(input.value, 10);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(min, Math.min(max, parsed));
  }

  function readSettingsForm() {
    const difficulty = ui.difficultySelect.value;
    if (difficulty !== "custom") return selectedPresetSettings(difficulty);
    const capacity = clampInteger(ui.capacityInput, 2, 12, settings.capacity);
    return {
      difficulty: "custom",
      patternCount: clampInteger(ui.patternCountInput, 2, 7, settings.patternCount),
      capacity: capacity,
      reserveCount: clampInteger(ui.reserveCountInput, 0, 8, settings.reserveCount),
      shuffleSteps: clampInteger(ui.shuffleStepsInput, 10, 2400, settings.shuffleSteps),
      mysteryCount: clampInteger(ui.mysteryCountInput, 0, 24, settings.mysteryCount),
      fixedCount: clampInteger(ui.fixedCountInput, 0, Math.min(3, capacity - 1, Number.parseInt(ui.patternCountInput.value, 10) || settings.patternCount), settings.fixedCount)
    };
  }

  function openSettings() {
    if (isAnimating) return;
    setFormValues(settings);
    if (typeof ui.settingsDialog.showModal === "function") ui.settingsDialog.showModal();
    else ui.settingsDialog.setAttribute("open", "");
  }

  function closeSettings() {
    if (typeof ui.settingsDialog.close === "function") ui.settingsDialog.close();
    else ui.settingsDialog.removeAttribute("open");
  }

  function handleColumnClick(event) {
    if (Date.now() < suppressClickUntil) return;
    const columnButton = event.target.closest('[data-kind="column"]');
    if (!columnButton || !ui.columns.contains(columnButton)) return;
    handleTarget("column", Number(columnButton.dataset.index));
  }

  function handleReserveClick(event) {
    if (Date.now() < suppressClickUntil) return;
    const reserveButton = event.target.closest('[data-kind="reserve"]');
    if (!reserveButton || !ui.reserveSlots.contains(reserveButton)) return;
    handleTarget("reserve", Number(reserveButton.dataset.index));
  }

  function setDragSource(event, element) {
    if (isAnimating) {
      event.preventDefault();
      return;
    }
    const kind = element.dataset.kind;
    const index = Number(element.dataset.index);
    if (kind === "column" && !topGroupSize(board.columns[index])) {
      event.preventDefault();
      return;
    }
    if (kind === "reserve" && !board.reserve[index]) {
      event.preventDefault();
      return;
    }
    selected = { kind: kind, index: index };
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", kind + ":" + index);
    announce(kind === "column" ? "拖动顶部图案组到目标列，或拖到暂存位收起一个。" : "拖动暂存图案到可以放入的列。");
  }

  function handleDrop(event, targetKind, targetIndex) {
    event.preventDefault();
    const payload = event.dataTransfer.getData("text/plain").split(":");
    if (payload.length !== 2) return;
    const sourceKind = payload[0];
    const sourceIndex = Number(payload[1]);
    selected = { kind: sourceKind, index: sourceIndex };
    suppressClickUntil = Date.now() + 400;
    handleTarget(targetKind, targetIndex);
  }

  ui.themeSelect.addEventListener("change", function (event) { applyTheme(event.target.value); });
  ui.soundToggle.addEventListener("click", function () {
    soundEnabled = !soundEnabled;
    updateSaveButton();
    persistLocalData(false);
    if (soundEnabled) playSound("move");
  });
  ui.vibrationToggle.addEventListener("change", function () {
    vibrationEnabled = ui.vibrationToggle.checked;
    if (vibrationEnabled && typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try { navigator.vibrate([30, 24, 42]); } catch (error) {}
    }
    persistLocalData(false);
  });
  ui.saveButton.addEventListener("click", openSaveDialog);
  ui.closeSaveButton.addEventListener("click", closeSaveDialog);
  ui.closeSaveFooterButton.addEventListener("click", closeSaveDialog);
  ui.saveSlotsList.addEventListener("click", handleSaveSlotAction);
  ui.settingsButton.addEventListener("click", openSettings);
  ui.closeSettingsButton.addEventListener("click", closeSettings);
  ui.cancelSettingsButton.addEventListener("click", closeSettings);
  ui.applySettingsButton.addEventListener("click", function () {
    if (isAnimating) return;
    settings = readSettingsForm();
    closeSettings();
    setNewGame();
  });
  ui.difficultySelect.addEventListener("change", function () {
    if (PRESETS[ui.difficultySelect.value]) {
      setFormValues(selectedPresetSettings(ui.difficultySelect.value));
    } else {
      updateCustomControls();
    }
  });
  ui.capacityInput.addEventListener("input", updateCustomControls);
  ui.columns.addEventListener("click", handleColumnClick);
  ui.reserveSlots.addEventListener("click", handleReserveClick);
  ui.columns.addEventListener("dragstart", function (event) {
    const element = event.target.closest('[data-kind="column"]');
    if (element) setDragSource(event, element);
  });
  ui.reserveSlots.addEventListener("dragstart", function (event) {
    const element = event.target.closest('[data-kind="reserve"]');
    if (element) setDragSource(event, element);
  });
  ui.columns.addEventListener("dragover", function (event) { event.preventDefault(); });
  ui.reserveSlots.addEventListener("dragover", function (event) { event.preventDefault(); });
  ui.columns.addEventListener("drop", function (event) {
    const element = event.target.closest('[data-kind="column"]');
    if (element) handleDrop(event, "column", Number(element.dataset.index));
  });
  ui.reserveSlots.addEventListener("drop", function (event) {
    const element = event.target.closest('[data-kind="reserve"]');
    if (element) handleDrop(event, "reserve", Number(element.dataset.index));
  });
  ui.cancelSelectionButton.addEventListener("click", function () {
    clearSelection();
    announce("已取消选择。");
  });
  ui.restartButton.addEventListener("click", restartGame);
  ui.shuffleButton.addEventListener("click", function () {
    setNewGame("棋盘已重新打乱，新的挑战开始啦。");
  });
  ui.undoButton.addEventListener("click", undoMove);
  ui.newGameButton.addEventListener("click", setNewGame);
  ui.victoryNewGameButton.addEventListener("click", setNewGame);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && selected && !isAnimating && !ui.settingsDialog.open) {
      clearSelection();
      announce("已取消选择。");
    }
  });
  ui.settingsDialog.addEventListener("click", function (event) {
    if (event.target === ui.settingsDialog) closeSettings();
  });
  ui.saveDialog.addEventListener("click", function (event) {
    if (event.target === ui.saveDialog) closeSaveDialog();
  });

  if (loadLocalData()) {
    setFormValues(settings);
    render();
    announce("欢迎回来，已从存档 " + (activeSaveId + 1) + " 继续上次的进度。");
  } else {
    setFormValues(settings);
    setNewGame("欢迎来到海宝跳跳。困难挑战已经准备好了。");
  }
  updateSaveButton();
  window.addEventListener("pagehide", function () {
    if (!isAnimating) persistLocalData(true);
  });
})();
