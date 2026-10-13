"use strict";
importScripts("./level-generator.js?v=20261013-2", "./board-generator.js?v=20261013-1");
self.onmessage = function (event) {
  try {
    const iterator = self.HiboBoardGenerator.generate(event.data.settings, event.data.seed);
    let step = iterator.next();
    while (!step.done) {
      self.postMessage({ type: "progress", progress: step.value.progress, phase: step.value.phase });
      step = iterator.next();
    }
    self.postMessage({ type: "complete", board: step.value });
  } catch (error) {
    self.postMessage({ type: "error", message: error.message });
  }
};
