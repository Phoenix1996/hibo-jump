(function (root) {
  "use strict";
  const levels = typeof module !== "undefined" && module.exports ? require("./level-generator.js") : root.HiboLevels;
  const BOARD_GENERATION_VERSION = 3;

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

  function createSeededRandom(seed) {
    let state = seed >>> 0 || 0x9e3779b9;
    return function () {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      return (state >>> 0) / 4294967296;
    };
  }

  function randomIndex(max, randomSource) {
    return Math.floor((randomSource || Math.random)() * max);
  }

  function wouldCompleteColumnAfterAdding(column, patternId, capacity) {
    if (!column || column.length + 1 !== capacity) return false;
    const patternTokens = column.filter(function (token) { return !isBlankToken(token); });
    return patternTokens.every(function (token) {
      return actualPatternId(token) === patternId;
    });
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

  function* generateReverseBoardSteps(currentSettings, seed) {
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
          // Without a tray, every reverse transfer must be undoable by a
          // matching-top column move. Arbitrary pops can otherwise strand colors.
          const remainingTop = donor.length > 1 ? actualPatternId(donor[donor.length - 2]) : null;
          if (currentSettings.reserveCount === 0 && remainingTop && remainingTop !== patternId) continue;

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

  function* generateSolvableBoardSteps(currentSettings, seed) {
    if (currentSettings.difficulty === "hard") {
      return yield* levels.generate(currentSettings, seed);
    }
    const attempts = currentSettings.reserveCount === 0 ? 18 : 6;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const candidateSeed = Number.isInteger(seed) ? (seed + attempt * 104729) >>> 0 : undefined;
      const reverse = generateReverseBoardSteps(currentSettings, candidateSeed);
      let step = reverse.next();
      while (!step.done) {
        yield { progress: (attempt + step.value.progress / 100 * .4) / attempts * 95,
          phase: "正在打乱棋盘" };
        step = reverse.next();
      }
      const candidate = step.value;
      const numericBoard = {
        columns: candidate.columns.map(column => column.map(token => isBlankToken(token) ? 0 :
          Number(actualPatternId(token).slice(1)) + (isMysteryToken(token) ? 16 : 0))),
        reserve: []
      };
      const solver = levels.solve(numericBoard, currentSettings, 12000);
      let check = solver.next();
      while (!check.done) {
        yield { progress: (attempt + .4 + Math.min(1, check.value.explored / 12000) * .6) / attempts * 95,
          phase: "正在检查棋盘" };
        check = solver.next();
      }
      if (!check.value.solved || !check.value.moves.length ||
          !levels.replay(numericBoard, check.value.moves, currentSettings)) continue;
      candidate.generation = { version: BOARD_GENERATION_VERSION, verified: true,
        solutionMoves: check.value.moves.length, explored: check.value.explored };
      return candidate;
    }
    throw new Error("候选棋盘尚未通过可解性检查，请重试。");
  }

  const api = { generate: generateSolvableBoardSteps };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.HiboBoardGenerator = api;
})(typeof self !== "undefined" ? self : globalThis);
