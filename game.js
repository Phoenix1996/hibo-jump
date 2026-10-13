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
        { id: "p1", name: "超梦", glyph: "💜", color: "#a078c8", image: "assets/themes/pokemon/超梦.webp" },
        { id: "p2", name: "杰尼龟", glyph: "💧", color: "#65a9d1", image: "assets/themes/pokemon/杰尼龟.webp" },
        { id: "p3", name: "可达鸭", glyph: "🦆", color: "#e8bd4e", image: "assets/themes/pokemon/可达鸭.webp" },
        { id: "p4", name: "妙蛙种子", glyph: "🌱", color: "#67a66b", image: "assets/themes/pokemon/妙蛙种子 (2).webp" },
        { id: "p5", name: "皮卡丘", glyph: "⚡", color: "#e5bb43", image: "assets/themes/pokemon/皮卡丘.webp" },
        { id: "p6", name: "仙子伊布", glyph: "🎀", color: "#cb8cba", image: "assets/themes/pokemon/仙子伊布.webp" },
        { id: "p7", name: "小火龙", glyph: "🔥", color: "#e58b55", image: "assets/themes/pokemon/小火龙.webp" }
      ]
    },
    "pokemon-2": {
      id: "pokemon-2",
      name: "宝可梦徽章主题",
      patterns: [
        { id: "p1", name: "徽章伙伴 01", glyph: "🐉", color: "#d8aa62", image: "assets/themes/pokemon-2/10662101-a808-4b0b-80e0-83e38c90b9ca.webp" },
        { id: "p2", name: "徽章伙伴 02", glyph: "🍃", color: "#78b77a", image: "assets/themes/pokemon-2/32dfc1c7-085d-462a-a9ab-502df96fd390.webp" },
        { id: "p3", name: "徽章伙伴 03", glyph: "😴", color: "#7bb6c4", image: "assets/themes/pokemon-2/340914f4-d72f-4568-b705-46a3c206f744.webp" },
        { id: "p4", name: "徽章伙伴 04", glyph: "🌙", color: "#8f7fbd", image: "assets/themes/pokemon-2/677d193c-1e67-44b5-a854-1e5eae5970bf.webp" },
        { id: "p5", name: "徽章伙伴 05", glyph: "🔥", color: "#dc7452", image: "assets/themes/pokemon-2/74ea19f1-43bc-496f-965d-6f4472eda4c5.webp" },
        { id: "p6", name: "徽章伙伴 06", glyph: "✨", color: "#d783b7", image: "assets/themes/pokemon-2/7695ac6b-e28d-4404-8bb9-e6e5ed611fbd.webp" },
        { id: "p7", name: "徽章伙伴 07", glyph: "💙", color: "#628ac3", image: "assets/themes/pokemon-2/d7a28cea-f41a-4579-9e25-ee6070c7429c.webp" }
      ]
    },
    digimon: {
      id: "digimon",
      name: "数码宝贝主题",
      patterns: [
        { id: "p1", name: "数码伙伴 01", glyph: "🌿", color: "#81aa67", image: "assets/themes/digimon/01c6440d-c38e-4a00-ba88-f68bc7a3ffc1.webp" },
        { id: "p2", name: "数码伙伴 02", glyph: "🦊", color: "#daa955", image: "assets/themes/digimon/0cbedb23-3712-4f74-8bbf-31f2116362eb.webp" },
        { id: "p3", name: "数码伙伴 03", glyph: "🔥", color: "#dc9857", image: "assets/themes/digimon/8baa6bc8-d4a5-492f-bec5-5721c9a1985c.webp" },
        { id: "p4", name: "数码伙伴 04", glyph: "🌸", color: "#d98eb0", image: "assets/themes/digimon/932aab38-b902-4451-9689-8dde7b6ce3a7.webp" },
        { id: "p5", name: "数码伙伴 05", glyph: "🐺", color: "#8e9db2", image: "assets/themes/digimon/9b8da726-e7d9-44f9-8832-f5fcdcd962b2.webp" },
        { id: "p6", name: "数码伙伴 06", glyph: "⚪", color: "#afc5dc", image: "assets/themes/digimon/b78e61e2-7d47-45ef-8467-a1c6163931fe.webp" },
        { id: "p7", name: "数码伙伴 07", glyph: "💗", color: "#dd8cae", image: "assets/themes/digimon/ff3a266e-fcbc-40e2-9615-666a457124c3.webp" }
      ]
    }
  };

  const PRESETS = {
    easy: { label: "简单", patternCount: 3, capacity: 4, reserveCount: 4, shuffleSteps: 20, mysteryCount: 0, fixedCount: 0 },
    normal: { label: "普通", patternCount: 4, capacity: 4, reserveCount: 2, shuffleSteps: 45, mysteryCount: 4, fixedCount: 1 },
    hard: { label: "困难", patternCount: 7, capacity: 12, reserveCount: 8, shuffleSteps: 2400, mysteryCount: 48, fixedCount: 3 }
  };

  const CAMPAIGN_LEVEL_COUNT = 30;
  const DEFAULT_SETTINGS = { difficulty: "hard", patternCount: 7, capacity: 12, reserveCount: 8, shuffleSteps: 2400, mysteryCount: 48, fixedCount: 3 };
  const BOARD_GENERATION_VERSION = 3;
  const STORAGE_KEY = "haibao-jump.local.v1";
  const SAVE_SLOT_COUNT = 3;

  function campaignSettingsForLevel(level) {
    level = Math.max(1, Math.min(CAMPAIGN_LEVEL_COUNT, Number.parseInt(level, 10) || 1));
    if (level <= 5) {
      return { difficulty: "custom", patternCount: 3, capacity: 4, reserveCount: 4,
        shuffleSteps: 20 + (level - 1) * 20, mysteryCount: Math.max(0, level - 3), fixedCount: 0 };
    }
    if (level <= 10) {
      return { difficulty: "custom", patternCount: 4, capacity: 6, reserveCount: 4,
        shuffleSteps: 140 + (level - 6) * 55, mysteryCount: level - 5, fixedCount: 0 };
    }
    if (level <= 15) {
      return { difficulty: "custom", patternCount: 5, capacity: 8, reserveCount: 5,
        shuffleSteps: 400 + (level - 11) * 85, mysteryCount: 6 + (level - 11) * 2, fixedCount: 1 };
    }
    if (level <= 20) {
      return { difficulty: "custom", patternCount: 6, capacity: 10, reserveCount: 6,
        shuffleSteps: 850 + (level - 16) * 80, mysteryCount: 14 + (level - 16) * 2, fixedCount: 2 };
    }
    return { difficulty: "custom", patternCount: 7, capacity: 12, reserveCount: 8,
      shuffleSteps: 1250 + (level - 21) * 100, mysteryCount: Math.min(48, 20 + (level - 21) * 2), fixedCount: 3 };
  }
  const ui = {
    themeSelect: document.getElementById("themeSelect"),
    brandSubtitle: document.getElementById("brandSubtitle"),
    gameTitle: document.getElementById("gameTitle"),
    campaignButton: document.getElementById("campaignButton"),
    campaignDialog: document.getElementById("campaignDialog"),
    closeCampaignButton: document.getElementById("closeCampaignButton"),
    closeCampaignFooterButton: document.getElementById("closeCampaignFooterButton"),
    campaignProgress: document.getElementById("campaignProgress"),
    campaignLevelGrid: document.getElementById("campaignLevelGrid"),
    dailyChallengeButton: document.getElementById("dailyChallengeButton"),
    dailyChallengeDate: document.getElementById("dailyChallengeDate"),
    dailyChallengeMeta: document.getElementById("dailyChallengeMeta"),
    dailyChallengeAction: document.getElementById("dailyChallengeAction"),
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
    boardLoading: document.getElementById("boardLoading"),
    boardLoadingTrack: document.querySelector(".board-loading-track"),
    boardLoadingProgress: document.getElementById("boardLoadingProgress"),
    boardLoadingLabel: document.getElementById("boardLoadingLabel"),
    cancelSelectionButton: document.getElementById("cancelSelectionButton"),
    restartButton: document.getElementById("restartButton"),
    newGameButton: document.getElementById("newGameButton"),
    victoryBanner: document.getElementById("victoryBanner"),
    victoryNewGameButton: document.getElementById("victoryNewGameButton"),
    victoryButtonText: document.getElementById("victoryButtonText"),
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
    shuffleButtonText: document.getElementById("shuffleButtonText"),
    newGameButtonText: document.getElementById("newGameButtonText"),
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
  let campaignMode = false;
  let campaignLevel = 1;
  let campaignUnlockedLevel = 1;
  let dailyMode = false;
  let dailyChallengeDate = "";
  let dailyBest = null;
  let dailyHistory = Object.create(null);
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

  function localDateKey() {
    const date = new Date();
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  }

  function isValidDateKey(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value + "T00:00:00Z");
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function shiftDateKey(value, days) {
    const date = new Date(value + "T00:00:00Z");
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function dailyStreakCount(history, today) {
    let date = history[today] ? today : shiftDateKey(today, -1);
    let streak = 0;
    while (history[date]) {
      streak += 1;
      date = shiftDateKey(date, -1);
    }
    return streak;
  }

  function normalizeDailyHistory(source, legacyBest) {
    const history = Object.create(null);
    if (source && typeof source === "object" && !Array.isArray(source)) {
      Object.keys(source).forEach(function (date) {
        const moves = source[date];
        if (isValidDateKey(date) && Number.isInteger(moves) && moves > 0) history[date] = moves;
      });
    }
    if (legacyBest && isValidDateKey(legacyBest.date) && Number.isInteger(legacyBest.moves) && legacyBest.moves > 0) {
      if (!history[legacyBest.date] || legacyBest.moves < history[legacyBest.date]) {
        history[legacyBest.date] = legacyBest.moves;
      }
    }
    return history;
  }

  function formatDateKey(value) {
    if (!isValidDateKey(value)) return "今日";
    const parts = value.split("-");
    return Number(parts[1]) + "月" + Number(parts[2]) + "日";
  }

  function dateSeed(value) {
    let hash = 2166136261;
    const source = "hibo-jump-daily-v1:" + value;
    for (let index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) || 1;
  }

  function createSeededRandom(seed) {
    let state = seed >>> 0 || 0x9e3779b9;
    return function () {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      return (state >>> 0) / 4294967296;
    };
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
    if (!board || !columnIsSortedForCapacity(column, settings.capacity)) return false;
    const blankCount = column.filter(isBlankToken).length;
    const patternId = actualPatternId(column.find(function (token) { return !isBlankToken(token); }));
    // A white fixed cell stands for a tile missing from the puzzle, not an arbitrary
    // tile that happens to sit elsewhere on the board. Count columns and reserve together.
    return Boolean(patternId) && countPatternTiles(board, patternId) === settings.capacity - blankCount;
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
      mysteryCount: bounded(source.mysteryCount, DEFAULT_SETTINGS.mysteryCount, 0, 48),
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
    const snapshotCampaignMode = source.campaignMode === true;
    const snapshotDailyDate = isValidDateKey(source.dailyChallengeDate) ? source.dailyChallengeDate : "";
    const snapshotDailyMode = !snapshotCampaignMode && source.dailyMode === true && Boolean(snapshotDailyDate);
    let snapshotBoard = normalizeBoard(source.board, snapshotSettings);
    const snapshotInitial = normalizeBoard(source.initialBoard, snapshotSettings);
    if (!snapshotBoard) return null;
    const moveCount = Math.max(0, Math.min(999999, Number.parseInt(source.moveCount, 10) || 0));
    const sourceGenerationVersion = Number.parseInt(source.boardGenerationVersion, 10) || 0;
    let initialBoard = snapshotInitial || cloneBoard(snapshotBoard);
    let migratedBlankLayout = false;
    let regeneratedBoard = false;
    const unplayedBoard = moveCount === 0 && JSON.stringify(snapshotBoard) === JSON.stringify(initialBoard);
    const shouldRegenerate = unplayedBoard && (hasLegacyGuessCells(source.board) ||
      (snapshotSettings.difficulty === "hard" && sourceGenerationVersion < BOARD_GENERATION_VERSION));
    if (shouldRegenerate) {
      snapshotBoard = buildSolvableBoard(snapshotSettings, snapshotDailyMode ? dateSeed(snapshotDailyDate) : undefined);
      initialBoard = cloneBoard(snapshotBoard);
      migratedBlankLayout = hasLegacyGuessCells(source.board);
      regeneratedBoard = true;
    }
    migratedBlankLayout = migrateMissingBlankTiles(snapshotBoard, initialBoard, snapshotSettings) || migratedBlankLayout;
    return {
      settings: snapshotSettings,
      themeId: THEMES[source.themeId] ? source.themeId : "ocean",
      board: snapshotBoard,
      initialBoard: initialBoard,
      moveCount: moveCount,
      campaignMode: snapshotCampaignMode,
      campaignLevel: Math.max(1, Math.min(CAMPAIGN_LEVEL_COUNT, Number.parseInt(source.campaignLevel, 10) || 1)),
      dailyMode: snapshotDailyMode,
      dailyChallengeDate: snapshotDailyDate,
      boardGenerationVersion: BOARD_GENERATION_VERSION,
      migratedBlankLayout: migratedBlankLayout,
      regeneratedBoard: regeneratedBoard,
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
      campaignMode: campaignMode,
      campaignLevel: campaignLevel,
      dailyMode: dailyMode,
      dailyChallengeDate: dailyChallengeDate,
      boardGenerationVersion: BOARD_GENERATION_VERSION,
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
    campaignMode = normalized.campaignMode;
    campaignLevel = normalized.campaignLevel;
    dailyMode = normalized.dailyMode;
    dailyChallengeDate = normalized.dailyChallengeDate;
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
    campaignUnlockedLevel = Math.max(1, Math.min(CAMPAIGN_LEVEL_COUNT, Number.parseInt(stored.campaignUnlockedLevel, 10) || 1));
    currentThemeId = THEMES[stored.themeId] ? stored.themeId : "ocean";
    soundEnabled = stored.soundEnabled !== false;
    vibrationEnabled = stored.vibrationEnabled !== false;
    dailyBest = stored.dailyBest && isValidDateKey(stored.dailyBest.date) &&
      Number.isInteger(stored.dailyBest.moves) && stored.dailyBest.moves > 0
      ? { date: stored.dailyBest.date, moves: stored.dailyBest.moves }
      : null;
    dailyHistory = normalizeDailyHistory(stored.dailyHistory, dailyBest);
    activeSaveId = Math.max(0, Math.min(SAVE_SLOT_COUNT - 1, Number.parseInt(stored.activeSaveId, 10) || 0));
    saveSlots = Array.from({ length: SAVE_SLOT_COUNT }, function (_, index) {
      return normalizeSnapshot(Array.isArray(stored.saveSlots) ? stored.saveSlots[index] : null);
    });
    const activeLayoutMigrated = Boolean(saveSlots[activeSaveId] &&
      (saveSlots[activeSaveId].migratedBlankLayout || saveSlots[activeSaveId].regeneratedBoard));
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
      campaignUnlockedLevel: campaignUnlockedLevel,
      dailyBest: dailyBest,
      dailyHistory: dailyHistory,
      saveSlots: saveSlots.map(function (snapshot) {
        if (!snapshot) return null;
        const storedSnapshot = Object.assign({}, snapshot);
        delete storedSnapshot.migratedBlankLayout;
        delete storedSnapshot.regeneratedBoard;
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
        const saveMode = snapshot.campaignMode ? "第 " + snapshot.campaignLevel + " 关" : savedDifficulty;
        details = saveMode + " · " + THEMES[snapshot.themeId].name + " · " +
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

  function renderCampaignLevels() {
    const today = localDateKey();
    const dailyActive = dailyMode && dailyChallengeDate === today;
    const todayBest = dailyHistory[today];
    const completedDailyDays = Object.keys(dailyHistory).length;
    const dailyStreak = dailyStreakCount(dailyHistory, today);
    ui.dailyChallengeDate.textContent = formatDateKey(today);
    ui.dailyChallengeMeta.textContent = todayBest
      ? "本日最佳 " + todayBest + " 步 · 连胜 " + dailyStreak + " 天"
      : dailyStreak
        ? "连续通关 " + dailyStreak + " 天 · 完成今日可延续"
        : completedDailyDays
          ? "每日更新 · 累计通关 " + completedDailyDays + " 天"
        : "每天更新 · 同日玩家玩同一盘";
    ui.dailyChallengeAction.textContent = dailyActive ? "重开今日" : "开始挑战";
    ui.dailyChallengeButton.setAttribute("aria-label", dailyActive
      ? "重开 " + formatDateKey(today) + " 的每日挑战"
      : "开始 " + formatDateKey(today) + " 的每日挑战");
    ui.campaignProgress.textContent = "已解锁 " + campaignUnlockedLevel + " / " + CAMPAIGN_LEVEL_COUNT + " 关";
    ui.campaignLevelGrid.innerHTML = Array.from({ length: CAMPAIGN_LEVEL_COUNT }, function (_, index) {
      const level = index + 1;
      const locked = level > campaignUnlockedLevel;
      const current = campaignMode && level === campaignLevel;
      const completed = level < campaignUnlockedLevel;
      const stateClass = locked ? " is-locked" : (current ? " is-current" : (completed ? " is-complete" : ""));
      const stateLabel = locked ? "未解锁" : (current ? "当前关卡" : (completed ? "已通过" : "已解锁"));
      return '<button class="campaign-level-button' + stateClass + '" type="button"' +
        ' data-campaign-level="' + level + '" aria-label="第 ' + level + ' 关，' + stateLabel + '"' +
        (locked ? " disabled" : "") + (current ? ' aria-current="step"' : "") + '>' +
        '<strong>' + level + '</strong><small>' + stateLabel + '</small></button>';
    }).join("");
  }

  function openCampaignDialog() {
    if (isAnimating) return;
    renderCampaignLevels();
    if (typeof ui.campaignDialog.showModal === "function") ui.campaignDialog.showModal();
    else ui.campaignDialog.setAttribute("open", "");
  }

  function closeCampaignDialog() {
    if (typeof ui.campaignDialog.close === "function") ui.campaignDialog.close();
    else ui.campaignDialog.removeAttribute("open");
  }

  async function startCampaignLevel(level) {
    if (isAnimating) return;
    campaignMode = true;
    dailyMode = false;
    dailyChallengeDate = "";
    campaignLevel = Math.max(1, Math.min(campaignUnlockedLevel, CAMPAIGN_LEVEL_COUNT, Number.parseInt(level, 10) || 1));
    settings = campaignSettingsForLevel(campaignLevel);
    closeCampaignDialog();
    setFormValues(settings);
    const newBoard = await buildSolvableBoardWithProgress(settings);
    if (!newBoard) return;
    selected = null;
    moveCount = 0;
    moveHistory = [];
    board = newBoard;
    initialBoard = cloneBoard(board);
    victoryCelebrated = false;
    clearCelebration();
    render();
    playBoardOpeningAnimation();
    persistLocalData(true);
    announce("第 " + campaignLevel + " 关开始。完成后会解锁下一关。");
  }

  async function startDailyChallenge(dateKey) {
    if (isAnimating) return;
    dailyChallengeDate = isValidDateKey(dateKey) ? dateKey : localDateKey();
    dailyMode = true;
    campaignMode = false;
    settings = selectedPresetSettings("hard");
    closeCampaignDialog();
    setFormValues(settings);
    const newBoard = await buildSolvableBoardWithProgress(settings, dateSeed(dailyChallengeDate));
    if (!newBoard) return;
    selected = null;
    moveCount = 0;
    moveHistory = [];
    board = newBoard;
    initialBoard = cloneBoard(board);
    victoryCelebrated = false;
    clearCelebration();
    render();
    playBoardOpeningAnimation();
    persistLocalData(true);
    announce("" + formatDateKey(dailyChallengeDate) + " 的每日挑战开始。同一天的棋盘相同。");
  }

  function handleDailyChallengeClick() {
    startDailyChallenge(localDateKey());
  }

  function handleCampaignLevelClick(event) {
    const button = event.target.closest("[data-campaign-level]");
    if (!button || !ui.campaignLevelGrid.contains(button) || button.disabled) return;
    startCampaignLevel(Number(button.dataset.campaignLevel));
  }

  function handleVictoryAction() {
    if (campaignMode && isVictory() && campaignLevel < CAMPAIGN_LEVEL_COUNT) {
      startCampaignLevel(campaignLevel + 1);
      return;
    }
    if (dailyMode) {
      startDailyChallenge(localDateKey());
      return;
    }
    setNewGame();
  }

  async function createGameInSlot(index) {
    closeSaveDialog();
    activeSaveId = index;
    const newBoard = await buildSolvableBoardWithProgress(settings, dailyMode ? dateSeed(dailyChallengeDate) : undefined);
    if (!newBoard) return;
    selected = null;
    moveCount = 0;
    moveHistory = [];
    board = newBoard;
    initialBoard = cloneBoard(board);
    victoryCelebrated = false;
    clearCelebration();
    render();
    playBoardOpeningAnimation();
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
          board = buildSolvableBoard(settings, dailyMode ? dateSeed(dailyChallengeDate) : undefined);
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

  function playSound(kind, variant, sequenceIndex) {
    if (!soundEnabled) return;
    const context = prepareAudioContext();
    if (!context) return;
    try {
      const tileNotes = [392, 440, 523.25, 587.33, 659.25, 783.99, 880];
      const tileIndex = kind === "tile"
        ? Math.max(0, getTheme().patterns.findIndex(function (pattern) { return pattern.id === actualPatternId(variant); }))
        : 0;
      const pitchSteps = [0, 2, 4, 5, 7, 9, 11, 12];
      const tileFrequency = tileNotes[tileIndex % tileNotes.length] *
        Math.pow(2, pitchSteps[Math.min(pitchSteps.length - 1, Math.max(0, sequenceIndex || 0))] / 12);
      const notes = kind === "win" ? [523.25, 659.25, 783.99, 1046.5] :
        kind === "wrong" ? [246.94, 196] :
        kind === "stash" ? [493.88] :
        kind === "reveal" ? [587.33, 783.99] :
        kind === "tile" ? [tileFrequency] : [659.25];
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

  function vibrateOnLanding(shortPulse) {
    if (!vibrationEnabled || typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
    try {
      const accepted = navigator.vibrate(shortPulse ? 12 : [32, 18, 42]);
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

  function randomIndex(max, randomSource) {
    return Math.floor((randomSource || Math.random)() * max);
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
    let largestTopGroup = 0;
    let solvedColumns = 0;
    const repeatedRuns = { 2: 0 };
    let patternRunCount = 0;
    columns.forEach(function (column) {
      if (!column.length) return;
      largestTopGroup = Math.max(largestTopGroup, topGroupSize(column));
      const colors = new Set();
      let previousPattern = null;
      let runLength = 0;
      let columnRunCount = 0;
      function scoreRun(length) {
        if (length > 0) {
          patternRunCount += 1;
          columnRunCount += 1;
        }
        if (length === 2) repeatedRuns[2] += 1;
      }
      column.forEach(function (token) {
        if (isBlankToken(token)) {
          scoreRun(runLength);
          previousPattern = null;
          runLength = 0;
          return;
        }
        const patternId = actualPatternId(token);
        colors.add(patternId);
        if (patternId === previousPattern) {
          runLength += 1;
        } else {
          scoreRun(runLength);
          previousPattern = patternId;
          runLength = 1;
        }
        largestRun = Math.max(largestRun, runLength);
      });
      scoreRun(runLength);
      if (colors.size > 1) score += colors.size * 15;
      score += columnRunCount * 3;
      if (columnIsSortedForCapacity(column, capacity)) solvedColumns += 1;
    });
    const topGroupPenalty = Math.max(0, largestTopGroup - 1) ** 2 * 8;
    const pairRate = patternRunCount ? repeatedRuns[2] / patternRunCount : 0;
    return {
      score: score - topGroupPenalty - solvedColumns * 60,
      largestRun: largestRun,
      solvedColumns: solvedColumns,
      pairCount: repeatedRuns[2],
      runCount: patternRunCount,
      pairRate: pairRate
    };
  }

  function normalizeHardBoardShape(sourceColumns, currentSettings, pickIndex) {
    const patternColumnCount = currentSettings.patternCount;
    const spareColumnIndex = patternColumnCount;
    const candidateLayouts = [];

    for (let shortColumnIndex = 0; shortColumnIndex < patternColumnCount; shortColumnIndex += 1) {
      const targetHeights = Array(patternColumnCount + 1).fill(currentSettings.capacity);
      targetHeights[shortColumnIndex] = currentSettings.capacity - 1;
      targetHeights[spareColumnIndex] = 1;
      const distance = sourceColumns.reduce(function (total, column, index) {
        return total + Math.abs(column.length - targetHeights[index]);
      }, 0);
      candidateLayouts.push({ shortColumnIndex: shortColumnIndex, targetHeights: targetHeights, distance: distance, tie: pickIndex(1000000) });
    }
    candidateLayouts.sort(function (left, right) {
      return left.distance - right.distance || left.tie - right.tie;
    });

    for (let layoutIndex = 0; layoutIndex < candidateLayouts.length; layoutIndex += 1) {
      const targetHeights = candidateLayouts[layoutIndex].targetHeights;
      if (currentSettings.reserveCount < 1) continue;
      const columns = sourceColumns.map(function (column) { return column.slice(); });
      const visited = new Set();
      let exploredStates = 0;
      const stateBudget = 900;
      function searchShape() {
        const heightsMatch = columns.every(function (column, index) { return column.length === targetHeights[index]; });
        if (heightsMatch) return true;
        if (exploredStates >= stateBudget) return false;
        exploredStates += 1;

        const stateKey = columns.map(function (column) { return column.join(","); }).join("|");
        if (visited.has(stateKey)) return false;
        visited.add(stateKey);

        const deficits = [];
        columns.forEach(function (column, index) {
          if (column.length < targetHeights[index] && !columnIsSortedForCapacity(column, currentSettings.capacity)) {
            deficits.push(index);
          }
        });

        const directTransfers = [];
        columns.forEach(function (donor, donorIndex) {
          if (donor.length <= targetHeights[donorIndex]) return;
          const groupSize = topGroupSize(donor);
          if (!groupSize) return;
          const patternId = actualPatternId(donor[donor.length - 1]);
          // After taking one icon into a reserve slot, the source must still
          // accept that icon if the layout adjustment is undone.
          if (groupSize < 2 && donor.length > 1) return;
          deficits.forEach(function (targetIndex) {
            if (targetIndex === donorIndex) return;
            const target = columns[targetIndex];
            const targetTopPattern = target.length ? actualPatternId(target[target.length - 1]) : null;
            if (target.length >= currentSettings.capacity || (targetTopPattern && targetTopPattern !== patternId) ||
                wouldCompleteColumnAfterAdding(target, patternId, currentSettings.capacity)) return;
            directTransfers.push({ donorIndex: donorIndex, targetIndex: targetIndex, patternId: patternId });
          });
        });

        for (let index = directTransfers.length - 1; index > 0; index -= 1) {
          const swapIndex = pickIndex(index + 1);
          const transfer = directTransfers[index];
          directTransfers[index] = directTransfers[swapIndex];
          directTransfers[swapIndex] = transfer;
        }
        for (let index = 0; index < directTransfers.length; index += 1) {
          const transfer = directTransfers[index];
          const donor = columns[transfer.donorIndex];
          // Rebalance through a one-tile reserve move so stack grouping rules are preserved.
          const token = donor.pop();
          columns[transfer.targetIndex].push(token);
          if (searchShape()) return true;
          columns[transfer.targetIndex].pop();
          donor.push(token);
        }
        return false;
      }
      if (searchShape()) return { columns: columns, shortColumnIndex: candidateLayouts[layoutIndex].shortColumnIndex };
    }

    return null;
  }

  function* generateSolvableBoardSteps(currentSettings, seed) {
    if (currentSettings.difficulty === "hard") {
      return yield* window.HiboLevels.generate(currentSettings, seed);
    }
    const randomSource = Number.isInteger(seed) ? createSeededRandom(seed) : Math.random;
    const pickIndex = function (max) { return randomIndex(max, randomSource); };
    const fixedCount = Math.min(currentSettings.fixedCount, currentSettings.capacity - 1, currentSettings.patternCount);
    // Fix the number of columns holding white spaces for the whole generation run;
    // otherwise quality selection across multiple candidates would favor spreading them.
    const blankDistributionRoll = pickIndex(100);
    const blankPatternCount = fixedCount === 0 ? 0 : fixedCount === 1 ? 1 :
      fixedCount === 2 ? (blankDistributionRoll < 65 ? 1 : 2) :
        (blankDistributionRoll < 40 ? 1 : blankDistributionRoll < 80 ? 2 : 3);
    // Compare a small pool of reverse walks, keep their solvable path, and
    // prefer boards with no adjacent matching patterns. Hard boards never
    // retain a run longer than two.
    const isHardMode = currentSettings.difficulty === "hard";
    const attemptCount = isHardMode ? 16 : 1;
    const reverseLookback = Math.min(16, Math.max(10, currentSettings.patternCount * 2));
    let bestColumns = null;
    let bestReverseSteps = -1;
    let bestQuality = -Infinity;
    let bestPairCount = Infinity;
    let bestShapedColumns = null;
    let bestShapedQuality = null;

    function shapedBoardIsBetter(quality, previousQuality) {
      if (!previousQuality) return true;
      if (quality.solvedColumns !== previousQuality.solvedColumns) {
        return quality.solvedColumns < previousQuality.solvedColumns;
      }
      if (quality.largestRun !== previousQuality.largestRun) return quality.largestRun < previousQuality.largestRun;
      if (quality.pairCount !== previousQuality.pairCount) return quality.pairCount < previousQuality.pairCount;
      return quality.score > previousQuality.score;
    }

    for (let attempt = 0; attempt < attemptCount; attempt += 1) {
      const availablePatterns = [];
      for (let index = 0; index < currentSettings.patternCount; index += 1) availablePatterns.push(index + 1);
      for (let index = availablePatterns.length - 1; index > 0; index -= 1) {
        const swapIndex = pickIndex(index + 1);
        const value = availablePatterns[index];
        availablePatterns[index] = availablePatterns[swapIndex];
        availablePatterns[swapIndex] = value;
      }
      const blankCountsByPattern = new Map();
      availablePatterns.slice(0, blankPatternCount).forEach(function (index) {
        blankCountsByPattern.set("p" + index, 1);
      });
      for (let blankIndex = blankPatternCount; blankIndex < fixedCount; blankIndex += 1) {
        const eligiblePatterns = Array.from(blankCountsByPattern.keys()).filter(function (patternId) {
          return blankCountsByPattern.get(patternId) < currentSettings.capacity - 1;
        });
        const patternId = eligiblePatterns[pickIndex(eligiblePatterns.length)];
        blankCountsByPattern.set(patternId, blankCountsByPattern.get(patternId) + 1);
      }
      const columns = [];
      for (let patternIndex = 0; patternIndex < currentSettings.patternCount; patternIndex += 1) {
        const patternId = "p" + (patternIndex + 1);
        const column = [];
        for (let blankIndex = 0; blankIndex < (blankCountsByPattern.get(patternId) || 0); blankIndex += 1) {
          column.push("blank");
        }
        while (column.length < currentSettings.capacity) column.push(patternId);
        columns.push(column);
      }
      columns.push([]);
      const reserve = Array(currentSettings.reserveCount).fill(null);

      const recentReverseMoves = [];
      const blockedReverseMoveKeys = new Set();
      function reverseMoveKey(move) {
        return move.targetKind + ":" + move.targetIndex + ">" + move.sourceKind + ":" + move.sourceIndex + ":" + move.patternId;
      }
      function moveKey(move) {
        return move.sourceKind + ":" + move.sourceIndex + ">" + move.targetKind + ":" + move.targetIndex + ":" + move.patternId;
      }
      let completedReverseSteps = 0;
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
            const targetTopPattern = target.length ? actualPatternId(target[target.length - 1]) : null;
            const targetGroupSize = targetTopPattern === patternId ? topGroupSize(target) : 0;
            // Avoid creating visible matching pairs where another move is available.
            // A pair may still be necessary when all legal destinations join a group.
            if ((isHardMode && targetGroupSize >= 2) ||
                (!isHardMode && targetTopPattern === patternId)) continue;
            if (target.length >= currentSettings.capacity) continue;
            // A column that becomes complete during reverse scrambling would be locked
            // before the earlier reverse moves could be undone in normal play.
            if (wouldCompleteColumnAfterAdding(target, patternId, currentSettings.capacity)) continue;
            candidates.push({
              sourceKind: "column", sourceIndex: donorIndex,
              targetKind: "column", targetIndex: targetIndex,
              patternId: patternId,
              joinsGroup: targetGroupSize === 1
            });
          }

          // Reverse a normal tray deposit: take a tile from a solved or mixed
          // column and place it in an empty reserve slot.
          for (let reserveIndex = 0; reserveIndex < reserve.length; reserveIndex += 1) {
            if (reserve[reserveIndex] !== null) continue;
            candidates.push({
              sourceKind: "column", sourceIndex: donorIndex,
              targetKind: "reserve", targetIndex: reserveIndex,
              patternId: patternId,
              joinsGroup: false
            });
          }
        }

        // Reverse a normal tray pickup. Unlike column-to-column moves, the
        // original move had no color-matching restriction, so this spreads
        // held tiles across different stacks and breaks up long runs.
        for (let reserveIndex = 0; reserveIndex < reserve.length; reserveIndex += 1) {
          const patternId = actualPatternId(reserve[reserveIndex]);
          if (!patternId) continue;
          for (let targetIndex = 0; targetIndex < columns.length; targetIndex += 1) {
            const target = columns[targetIndex];
            const targetTopPattern = target.length ? actualPatternId(target[target.length - 1]) : null;
            const targetGroupSize = targetTopPattern === patternId ? topGroupSize(target) : 0;
            if (isHardMode && targetGroupSize >= 2) continue;
            if (columnIsSortedForCapacity(target, currentSettings.capacity)) continue;
            if (target.length >= currentSettings.capacity) continue;
            if (wouldCompleteColumnAfterAdding(target, patternId, currentSettings.capacity)) continue;
            candidates.push({
              sourceKind: "reserve", sourceIndex: reserveIndex,
              targetKind: "column", targetIndex: targetIndex,
              patternId: patternId,
              joinsGroup: targetGroupSize === 1
            });
          }
        }

        const choices = candidates.filter(function (candidate) {
          return !blockedReverseMoveKeys.has(moveKey(candidate));
        });
        const availableChoices = choices.length ? choices : candidates;
        if (!availableChoices.length) break;

        const pairChoices = availableChoices.filter(function (candidate) { return candidate.joinsGroup; });
        const nonPairChoices = availableChoices.filter(function (candidate) { return !candidate.joinsGroup; });
        let chosen;
        if (isHardMode && pairChoices.length && nonPairChoices.length) {
          chosen = nonPairChoices[pickIndex(nonPairChoices.length)];
        } else {
          chosen = availableChoices[pickIndex(availableChoices.length)];
        }
        const token = chosen.sourceKind === "column"
          ? columns[chosen.sourceIndex].pop()
          : reserve[chosen.sourceIndex];
        if (chosen.sourceKind === "reserve") reserve[chosen.sourceIndex] = null;
        if (chosen.targetKind === "column") columns[chosen.targetIndex].push(token);
        else reserve[chosen.targetIndex] = token;
        recentReverseMoves.push(chosen);
        blockedReverseMoveKeys.add(reverseMoveKey(chosen));
        if (recentReverseMoves.length > reverseLookback) {
          blockedReverseMoveKeys.delete(reverseMoveKey(recentReverseMoves.shift()));
        }
        completedReverseSteps += 1;
        if ((step + 1) % 600 === 0) {
          const progress = ((attempt * currentSettings.shuffleSteps + step + 1) /
            (attemptCount * currentSettings.shuffleSteps)) * 96;
          yield { progress: Math.min(96, Math.round(progress)) };
        }
      }
      const randomWalkSteps = completedReverseSteps;

      // Keep the visible puzzle's tray empty. These are still legal reverse
      // moves: in the solve path, each tile is first moved from its column to
      // a free tray slot. The empty working column provides ample drain space.
      while (reserve.some(function (token) { return token !== null; })) {
        const releaseCandidates = [];
        for (let reserveIndex = 0; reserveIndex < reserve.length; reserveIndex += 1) {
          const patternId = actualPatternId(reserve[reserveIndex]);
          if (!patternId) continue;
          for (let targetIndex = 0; targetIndex < columns.length; targetIndex += 1) {
            const target = columns[targetIndex];
            const targetTopPattern = target.length ? actualPatternId(target[target.length - 1]) : null;
            const targetGroupSize = targetTopPattern === patternId ? topGroupSize(target) : 0;
            if (isHardMode && targetGroupSize >= 2) continue;
            if (columnIsSortedForCapacity(target, currentSettings.capacity)) continue;
            if (target.length >= currentSettings.capacity) continue;
            if (wouldCompleteColumnAfterAdding(target, patternId, currentSettings.capacity)) continue;
            releaseCandidates.push({ reserveIndex: reserveIndex, targetIndex: targetIndex, patternId: patternId });
          }
        }
        if (!releaseCandidates.length) break;

        const scoredReleases = releaseCandidates.map(function (candidate) {
          const target = columns[candidate.targetIndex];
          const topPattern = target.length ? actualPatternId(target[target.length - 1]) : null;
          const joinsGroup = topPattern === candidate.patternId;
          return { candidate: candidate, joinsGroup: joinsGroup };
        });
        const nonPairReleases = scoredReleases.filter(function (item) { return !item.joinsGroup; });
        const pairReleases = scoredReleases.filter(function (item) { return item.joinsGroup; });
        let bestReleases = nonPairReleases.length ? nonPairReleases : pairReleases;
        const chosenRelease = bestReleases[pickIndex(bestReleases.length)].candidate;
        const token = reserve[chosenRelease.reserveIndex];
        reserve[chosenRelease.reserveIndex] = null;
        columns[chosenRelease.targetIndex].push(token);
        completedReverseSteps += 1;
      }
      if (reserve.some(function (token) { return token !== null; })) continue;

      const alreadySolved = reserve.every(function (token) { return token === null; }) &&
        columns.filter(function (column) {
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
          completedReverseSteps += 1;
        }
      }

      let candidateColumns = columns;
      if (isHardMode) {
        const shapedBoard = normalizeHardBoardShape(columns, currentSettings, pickIndex);
        if (!shapedBoard) {
          yield { progress: Math.min(96, Math.round(((attempt + 1) / attemptCount) * 96)) };
          continue;
        }
        candidateColumns = shapedBoard.columns;
      }

      const quality = scrambleQuality(candidateColumns, currentSettings.capacity);
      // A hard start must not look like a mostly completed board. Keep at most
      // one already-complete column, and prefer candidates with none.
      if (isHardMode && quality.solvedColumns <= 1 && shapedBoardIsBetter(quality, bestShapedQuality)) {
        bestShapedColumns = candidateColumns.map(function (column) { return column.slice(); });
        bestShapedQuality = quality;
      }
      // Source game tiles are scored before mystery faces are added.
      if (isHardMode && quality.largestRun > 2) {
        yield { progress: Math.min(96, Math.round(((attempt + 1) / attemptCount) * 96)) };
        continue;
      }
      if (!bestColumns || randomWalkSteps > bestReverseSteps ||
          (randomWalkSteps === bestReverseSteps &&
            (quality.pairCount < bestPairCount ||
              (quality.pairCount === bestPairCount && quality.score > bestQuality)))) {
        bestReverseSteps = randomWalkSteps;
        bestQuality = quality.score;
        bestPairCount = quality.pairCount;
        bestColumns = candidateColumns;
      }
      yield { progress: Math.min(96, Math.round(((attempt + 1) / attemptCount) * 96)) };
    }

    const columns = bestColumns || bestShapedColumns;
    if (!columns) throw new Error("没有生成足够打乱的困难棋盘，请重新开始。");

    const mysteryCandidatesByNeighborMatches = [[], [], []];
    columns.forEach(function (column, columnIndex) {
      for (let level = 0; level < column.length - 1; level += 1) {
        const token = column[level];
        if (isFixedToken(token)) continue;
        const patternId = actualPatternId(token);
        let matchingNeighbors = 0;
        [level - 1, level + 1].forEach(function (neighborLevel) {
          if (neighborLevel >= 0 && neighborLevel < column.length &&
              !isFixedToken(column[neighborLevel]) &&
              actualPatternId(column[neighborLevel]) === patternId) matchingNeighbors += 1;
        });
        mysteryCandidatesByNeighborMatches[matchingNeighbors].push({ columnIndex: columnIndex, level: level });
      }
    });
    const mysteryCandidates = [];
    // Mask matching neighbors first so visible tiles do not form accidental
    // pairs. The hidden true pattern stays in the solvable board underneath.
    [1, 2, 0].forEach(function (neighborCount) {
      const bucket = mysteryCandidatesByNeighborMatches[neighborCount];
      for (let index = bucket.length - 1; index > 0; index -= 1) {
        const swapIndex = pickIndex(index + 1);
        const candidate = bucket[index];
        bucket[index] = bucket[swapIndex];
        bucket[swapIndex] = candidate;
      }
      mysteryCandidates.push.apply(mysteryCandidates, bucket);
    });
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

  function buildSolvableBoard(currentSettings, seed) {
    const generator = generateSolvableBoardSteps(currentSettings, seed);
    let step = generator.next();
    while (!step.done) step = generator.next();
    return step.value;
  }

  async function buildSolvableBoardWithProgress(currentSettings, seed) {
    isAnimating = true;
    ui.boardLoading.hidden = false;
    ui.boardLoadingProgress.style.width = "0%";
    ui.boardLoadingTrack.setAttribute("aria-valuenow", "0");
    ui.boardLoadingLabel.textContent = "正在准备棋盘 · 0%";
    setBoardCreationControlsDisabled(true);
    let generationWorker = null;
    function showProgress(progress, phase) {
      const value = Math.max(0, Math.min(96, progress || 0));
      ui.boardLoadingProgress.style.width = value + "%";
      ui.boardLoadingTrack.setAttribute("aria-valuenow", String(value));
      ui.boardLoadingLabel.textContent = (phase || "正在生成棋盘") + " · " + value + "%";
    }
    try {
      await new Promise(function (resolve) { window.requestAnimationFrame(resolve); });
      let generatedBoard;
      if (currentSettings.difficulty === "hard" && typeof Worker === "function" && window.location.protocol !== "file:") {
        generatedBoard = await new Promise(function (resolve, reject) {
          generationWorker = new Worker(new URL("level-worker.js?v=20261013-2", document.baseURI));
          generationWorker.onmessage = function (event) {
            const result = event.data;
            if (result.type === "progress") showProgress(result.progress, result.phase);
            else if (result.type === "complete") resolve(result.board);
            else if (result.type === "error") reject(new Error(result.message));
          };
          generationWorker.onerror = function () { reject(new Error("棋盘生成线程未能启动")); };
          generationWorker.postMessage({ settings: currentSettings, seed: seed });
        });
      } else {
        const generator = generateSolvableBoardSteps(currentSettings, seed);
        let step = generator.next();
        while (!step.done) {
          showProgress(step.value.progress, step.value.phase);
          await new Promise(function (resolve) { window.requestAnimationFrame(resolve); });
          step = generator.next();
        }
        generatedBoard = step.value;
      }

      ui.boardLoadingProgress.style.width = "100%";
      ui.boardLoadingTrack.setAttribute("aria-valuenow", "100");
      ui.boardLoadingLabel.textContent = "棋盘准备好了";
      await new Promise(function (resolve) { window.requestAnimationFrame(resolve); });
      ui.boardLoading.hidden = true;
      return generatedBoard;
    } catch (error) {
      ui.boardLoading.hidden = true;
      isAnimating = false;
      setBoardCreationControlsDisabled(false);
      render();
      announce("棋盘生成遇到问题，请再试一次。");
      return null;
    } finally {
      if (generationWorker) generationWorker.terminate();
    }
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
    return Math.max(180, Math.min(250, 180 + distance * 0.11));
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
    const duration = reducedMotion ? 70 : 130;
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
      duration: reducedMotion ? 75 : 100,
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
      escapeHtml(pattern.glyph) + '" loading="lazy" decoding="async" draggable="false">';
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

  function visualKeyForPattern(pattern) {
    return pattern.id + "|" + (pattern.image || pattern.glyph);
  }

  function createColumnMarkup(columnIndex) {
    const cells = [];
    for (let level = 0; level < settings.capacity; level += 1) {
      cells.push('<span class="stack-cell" data-level="' + level + '" style="grid-row:' +
        (settings.capacity - level) + '" aria-hidden="true"></span>');
    }
    return '<button class="column" type="button" data-kind="column" data-index="' + columnIndex + '">' +
      '<span class="column-meta"><span>列 ' + (columnIndex + 1) + '</span><span class="column-count"></span></span>' +
      '<span class="column-stack" style="--cell-count:' + settings.capacity + '">' + cells.join("") + '</span></button>';
  }

  function patchColumnElement(element, column, columnIndex) {
    const isComplete = columnIsSorted(column);
    const groupSize = topGroupSize(column);
    const isSelected = selected && selected.kind === "column" && selected.index === columnIndex;
    const canDrag = !isComplete && groupSize > 0;
    const title = column.length
      ? (isComplete ? "此列不能接收或移出图案" : (canDrag ? "移动顶部图案组" : "只有固定格，不能移动"))
      : "空列";
    element.classList.toggle("is-empty", column.length === 0);
    element.classList.toggle("is-complete", isComplete);
    element.classList.toggle("is-selected", Boolean(isSelected));
    element.draggable = canDrag;
    const description = columnDescription(column, columnIndex);
    if (element.getAttribute("aria-label") !== description) element.setAttribute("aria-label", description);
    if (element.title !== title) element.title = title;

    const countLabel = element.querySelector(".column-count");
    const countText = column.length + "/" + settings.capacity;
    if (countLabel.textContent !== countText) countLabel.textContent = countText;

    const stack = element.querySelector(".column-stack");
    for (let level = 0; level < settings.capacity; level += 1) {
      const cell = stack.children[level];
      const hasToken = level < column.length;
      const token = hasToken ? column[level] : null;
      const isBlank = isBlankToken(token);
      const isHidden = isMysteryToken(token);
      const isFixed = hasToken && isFixedToken(token);
      const pattern = hasToken && !isBlank ? getPattern(token) : null;
      const isTopGroup = hasToken && level >= column.length - groupSize;
      const className = "stack-cell" + (hasToken ? " tile" : " is-empty") +
        (isTopGroup ? " top-group" : "") + (isFixed ? " is-fixed-cell" : "") +
        (isBlank ? " is-blank-cell" : "") + (isHidden ? " mystery-hidden" : "") +
        (!isHidden && pattern && pattern.image ? " has-art" : "");
      if (cell.className !== className) cell.className = className;

      const patternId = isHidden || isBlank || !pattern ? "" : pattern.id;
      if (cell.dataset.patternId !== patternId) cell.dataset.patternId = patternId;
      let visualKey = "empty";
      if (isBlank) visualKey = "blank";
      else if (isHidden) visualKey = "mystery";
      else if (pattern) visualKey = visualKeyForPattern(pattern);
      if (cell.dataset.visualKey !== visualKey) {
        if (isHidden) cell.textContent = "?";
        else if (isBlank || !pattern) cell.textContent = "";
        else cell.innerHTML = patternVisualHtml(pattern);
        cell.dataset.visualKey = visualKey;
      }
      const patternColor = pattern && !isHidden ? pattern.color : "";
      if (cell.style.getPropertyValue("--pattern-color") !== patternColor) {
        if (patternColor) cell.style.setProperty("--pattern-color", patternColor);
        else cell.style.removeProperty("--pattern-color");
      }
    }
  }

  function ensureColumnElements() {
    const needsRebuild = ui.columns.children.length !== board.columns.length ||
      Array.from(ui.columns.children).some(function (element) {
        const stack = element.querySelector(".column-stack");
        return !stack || stack.children.length !== settings.capacity;
      });
    if (needsRebuild) {
      ui.columns.innerHTML = board.columns.map(function (_, index) { return createColumnMarkup(index); }).join("");
    }
    board.columns.forEach(function (column, index) {
      patchColumnElement(ui.columns.children[index], column, index);
    });
  }

  function ensureReserveElements() {
    const reserve = board.reserve;
    ui.reserveSection.hidden = !reserve.length;
    if (!reserve.length) {
      if (ui.reserveSlots.children.length) ui.reserveSlots.replaceChildren();
      return;
    }
    if (ui.reserveSlots.children.length !== reserve.length) {
      ui.reserveSlots.innerHTML = reserve.map(function (_, index) {
        return '<button class="reserve-slot" type="button" data-kind="reserve" data-index="' + index + '">' +
          '<span class="reserve-placeholder" aria-hidden="true">＋</span>' +
          '<span class="tile reserve-glyph" aria-hidden="true" hidden></span></button>';
      }).join("");
    }
    reserve.forEach(function (patternId, index) {
      const button = ui.reserveSlots.children[index];
      const isSelected = selected && selected.kind === "reserve" && selected.index === index;
      const filled = Boolean(patternId);
      const pattern = filled ? getPattern(patternId) : null;
      const glyph = button.querySelector(".reserve-glyph");
      const placeholder = button.querySelector(".reserve-placeholder");
      const className = "reserve-slot" + (filled ? " is-filled" : "") + (isSelected ? " is-selected" : "");
      if (button.className !== className) button.className = className;
      button.draggable = filled;
      const label = filled
        ? "暂存位 " + (index + 1) + "，" + pattern.name + "，点选后放回棋盘"
        : "暂存位 " + (index + 1) + "，空位";
      if (button.getAttribute("aria-label") !== label) button.setAttribute("aria-label", label);
      const title = filled ? "点选后放回棋盘" : "空暂存位";
      if (button.title !== title) button.title = title;
      glyph.hidden = !filled;
      placeholder.hidden = filled;
      if (!filled) return;
      glyph.classList.toggle("has-art", Boolean(pattern.image));
      const visualKey = visualKeyForPattern(pattern);
      if (glyph.dataset.visualKey !== visualKey) {
        glyph.innerHTML = patternVisualHtml(pattern);
        glyph.dataset.visualKey = visualKey;
      }
      if (glyph.style.getPropertyValue("--pattern-color") !== pattern.color) {
        glyph.style.setProperty("--pattern-color", pattern.color);
      }
    });
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
    const featuredVisualKey = visualKeyForPattern(featuredPattern);
    if (ui.floatingToken.dataset.visualKey !== featuredVisualKey) {
      ui.floatingToken.innerHTML = patternVisualHtml(featuredPattern);
      ui.floatingToken.dataset.visualKey = featuredVisualKey;
    }
    ensureColumnElements();
    ensureReserveElements();
    ui.moveCount.textContent = String(moveCount);
    ui.capacityLabel.textContent = String(settings.capacity);
    ui.difficultyBadge.textContent = campaignMode ? "闯关" : dailyMode ? "每日" : (settings.difficulty === "custom" ? "自定义" : PRESETS[settings.difficulty].label);
    ui.gameTitle.textContent = campaignMode ? "第 " + campaignLevel + " 关" : dailyMode ? "每日挑战" : "图案归列";
    ui.brandSubtitle.textContent = campaignMode
      ? "关卡进度 " + campaignLevel + "/" + CAMPAIGN_LEVEL_COUNT
      : dailyMode
        ? formatDateKey(dailyChallengeDate) + " · 同日同盘"
        : "自由挑战 · 慢慢通关";
    ui.campaignButton.setAttribute("aria-label", campaignMode
      ? "关卡闯关，当前第 " + campaignLevel + " 关，已解锁 " + campaignUnlockedLevel + " 关"
      : "关卡闯关，已解锁 " + campaignUnlockedLevel + " 关" + (dailyMode ? "；每日挑战进行中" : ""));
    const victoryButtonLabel = campaignMode && campaignLevel < CAMPAIGN_LEVEL_COUNT
      ? "下一关"
      : dailyMode ? "再挑战一次" : "再玩一局";
    if (ui.victoryButtonText.textContent !== victoryButtonLabel) ui.victoryButtonText.textContent = victoryButtonLabel;
    const shuffleLabel = dailyMode ? "换随机局" : "打乱";
    if (ui.shuffleButtonText.textContent !== shuffleLabel) ui.shuffleButtonText.textContent = shuffleLabel;
    ui.shuffleButton.setAttribute("aria-label", dailyMode ? "离开每日挑战并开始随机局" : "重新打乱棋盘");
    const newGameLabel = dailyMode ? "重开今日" : campaignMode ? "重开本关" : "新的一局";
    if (ui.newGameButtonText.textContent !== newGameLabel) ui.newGameButtonText.textContent = newGameLabel;
    ui.boardCaption.textContent = "每列最多 " + settings.capacity + " 格 · " +
      (settings.difficulty === "hard" ? "随机混排 · " + settings.mysteryCount + " 个隐藏图案" : settings.shuffleSteps + " 步打乱") +
      (settings.fixedCount ? " · 白格可能出现在同一列" : "");
    ui.cancelSelectionButton.hidden = !selected || isAnimating;
    ui.victoryBanner.hidden = isAnimating || !isVictory();
    ui.undoButton.disabled = isAnimating || moveHistory.length === 0;
    ui.saveButton.disabled = isAnimating;
    ui.soundToggle.setAttribute("aria-pressed", String(soundEnabled));
    updateSaveButton();
    ui.columns.style.setProperty("--column-count", board.columns.length);
  }

  function setBoardCreationControlsDisabled(disabled) {
    [ui.themeSelect, ui.settingsButton, ui.campaignButton, ui.dailyChallengeButton,
      ui.newGameButton, ui.restartButton, ui.shuffleButton, ui.undoButton, ui.saveButton]
      .forEach(function (control) { control.disabled = disabled; });
    if (disabled) {
      ui.columns.querySelectorAll(".column").forEach(function (element) { element.setAttribute("aria-disabled", "true"); });
      ui.reserveSlots.querySelectorAll(".reserve-slot").forEach(function (element) { element.setAttribute("aria-disabled", "true"); });
    } else {
      ui.columns.querySelectorAll(".column").forEach(function (element) { element.removeAttribute("aria-disabled"); });
      ui.reserveSlots.querySelectorAll(".reserve-slot").forEach(function (element) { element.removeAttribute("aria-disabled"); });
    }
  }

  function playBoardOpeningAnimation() {
    const cells = Array.from(ui.columns.querySelectorAll(".stack-cell.tile"));
    if (!cells.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ui.boardLoading.hidden = true;
      isAnimating = false;
      setBoardCreationControlsDisabled(false);
      render();
      return;
    }

    isAnimating = true;
    let lastDelay = 0;
    cells.forEach(function (cell) {
      const column = cell.closest(".column");
      const columnIndex = column ? Number(column.dataset.index) : 0;
      const level = Number(cell.dataset.level) || 0;
      const delay = columnIndex * 22 + level * 10;
      lastDelay = Math.max(lastDelay, delay);
      cell.style.setProperty("--opening-delay", delay + "ms");
    });

    setBoardCreationControlsDisabled(true);
    ui.columns.classList.add("is-opening");

    window.setTimeout(function () {
      ui.columns.classList.remove("is-opening");
      cells.forEach(function (cell) { cell.style.removeProperty("--opening-delay"); });
      isAnimating = false;
      setBoardCreationControlsDisabled(false);
      render();
    }, lastDelay + 470);
  }

  function clearSelection() {
    selected = null;
    render();
  }

  function selectSource(kind, index) {
    if (isAnimating || isVictory()) return;
    if (kind === "column" && columnIsSorted(board.columns[index])) {
      nudgeTarget("column", index);
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

  function createFlightTile(patternId, sourceRect, parent, origin, sourceElement) {
    const pattern = getPattern(patternId);
    const tile = document.createElement("span");
    tile.className = "flight-tile tile" + (isMysteryToken(patternId) ? " mystery-hidden" : "") +
      (!isMysteryToken(patternId) && pattern.image ? " has-art" : "");
    const offsetLeft = parent && parent !== ui.flightLayer && origin ? sourceRect.left - origin.left : sourceRect.left;
    const offsetTop = parent && parent !== ui.flightLayer && origin ? sourceRect.top - origin.top : sourceRect.top;
    tile.style.left = offsetLeft + "px";
    tile.style.top = offsetTop + "px";
    tile.style.width = sourceRect.width + "px";
    tile.style.height = sourceRect.height + "px";
    if (!isMysteryToken(patternId)) tile.style.setProperty("--pattern-color", pattern.color);
    if (sourceElement) {
      Array.from(sourceElement.childNodes).forEach(function (node) {
        tile.appendChild(node.cloneNode(true));
      });
    } else {
      tile.innerHTML = isMysteryToken(patternId) ? "?" : patternVisualHtml(pattern);
    }
    if (parent && parent !== ui.flightLayer) tile.style.position = "absolute";
    (parent || ui.flightLayer).appendChild(tile);
    return tile;
  }

  async function animateMove(move) {
    const source = sourceElements(move).filter(Boolean)[0];
    const oldDestination = destinationElements(move).filter(Boolean)[0];
    if (!source || !oldDestination) return false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const token = move.patternIds[0];
    const sourceRect = source.getBoundingClientRect();
    const initialTargetRect = centeredFlightRect(sourceRect, oldDestination.getBoundingClientRect());
    const flight = createFlightTile(token, sourceRect, null, null, source);
    const flightImage = flight.querySelector("img");
    if (flightImage) {
      flightImage.loading = "eager";
      if (typeof flightImage.decode === "function") await flightImage.decode().catch(function () {});
    }

    let revealCell = null;
    let revealedMystery = false;
    if (move.source.kind === "column") {
      const sourceColumn = board.columns[move.source.index];
      sourceColumn.pop();
      const nextTop = sourceColumn.length - 1;
      revealedMystery = nextTop >= 0 && isMysteryToken(sourceColumn[nextTop]);
      revealTopToken(sourceColumn);
    }
    if (move.source.kind === "reserve") board.reserve[move.source.index] = null;
    if (move.target.kind === "reserve") {
      board.reserve[move.target.index] = actualPatternId(token);
    } else {
      const targetColumn = board.columns[move.target.index];
      targetColumn.push(actualPatternId(token));
      revealTopToken(targetColumn);
    }
    render();

    const destination = move.target.kind === "reserve"
      ? ui.reserveSlots.querySelector('[data-kind="reserve"][data-index="' + move.target.index + '"]')
      : elementsForColumnLevels(move.target.index, board.columns[move.target.index].length - 1, 1)[0];
    if (!destination) {
      flight.remove();
      return true;
    }
    destination.classList.add("is-flying");
    if (revealedMystery) {
      const sourceColumn = board.columns[move.source.index];
      revealCell = elementsForColumnLevels(move.source.index, sourceColumn.length - 1, 1)[0];
    }
    const targetRect = centeredFlightRect(sourceRect, destination.getBoundingClientRect());
    const targetImage = destination.querySelector("img");
    if (targetImage) {
      targetImage.loading = "eager";
      if (typeof targetImage.decode === "function") await targetImage.decode().catch(function () {});
    }
    if (revealCell) {
      const revealedImage = revealCell.querySelector("img");
      if (revealedImage) {
        revealedImage.loading = "eager";
        if (typeof revealedImage.decode === "function") await revealedImage.decode().catch(function () {});
      }
    }

    await animateFlightTile(flight, sourceRect, targetRect, reducedMotion);
    await revealFlightTile(flight, token, sourceRect, targetRect, reducedMotion);
    flight.remove();
    destination.classList.remove("is-flying");
    await animateSourceReveal(revealCell, reducedMotion);
    playSound("tile", token);
    vibrateOnLanding();
    return true;
  }
  async function animateSourceReveal(cell, reducedMotion) {
    if (!cell || typeof cell.animate !== "function") return;
    const animation = cell.animate([
      { transform: "perspective(360px) rotateY(82deg) scale(.9)", opacity: .8 },
      { transform: "perspective(360px) rotateY(0) scale(1)", opacity: 1 }
    ], { duration: reducedMotion ? 70 : 130, easing: "cubic-bezier(.2,.75,.25,1)", fill: "none" });
    await animation.finished.catch(function () {});
  }

  async function animateGroupMove(move) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sourceColumn = board.columns[move.source.index];
    const targetColumn = board.columns[move.target.index];
    const sourceStart = sourceColumn.length - move.count;
    const targetStart = targetColumn.length;
    const sourceCells = elementsForColumnLevels(move.source.index, sourceStart, move.count);
    const targetCells = elementsForColumnLevels(move.target.index, targetStart, move.count);
    if (sourceCells.length !== move.count || targetCells.length !== move.count) return false;
    const sourceRects = sourceCells.map(cell => cell.getBoundingClientRect());
    const targetRects = targetCells.map(cell => cell.getBoundingClientRect());
    const sourceRim = sourceCells[0].closest(".column-stack").getBoundingClientRect().top;
    const targetRim = targetCells[0].closest(".column-stack").getBoundingClientRect().top;
    const tokens = sourceColumn.slice(sourceStart);
    const revealedMystery = sourceStart > 0 && isMysteryToken(sourceColumn[sourceStart - 1]);
    const flights = sourceCells.map(function (cell, index) {
      const flight = createFlightTile(tokens[index], sourceRects[index], null, null, cell);
      flight.style.visibility = "hidden";
      return flight;
    });
    await Promise.all(flights.map(function (flight) {
      const image = flight.querySelector("img");
      if (!image) return Promise.resolve();
      image.loading = "eager";
      return typeof image.decode === "function" ? image.decode().catch(function () {}) : Promise.resolve();
    }));

    const stagger = reducedMotion ? 0 : Math.max(28, 48 - move.count * 1.7);
    const horizontalDistance = Math.abs(targetRects[0].left - sourceRects[0].left);
    const duration = reducedMotion ? 90 : Math.min(320, 250 + horizontalDistance * 0.07);
    await Promise.all(flights.map(async function (_, order) {
      // The highest source tile departs first and occupies the lowest new slot.
      const sourceOffset = move.count - 1 - order;
      const flight = flights[sourceOffset];
      const sourceRect = sourceRects[sourceOffset];
      const targetRect = centeredFlightRect(sourceRect, targetRects[order]);
      if (order && stagger) await new Promise(resolve => window.setTimeout(resolve, order * stagger));
      sourceCells[sourceOffset].classList.add("is-flight-source");
      flight.style.visibility = "visible";
      playSound("tile", tokens[sourceOffset], order);
      const dx = targetRect.left - sourceRect.left;
      const dy = targetRect.top - sourceRect.top;
      const lift = sourceRect.height * 0.72 + 6;
      const exitY = sourceRim - sourceRect.top - lift;
      const entryY = targetRim - sourceRect.top - lift;
      const bridgeY = Math.min(exitY, entryY) - 12;
      const frames = reducedMotion ? [
        { transform: "translate3d(0,0,0)" },
        { transform: "translate3d(" + dx + "px," + dy + "px,0)" }
      ] : [
        { transform: "translate3d(0,0,0) scale(1)", offset: 0 },
        { transform: "translate3d(0," + exitY + "px,0) scale(1.03)", offset: 0.23 },
        { transform: "translate3d(" + dx + "px," + bridgeY + "px,0) scale(1.04)", offset: 0.59 },
        { transform: "translate3d(" + dx + "px," + entryY + "px,0) scale(1.02)", offset: 0.70 },
        { transform: "translate3d(" + dx + "px," + (dy + 2) + "px,0) scale(1.035,.96)", offset: 0.92 },
        { transform: "translate3d(" + dx + "px," + dy + "px,0) scale(1)", offset: 1 }
      ];
      if (typeof flight.animate === "function") {
        const animation = flight.animate(frames, { duration: duration, easing: "linear", fill: "forwards" });
        await animation.finished.catch(function () {});
      } else {
        await animateFlightTile(flight, sourceRect, targetRect, reducedMotion);
      }
      await revealFlightTile(flight, tokens[sourceOffset], sourceRect, targetRect, reducedMotion);
      vibrateOnLanding(true);
    }));

    // Commit once all flights have landed; keep overlays visible until decoded
    // destination images replace them in the same paint.
    sourceColumn.splice(sourceStart, move.count);
    targetColumn.push.apply(targetColumn, tokens.map(actualPatternId));
    revealTopToken(sourceColumn);
    render();
    targetCells.forEach(cell => cell.classList.add("is-flying"));
    const revealCell = revealedMystery ? elementsForColumnLevels(move.source.index, sourceStart - 1, 1)[0] : null;
    await Promise.all(targetCells.concat(revealCell ? [revealCell] : []).map(function (cell) {
      const image = cell.querySelector("img");
      if (!image) return Promise.resolve();
      image.loading = "eager";
      return typeof image.decode === "function" ? image.decode().catch(function () {}) : Promise.resolve();
    }));
    flights.forEach(flight => flight.remove());
    sourceCells.forEach(cell => cell.classList.remove("is-flight-source"));
    targetCells.forEach(cell => cell.classList.remove("is-flying"));
    await animateSourceReveal(revealCell, reducedMotion);
    return true;
  }

  async function performMove(move) {
    if (isAnimating) return;
    prepareAudioContext();
    const previousBoard = cloneBoard(board);
    const previousMoveCount = moveCount;
    let committed = false;
    isAnimating = true;
    try {
      ui.columns.classList.add("is-animating");
      ui.reserveSlots.classList.add("is-animating");
      ui.cancelSelectionButton.hidden = true;
      ui.themeSelect.disabled = true;
      ui.settingsButton.disabled = true;
      ui.campaignButton.disabled = true;
      ui.newGameButton.disabled = true;
      ui.restartButton.disabled = true;
      ui.shuffleButton.disabled = true;
      ui.undoButton.disabled = true;
      ui.saveButton.disabled = true;
      ui.columns.querySelectorAll(".column").forEach(function (element) { element.setAttribute("aria-disabled", "true"); });
      ui.reserveSlots.querySelectorAll(".reserve-slot").forEach(function (element) { element.setAttribute("aria-disabled", "true"); });

      if (move.type !== "column-group" && move.type !== "to-reserve" && move.type !== "from-reserve") playSound("move");
      const didMove = move.type === "column-group"
        ? await animateGroupMove(move)
        : await animateMove(move);
      if (!didMove) {
        selected = null;
        announce("移动没有完成，请再试一次。");
        return;
      }

      moveHistory.push({ board: previousBoard, moveCount: previousMoveCount });
      moveCount = previousMoveCount + 1;
      selected = null;
      committed = true;
      if (move.type === "column-group") {
        announce("已将顶部 " + move.count + " 个图案一起移入目标列。");
      } else if (move.type === "to-reserve") {
        announce("已暂存一个图案。");
      } else {
        announce("图案已放回列中。");
      }
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
    } catch (error) {
      if (!committed) {
        board = previousBoard;
        moveCount = previousMoveCount;
        ui.flightLayer.replaceChildren();
        ui.columns.querySelectorAll(".is-flying").forEach(function (element) { element.classList.remove("is-flying"); });
        ui.reserveSlots.querySelectorAll(".is-flying").forEach(function (element) { element.classList.remove("is-flying"); });
        selected = null;
        render();
        announce("移动没有完成，棋盘已恢复，请再试一次。");
      }
    } finally {
      isAnimating = false;
      ui.columns.classList.remove("is-animating");
      ui.reserveSlots.classList.remove("is-animating");
      ui.columns.querySelectorAll(".column").forEach(function (element) { element.removeAttribute("aria-disabled"); });
      ui.reserveSlots.querySelectorAll(".reserve-slot").forEach(function (element) { element.removeAttribute("aria-disabled"); });
      ui.themeSelect.disabled = false;
      ui.settingsButton.disabled = false;
      ui.campaignButton.disabled = false;
      ui.newGameButton.disabled = false;
      ui.restartButton.disabled = false;
      ui.shuffleButton.disabled = false;
      render();
    }

    if (!committed) return;
    const won = isVictory();
    if (won && campaignMode && campaignLevel < CAMPAIGN_LEVEL_COUNT) {
      campaignUnlockedLevel = Math.max(campaignUnlockedLevel, campaignLevel + 1);
    }
    persistLocalData(true);
    if (won) {
      if (dailyMode && dailyChallengeDate) {
        const previousBest = dailyHistory[dailyChallengeDate];
        if (!previousBest || moveCount < previousBest) dailyHistory[dailyChallengeDate] = moveCount;
        dailyBest = { date: dailyChallengeDate, moves: dailyHistory[dailyChallengeDate] };
        persistLocalData(true);
        renderCampaignLevels();
        announce("每日挑战完成！本局 " + moveCount + " 步" + (dailyBest.date === dailyChallengeDate ? "，个人最佳 " + dailyBest.moves + " 步。" : "。"));
      } else {
        announce("整理完成！所有图案都回到了自己的列里。");
      }
      showVictoryCelebration();
    } else if (victoryCelebrated) {
      victoryCelebrated = false;
      clearCelebration();
    }
  }

  async function setNewGame(message) {
    if (isAnimating) return;
    if (typeof message !== "string") message = "";
    if (dailyMode) dailyChallengeDate = localDateKey();
    const newBoard = await buildSolvableBoardWithProgress(settings, dailyMode ? dateSeed(dailyChallengeDate) : undefined);
    if (!newBoard) return;
    selected = null;
    moveCount = 0;
    moveHistory = [];
    board = newBoard;
    initialBoard = cloneBoard(board);
    victoryCelebrated = false;
    clearCelebration();
    render();
    playBoardOpeningAnimation();
    persistLocalData(true);
    announce(message || (dailyMode
      ? formatDateKey(dailyChallengeDate) + " 的每日棋盘已重开。同一天的棋盘相同。"
      : "新的一局开始啦。点一列，再点目标列；顶部连续相同的图案会整组一起移动。"));
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
    playBoardOpeningAnimation();
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
    ui.shuffleStepsInput.closest(".setting-field").style.display = ui.difficultySelect.value === "hard" ? "none" : "";
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
      ui.difficultyHint.textContent = "自定义图案种类、列容量、暂存位、问号和打乱强度；固定白格可能在同一列底部。";
    } else {
      const preset = PRESETS[ui.difficultySelect.value];
      const fixedHint = preset.fixedCount ? "；固定白格可能在同一列底部" : "";
      ui.difficultyHint.textContent = preset.label + "：" +
        (ui.difficultySelect.value === "hard" ? "随机混排 · " + preset.mysteryCount + " 个隐藏图案" : preset.shuffleSteps + " 步打乱") +
        " · " + preset.reserveCount + " 个暂存位" + fixedHint + "。";
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
      mysteryCount: clampInteger(ui.mysteryCountInput, 0, 48, settings.mysteryCount),
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
    if (kind === "column" && columnIsSorted(board.columns[index])) {
      event.preventDefault();
      nudgeTarget("column", index);
      announce("这一列已经完成，暂时不能再移动。");
      return;
    }
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
  ui.campaignButton.addEventListener("click", openCampaignDialog);
  ui.closeCampaignButton.addEventListener("click", closeCampaignDialog);
  ui.closeCampaignFooterButton.addEventListener("click", closeCampaignDialog);
  ui.campaignLevelGrid.addEventListener("click", handleCampaignLevelClick);
  ui.dailyChallengeButton.addEventListener("click", handleDailyChallengeClick);
  ui.closeSettingsButton.addEventListener("click", closeSettings);
  ui.cancelSettingsButton.addEventListener("click", closeSettings);
  ui.applySettingsButton.addEventListener("click", function () {
    if (isAnimating) return;
    settings = readSettingsForm();
    campaignMode = false;
    dailyMode = false;
    dailyChallengeDate = "";
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
    if (dailyMode) {
      dailyMode = false;
      dailyChallengeDate = "";
      campaignMode = false;
      setNewGame("已离开每日挑战，开始自由随机局。");
      return;
    }
    setNewGame("棋盘已重新打乱，新的挑战开始啦。");
  });
  ui.undoButton.addEventListener("click", undoMove);
  ui.newGameButton.addEventListener("click", setNewGame);
  ui.victoryNewGameButton.addEventListener("click", handleVictoryAction);
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
  ui.campaignDialog.addEventListener("click", function (event) {
    if (event.target === ui.campaignDialog) closeCampaignDialog();
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
