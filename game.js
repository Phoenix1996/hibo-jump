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
        { id: "p6", name: "海龟", glyph: "🐢", color: "#61aa83" }
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
        { id: "p6", name: "樱桃", glyph: "🍒", color: "#ca5f6a" }
      ]
    }
  };

  const PRESETS = {
    easy: { label: "简单", patternCount: 3, capacity: 4, reserveCount: 4, shuffleSteps: 20 },
    normal: { label: "普通", patternCount: 4, capacity: 4, reserveCount: 2, shuffleSteps: 45 },
    hard: { label: "困难", patternCount: 5, capacity: 4, reserveCount: 0, shuffleSteps: 90 }
  };

  const DEFAULT_SETTINGS = { difficulty: "normal", patternCount: 4, capacity: 4, reserveCount: 2, shuffleSteps: 45 };
  const ui = {
    themeSelect: document.getElementById("themeSelect"),
    settingsButton: document.getElementById("settingsButton"),
    difficultyBadge: document.getElementById("levelBadge"),
    boardCaption: document.getElementById("boardCaption"),
    moveCount: document.getElementById("moveCount"),
    sortedCount: document.getElementById("sortedCount"),
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
    flightLayer: document.getElementById("flightLayer")
  };

  let settings = Object.assign({}, DEFAULT_SETTINGS);
  let currentThemeId = "ocean";
  let board = null;
  let initialBoard = null;
  let selected = null;
  let moveCount = 0;
  let isAnimating = false;
  let suppressClickUntil = 0;

  function getTheme() {
    return THEMES[currentThemeId] || THEMES.ocean;
  }

  function getPattern(patternId) {
    const theme = getTheme();
    for (let i = 0; i < theme.patterns.length; i += 1) {
      if (theme.patterns[i].id === patternId) return theme.patterns[i];
    }
    return theme.patterns[0];
  }

  function cloneBoard(source) {
    return {
      columns: source.columns.map(function (column) { return column.slice(); }),
      reserve: source.reserve.slice()
    };
  }

  function randomIndex(max) {
    return Math.floor(Math.random() * max);
  }

  function topGroupSize(column) {
    if (!column.length) return 0;
    const patternId = column[column.length - 1];
    let count = 1;
    for (let index = column.length - 2; index >= 0; index -= 1) {
      if (column[index] !== patternId) break;
      count += 1;
    }
    return count;
  }

  function buildSolvableBoard(currentSettings) {
    const columns = [];
    for (let patternIndex = 0; patternIndex < currentSettings.patternCount; patternIndex += 1) {
      const patternId = "p" + (patternIndex + 1);
      columns.push(Array(currentSettings.capacity).fill(patternId));
    }
    columns.push([]);

    let previousReverseMove = null;
    for (let step = 0; step < currentSettings.shuffleSteps; step += 1) {
      const candidates = [];
      for (let donorIndex = 0; donorIndex < columns.length; donorIndex += 1) {
        const donor = columns[donorIndex];
        if (!donor.length) continue;
        const patternId = donor[donor.length - 1];
        const availableGroup = topGroupSize(donor);

        for (let targetIndex = 0; targetIndex < columns.length; targetIndex += 1) {
          if (targetIndex === donorIndex) continue;
          const target = columns[targetIndex];
          if (target.length && target[target.length - 1] === patternId) continue;
          const freeCapacity = currentSettings.capacity - target.length;
          const maxCount = Math.min(availableGroup, freeCapacity);
          for (let count = 1; count <= maxCount; count += 1) {
            candidates.push({
              donorIndex: donorIndex,
              targetIndex: targetIndex,
              patternId: patternId,
              count: count
            });
          }
        }
      }

      let choices = candidates;
      if (previousReverseMove) {
        const withoutImmediateUndo = candidates.filter(function (candidate) {
          return !(
            candidate.donorIndex === previousReverseMove.targetIndex &&
            candidate.targetIndex === previousReverseMove.donorIndex &&
            candidate.patternId === previousReverseMove.patternId &&
            candidate.count === previousReverseMove.count
          );
        });
        if (withoutImmediateUndo.length) choices = withoutImmediateUndo;
      }
      if (!choices.length) break;

      const chosen = choices[randomIndex(choices.length)];
      const donor = columns[chosen.donorIndex];
      const group = donor.splice(donor.length - chosen.count, chosen.count);
      columns[chosen.targetIndex].push.apply(columns[chosen.targetIndex], group);
      previousReverseMove = chosen;
    }

    const alreadySolved = columns.filter(function (column) {
      return column.length === currentSettings.capacity &&
        column.every(function (patternId) { return patternId === column[0]; });
    }).length === currentSettings.patternCount;
    if (alreadySolved) {
      const emptyIndex = columns.findIndex(function (column) { return column.length === 0; });
      const sourceIndex = columns.findIndex(function (column) { return column.length === currentSettings.capacity; });
      if (emptyIndex >= 0 && sourceIndex >= 0) {
        const patternId = columns[sourceIndex].pop();
        columns[emptyIndex].push(patternId);
      }
    }

    return {
      columns: columns,
      reserve: Array(currentSettings.reserveCount).fill(null)
    };
  }

  function currentSortedCount() {
    if (!board) return 0;
    return board.columns.filter(function (column) {
      return column.length === settings.capacity && column.every(function (patternId) {
        return patternId === column[0];
      });
    }).length;
  }

  function isVictory() {
    if (!board || board.reserve.some(function (item) { return item !== null; })) return false;
    const completed = board.columns.filter(function (column) {
      return column.length === settings.capacity && column.every(function (patternId) {
        return patternId === column[0];
      });
    });
    const emptyColumns = board.columns.filter(function (column) { return column.length === 0; });
    return completed.length === settings.patternCount && emptyColumns.length === 1;
  }

  function announce(message) {
    ui.gameMessage.textContent = message;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return map[character];
    });
  }

  function columnDescription(column, index) {
    if (!column.length) return "第 " + (index + 1) + " 列，空列，可接收任何图案";
    const topPattern = getPattern(column[column.length - 1]);
    const labels = column.map(function (patternId) { return getPattern(patternId).name; });
    return "第 " + (index + 1) + " 列，顶部是" + topPattern.name + "，共 " + column.length + " 个；" + labels.join("、");
  }

  function canMoveToColumn(source, targetIndex) {
    if (!board || targetIndex < 0 || targetIndex >= board.columns.length) return false;
    if (source.kind === "column" && source.index === targetIndex) return false;
    const target = board.columns[targetIndex];
    const movingCount = source.kind === "column"
      ? topGroupSize(board.columns[source.index])
      : 1;
    const sourcePattern = source.kind === "column"
      ? board.columns[source.index][board.columns[source.index].length - 1]
      : board.reserve[source.index];
    if (!movingCount || !sourcePattern) return false;
    if (target.length + movingCount > settings.capacity) return false;
    return !target.length || target[target.length - 1] === sourcePattern;
  }

  function targetIsValid(source, targetKind, targetIndex) {
    if (!source || !board) return false;
    if (targetKind === "column") return canMoveToColumn(source, targetIndex);
    return source.kind === "column" &&
      targetKind === "reserve" &&
      targetIndex >= 0 &&
      targetIndex < board.reserve.length &&
      board.reserve[targetIndex] === null;
  }

  function render() {
    if (!board) return;
    ui.themeSelect.value = currentThemeId;
    const completedCount = currentSortedCount();
    const totalPatterns = settings.patternCount;

    ui.columns.innerHTML = board.columns.map(function (column, columnIndex) {
      const groupSize = topGroupSize(column);
      const slots = [];
      for (let level = 0; level < settings.capacity; level += 1) {
        if (level < column.length) {
          const pattern = getPattern(column[level]);
          const isTopGroup = level >= column.length - groupSize;
          slots.push(
            '<span class="stack-cell tile' + (isTopGroup ? " top-group" : "") + '" ' +
            'data-pattern-id="' + escapeHtml(pattern.id) + '" data-level="' + level + '" ' +
            'style="--pattern-color:' + escapeHtml(pattern.color) + '" aria-hidden="true">' +
            escapeHtml(pattern.glyph) + "</span>"
          );
        } else {
          slots.push('<span class="stack-cell is-empty" data-level="' + level + '" aria-hidden="true"></span>');
        }
      }

      const isSelected = selected && selected.kind === "column" && selected.index === columnIndex;
      const validTarget = selected && targetIsValid(selected, "column", columnIndex);
      const title = column.length ? "移动顶部的 " + getPattern(column[column.length - 1]).name + " 图案组" : "空列";
      return (
        '<button class="column' + (column.length ? "" : " is-empty") +
          (isSelected ? " is-selected" : "") + (validTarget ? " is-target is-valid-target" : "") + '" ' +
          'type="button" data-kind="column" data-index="' + columnIndex + '" draggable="' + Boolean(column.length) + '" ' +
          'aria-label="' + escapeHtml(columnDescription(column, columnIndex)) + '" title="' + escapeHtml(title) + '">' +
          '<span class="column-meta"><span>列 ' + (columnIndex + 1) + '</span><span class="column-count">' +
          column.length + "/" + settings.capacity + '</span></span>' +
          '<span class="column-stack">' + slots.join("") + "</span></button>"
      );
    }).join("");

    if (board.reserve.length) {
      ui.reserveSection.hidden = false;
      ui.reserveSlots.innerHTML = board.reserve.map(function (patternId, reserveIndex) {
        const isSelected = selected && selected.kind === "reserve" && selected.index === reserveIndex;
        const validTarget = selected && targetIsValid(selected, "reserve", reserveIndex);
        if (patternId) {
          const pattern = getPattern(patternId);
          return (
            '<button class="reserve-slot is-filled' + (isSelected ? " is-selected" : "") + '" ' +
              (validTarget ? " is-target is-valid-target" : "") + 'type="button" data-kind="reserve" data-index="' + reserveIndex + '" draggable="true" ' +
              'aria-label="暂存位 ' + (reserveIndex + 1) + "，" + escapeHtml(pattern.name) + '，点选后放回棋盘" title="点选后放回棋盘">' +
              '<span class="tile reserve-glyph" style="--pattern-color:' + escapeHtml(pattern.color) + '" aria-hidden="true">' +
                escapeHtml(pattern.glyph) + "</span></button>"
          );
        }
        return (
          '<button class="reserve-slot' + (validTarget ? " is-target is-valid-target" : "") + '" type="button" ' +
            'data-kind="reserve" data-index="' + reserveIndex + '" aria-label="暂存位 ' + (reserveIndex + 1) + "，空位" + '" title="空暂存位">' +
            '<span class="reserve-placeholder" aria-hidden="true">＋</span></button>'
        );
      }).join("");
    } else {
      ui.reserveSection.hidden = false;
      ui.reserveSlots.innerHTML = '<span class="reserve-empty-copy">当前难度没有暂存位</span>';
    }

    ui.moveCount.textContent = String(moveCount);
    ui.sortedCount.textContent = completedCount + " / " + totalPatterns;
    ui.capacityLabel.textContent = String(settings.capacity);
    ui.difficultyBadge.textContent = settings.difficulty === "custom" ? "自定义" : PRESETS[settings.difficulty].label;
    ui.boardCaption.textContent = "每列最多 " + settings.capacity + " 个图案 · 顶部同图或空列才能放入";
    ui.cancelSelectionButton.hidden = !selected || isAnimating;
    ui.victoryBanner.hidden = !isVictory();
    ui.columns.style.setProperty("--column-count", board.columns.length);
  }

  function clearSelection() {
    selected = null;
    render();
  }

  function selectSource(kind, index) {
    if (isAnimating || isVictory()) return;
    if (kind === "column" && (!board.columns[index] || !board.columns[index].length)) {
      announce("先点选一列顶部有图案的列。");
      return;
    }
    if (kind === "reserve" && !board.reserve[index]) {
      announce("这个暂存位还是空的，可以把列顶的单个图案放到这里。");
      return;
    }
    selected = { kind: kind, index: index };
    const description = kind === "column"
      ? "已选第 " + (index + 1) + " 列。点另一列移动顶部整组，或点空暂存位收起一个图案。"
      : "已选暂存位。点空列或相同图案列，把图案放回去。";
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
      if (targetKind === "reserve" && selected.kind === "column") {
        announce("请选一个空暂存位。列顶的一个图案就能暂时放在这里。");
      } else if (targetKind === "column") {
        const target = board.columns[targetIndex];
        if (selected.kind === "column" && selected.index === targetIndex) return;
        if (selected.kind === "column") {
          const sourceColumn = board.columns[selected.index];
          const count = topGroupSize(sourceColumn);
          if (target.length + count > settings.capacity) {
            announce("这一整组放不下。可以先把挡住的图案放进暂存位。");
          } else {
            announce("只能把图案放到顶部相同的列，或空列。");
          }
        } else if (target.length + 1 > settings.capacity) {
          announce("这一列已经满了，先找其他位置吧。");
        } else {
          announce("只能把图案放到顶部相同的列，或空列。");
        }
      } else {
        announce("请先从列或有图案的暂存位开始选择。");
      }
      return;
    }

    performMove(move);
  }

  function createMove(source, target) {
    if (!targetIsValid(source, target.kind, target.index)) return null;
    if (source.kind === "column" && target.kind === "column") {
      const sourceColumn = board.columns[source.index];
      const count = topGroupSize(sourceColumn);
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

  function unionRect(elements) {
    const rects = elements.map(function (element) { return element.getBoundingClientRect(); });
    return rects.reduce(function (result, rect) {
      return {
        left: Math.min(result.left, rect.left),
        top: Math.min(result.top, rect.top),
        right: Math.max(result.right, rect.right),
        bottom: Math.max(result.bottom, rect.bottom)
      };
    }, { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });
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

  function createFlightGroup(move, sourceRect, cellWidth, cellHeight) {
    const flight = document.createElement("div");
    flight.className = "flight-group";
    flight.style.left = sourceRect.left + "px";
    flight.style.top = sourceRect.top + "px";
    flight.style.width = cellWidth + "px";
    flight.style.height = sourceRect.bottom - sourceRect.top + "px";

    const visualPatternIds = move.patternIds.slice().reverse();
    visualPatternIds.forEach(function (patternId) {
      const pattern = getPattern(patternId);
      const tile = document.createElement("span");
      tile.className = "flight-tile tile";
      tile.style.width = cellWidth + "px";
      tile.style.height = cellHeight + "px";
      tile.style.flexBasis = cellHeight + "px";
      tile.style.setProperty("--pattern-color", pattern.color);
      tile.textContent = pattern.glyph;
      flight.appendChild(tile);
    });
    ui.flightLayer.appendChild(flight);
    return flight;
  }

  async function animateMove(move) {
    const fromElements = sourceElements(move).filter(Boolean);
    const toElements = destinationElements(move).filter(Boolean);
    if (!fromElements.length || !toElements.length) return;

    const fromRect = unionRect(fromElements);
    const toRect = unionRect(toElements);
    const cellRect = fromElements[0].getBoundingClientRect();
    const flight = createFlightGroup(move, fromRect, cellRect.width, cellRect.height);
    fromElements.forEach(function (element) { element.classList.add("is-flying"); });

    const deltaX = (toRect.left + toRect.width / 2) - (fromRect.left + fromRect.width / 2);
    const deltaY = (toRect.top + toRect.height / 2) - (fromRect.top + fromRect.height / 2);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 90 : Math.max(320, 260 + move.count * 45);

    if (typeof flight.animate === "function") {
      const animation = flight.animate([
        { transform: "translate(0px, 0px) scale(1)", offset: 0 },
        { transform: "translate(0px, -16px) scale(1.04)", offset: 0.19 },
        { transform: "translate(" + deltaX + "px, " + (deltaY - 11) + "px) scale(1.035)", offset: 0.76 },
        { transform: "translate(" + deltaX + "px, " + deltaY + "px) scale(1)", offset: 1 }
      ], { duration: duration, easing: "cubic-bezier(.2,.72,.25,1)", fill: "forwards" });
      try {
        await animation.finished;
      } catch (error) {
        // The move still completes if the browser cancels its visual animation.
      }
    } else {
      await new Promise(function (resolve) { window.setTimeout(resolve, duration); });
    }

    flight.remove();
    fromElements.forEach(function (element) { element.classList.remove("is-flying"); });
  }

  async function performMove(move) {
    if (isAnimating) return;
    isAnimating = true;
    ui.cancelSelectionButton.hidden = true;
    ui.themeSelect.disabled = true;
    ui.settingsButton.disabled = true;
    ui.newGameButton.disabled = true;
    ui.restartButton.disabled = true;
    ui.columns.querySelectorAll(".column").forEach(function (element) { element.setAttribute("aria-disabled", "true"); });
    ui.reserveSlots.querySelectorAll(".reserve-slot").forEach(function (element) { element.setAttribute("aria-disabled", "true"); });

    await animateMove(move);

    if (move.type === "column-group") {
      const source = board.columns[move.source.index];
      source.splice(source.length - move.count, move.count);
      board.columns[move.target.index].push.apply(board.columns[move.target.index], move.patternIds);
      announce("整组移动完成。");
    } else if (move.type === "to-reserve") {
      board.columns[move.source.index].pop();
      board.reserve[move.target.index] = move.patternIds[0];
      announce("已暂存一个图案。");
    } else {
      board.reserve[move.source.index] = null;
      board.columns[move.target.index].push(move.patternIds[0]);
      announce("图案已放回列中。");
    }

    moveCount += 1;
    selected = null;
    isAnimating = false;
    ui.themeSelect.disabled = false;
    ui.settingsButton.disabled = false;
    ui.newGameButton.disabled = false;
    ui.restartButton.disabled = false;
    render();
    if (isVictory()) announce("整理完成！所有图案都回到了自己的列里。");
  }

  function setNewGame() {
    if (isAnimating) return;
    selected = null;
    moveCount = 0;
    board = buildSolvableBoard(settings);
    initialBoard = cloneBoard(board);
    ui.victoryBanner.hidden = true;
    render();
    announce("新的一局开始啦。点一列，再点目标列；顶部相同的图案会整组移动。");
  }

  function restartGame() {
    if (!initialBoard || isAnimating) return;
    selected = null;
    moveCount = 0;
    board = cloneBoard(initialBoard);
    ui.victoryBanner.hidden = true;
    render();
    announce("已重新开始这局。");
  }

  function applyTheme(themeId) {
    if (isAnimating) {
      ui.themeSelect.value = currentThemeId;
      return;
    }
    if (!THEMES[themeId]) return;
    currentThemeId = themeId;
    render();
    announce("已切换到" + getTheme().name + "，棋盘进度保留。");
  }

  function setFormValues(value) {
    ui.difficultySelect.value = value.difficulty;
    ui.patternCountInput.value = value.patternCount;
    ui.capacityInput.value = value.capacity;
    ui.reserveCountInput.value = value.reserveCount;
    ui.shuffleStepsInput.value = value.shuffleSteps;
    updateCustomControls();
  }

  function selectedPresetSettings(difficulty) {
    const preset = PRESETS[difficulty];
    return {
      difficulty: difficulty,
      patternCount: preset.patternCount,
      capacity: preset.capacity,
      reserveCount: preset.reserveCount,
      shuffleSteps: preset.shuffleSteps
    };
  }

  function updateCustomControls() {
    const isCustom = ui.difficultySelect.value === "custom";
    [
      ui.patternCountInput,
      ui.capacityInput,
      ui.reserveCountInput,
      ui.shuffleStepsInput
    ].forEach(function (input) { input.disabled = !isCustom; });
    ui.difficultyHint.textContent = isCustom
      ? "自定义图案种类、列容量、暂存位和打乱强度。"
      : "预设难度会调整图案种类、暂存位和开局打乱强度。";
  }

  function clampInteger(input, min, max, fallback) {
    const parsed = Number.parseInt(input.value, 10);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(min, Math.min(max, parsed));
  }

  function readSettingsForm() {
    const difficulty = ui.difficultySelect.value;
    if (difficulty !== "custom") return selectedPresetSettings(difficulty);
    return {
      difficulty: "custom",
      patternCount: clampInteger(ui.patternCountInput, 2, 6, settings.patternCount),
      capacity: clampInteger(ui.capacityInput, 2, 6, settings.capacity),
      reserveCount: clampInteger(ui.reserveCountInput, 0, 8, settings.reserveCount),
      shuffleSteps: clampInteger(ui.shuffleStepsInput, 10, 120, settings.shuffleSteps)
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
    if (kind === "column" && !board.columns[index].length) {
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
    announce(kind === "column" ? "拖动整组图案到目标列，或拖到暂存位收起一个。" : "拖动暂存图案到可以放入的列。");
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

  setNewGame();
})();
