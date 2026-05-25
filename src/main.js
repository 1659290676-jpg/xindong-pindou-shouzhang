const defaultImageSrc = "./assets/level-cat.png";
const playerMode = window.XINDONG_PLAYER_MODE === true;
const fixedLevelConfigs = {
  "1": {
    src: "./assets/level-1.png",
    name: "关卡 1",
    settings: { cols: 30, rows: 30, maxColors: 10, offsetX: 0, offsetY: 0, imageScale: 100, brightness: -13, contrast: 14, saturation: 46 },
  },
  "2": {
    src: "./assets/level-2.png",
    name: "关卡 2",
    settings: { cols: 30, rows: 30, maxColors: 10, offsetX: 0, offsetY: 0, imageScale: 100, brightness: -13, contrast: 14, saturation: 46 },
  },
  "3": {
    src: "./assets/level-3.png",
    name: "关卡 3",
    settings: { cols: 30, rows: 30, maxColors: 10, offsetX: 0, offsetY: 0, imageScale: 100, brightness: -13, contrast: 14, saturation: 46 },
  },
};
const storageKey = "xindong-levels";
const maxTime = 600;
const traySize = 36;
const trayCols = 12;
const maxPickupPerClick = trayCols;
const idleHintDelay = 15000;
const hintDuration = 4200;
const maxHintCells = 6;
const backgroundCutoff = 250;
const minInkRatio = 0.02;
const boardSplitSize = 29;

const elements = {
  homeTab: document.getElementById("homeTab"),
  generatorTab: document.getElementById("generatorTab"),
  gameTab: document.getElementById("gameTab"),
  homeView: document.getElementById("homeView"),
  generatorView: document.getElementById("generatorView"),
  gameView: document.getElementById("gameView"),
  homeOriginalPreview: document.getElementById("homeOriginalPreview"),
  homePatternBoard: document.getElementById("homePatternBoard"),
  homeLevelSelector: document.getElementById("homeLevelSelector"),
  homeLevelNumber: document.getElementById("homeLevelNumber"),
  startLevelButton: document.getElementById("startLevelButton"),
  levelSelect: document.getElementById("levelSelect"),
  imageInput: document.getElementById("imageInput"),
  widthInput: document.getElementById("widthInput"),
  heightInput: document.getElementById("heightInput"),
  maxColorsInput: document.getElementById("maxColorsInput"),
  offsetXInput: document.getElementById("offsetXInput"),
  offsetYInput: document.getElementById("offsetYInput"),
  imageScaleInput: document.getElementById("imageScaleInput"),
  brightnessInput: document.getElementById("brightnessInput"),
  contrastInput: document.getElementById("contrastInput"),
  saturationInput: document.getElementById("saturationInput"),
  offsetXValue: document.getElementById("offsetXValue"),
  offsetYValue: document.getElementById("offsetYValue"),
  imageScaleValue: document.getElementById("imageScaleValue"),
  brightnessValue: document.getElementById("brightnessValue"),
  contrastValue: document.getElementById("contrastValue"),
  saturationValue: document.getElementById("saturationValue"),
  showCodesInput: document.getElementById("showCodesInput"),
  showGridInput: document.getElementById("showGridInput"),
  showSplitInput: document.getElementById("showSplitInput"),
  generateButton: document.getElementById("generateButton"),
  playGeneratedButton: document.getElementById("playGeneratedButton"),
  previewMeta: document.getElementById("previewMeta"),
  patternBoard: document.getElementById("patternBoard"),
  board: document.getElementById("board"),
  tray: document.getElementById("tray"),
  timer: document.getElementById("timer"),
  coinCount: document.getElementById("coinCount"),
  toast: document.getElementById("toast"),
  resultModal: document.getElementById("resultModal"),
  resultPanel: document.getElementById("resultPanel"),
  resultBanner: document.getElementById("resultBanner"),
  resultCelebration: document.getElementById("resultCelebration"),
  resultSticker: document.getElementById("resultSticker"),
  resultStickerImage: document.getElementById("resultStickerImage"),
  resultCat: document.getElementById("resultCat"),
  resultTitle: document.getElementById("resultTitle"),
  resultText: document.getElementById("resultText"),
  restartButton: document.getElementById("restartButton"),
  modalCloseButton: document.getElementById("modalCloseButton"),
  zoomButton: document.getElementById("zoomButton"),
  zoomSliderWrap: document.getElementById("zoomSliderWrap"),
  zoomScaleInput: document.getElementById("zoomScaleInput"),
  boardWindow: document.getElementById("boardWindow"),
};

let sourceImage = null;
let sourceImageName = "内置猫咪素材";
let sourceImageDataUrl = null;
let generatedLevels = loadStoredLevels();
let currentGeneratedLevel = null;
let activeGameLevel = null;
let selectedLevelId = "1";
let board = [];
let tray = [];
let selectedTrayIndex = null;
let secondsLeft = maxTime;
let timerId = null;
let won = false;
let zoomed = false;
let zoomScale = 1.2;
let pan = { x: 0, y: 0 };
let drag = null;
let correctStreak = 0;
let idleHintTimerId = null;
let hintClearTimerId = null;
let hintCells = new Set();

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function alphaColor(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function adjustColor(rgb, settings) {
  let { r, g, b } = rgb;
  const brightness = settings.brightness * 2.2;
  const contrast = 1 + settings.contrast / 100;
  const saturation = 1 + settings.saturation / 100;

  r = (r - 128) * contrast + 128 + brightness;
  g = (g - 128) * contrast + 128 + brightness;
  b = (b - 128) * contrast + 128 + brightness;

  const gray = r * 0.299 + g * 0.587 + b * 0.114;
  r = gray + (r - gray) * saturation;
  g = gray + (g - gray) * saturation;
  b = gray + (b - gray) * saturation;

  return {
    r: Math.round(clamp(r, 0, 255)),
    g: Math.round(clamp(g, 0, 255)),
    b: Math.round(clamp(b, 0, 255)),
  };
}

function quantizeColor(rgb) {
  const step = 17;
  return {
    r: Math.round(rgb.r / step) * step,
    g: Math.round(rgb.g / step) * step,
    b: Math.round(rgb.b / step) * step,
  };
}

function colorDistance(a, b) {
  return Math.abs(a.r - b.r) * 1.1 + Math.abs(a.g - b.g) + Math.abs(a.b - b.b) * 0.9;
}

function loadStoredLevels() {
  if (playerMode) return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey)) || {};
    Object.keys(parsed).forEach((key) => {
      parsed[key] = normalizeLevel(parsed[key]);
      if (!isPlayableLevel(parsed[key])) delete parsed[key];
    });
    return parsed;
  } catch {
    return {};
  }
}

function saveStoredLevels() {
  if (playerMode) return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(generatedLevels));
  } catch (error) {
    console.warn("关卡数据保存失败", error);
    showToast("关卡已生成，但本地保存空间不足");
  }
}

function cellKey(cell) {
  if (!cell) return null;
  return typeof cell === "string" ? cell : cell.key;
}

function normalizeLevel(level) {
  if (!level || !Array.isArray(level.matrix)) return level;
  const rows = Math.max(0, Number(level.rows) || level.matrix.length);
  const cols = Math.max(0, Number(level.cols) || Math.max(...level.matrix.map((row) => (Array.isArray(row) ? row.length : 0)), 0));
  return {
    ...level,
    rows,
    cols,
    palette: Array.isArray(level.palette) ? level.palette.filter((entry) => entry?.key && entry?.color) : [],
    matrix: level.matrix.map((row) => (Array.isArray(row) ? row.map(cellKey) : [])),
  };
}

function isPlayableLevel(level) {
  if (!level || !Array.isArray(level.matrix) || !Array.isArray(level.palette)) return false;
  if (!level.rows || !level.cols || !level.palette.length) return false;
  const colors = paletteMap(level);
  return level.matrix.some((row) => row.some((cell) => {
    const key = cellKey(cell);
    return key && colors.has(key);
  }));
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("图片加载失败"));
    image.src = src;
  });
}

function readFileAsImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      sourceImageDataUrl = reader.result;
      loadImage(reader.result).then(resolve).catch(reject);
    };
    reader.onerror = () => reject(new Error("图片读取失败"));
    reader.readAsDataURL(file);
  });
}

function getGeneratorSettings() {
  const cols = clamp(Number(elements.widthInput.value) || 50, 8, 80);
  const rows = sourceImage ? Math.max(1, Math.round((sourceImage.height / sourceImage.width) * cols)) : Number(elements.heightInput.value);
  const maxColors = clamp(Number(elements.maxColorsInput.value) || 0, 0, 64);
  return {
    cols,
    rows,
    maxColors,
    offsetX: Number(elements.offsetXInput.value) || 0,
    offsetY: Number(elements.offsetYInput.value) || 0,
    imageScale: clamp(Number(elements.imageScaleInput.value) || 100, 40, 240),
    brightness: Number(elements.brightnessInput.value) || 0,
    contrast: Number(elements.contrastInput.value) || 0,
    saturation: Number(elements.saturationInput.value) || 0,
  };
}

function syncControls() {
  const settings = getGeneratorSettings();
  elements.heightInput.value = settings.rows;
  elements.offsetXValue.value = settings.offsetX;
  elements.offsetYValue.value = settings.offsetY;
  elements.imageScaleValue.value = settings.imageScale;
  elements.brightnessValue.value = settings.brightness;
  elements.contrastValue.value = settings.contrast;
  elements.saturationValue.value = settings.saturation;
  elements.patternBoard.classList.toggle("show-codes", elements.showCodesInput.checked);
  elements.patternBoard.classList.toggle("show-grid", elements.showGridInput.checked);
  elements.patternBoard.classList.toggle("show-split", elements.showSplitInput.checked);
}

function applyGeneratorSettings(settings) {
  elements.widthInput.value = settings.cols;
  elements.heightInput.value = settings.rows;
  elements.maxColorsInput.value = settings.maxColors;
  elements.offsetXInput.value = settings.offsetX;
  elements.offsetYInput.value = settings.offsetY;
  elements.imageScaleInput.value = settings.imageScale;
  elements.brightnessInput.value = settings.brightness;
  elements.contrastInput.value = settings.contrast;
  elements.saturationInput.value = settings.saturation;
  syncControls();
}

async function loadFixedLevelIntoGenerator(levelId) {
  const config = fixedLevelConfigs[levelId];
  if (!config) return null;
  sourceImage = await loadImage(config.src);
  sourceImageName = config.src.split("/").pop();
  sourceImageDataUrl = config.src;
  applyGeneratorSettings(config.settings);
  return generatedLevels[levelId] || null;
}

function sampleCellsFromImage(image, settings) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const canvasWidth = settings.cols * 12;
  const canvasHeight = settings.rows * 12;
  const sampleW = canvasWidth / settings.cols;
  const sampleH = canvasHeight / settings.rows;
  const fitScale = Math.min(canvasWidth / image.width, canvasHeight / image.height);
  const drawScale = fitScale * (settings.imageScale / 100);
  const drawWidth = image.width * drawScale;
  const drawHeight = image.height * drawScale;
  const drawX = (canvasWidth - drawWidth) / 2 + (settings.offsetX / 100) * canvasWidth * 0.5;
  const drawY = (canvasHeight - drawHeight) / 2 + (settings.offsetY / 100) * canvasHeight * 0.5;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  const cells = [];
  const colors = [];

  for (let row = 0; row < settings.rows; row += 1) {
    const rowCells = [];
    for (let col = 0; col < settings.cols; col += 1) {
      const startX = Math.floor(col * sampleW);
      const startY = Math.floor(row * sampleH);
      const width = Math.max(1, Math.floor(sampleW));
      const height = Math.max(1, Math.floor(sampleH));
      const data = context.getImageData(startX, startY, width, height).data;
      let count = 0;
      let r = 0;
      let g = 0;
      let b = 0;

      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        const isBackground = alpha < 8 || (red > backgroundCutoff && green > backgroundCutoff && blue > backgroundCutoff);
        if (isBackground) continue;
        const adjusted = adjustColor({ r: red, g: green, b: blue }, settings);
        count += 1;
        r += adjusted.r;
        g += adjusted.g;
        b += adjusted.b;
      }

      if (count / (data.length / 4) < minInkRatio) {
        rowCells.push(null);
        continue;
      }

      const sampled = quantizeColor({
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count),
      });
      colors.push(sampled);
      rowCells.push({ rgb: sampled });
    }
    cells.push(rowCells);
  }

  return { cells, colors };
}

function buildPalette(colors, maxColors) {
  const unique = new Map();
  colors.forEach((rgb) => unique.set(rgbToHex(rgb.r, rgb.g, rgb.b), rgb));
  const uniqueColors = [...unique.values()];
  if (maxColors === 0 || uniqueColors.length <= maxColors) return uniqueColors;

  const centers = uniqueColors.slice(0, maxColors).map((color) => ({ ...color }));
  for (let iteration = 0; iteration < 8; iteration += 1) {
    const buckets = centers.map(() => []);
    uniqueColors.forEach((color) => {
      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      centers.forEach((center, index) => {
        const distance = colorDistance(color, center);
        if (distance < bestDistance) {
          bestIndex = index;
          bestDistance = distance;
        }
      });
      buckets[bestIndex].push(color);
    });

    buckets.forEach((bucket, index) => {
      if (!bucket.length) return;
      centers[index] = {
        r: Math.round(bucket.reduce((sum, color) => sum + color.r, 0) / bucket.length),
        g: Math.round(bucket.reduce((sum, color) => sum + color.g, 0) / bucket.length),
        b: Math.round(bucket.reduce((sum, color) => sum + color.b, 0) / bucket.length),
      };
    });
  }

  const deduped = new Map();
  centers.map(quantizeColor).forEach((rgb) => deduped.set(rgbToHex(rgb.r, rgb.g, rgb.b), rgb));
  return [...deduped.values()];
}

function nearestColor(rgb, palette) {
  let best = palette[0];
  let bestDistance = Number.POSITIVE_INFINITY;
  palette.forEach((color) => {
    const distance = colorDistance(rgb, color);
    if (distance < bestDistance) {
      best = color;
      bestDistance = distance;
    }
  });
  return best;
}

function generateLevelFromImage(image, settings, levelId = elements.levelSelect.value) {
  const sampled = sampleCellsFromImage(image, settings);
  const paletteRgb = buildPalette(sampled.colors, settings.maxColors);
  if (!paletteRgb.length) {
    throw new Error("未识别到有效图案区域，请降低背景阈值或换一张非纯白图片");
  }
  const palette = paletteRgb.map((rgb, index) => ({
    key: `C${String(index + 1).padStart(2, "0")}`,
    color: rgbToHex(rgb.r, rgb.g, rgb.b),
  }));
  const paletteByHex = new Map(palette.map((entry) => [entry.color, entry.key]));

  const matrix = sampled.cells.map((rowCells) =>
    rowCells.map((cell) => {
      if (!cell) return null;
      const matched = nearestColor(cell.rgb, paletteRgb);
      const hex = rgbToHex(matched.r, matched.g, matched.b);
      return paletteByHex.get(hex);
    }),
  );

  return {
    id: `level-${levelId}`,
    name: fixedLevelConfigs[levelId]?.name || `关卡 ${levelId}`,
    sourceName: sourceImageName,
    sourceImage: sourceImageDataUrl,
    rows: settings.rows,
    cols: settings.cols,
    palette,
    matrix,
    createdAt: new Date().toISOString(),
  };
}

function paletteMap(level) {
  return new Map((level?.palette || []).map((entry) => [entry.key, entry]));
}

function renderPatternPreview(level) {
  level = normalizeLevel(level);
  elements.patternBoard.innerHTML = "";
  elements.patternBoard.style.setProperty("--cols", level.cols);
  elements.patternBoard.style.setProperty("--rows", level.rows);
  const colors = paletteMap(level);

  let activeCells = 0;
  level.matrix.forEach((rowCells, row) => {
    rowCells.forEach((cell, col) => {
      const colorKey = cellKey(cell);
      const color = colorKey ? colors.get(colorKey) : null;
      const tile = document.createElement("div");
      tile.className = color ? "pattern-cell" : "pattern-cell empty";
      if (color) {
        activeCells += 1;
        tile.style.setProperty("--target-bg", color.color);
        tile.textContent = color.key;
      }
      if ((col + 1) % boardSplitSize === 0) tile.classList.add("split-right");
      if ((row + 1) % boardSplitSize === 0) tile.classList.add("split-bottom");
      elements.patternBoard.appendChild(tile);
    });
  });

  elements.previewMeta.textContent = `${level.name} / ${level.cols} × ${level.rows} / 有效拼豆 ${activeCells} / 颜色 ${level.palette.length}`;
}

function renderHomePreview(level) {
  level = normalizeLevel(level);
  if (!level) return;
  if (level.sourceImage) {
    elements.homeOriginalPreview.src = level.sourceImage;
    elements.homeOriginalPreview.classList.remove("hidden");
    elements.homePatternBoard.classList.add("hidden");
    return;
  }
  elements.homeOriginalPreview.classList.add("hidden");
  elements.homePatternBoard.classList.remove("hidden");
  const colors = paletteMap(level);
  const maxCols = Math.min(level.cols, 32);
  const maxRows = Math.min(level.rows, 28);
  const colStep = Math.max(1, Math.ceil(level.cols / maxCols));
  const rowStep = Math.max(1, Math.ceil(level.rows / maxRows));

  elements.homePatternBoard.innerHTML = "";
  elements.homePatternBoard.style.setProperty("--cols", Math.ceil(level.cols / colStep));
  elements.homePatternBoard.style.setProperty("--rows", Math.ceil(level.rows / rowStep));

  for (let row = 0; row < level.rows; row += rowStep) {
    for (let col = 0; col < level.cols; col += colStep) {
      const colorKey = cellKey(level.matrix[row][col]);
      const color = colorKey ? colors.get(colorKey) : null;
      const tile = document.createElement("span");
      tile.className = color ? "home-preview-cell" : "home-preview-cell empty";
      if (color) tile.style.setProperty("--target-bg", color.color);
      elements.homePatternBoard.appendChild(tile);
    }
  }
}

function syncHomeLevelButtons() {
  elements.homeLevelNumber.textContent = selectedLevelId;
  elements.levelSelect.value = selectedLevelId;
  elements.homeLevelSelector.querySelectorAll(".level-chip").forEach((button) => {
    button.classList.toggle("active", button.dataset.level === selectedLevelId);
  });
  const level = generatedLevels[selectedLevelId] || currentGeneratedLevel;
  if (level) renderHomePreview(level);
}

function setActiveView(view) {
  if (playerMode && view === "generator") view = "home";
  const isHome = view === "home";
  const isGenerator = view === "generator";
  const isGame = view === "game";
  elements.homeView.classList.toggle("hidden", !isHome);
  elements.generatorView.classList.toggle("hidden", !isGenerator);
  elements.gameView.classList.toggle("hidden", !isGame);
  elements.homeTab.classList.toggle("active", isHome);
  elements.generatorTab.classList.toggle("active", isGenerator);
  elements.gameTab.classList.toggle("active", isGame);
  if (isHome) syncHomeLevelButtons();
}

function generateAndStoreLevel() {
  if (!sourceImage) {
    showToast("请先导入图片或等待内置素材加载");
    return null;
  }
  syncControls();
  const settings = getGeneratorSettings();
  try {
    elements.previewMeta.textContent = "正在生成关卡图案...";
    const level = generateLevelFromImage(sourceImage, settings);
    generatedLevels[elements.levelSelect.value] = level;
    selectedLevelId = elements.levelSelect.value;
    currentGeneratedLevel = level;
    saveStoredLevels();
    renderPatternPreview(level);
    renderHomePreview(level);
    showToast("关卡图案已生成");
    return level;
  } catch (error) {
    console.error(error);
    elements.previewMeta.textContent = "生成失败：未识别到有效图案";
    showToast("生成失败，请换图或调整参数");
    return null;
  }
}

async function buildFixedLevels() {
  const entries = await Promise.all(
    Object.entries(fixedLevelConfigs).map(async ([levelId, config]) => {
      const image = await loadImage(config.src);
      const previousName = sourceImageName;
      const previousDataUrl = sourceImageDataUrl;
      sourceImageName = config.src.split("/").pop();
      sourceImageDataUrl = config.src;
      const level = generateLevelFromImage(image, config.settings, levelId);
      sourceImageName = previousName;
      sourceImageDataUrl = previousDataUrl;
      return [levelId, level];
    }),
  );
  generatedLevels = Object.fromEntries(entries);
  currentGeneratedLevel = generatedLevels[selectedLevelId];
}

function shuffle(values) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildTargetCells() {
  const cells = [];
  const colors = paletteMap(activeGameLevel);
  activeGameLevel.matrix.forEach((rowCells, row) => {
    rowCells.forEach((cell, col) => {
      const colorKey = cellKey(cell);
      const target = colorKey ? colors.get(colorKey) : null;
      if (target) cells.push({ row, col, target });
    });
  });
  return cells;
}

function shuffledColors(targetCells) {
  const targets = targetCells.map((cell) => cell.target);
  let colors = localShuffleTargets(targetCells, targets);
  for (let attempts = 0; attempts < 80; attempts += 1) {
    const correctCount = colors.filter((color, index) => color.key === targets[index].key).length;
    if (correctCount === 0) return colors;
    fixCorrectPlacements(colors, targetCells, targets);
    if (colors.every((color, index) => color.key !== targets[index].key)) return colors;
    colors = localShuffleTargets(targetCells, targets);
  }
  fixCorrectPlacements(colors, targetCells, targets);
  return colors;
}

function fixCorrectPlacements(colors, targetCells, targets) {
  for (let index = 0; index < colors.length; index += 1) {
    if (colors[index].key !== targets[index].key) continue;
    let swapIndex = -1;
    for (let other = 0; other < colors.length; other += 1) {
      if (other === index) continue;
      const distance = Math.abs(targetCells[index].row - targetCells[other].row) + Math.abs(targetCells[index].col - targetCells[other].col);
      const fixesIndex = colors[other].key !== targets[index].key;
      const keepsOtherWrong = colors[index].key !== targets[other].key;
      if (distance <= 2 && fixesIndex && keepsOtherWrong) {
        swapIndex = other;
        break;
      }
    }
    if (swapIndex === -1) {
      swapIndex = colors.findIndex((color, other) => other !== index && color.key !== targets[index].key && colors[index].key !== targets[other].key);
    }
    if (swapIndex !== -1) {
      [colors[index], colors[swapIndex]] = [colors[swapIndex], colors[index]];
    }
  }
}

function localShuffleTargets(targetCells, targets) {
  const colors = [...targets];
  const radius = 1;
  const buckets = targetCells.map((cell, index) => {
    const nearby = [];
    targetCells.forEach((other, otherIndex) => {
      if (index === otherIndex) return;
      const distance = Math.abs(cell.row - other.row) + Math.abs(cell.col - other.col);
      if (distance <= radius) nearby.push(otherIndex);
    });
    return nearby;
  });

  for (let iteration = 0; iteration < targetCells.length * 2; iteration += 1) {
    const index = Math.floor(Math.random() * targetCells.length);
    const nearby = buckets[index];
    if (!nearby.length) continue;
    const otherIndex = nearby[Math.floor(Math.random() * nearby.length)];
    [colors[index], colors[otherIndex]] = [colors[otherIndex], colors[index]];
  }

  return colors;
}

async function ensureGameLevel() {
  const selectedLevel = generatedLevels[selectedLevelId];
  const normalizedSelected = normalizeLevel(selectedLevel);
  if (isPlayableLevel(normalizedSelected)) {
    activeGameLevel = normalizedSelected;
    return;
  }
  if (selectedLevel) {
    delete generatedLevels[selectedLevelId];
    saveStoredLevels();
  }
  if (!sourceImage) sourceImage = await loadImage(defaultImageSrc);
  activeGameLevel = generateAndStoreLevel();
}

async function initGame() {
  await ensureGameLevel();
  activeGameLevel = normalizeLevel(activeGameLevel);
  if (!isPlayableLevel(activeGameLevel)) throw new Error("当前关卡数据不完整，请重新生成关卡");
  const targetCells = buildTargetCells();
  if (!targetCells.length) throw new Error("当前关卡没有可拼区域，请重新生成关卡");
  const colors = shuffledColors(targetCells);
  const colorMap = paletteMap(activeGameLevel);
  board = Array.from({ length: activeGameLevel.rows }, (_, row) =>
    Array.from({ length: activeGameLevel.cols }, (_, col) => {
      const colorKey = cellKey(activeGameLevel.matrix[row]?.[col]);
      if (!colorKey) return null;
      const target = colorMap.get(colorKey);
      if (!target) return null;
      const index = targetCells.findIndex((cell) => cell.row === row && cell.col === col);
      const current = colors[index];
      return { target, current, locked: false };
    }),
  );
  splitOversizedColorGroups();
  fixInitialCorrectCells();
  splitOversizedColorGroups();
  fixInitialCorrectCells();

  tray = Array.from({ length: traySize }, () => null);
  selectedTrayIndex = null;
  correctStreak = 0;
  secondsLeft = maxTime;
  won = false;
  elements.resultModal.classList.add("hidden");
  elements.coinCount.textContent = "0";
  elements.board.style.setProperty("--cols", activeGameLevel.cols);
  elements.board.style.setProperty("--rows", activeGameLevel.rows);
  centerBoard();
  startTimer();
  renderGame();
  resetIdleHintTimer();
}

function startTimer() {
  window.clearInterval(timerId);
  timerId = window.setInterval(() => {
    if (won) return;
    secondsLeft = Math.max(0, secondsLeft - 1);
    updateTimer();
    if (secondsLeft === 0) {
      window.clearInterval(timerId);
      showResultModal("fail");
    }
  }, 1000);
  updateTimer();
}

function updateTimer() {
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  elements.timer.textContent = `${minutes}:${seconds}`;
}

function renderGame() {
  elements.board.innerHTML = "";
  for (let row = 0; row < activeGameLevel.rows; row += 1) {
    for (let col = 0; col < activeGameLevel.cols; col += 1) {
      const data = board[row][col];
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = data ? "cell target" : "cell empty";
      if (data) {
        cell.style.setProperty("--target-bg", alphaColor(data.target.color, 0.72));
        if (data.locked) cell.classList.add("locked");
        if (hintCells.has(`${row},${col}`)) cell.classList.add("hint");
        if (data.current) {
          const bead = document.createElement("span");
          bead.className = "bead";
          bead.style.setProperty("--bead-color", data.current.color);
          cell.appendChild(bead);
        }
        cell.addEventListener("click", () => handleBoardClick(row, col));
      }
      elements.board.appendChild(cell);
    }
  }

  elements.tray.innerHTML = "";
  tray.forEach((color, index) => {
    const slot = document.createElement("button");
    slot.type = "button";
    slot.className = "tray-slot";
    if (selectedTrayIndex === index) slot.classList.add("selected");
    if (color) {
      const bead = document.createElement("span");
      bead.className = "bead";
      bead.style.setProperty("--bead-color", color.color);
      slot.appendChild(bead);
    }
    slot.addEventListener("click", () => handleTrayClick(index));
    elements.tray.appendChild(slot);
  });

  applyBoardTransform();
  checkWin();
}

function handleBoardClick(row, col) {
  if (won || secondsLeft === 0) return;
  resetIdleHintTimer();
  const cell = board[row][col];
  if (!cell?.target || cell.locked) {
    showToast("这里不能操作");
    return;
  }
  if (selectedTrayIndex !== null) {
    placeSelectedOnBoard(cell);
    renderGame();
    return;
  }
  if (!cell.current) {
    showToast("先选择一个拼豆");
    return;
  }
  pickConnectedBeads(row, col);
  renderGame();
}

function pickConnectedBeads(startRow, startCol) {
  const start = board[startRow][startCol];
  if (!start?.current) return;
  const emptySlots = tray.map((item, index) => (item ? null : index)).filter((index) => index !== null);
  if (emptySlots.length === 0) {
    showToast("暂存格满了");
    return;
  }
  const group = findConnectedGroup(startRow, startCol, start.current.key);
  const pickupLimit = Math.min(emptySlots.length, maxPickupPerClick);
  const picked = group.slice(0, pickupLimit);
  picked.forEach(({ row, col }, index) => {
    tray[emptySlots[index]] = board[row][col].current;
    board[row][col].current = null;
  });
  showToast(group.length > picked.length ? `本次拾取 ${picked.length} 个，剩余同色留在棋盘` : `拾取 ${picked.length} 个同色拼豆`);
}

function findConnectedGroup(startRow, startCol, colorKey) {
  const group = [];
  const queue = [{ row: startRow, col: startCol }];
  const visited = new Set();

  while (queue.length) {
    const point = queue.shift();
    const id = `${point.row},${point.col}`;
    if (visited.has(id)) continue;
    visited.add(id);
    const cell = board[point.row]?.[point.col];
    if (!cell || cell.locked || !cell.current || cell.current.key !== colorKey) continue;
    group.push(point);
    queue.push(
      { row: point.row - 1, col: point.col },
      { row: point.row + 1, col: point.col },
      { row: point.row, col: point.col - 1 },
      { row: point.row, col: point.col + 1 },
    );
  }
  return group;
}

function findCurrentColorGroups() {
  const groups = [];
  const visited = new Set();
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      const cell = board[row][col];
      const id = `${row},${col}`;
      if (!cell || !cell.current || visited.has(id)) continue;
      const group = findConnectedGroup(row, col, cell.current.key);
      group.forEach((point) => visited.add(`${point.row},${point.col}`));
      groups.push(group);
    }
  }
  return groups;
}

function splitOversizedColorGroups() {
  const maxGroupSize = maxPickupPerClick;
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const oversized = findCurrentColorGroups().find((group) => group.length > maxGroupSize);
    if (!oversized) return;
    const point = oversized[Math.floor(oversized.length / 2)];
    const sourceCell = board[point.row]?.[point.col];
    if (!sourceCell?.current) return;
    const replacement = findNearbyDifferentCurrent(point.row, point.col, sourceCell.current.key);
    if (!replacement) return;
    [sourceCell.current, board[replacement.row][replacement.col].current] = [
      board[replacement.row][replacement.col].current,
      sourceCell.current,
    ];
    const stillTooLarge = findCurrentColorGroups().some((group) => group.length > maxGroupSize);
    if (!stillTooLarge) return;
  }
}

function findNearbyDifferentCurrent(row, col, colorKey) {
  const sourceCell = board[row]?.[col];
  if (!sourceCell?.current || !sourceCell?.target) return null;
  let fallback = null;
  for (let radius = 1; radius <= 5; radius += 1) {
    for (let r = Math.max(0, row - radius); r <= Math.min(board.length - 1, row + radius); r += 1) {
      for (let c = Math.max(0, col - radius); c <= Math.min(board[r].length - 1, col + radius); c += 1) {
        const cell = board[r][c];
        if (!cell?.current || !cell?.target || cell.current.key === colorKey) continue;
        if (cell.current.key !== sourceCell.target.key && sourceCell.current.key !== cell.target.key) {
          return { row: r, col: c };
        }
        fallback = fallback || { row: r, col: c };
      }
    }
  }
  return fallback;
}

function fixInitialCorrectCells() {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const correctPoint = findInitialCorrectPoint();
    if (!correctPoint) return;
    const sourceCell = board[correctPoint.row]?.[correctPoint.col];
    if (!sourceCell?.current) return;
    const replacement = findNearbyDifferentCurrent(correctPoint.row, correctPoint.col, sourceCell.current.key);
    if (!replacement) return;
    [sourceCell.current, board[replacement.row][replacement.col].current] = [
      board[replacement.row][replacement.col].current,
      sourceCell.current,
    ];
  }
}

function findInitialCorrectPoint() {
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      const cell = board[row][col];
      if (cell?.current?.key && cell?.target?.key && cell.current.key === cell.target.key) return { row, col };
    }
  }
  return null;
}

function placeSelectedOnBoard(cell) {
  if (!cell?.target) {
    showToast("这里不能操作");
    return;
  }
  if (cell.current) {
    showToast("目标格已有拼豆");
    return;
  }
  const color = tray[selectedTrayIndex];
  if (!color) {
    selectedTrayIndex = null;
    return;
  }

  if (color.key === cell.target.key) {
    const targetGroup = findFillableTargetGroup(cell, color.key);
    const trayIndexes = findTrayIndexesByColor(color.key);
    const fillCount = Math.min(targetGroup.length, trayIndexes.length);
    for (let index = 0; index < fillCount; index += 1) {
      const targetCell = targetGroup[index];
      const trayIndex = trayIndexes[index];
      targetCell.current = tray[trayIndex];
      targetCell.locked = true;
      tray[trayIndex] = null;
    }
    selectedTrayIndex = null;
    correctStreak += fillCount;
    showCombo(fillCount);
  } else {
    correctStreak = 0;
    cell.current = color;
    tray[selectedTrayIndex] = null;
    selectedTrayIndex = null;
    secondsLeft = Math.max(0, secondsLeft - 10);
    updateTimer();
    showToast("错放 -10 秒");
  }
}

function findTrayIndexesByColor(colorKey) {
  return tray
    .map((color, index) => (color?.key === colorKey ? index : null))
    .filter((index) => index !== null);
}

function findFillableTargetGroup(startCell, colorKey) {
  let startPoint = null;
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      if (board[row][col] === startCell) startPoint = { row, col };
    }
  }
  if (!startPoint) return [];

  const group = [];
  const queue = [startPoint];
  const visited = new Set();
  while (queue.length) {
    const point = queue.shift();
    const id = `${point.row},${point.col}`;
    if (visited.has(id)) continue;
    visited.add(id);

    const cell = board[point.row]?.[point.col];
    if (!cell?.target || cell.locked || cell.current || cell.target.key !== colorKey) continue;
    group.push(cell);
    queue.push(
      { row: point.row - 1, col: point.col },
      { row: point.row + 1, col: point.col },
      { row: point.row, col: point.col - 1 },
      { row: point.row, col: point.col + 1 },
    );
  }
  return group;
}

function handleTrayClick(index) {
  if (won || secondsLeft === 0) return;
  resetIdleHintTimer();
  if (!tray[index]) {
    showToast("空槽位");
    return;
  }
  selectedTrayIndex = selectedTrayIndex === index ? null : index;
  renderGame();
}

function checkWin() {
  if (won) return;
  const complete = board.flat().every((cell) => !cell || cell.locked);
  if (!complete) return;
  won = true;
  clearIdleHint();
  window.clearInterval(timerId);
  elements.coinCount.textContent = "30";
  window.setTimeout(() => showResultModal("win"), 250);
}

function showResultModal(type) {
  clearIdleHint();
  const isWin = type === "win";
  elements.resultPanel.classList.toggle("fail", !isWin);
  elements.resultPanel.classList.toggle("win", isWin);
  elements.resultBanner.textContent = isWin ? "贴纸复原完成" : "挑战失败了";
  elements.resultCat.textContent = isWin ? "" : "😿";
  elements.resultCat.classList.toggle("hidden", isWin);
  elements.resultSticker.classList.toggle("hidden", !isWin);
  elements.resultCelebration.classList.toggle("hidden", !isWin);
  if (isWin && activeGameLevel?.sourceImage) {
    elements.resultStickerImage.src = activeGameLevel.sourceImage;
  }
  elements.resultTitle.textContent = isWin ? "贴纸复原完成" : "失败了";
  elements.resultText.textContent = isWin ? "获得猫咪手账贴纸，金币 +30" : "猫咪哭唧唧地等你再试一次";
  elements.restartButton.textContent = isWin ? "下一关" : "再玩一次";
  elements.resultModal.classList.remove("hidden");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => elements.toast.classList.remove("show"), 1200);
}

function showCombo(fillCount) {
  const message = correctStreak >= 5 ? `太棒了 连续完成 +${correctStreak}` : `归位 ${fillCount} 个同色拼豆`;
  showToast(message);
  if (correctStreak >= 5) {
    // Future hook: play praise SFX here.
  }
}

function resetIdleHintTimer() {
  clearIdleHint(false);
  window.clearTimeout(idleHintTimerId);
  if (won || secondsLeft === 0) return;
  idleHintTimerId = window.setTimeout(showMismatchHint, idleHintDelay);
}

function clearIdleHint(shouldRender = true) {
  window.clearTimeout(idleHintTimerId);
  idleHintTimerId = null;
  window.clearTimeout(hintClearTimerId);
  hintClearTimerId = null;
  if (!hintCells.size) return;
  hintCells = new Set();
  if (shouldRender) renderGame();
}

function showMismatchHint() {
  if (won || secondsLeft === 0) return;
  const candidates = getMismatchedBoardCells();
  if (!candidates.length) {
    resetIdleHintTimer();
    return;
  }
  hintCells = new Set(shuffle(candidates).slice(0, maxHintCells).map((cell) => `${cell.row},${cell.col}`));
  showToast("这些拼豆还没对上底色");
  renderGame();
  hintClearTimerId = window.setTimeout(() => {
    clearIdleHint();
    resetIdleHintTimer();
  }, hintDuration);
}

function getMismatchedBoardCells() {
  const cells = [];
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      const cell = board[row][col];
      if (!cell?.target || cell.locked || !cell.current) continue;
      if (cell.current.key !== cell.target.key) cells.push({ row, col });
    }
  }
  return cells;
}

function handleGameLoadError(error, fallback = "游戏加载失败") {
  console.error(fallback, error);
  showToast(error?.message || fallback);
}

function centerBoard() {
  pan = { x: 0, y: 0 };
  applyBoardTransform();
}

function applyBoardTransform() {
  const scale = zoomed ? zoomScale : 1;
  elements.board.classList.toggle("zoomed", zoomed);
  elements.board.style.transform = `translate(${pan.x}px, ${pan.y}px) scale(${scale})`;
}

function clampPan(nextPan) {
  if (!zoomed) return { x: 0, y: 0 };
  const windowRect = elements.boardWindow.getBoundingClientRect();
  const boardRect = elements.board.getBoundingClientRect();
  const maxX = Math.max(0, (boardRect.width - windowRect.width) / 2 + 28);
  const maxY = Math.max(0, (boardRect.height - windowRect.height) / 2 + 28);
  return {
    x: Math.max(-maxX, Math.min(maxX, nextPan.x)),
    y: Math.max(-maxY, Math.min(maxY, nextPan.y)),
  };
}

function bindEvents() {
  elements.homeTab.addEventListener("click", () => setActiveView("home"));
  elements.generatorTab.addEventListener("click", async () => {
    await loadFixedLevelIntoGenerator(selectedLevelId);
    setActiveView("generator");
  });
  elements.gameTab.addEventListener("click", () => {
    setActiveView("game");
    initGame().catch((error) => handleGameLoadError(error));
  });
  elements.imageInput.addEventListener("change", async () => {
    const file = elements.imageInput.files[0];
    if (!file) return;
    sourceImage = await readFileAsImage(file);
    sourceImageName = file.name;
    syncControls();
    showToast("图片已导入");
  });
  [
    elements.widthInput,
    elements.maxColorsInput,
    elements.offsetXInput,
    elements.offsetYInput,
    elements.imageScaleInput,
    elements.brightnessInput,
    elements.contrastInput,
    elements.saturationInput,
    elements.showCodesInput,
    elements.showGridInput,
    elements.showSplitInput,
  ].forEach((control) => control.addEventListener("input", syncControls));
  elements.generateButton.addEventListener("click", generateAndStoreLevel);
  elements.playGeneratedButton.addEventListener("click", () => {
    generateAndStoreLevel();
    setActiveView("game");
    initGame().catch((error) => handleGameLoadError(error));
  });
  elements.levelSelect.addEventListener("change", async () => {
    selectedLevelId = elements.levelSelect.value;
    await loadFixedLevelIntoGenerator(selectedLevelId);
    const stored = generatedLevels[elements.levelSelect.value];
    if (stored) {
      currentGeneratedLevel = stored;
      renderPatternPreview(stored);
      renderHomePreview(stored);
    }
    syncHomeLevelButtons();
  });
  elements.homeLevelSelector.addEventListener("click", (event) => {
    const button = event.target.closest(".level-chip");
    if (!button) return;
    selectedLevelId = button.dataset.level;
    elements.levelSelect.value = selectedLevelId;
    const stored = generatedLevels[selectedLevelId];
    if (stored) {
      currentGeneratedLevel = stored;
      renderPatternPreview(stored);
    }
    syncHomeLevelButtons();
  });
  elements.startLevelButton.addEventListener("click", () => {
    setActiveView("game");
    initGame().catch((error) => handleGameLoadError(error));
  });
  elements.zoomButton.addEventListener("click", () => {
    zoomed = !zoomed;
    elements.zoomSliderWrap.classList.toggle("hidden", !zoomed);
    if (!zoomed) centerBoard();
    applyBoardTransform();
  });
  elements.zoomScaleInput.addEventListener("input", () => {
    zoomScale = Number(elements.zoomScaleInput.value) / 100;
    pan = clampPan(pan);
    applyBoardTransform();
  });
  elements.boardWindow.addEventListener("pointerdown", (event) => {
    if (!zoomed) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, startPan: { ...pan }, moved: false };
  });
  elements.boardWindow.addEventListener("pointermove", (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) {
      if (!drag.moved) {
        drag.moved = true;
        elements.boardWindow.setPointerCapture(event.pointerId);
      }
      elements.board.classList.add("dragging");
    }
    if (!drag.moved) return;
    pan = clampPan({
      x: drag.startPan.x + dx,
      y: drag.startPan.y + dy,
    });
    applyBoardTransform();
  });
  elements.boardWindow.addEventListener("pointerup", (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    drag = null;
    elements.board.classList.remove("dragging");
  });
  elements.restartButton.addEventListener("click", () => {
    if (elements.resultPanel.classList.contains("win")) {
      const nextLevel = Math.min(3, Number(selectedLevelId) + 1);
      selectedLevelId = String(nextLevel);
      elements.resultModal.classList.add("hidden");
      setActiveView("home");
      syncHomeLevelButtons();
      return;
    }
    initGame().catch((error) => handleGameLoadError(error, "关卡重启失败"));
  });
  elements.modalCloseButton.addEventListener("click", () => elements.resultModal.classList.add("hidden"));
}

async function boot() {
  bindEvents();
  sourceImage = await loadImage(defaultImageSrc);
  sourceImageName = "level-cat.png";
  sourceImageDataUrl = defaultImageSrc;
  syncControls();
  if (playerMode) {
    await buildFixedLevels();
    renderHomePreview(generatedLevels[selectedLevelId]);
  } else {
    await buildFixedLevels();
    currentGeneratedLevel = generatedLevels[selectedLevelId];
    await loadFixedLevelIntoGenerator(selectedLevelId);
    renderPatternPreview(currentGeneratedLevel);
    renderHomePreview(currentGeneratedLevel);
  }
  setActiveView("home");
}

boot().catch((error) => {
  console.error(error);
  showToast("内置素材加载失败，请导入图片");
});
