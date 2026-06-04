const canvas = { w: 480, h: 853 };
const storageKey = "neko-ui-editor-scenes-v2";

const scenePresets = {
  levelEntry: {
    title: "\u5173\u5361\u5165\u53e3",
    layers: [
      layer("homeBgAlt", "\u5e95\u5c42\u80cc\u666f", "./assets/ui/level-entry/home-bg-alt.png", 0, 0, 480, 853, 0, { locked: true }),
      layer("homeBg", "\u5173\u5361\u5165\u53e3\u5e95\u56fe", "./assets/ui/level-entry/home-bg.png", 18, 0, 444, 843, 1, { locked: true, target: ".home-phone" }),
      layer("homePlayerCard", "\u73a9\u5bb6\u7ea7\u6570\u724c", "./assets/ui/level-entry/player-level-crop.png", 0, 15, 166, 68, 10, { target: ".player-card" }),
      textLayer("homePlayerLevelText", "LV.1", 98, 38, 72, 26, 11, { target: ".player-card strong", fontSize: 22, parentKey: "homePlayerCard" }),
      layer("homeCoinPanel", "\u732b\u54aa\u91d1\u5e01\u6846", "./assets/ui/level-entry/coin-panel-crop.png", 170, 18, 140, 54, 10, { target: ".coin-status" }),
      textLayer("homeCoinText", "0", 232, 33, 52, 22, 11, { target: ".coin-status span:last-child", fontSize: 21, parentKey: "homeCoinPanel" }),
      textLayer("homeLifeText", "\u2665\u2665\u2665\u2665\u2665", 300, 24, 72, 28, 11, { target: ".home-life-status", fontSize: 14 }),
      layer("homeSettings", "\u8bbe\u7f6e", "./assets/ui/level-entry/settings-crop.png", 323, 15, 64, 64, 10, { target: ".home-icon-button.small" }),
      layer("homeTitle", "\u6e38\u620f\u6807\u9898", "./assets/ui/level-entry/title-crop.png", 67, 72, 346, 94, 8, { target: ".game-logo" }),
      groupLayer("homeLevelPanel", "\u5173\u5361\u6eda\u52a8\u680f", 30, 172, 292, 480, 3, { target: ".level-scroll-panel" }),
      mockLevelLayer("homeLevelContent", "\u5173\u5361\u6eda\u52a8\u680f\u5185\u5bb9", 38, 188, 272, 430, 4),
      layer("navHome", "\u4e3b\u9875", "./assets/ui/level-entry/nav-home-crop.png", 22, 760, 82, 82, 9, { target: ".home-bottom-nav button:nth-child(1)" }),
      layer("navShop", "\u5e97\u94fa", "./assets/ui/level-entry/nav-shop-crop.png", 142, 760, 82, 82, 9, { target: ".home-bottom-nav button:nth-child(2)" }),
      layer("navCan", "\u7f50\u5934", "./assets/ui/level-entry/nav-can-crop.png", 260, 760, 82, 82, 9, { target: ".home-bottom-nav button:nth-child(3)" }),
      layer("navJournal", "\u624b\u8d26", "./assets/ui/level-entry/nav-journal-crop.png", 378, 760, 82, 82, 9, { target: ".home-bottom-nav button:nth-child(4)" }),
      layer("completeStamp", "\u901a\u5173\u5370\u7ae0", "./assets/ui/level-entry/stamp-complete-crop.png", 240, 188, 74, 74, 12),
      layer("lockIcon", "\u9501", "./assets/ui/level-entry/lock-crop.png", 248, 318, 42, 50, 12),
    ],
  },
  gameplay: {
    title: "\u8bd5\u73a9\u6e38\u620f",
    layers: [
      layer("gameBgOuter", "\u8bd5\u73a9\u80cc\u666f", "./assets/ui/gameplay/game-bg-outer.png", 0, 0, 480, 853, 0, { locked: true }),
      layer("gameBgPanel", "\u8bd5\u73a9\u5e95\u56fe", "./assets/ui/gameplay/game-bg-panel.png", 18, 0, 444, 853, 1, { locked: true, target: ".game-shell" }),
      layer("gameLevelPanel", "\u73a9\u5bb6\u7ea7\u6570\u6846", "./assets/ui/gameplay/level-panel-crop.png", 12, 15, 166, 68, 10, { target: ".game-level-pill" }),
      textLayer("gamePlayerLevelText", "LV.1", 98, 38, 72, 26, 11, { target: ".game-level-pill span", fontSize: 22, parentKey: "gameLevelPanel" }),
      textLayer("gameLevelText", "\u7b2c1\u5173", 172, 33, 202, 32, 11, { target: ".game-stage-label", fontSize: 30 }),
      layer("gameBack", "\u8fd4\u56de\u952e", "./assets/ui/gameplay/back-button-crop.png", 405, 15, 64, 64, 10, { target: ".game-back-button" }),
      layer("gameCoinPanel", "\u91d1\u5e01\u6846", "./assets/ui/gameplay/coin-panel-crop.png", 102, 90, 128, 46, 10, { target: ".coin-pill" }),
      textLayer("gameCoinText", "0", 184, 104, 42, 22, 11, { target: ".coin-pill span", fontSize: 16, parentKey: "gameCoinPanel" }),
      textLayer("gameLifeText", "\u2665\u2665\u2665", 232, 94, 58, 36, 11, { target: ".game-life-status", fontSize: 12 }),
      layer("gameTimerPanel", "\u5012\u8ba1\u65f6\u6846", "./assets/ui/gameplay/timer-panel-crop.png", 286, 90, 136, 46, 10, { target: ".timer-pill" }),
      textLayer("gameTimerText", "09:58", 350, 104, 68, 22, 11, { target: ".timer-pill span", fontSize: 16, parentKey: "gameTimerPanel" }),
      layer("boardFrame", "\u68cb\u76d8\u6846", "./assets/ui/gameplay/board-frame-crop.png", 35, 145, 410, 400, 4, { target: ".board-section::before" }),
      groupLayer("boardPlayArea", "\u5b9e\u9645\u68cb\u76d8\u53ef\u73a9\u533a", 45, 165, 390, 370, 5, { target: ".board-window" }),
      layer("zoomButton", "\u653e\u5927\u955c", "./assets/ui/gameplay/zoom-crop.png", 30, 124, 96, 105, 12, { target: ".zoom-button" }),
      layer("trayFrame", "\u6682\u5b58\u680f\u5e95\u56fe", "./assets/ui/gameplay/tray-frame.png", 18, 570, 384, 112, 3, { target: ".tray" }),
      mockTrayLayer("trayCells", "\u6682\u5b58\u683c\u548c\u6570\u91cf", 54, 585, 390, 92, 6),
      textLayer("gameToastText", "\u672c\u6b21\u62fe\u53d612\u4e2a\uff0c\u5269\u4f59\u540c\u8272\u7559\u5728\u68cb\u76d8", 118, 548, 260, 24, 12, { target: ".toast", fontSize: 14 }),
      layer("toolArea", "\u6846\u9009\u5f52\u4f4d", "./assets/ui/gameplay/tool-area-crop.png", 40, 704, 122, 132, 10, { target: ".area-tool-button" }),
      layer("toolClearTray", "\u6e05\u7a7a\u69fd\u4f4d", "./assets/ui/gameplay/tool-clear-tray-crop.png", 190, 704, 122, 132, 10, { target: ".clear-tray-tool-button" }),
      layer("toolClearColor", "\u6d88\u8272", "./assets/ui/gameplay/tool-clear-color-crop.png", 338, 704, 122, 132, 10, { target: ".clear-color-tool-button" }),
    ],
  },
  successModal: {
    title: "\u6210\u529f\u5f39\u7a97",
    layers: [
      groupLayer("successMask", "\u534a\u900f\u660e\u906e\u7f69\u53c2\u8003", 0, 0, 480, 853, 0, { locked: true }),
      layer("successPanel", "\u6210\u529f\u5f39\u7a97\u9762\u677f", "./assets/ui/gameplay/success-modal-panel.png", 46, 82, 388, 688, 2, { target: ".result-panel.win" }),
      groupLayer("successSticker", "\u5f53\u524d\u5173\u5361\u56fe", 110, 300, 169, 133, 4, { target: ".result-panel.win .result-sticker" }),
      textLayer("successTitle", "\u8d34\u7eb8\u590d\u539f\u6210\u529f", 96, 420, 220, 32, 4, { fontSize: 24 }),
      layer("successNext", "\u4e0b\u4e00\u5173\u6309\u94ae", "./assets/ui/gameplay/success-next-button.png", 148, 460, 94, 41, 5, { target: ".result-panel.win #restartButton" }),
    ],
  },
  failModal: {
    title: "\u5931\u8d25\u5f39\u7a97",
    layers: [
      groupLayer("failMask", "\u534a\u900f\u660e\u906e\u7f69\u53c2\u8003", 0, 0, 480, 853, 0, { locked: true }),
      layer("failPanel", "\u5931\u8d25\u5f39\u7a97\u9762\u677f", "./assets/ui/gameplay/fail-modal-panel.png", 46, 82, 388, 688, 2, { target: ".result-panel.fail" }),
      textLayer("failAdText", "\u770b\u5e7f\u544a +300\u79d2", 122, 356, 150, 44, 4, { target: ".result-panel.fail .ad-time-button", fontSize: 16 }),
      layer("failRetry", "\u518d\u73a9\u4e00\u6b21\u6309\u94ae", "./assets/ui/gameplay/fail-retry-button-crop.png", 133, 420, 129, 56, 5, { target: ".result-panel.fail #restartButton" }),
    ],
  },
};

const stage = document.getElementById("stage");
const assetInput = document.getElementById("assetInput");
const jsonInput = document.getElementById("jsonInput");
const layerList = document.getElementById("layerList");
const output = document.getElementById("output");
const sceneSelect = document.getElementById("sceneSelect");
const canvasTitle = document.getElementById("canvasTitle");
const controls = {
  name: document.getElementById("nameInput"),
  x: document.getElementById("xInput"),
  y: document.getElementById("yInput"),
  w: document.getElementById("wInput"),
  h: document.getElementById("hInput"),
  z: document.getElementById("zInput"),
  opacity: document.getElementById("opacityInput"),
  lockRatio: document.getElementById("lockRatioInput"),
  locked: document.getElementById("lockedInput"),
};

let savedScenes = loadAllScenes();
let currentScene = sceneSelect.value;
let layers = getSceneLayers(currentScene);
let selectedId = layers[0]?.id || null;
let dragState = null;

function finishDrag() {
  if (dragState) {
    saveCurrentScene();
    renderLayerList();
  }
  dragState = null;
}

function baseLayer(key, name, x, y, w, h, z, options = {}) {
  return {
    id: makeId(key),
    key,
    name,
    x,
    y,
    w,
    h,
    z,
    opacity: options.opacity ?? 1,
    locked: Boolean(options.locked),
    target: options.target || "",
    parentKey: options.parentKey || "",
    type: options.type || "image",
    text: options.text || "",
    fontSize: options.fontSize || 14,
    src: options.src || "",
  };
}

function layer(key, name, src, x, y, w, h, z, options = {}) {
  return baseLayer(key, name, x, y, w, h, z, { ...options, src, type: "image" });
}

function groupLayer(key, name, x, y, w, h, z, options = {}) {
  return baseLayer(key, name, x, y, w, h, z, { ...options, type: "group" });
}

function textLayer(key, text, x, y, w, h, z, options = {}) {
  return baseLayer(key, options.name || text, x, y, w, h, z, { ...options, type: "text", text });
}

function mockLevelLayer(key, name, x, y, w, h, z) {
  return baseLayer(key, name, x, y, w, h, z, { type: "levelMock" });
}

function mockTrayLayer(key, name, x, y, w, h, z) {
  return baseLayer(key, name, x, y, w, h, z, { type: "trayMock" });
}

function makeId(seed = "layer") {
  const safe = String(seed).replace(/[^a-zA-Z0-9_-]+/g, "-") || "layer";
  return `${safe}-${Date.now()}-${Math.round(Math.random() * 10000)}`;
}

function cloneLayers(items) {
  return items.map((item) => ({ ...item, id: makeId(item.key || item.name) }));
}

function normalizeLayer(item) {
  return {
    opacity: 1,
    locked: false,
    target: "",
    type: item.src ? "image" : "group",
    text: "",
    fontSize: 14,
    src: "",
    ...item,
  };
}

function loadAllScenes() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {};
  }
}

function persistAllScenes() {
  localStorage.setItem(storageKey, JSON.stringify(savedScenes));
}

function getSceneLayers(sceneKey) {
  const saved = savedScenes[sceneKey];
  if (Array.isArray(saved?.layers)) return saved.layers.map(normalizeLayer);
  return cloneLayers(scenePresets[sceneKey].layers);
}

function saveCurrentScene() {
  savedScenes[currentScene] = {
    title: scenePresets[currentScene].title,
    canvas,
    layers,
    updatedAt: new Date().toISOString(),
  };
  persistAllScenes();
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("image read failed"));
    reader.readAsDataURL(file);
  });
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getSelectedLayer() {
  return layers.find((item) => item.id === selectedId) || null;
}

function setSelected(id, skipRender = false) {
  selectedId = id;
  syncControls();
  if (!skipRender) render();
}

function switchScene(sceneKey) {
  saveCurrentScene();
  if (!scenePresets[sceneKey]) return;
  currentScene = sceneKey;
  sceneSelect.value = sceneKey;
  layers = getSceneLayers(currentScene);
  selectedId = layers[0]?.id || null;
  output.value = "";
  syncSceneTitle();
  syncControls();
  render();
}

function syncSceneTitle() {
  canvasTitle.textContent = `${scenePresets[currentScene].title} 480 x 853`;
  stage.dataset.scene = currentScene;
}

function syncControls() {
  const selected = getSelectedLayer();
  const disabled = !selected;
  Object.entries(controls).forEach(([key, control]) => {
    if (key !== "lockRatio") control.disabled = disabled;
  });
  if (!selected) {
    controls.name.value = "";
    ["x", "y", "w", "h", "z", "opacity"].forEach((key) => (controls[key].value = ""));
    controls.locked.checked = false;
    return;
  }
  controls.name.value = selected.name;
  controls.x.value = Math.round(selected.x);
  controls.y.value = Math.round(selected.y);
  controls.w.value = Math.round(selected.w);
  controls.h.value = Math.round(selected.h);
  controls.z.value = selected.z;
  controls.opacity.value = selected.opacity;
  controls.locked.checked = Boolean(selected.locked);
}

function applyLayerStyle(node, item) {
  node.style.left = `${item.x}px`;
  node.style.top = `${item.y}px`;
  node.style.width = `${item.w}px`;
  node.style.height = `${item.h}px`;
  node.style.zIndex = item.z;
  node.style.opacity = item.opacity;
}

function updateLayerNode(item) {
  const node = stage.querySelector(`[data-id="${item.id}"]`);
  if (node) applyLayerStyle(node, item);
}

function renderLayerContent(node, item) {
  if (item.type === "image" && item.src) {
    const image = document.createElement("img");
    image.src = item.src;
    image.alt = item.name;
    node.appendChild(image);
    return;
  }
  if (item.type === "text") {
    node.classList.add("text-layer");
    node.style.fontSize = `${item.fontSize}px`;
    node.textContent = item.text || item.name;
    return;
  }
  if (item.type === "levelMock") {
    node.classList.add("level-mock-layer");
    node.innerHTML = Array.from({ length: 4 }, (_, index) => {
      const level = index + 1;
      const state = level === 1 ? "NEXT" : "\u9501";
      return `<div class="mock-level"><b>Level<br>${level}</b><span></span><em>${state}</em></div>`;
    }).join("");
    return;
  }
  if (item.type === "trayMock") {
    node.classList.add("tray-mock-layer");
    node.innerHTML = Array.from({ length: 36 }, (_, index) => `<span class="${index % 5 === 0 ? "filled" : ""}"></span>`).join("");
    return;
  }
  const label = document.createElement("span");
  label.className = "placeholder-label";
  label.textContent = item.name;
  node.appendChild(label);
}

function render() {
  stage.innerHTML = "";
  layers
    .slice()
    .sort((a, b) => a.z - b.z)
    .forEach((item) => {
      const node = document.createElement("div");
      node.className = "asset-layer";
      if (item.type !== "image") node.classList.add("placeholder-layer");
      if (item.locked) node.classList.add("locked-layer");
      if (item.id === selectedId) node.classList.add("active");
      node.dataset.id = item.id;
      applyLayerStyle(node, item);
      renderLayerContent(node, item);

      const handle = document.createElement("span");
      handle.className = "resize-handle";
      node.appendChild(handle);

      node.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        setSelected(item.id, true);
        node.classList.add("active");
        if (item.locked) return;
        const isResize = event.target.classList.contains("resize-handle");
        dragState = {
          type: isResize ? "resize" : "move",
          id: item.id,
          startX: event.clientX,
          startY: event.clientY,
          layer: { ...item },
        };
        node.setPointerCapture(event.pointerId);
      });
      node.addEventListener("pointerup", finishDrag);
      node.addEventListener("pointercancel", finishDrag);
      node.addEventListener("lostpointercapture", finishDrag);

      stage.appendChild(node);
    });
  renderLayerList();
}

function renderLayerList() {
  layerList.innerHTML = "";
  layers
    .slice()
    .sort((a, b) => b.z - a.z)
    .forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "layer-button";
      if (item.id === selectedId) button.classList.add("active");
      const lockMark = item.locked ? "\u9501\u5b9a" : `z${item.z}`;
      button.innerHTML = `<span>${item.name}</span><small>${lockMark}</small>`;
      button.addEventListener("click", () => setSelected(item.id));
      layerList.appendChild(button);
    });
}

function updateSelectedFromControls() {
  const selected = getSelectedLayer();
  if (!selected) return;
  selected.name = controls.name.value || selected.name;
  selected.x = Number(controls.x.value) || 0;
  selected.y = Number(controls.y.value) || 0;
  selected.w = Math.max(1, Number(controls.w.value) || selected.w);
  selected.h = Math.max(1, Number(controls.h.value) || selected.h);
  selected.z = Number(controls.z.value) || 0;
  selected.opacity = clamp(Number(controls.opacity.value), 0, 1);
  selected.locked = controls.locked.checked;
  saveCurrentScene();
  render();
}

async function addFiles(files) {
  for (const file of files) {
    const src = await readFileAsDataUrl(file);
    const image = new Image();
    image.src = src;
    await image.decode().catch(() => {});
    const ratio = image.width && image.height ? image.width / image.height : 1;
    const w = Math.min(180, image.width || 120);
    const h = Math.round(w / ratio);
    layers.push(baseLayer(makeId(file.name), file.name.replace(/\.[^.]+$/, ""), 24, 24, w, h, Math.max(0, ...layers.map((item) => Number(item.z) || 0)) + 1, {
      src,
      type: "image",
    }));
  }
  saveCurrentScene();
  setSelected(layers[layers.length - 1]?.id || null);
  assetInput.value = "";
}

function duplicateSelected() {
  const selected = getSelectedLayer();
  if (!selected) return;
  const copy = {
    ...selected,
    id: makeId(`${selected.key || selected.name}-copy`),
    key: `${selected.key || selected.name}-copy`,
    name: `${selected.name} \u526f\u672c`,
    x: selected.x + 12,
    y: selected.y + 12,
    z: selected.z + 1,
    locked: false,
  };
  layers.push(copy);
  saveCurrentScene();
  setSelected(copy.id);
}

function deleteSelected() {
  const selected = getSelectedLayer();
  if (!selected) return;
  layers = layers.filter((item) => item.id !== selected.id);
  saveCurrentScene();
  setSelected(layers[0]?.id || null);
}

function resetSceneToPreset() {
  const selectedScene = sceneSelect.value;
  if (scenePresets[selectedScene]) currentScene = selectedScene;
  sceneSelect.value = currentScene;
  layers = cloneLayers(scenePresets[currentScene].layers);
  selectedId = layers[0]?.id || null;
  saveCurrentScene();
  syncSceneTitle();
  syncControls();
  render();
  output.value = `${scenePresets[currentScene].title} \u5df2\u8f7d\u5165\u9884\u8bbe\u3002`;
}

function exportJson() {
  saveCurrentScene();
  output.value = JSON.stringify(
    {
      scene: currentScene,
      title: scenePresets[currentScene].title,
      canvas,
      layers,
    },
    null,
    2,
  );
}

function exportCss() {
  saveCurrentScene();
  output.value = layers
    .map((item) => [
      `/* ${scenePresets[currentScene].title} / ${item.name}${item.target ? ` / ${item.target}` : ""} */`,
      `left: ${Math.round(item.x)}px; top: ${Math.round(item.y)}px; width: ${Math.round(item.w)}px; height: ${Math.round(item.h)}px; z-index: ${item.z}; opacity: ${item.opacity};`,
    ].join("\n"))
    .join("\n\n");
}

function saveLayout() {
  saveCurrentScene();
  output.value = `${scenePresets[currentScene].title} \u5df2\u4fdd\u5b58\uff0cfile:///E:/codex/src/index.html \u5237\u65b0\u540e\u4f1a\u8bfb\u53d6\u8fd9\u4efd\u672c\u5730\u56fa\u5b9a\u5e03\u5c40\u3002`;
}

async function importJson(file) {
  if (!file) return;
  const text = await file.text();
  const parsed = JSON.parse(text);
  const sceneKey = parsed.scene && scenePresets[parsed.scene] ? parsed.scene : currentScene;
  currentScene = sceneKey;
  sceneSelect.value = sceneKey;
  layers = Array.isArray(parsed.layers) ? parsed.layers.map(normalizeLayer) : [];
  selectedId = layers[0]?.id || null;
  saveCurrentScene();
  syncSceneTitle();
  syncControls();
  render();
}

sceneSelect.addEventListener("change", () => switchScene(sceneSelect.value));
sceneSelect.addEventListener("input", () => switchScene(sceneSelect.value));
assetInput.addEventListener("change", () => addFiles(assetInput.files));
jsonInput.addEventListener("change", () => importJson(jsonInput.files[0]));

document.getElementById("loadPresetButton").addEventListener("click", resetSceneToPreset);
document.getElementById("saveButton").addEventListener("click", saveLayout);
document.getElementById("duplicateButton").addEventListener("click", duplicateSelected);
document.getElementById("deleteButton").addEventListener("click", deleteSelected);
document.getElementById("exportJsonButton").addEventListener("click", exportJson);
document.getElementById("exportCssButton").addEventListener("click", exportCss);

["name", "x", "y", "w", "h", "z", "opacity"].forEach((key) => {
  controls[key].addEventListener("input", updateSelectedFromControls);
});
controls.locked.addEventListener("change", updateSelectedFromControls);

window.addEventListener("pointermove", (event) => {
  if (!dragState) return;
  if (event.buttons === 0) {
    finishDrag();
    return;
  }
  const selected = layers.find((item) => item.id === dragState.id);
  if (!selected || selected.locked) return;
  const dx = event.clientX - dragState.startX;
  const dy = event.clientY - dragState.startY;
  if (dragState.type === "move") {
    selected.x = Math.round(dragState.layer.x + dx);
    selected.y = Math.round(dragState.layer.y + dy);
  } else {
    const nextW = Math.max(8, dragState.layer.w + dx);
    selected.w = Math.round(nextW);
    selected.h = controls.lockRatio.checked
      ? Math.round(nextW * (dragState.layer.h / dragState.layer.w))
      : Math.max(8, Math.round(dragState.layer.h + dy));
  }
  syncControls();
  updateLayerNode(selected);
});

window.addEventListener("pointerup", finishDrag);
window.addEventListener("pointercancel", finishDrag);
document.addEventListener("pointerup", finishDrag);
document.addEventListener("pointercancel", finishDrag);
document.addEventListener("mouseup", finishDrag);
document.addEventListener("mouseleave", finishDrag);

syncSceneTitle();
syncControls();
render();
