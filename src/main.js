const defaultImageSrc = "./assets/level-cat.png";
const playerMode = window.XINDONG_PLAYER_MODE === true;
const levelProgressKey = "xindong-level-progress";
const totalHomeLevels = 10;
const fixedLevelData = window.NEKO_FIXED_LEVELS || {};
const fixedLevelConfigs = {
  "1": {
    src: "./assets/level-1.png",
    name: "关卡 1",
    settings: { cols: 15, rows: 15, maxColors: 3, offsetX: 0, offsetY: 0, imageScale: 93, brightness: -9, contrast: 59, saturation: 106 },
  },
  "2": {
    src: "./assets/level-2.png",
    name: "关卡 2",
    settings: { cols: 30, rows: 30, maxColors: 4, offsetX: 0, offsetY: 0, imageScale: 100, brightness: -13, contrast: 14, saturation: 46 },
  },
  "3": {
    src: "./assets/level-3.png",
    name: "关卡 3",
    settings: { cols: 30, rows: 30, maxColors: 5, offsetX: 0, offsetY: 0, imageScale: 100, brightness: -13, contrast: 14, saturation: 46 },
  },
  "4": {
    src: "./assets/level-4.png",
    name: "关卡 4",
    settings: { cols: 30, rows: 30, maxColors: 6, offsetX: 0, offsetY: 0, imageScale: 100, brightness: -13, contrast: 14, saturation: 55 },
  },
  "5": {
    src: "./assets/level-5.png",
    name: "关卡 5",
    settings: { cols: 30, rows: 30, maxColors: 6, offsetX: 0, offsetY: 0, imageScale: 100, brightness: -13, contrast: 14, saturation: 55 },
  },
  "6": {
    src: "./assets/level-6.png",
    name: "关卡 6",
    settings: { cols: 30, rows: 30, maxColors: 4, offsetX: 0, offsetY: 0, imageScale: 100, brightness: -13, contrast: 14, saturation: 55 },
  },
  "7": {
    src: "./assets/level-7.png",
    name: "关卡 7",
    settings: { cols: 30, rows: 30, maxColors: 5, offsetX: 0, offsetY: 0, imageScale: 100, brightness: -13, contrast: 14, saturation: 55 },
  },
  "8": {
    src: "./assets/level-8.png",
    name: "关卡 8",
    settings: { cols: 30, rows: 30, maxColors: 6, offsetX: 0, offsetY: 0, imageScale: 100, brightness: -13, contrast: 14, saturation: 55 },
  },
  "9": {
    src: "./assets/level-9.png",
    name: "关卡 9",
    settings: { cols: 30, rows: 30, maxColors: 5, offsetX: 0, offsetY: 0, imageScale: 100, brightness: -13, contrast: 14, saturation: 55 },
  },
  "10": {
    src: "./assets/level-10.png",
    name: "关卡 10",
    settings: { cols: 30, rows: 30, maxColors: 8, offsetX: 0, offsetY: 0, imageScale: 100, brightness: -13, contrast: 14, saturation: 55 },
  },
};
const storageKey = "xindong-levels";
const editableFixedLevelIds = new Set();
const baseLevelTime = 600;
const levelTimeStep = 300;
const traySize = 36;
const trayCols = 12;
const maxPickupPerClick = trayCols;
const idleHintDelay = 10000;
const hintDuration = 4200;
const maxHintCells = 6;
const backgroundCutoff = 250;
const minInkRatio = 0.008;
const boardSplitSize = 29;

const elements = {
  homeTab: document.getElementById("homeTab"),
  generatorTab: document.getElementById("generatorTab"),
  gameTab: document.getElementById("gameTab"),
  homeView: document.getElementById("homeView"),
  generatorView: document.getElementById("generatorView"),
  gameView: document.getElementById("gameView"),
  gameShell: document.querySelector(".game-shell"),
  homeOriginalPreview: document.getElementById("homeOriginalPreview"),
  homePatternBoard: document.getElementById("homePatternBoard"),
  homeLevelSelector: document.getElementById("homeLevelSelector"),
  homeLevelNumber: document.getElementById("homeLevelNumber"),
  homeLevelHint: document.getElementById("homeLevelHint"),
  homeCoin: document.getElementById("homeCoin"),
  homePlayerLevel: document.getElementById("homePlayerLevel"),
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
  gameLevelLabel: document.getElementById("gameLevelLabel"),
  gamePlayerLevelLabel: document.getElementById("gamePlayerLevelLabel"),
  returnHomeButton: document.getElementById("returnHomeButton"),
  toolButtons: document.querySelectorAll(".tool-button[data-tool]"),
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
let levelProgress = loadLevelProgress();
let currentGeneratedLevel = null;
let activeGameLevel = null;
let selectedLevelId = "1";
let board = [];
let tray = [];
let selectedTrayIndex = null;
let secondsLeft = getLevelTimeLimit();
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
let activeTool = null;
let areaToolCenter = null;

const gameDesignSize = { width: 480, height: 853 };

function updateGameScale() {
  if (!elements.gameView || !elements.gameShell) return;
  const viewport = window.visualViewport;
  const visibleWidth = viewport?.width || window.innerWidth || document.documentElement.clientWidth;
  const visibleHeight = viewport?.height || window.innerHeight || document.documentElement.clientHeight;
  const viewRect = elements.gameView.getBoundingClientRect();
  const availableWidth = Math.min(visibleWidth || viewRect.width, viewRect.width || visibleWidth);
  const availableHeight = Math.min(visibleHeight || viewRect.height, viewRect.height || visibleHeight);
  const playerWidthScale = playerMode ? (visibleWidth / gameDesignSize.width) : 1;
  const scale = Math.min(1, availableWidth / gameDesignSize.width, availableHeight / gameDesignSize.height, playerWidthScale);
  elements.gameShell.style.setProperty("--game-scale", Number.isFinite(scale) && scale > 0 ? scale.toFixed(4) : "1");
  positionPlayerToast();
}

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

function loadLevelProgress() {
  try {
    return JSON.parse(localStorage.getItem(levelProgressKey)) || {};
  } catch {
    return {};
  }
}

function saveLevelProgress() {
  try {
    localStorage.setItem(levelProgressKey, JSON.stringify(levelProgress));
  } catch (error) {
    console.warn("关卡进度保存失败", error);
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

function cloneGeneratorSettings(settings) {
  return {
    cols: Number(settings.cols) || 50,
    rows: Number(settings.rows) || 50,
    maxColors: Number(settings.maxColors) || 0,
    offsetX: Number(settings.offsetX) || 0,
    offsetY: Number(settings.offsetY) || 0,
    imageScale: Number(settings.imageScale) || 100,
    brightness: Number(settings.brightness) || 0,
    contrast: Number(settings.contrast) || 0,
    saturation: Number(settings.saturation) || 0,
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
  if (editableFixedLevelIds.has(String(levelId))) {
    const stored = normalizeLevel(generatedLevels[levelId]);
    if (isPlayableLevel(stored)) return loadLevelIntoGenerator(levelId);
  }
  const config = fixedLevelConfigs[levelId];
  if (!config) return null;
  const level = await ensureFixedLevel(levelId);
  sourceImage = await loadImage(config.src);
  sourceImageName = config.src.split("/").pop();
  sourceImageDataUrl = config.src;
  applyGeneratorSettings(config.settings);
  return level;
}

async function ensureFixedLevel(levelId) {
  const normalized = normalizeLevel(generatedLevels[levelId]);
  if (editableFixedLevelIds.has(String(levelId)) && isPlayableLevel(normalized)) return normalized;

  const prebuilt = normalizeLevel(fixedLevelData[levelId]);
  if (isPlayableLevel(prebuilt)) {
    generatedLevels[levelId] = prebuilt;
    return prebuilt;
  }

  if (isPlayableLevel(normalized)) return normalized;

  const config = fixedLevelConfigs[levelId];
  if (!config) return null;

  const image = await loadImage(config.src);
  const previousName = sourceImageName;
  const previousDataUrl = sourceImageDataUrl;
  sourceImageName = config.src.split("/").pop();
  sourceImageDataUrl = config.src;
  const level = generateLevelFromImage(image, config.settings, levelId);
  sourceImageName = previousName;
  sourceImageDataUrl = previousDataUrl;
  generatedLevels[levelId] = level;
  return level;
}

async function loadLevelIntoGenerator(levelId) {
  const stored = normalizeLevel(generatedLevels[levelId]);
  if (stored?.sourceImage) {
    sourceImage = await loadImage(stored.sourceImage);
    sourceImageName = stored.sourceName || `level-${levelId}.png`;
    sourceImageDataUrl = stored.sourceImage;
    applyGeneratorSettings(stored.settings || {
      cols: stored.cols,
      rows: stored.rows,
      maxColors: stored.palette?.length || 0,
      offsetX: 0,
      offsetY: 0,
      imageScale: 100,
      brightness: 0,
      contrast: 0,
      saturation: 0,
    });
    currentGeneratedLevel = stored;
    renderPatternPreview(stored);
    renderHomePreview(stored);
    return stored;
  }
  return loadFixedLevelIntoGenerator(levelId);
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

      if (count === 0 || count / (data.length / 4) < minInkRatio) {
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
    settings: cloneGeneratorSettings(settings),
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
  if (!level || !elements.homeOriginalPreview || !elements.homePatternBoard) return;
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
  if (elements.homeLevelNumber) elements.homeLevelNumber.textContent = selectedLevelId;
  elements.levelSelect.value = selectedLevelId;
  const highestCompleted = getHighestCompletedLevel();
  const completedCount = Object.values(levelProgress).filter((progress) => progress?.completed === true).length;
  if (elements.homeCoin) elements.homeCoin.textContent = String(completedCount * 30);
  if (elements.homePlayerLevel) elements.homePlayerLevel.textContent = `LV.${1 + Math.floor(completedCount / 2)}`;
  const currentLevelNumber = Math.min(totalHomeLevels, highestCompleted + 1);
  const nextLevelNumber = Math.min(totalHomeLevels, currentLevelNumber + 1);
  elements.homeLevelSelector.querySelectorAll(".level-chip").forEach((button) => {
    const levelId = button.dataset.level;
    const levelNumber = getLevelNumber(levelId);
    const progress = levelProgress[levelId] || {};
    const hasLevelData = Boolean(generatedLevels[levelId]);
    const isCompleted = progress.completed === true;
    const isCurrent = !isCompleted && levelNumber === currentLevelNumber;
    const isNext = !isCompleted && levelNumber === nextLevelNumber && levelNumber > currentLevelNumber;
    const isLocked = !isCompleted && !isCurrent && !isNext;
    const isPlayable = isCompleted || (isCurrent && hasLevelData);
    const percent = isCompleted ? 100 : Math.max(0, Math.min(99, Math.round(progress.percent || 0)));
    button.classList.toggle("active", levelId === selectedLevelId);
    button.classList.toggle("complete", isCompleted);
    button.classList.toggle("current", isCurrent);
    button.classList.toggle("next", isNext);
    button.classList.toggle("locked", isLocked);
    button.disabled = false;
    const state = button.querySelector(".level-state");
    if (state) {
      state.textContent = isCompleted ? "COMPLETE" : isNext ? "NEXT" : isCurrent ? "START" : "🔒";
      state.innerHTML = "";
      if (isLocked) {
        const lockImage = document.createElement("img");
        lockImage.className = "level-lock-icon";
        lockImage.src = "./assets/ui/level-entry/lock-crop.png";
        lockImage.alt = "锁定";
        state.appendChild(lockImage);
      } else if (!isCompleted) {
        state.textContent = isNext ? "NEXT" : "START";
      }
      state.classList.toggle("locked-state", isLocked);
    }
    renderHomeLevelArt(button, generatedLevels[levelId]);
    const progressBar = button.querySelector(".level-progress");
    if (progressBar) {
      progressBar.classList.toggle("visible", !isCompleted && percent > 0);
      progressBar.style.setProperty("--progress", `${percent}%`);
      const progressText = progressBar.querySelector("em");
      if (progressText) progressText.textContent = `${percent}%`;
    }
  });
  const level = generatedLevels[selectedLevelId] || currentGeneratedLevel;
  if (level) renderHomePreview(level);
  if (elements.homeLevelHint) {
    const progress = levelProgress[selectedLevelId] || {};
    if (progress.completed) {
      elements.homeLevelHint.textContent = `Level ${selectedLevelId} 已完成`;
    } else if (progress.percent) {
      elements.homeLevelHint.textContent = `Level ${selectedLevelId} 进度 ${Math.round(progress.percent)}%`;
    } else if (!isLevelPlayable(selectedLevelId)) {
      elements.homeLevelHint.textContent = `先完成上一关`;
    } else {
      elements.homeLevelHint.textContent = `Level ${selectedLevelId} 准备开罐`;
    }
  }
}

function renderHomeLevelArt(button, level) {
  const art = button.querySelector(".level-art");
  if (!art || !level?.sourceImage || art.dataset.sourceImage === level.sourceImage) return;
  art.dataset.sourceImage = level.sourceImage;
  art.className = "level-art";
  art.innerHTML = "";
  const image = document.createElement("img");
  image.src = level.sourceImage;
  image.alt = level.name || `Level ${button.dataset.level}`;
  art.appendChild(image);
}

function getHighestCompletedLevel() {
  let highest = 0;
  Object.entries(levelProgress).forEach(([levelId, progress]) => {
    if (progress?.completed) highest = Math.max(highest, getLevelNumber(levelId));
  });
  return highest;
}

function isLevelPlayable(levelId) {
  const levelNumber = getLevelNumber(levelId);
  if (!generatedLevels[levelId]) return false;
  return levelNumber <= getHighestCompletedLevel() + 1;
}

function setActiveView(view) {
  if (playerMode && view === "generator") view = "home";
  const isHome = view === "home";
  const isGenerator = view === "generator";
  const isGame = view === "game";
  if (!isGame) stopGameTimers();
  elements.homeView.classList.toggle("hidden", !isHome);
  elements.generatorView.classList.toggle("hidden", !isGenerator);
  elements.gameView.classList.toggle("hidden", !isGame);
  elements.homeTab.classList.toggle("active", isHome);
  elements.generatorTab.classList.toggle("active", isGenerator);
  elements.gameTab.classList.toggle("active", isGame);
  if (isHome) syncHomeLevelButtons();
  window.requestAnimationFrame(updateGameScale);
}

function getLevelNumber(levelId = selectedLevelId) {
  const match = String(levelId || "1").match(/\d+/);
  return Math.max(1, Number(match?.[0]) || 1);
}

function getLevelTimeLimit(levelId = selectedLevelId) {
  const levelNumber = getLevelNumber(levelId);
  return baseLevelTime + (levelNumber - 1) * levelTimeStep;
}

function getPlayerLevelLabel() {
  const completedCount = Object.values(levelProgress).filter((progress) => progress?.completed === true).length;
  return `LV.${1 + Math.floor(completedCount / 2)}`;
}

function getCoinTotal() {
  return Object.values(levelProgress).filter((progress) => progress?.completed === true).length * 30;
}

function stopGameTimers() {
  window.clearInterval(timerId);
  timerId = null;
  clearIdleHint(false);
}

async function generateAndStoreLevel() {
  if (!sourceImage) {
    showToast("请先导入图片或等待内置素材加载");
    return null;
  }
  syncControls();
  const settings = getGeneratorSettings();
  try {
    elements.previewMeta.textContent = "正在生成关卡图案...";
    const levelId = elements.levelSelect.value;
    const prebuilt = normalizeLevel(fixedLevelData[levelId]);
    const isFixedAsset = typeof sourceImageDataUrl === "string" && sourceImageDataUrl.startsWith("./assets/level-");
    const level = isFixedAsset && isPlayableLevel(prebuilt)
      ? prebuilt
      : generateLevelFromImage(sourceImage, settings);
    generatedLevels[elements.levelSelect.value] = level;
    selectedLevelId = elements.levelSelect.value;
    currentGeneratedLevel = level;
    saveStoredLevels();
    renderPatternPreview(level);
    renderHomePreview(level);
    syncHomeLevelButtons();
    showToast("关卡图案已生成");
    return level;
  } catch (error) {
    console.error(error);
    elements.previewMeta.textContent = error.message || "生成失败：未识别到有效图案";
    showToast("生成失败，请把图片移回画布或调低缩放/偏移");
    return null;
  }
}

async function buildFixedLevels() {
  const previousLevels = { ...generatedLevels };
  const entries = [];
  for (const levelId of Object.keys(fixedLevelConfigs)) {
    try {
      if (editableFixedLevelIds.has(String(levelId)) && isPlayableLevel(normalizeLevel(previousLevels[levelId]))) continue;
      delete generatedLevels[levelId];
      const level = await ensureFixedLevel(levelId);
      if (level) entries.push([levelId, level]);
    } catch (error) {
      console.warn(`固定关卡 ${levelId} 生成失败`, error);
    }
  }
  generatedLevels = {
    ...previousLevels,
    ...Object.fromEntries(entries),
  };
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
  const fixedLevel = await ensureFixedLevel(selectedLevelId);
  if (isPlayableLevel(fixedLevel)) {
    activeGameLevel = fixedLevel;
    return;
  }
  if (selectedLevel) {
    delete generatedLevels[selectedLevelId];
    saveStoredLevels();
  }
  if (!sourceImage) sourceImage = await loadImage(defaultImageSrc);
  activeGameLevel = await generateAndStoreLevel();
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
  activeTool = null;
  areaToolCenter = null;
  correctStreak = 0;
  secondsLeft = getLevelTimeLimit(activeGameLevel.id || selectedLevelId);
  won = false;
  elements.resultModal.classList.add("hidden");
  elements.coinCount.textContent = String(getCoinTotal());
  if (elements.gameLevelLabel) elements.gameLevelLabel.textContent = `第${getLevelNumber(activeGameLevel.id || selectedLevelId)}关`;
  if (elements.gamePlayerLevelLabel) elements.gamePlayerLevelLabel.textContent = getPlayerLevelLabel();
  elements.board.style.setProperty("--cols", activeGameLevel.cols);
  elements.board.style.setProperty("--rows", activeGameLevel.rows);
  elements.board.style.setProperty("--board-base-scale", getLevelNumber(activeGameLevel.id || selectedLevelId) === 1 ? "1.5" : "1");
  centerBoard();
  startTimer();
  renderGame();
  resetIdleHintTimer();
}

function startTimer() {
  window.clearInterval(timerId);
  if (!elements.gameView || elements.gameView.classList.contains("hidden")) {
    updateTimer();
    return;
  }
  timerId = window.setInterval(() => {
    if (won || elements.gameView.classList.contains("hidden")) {
      stopGameTimers();
      return;
    }
    secondsLeft = Math.max(0, secondsLeft - 1);
    updateTimer();
    if (secondsLeft === 0) {
      stopGameTimers();
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
        cell.addEventListener("pointerenter", () => {
          if (activeTool === "area") {
            areaToolCenter = { row, col };
            renderAreaToolFrame();
          }
        });
        cell.addEventListener("click", () => handleBoardClick(row, col));
      }
      elements.board.appendChild(cell);
    }
  }
  if (activeTool === "area" && areaToolCenter) renderAreaToolFrame();

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
  updateToolButtons();
  checkWin();
}

function renderAreaToolFrame() {
  elements.board.querySelector(".area-tool-frame")?.remove();
  const bounds = getAreaBounds(areaToolCenter.row, areaToolCenter.col);
  const frame = document.createElement("span");
  frame.className = "area-tool-frame";
  frame.style.setProperty("--area-col", bounds.startCol);
  frame.style.setProperty("--area-row", bounds.startRow);
  frame.style.setProperty("--area-cols", bounds.cols);
  frame.style.setProperty("--area-rows", bounds.rows);
  elements.board.appendChild(frame);
}

function handleBoardClick(row, col) {
  if (won || secondsLeft === 0) return;
  resetIdleHintTimer();
  if (activeTool === "area") {
    useAreaReturnTool(row, col);
    return;
  }
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
  if (activeTool === "clear-tray") {
    useClearTrayTool(index);
    return;
  }
  if (!tray[index]) {
    showToast("空槽位");
    return;
  }
  selectedTrayIndex = selectedTrayIndex === index ? null : index;
  renderGame();
}

function setActiveTool(tool) {
  activeTool = activeTool === tool ? null : tool;
  selectedTrayIndex = null;
  areaToolCenter = null;
  if (activeTool === "area") showToast("点击棋盘选择 6x6 框选区域");
  if (activeTool === "clear-tray") showToast("点击暂存格中要清空的颜色");
  if (activeTool === "clear-color") useClearColorTool();
  renderGame();
}

function updateToolButtons() {
  elements.toolButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === activeTool);
  });
}

function getAreaBounds(centerRow, centerCol) {
  const size = 6;
  const startRow = Math.max(0, Math.min(board.length - size, centerRow - Math.floor(size / 2)));
  const startCol = Math.max(0, Math.min(board[0].length - size, centerCol - Math.floor(size / 2)));
  return {
    startRow,
    startCol,
    rows: Math.min(size, board.length - startRow),
    cols: Math.min(size, board[0].length - startCol),
  };
}

function useAreaReturnTool(row, col) {
  const bounds = getAreaBounds(row, col);
  const targets = [];
  for (let r = bounds.startRow; r < bounds.startRow + bounds.rows; r += 1) {
    for (let c = bounds.startCol; c < bounds.startCol + bounds.cols; c += 1) {
      const cell = board[r]?.[c];
      if (cell?.target && !cell.locked) targets.push({ row: r, col: c });
    }
  }
  let moved = 0;
  targets.forEach(({ row: targetRow, col: targetCol }) => {
    if (returnTargetCellToColor(targetRow, targetCol)) moved += 1;
  });
  activeTool = null;
  areaToolCenter = null;
  showToast(moved ? `框选归位 ${moved} 个拼豆` : "框内没有可归位拼豆");
  renderGame();
}

function returnTargetCellToColor(row, col) {
  const cell = board[row]?.[col];
  if (!cell?.target || cell.locked) return false;
  const colorKey = cell.target.key;
  if (cell.current?.key === colorKey) {
    cell.locked = true;
    return true;
  }
  if (cell.current && !moveBlockingBead(row, col)) return false;
  const source = findColorSource(colorKey);
  if (!source) return false;
  cell.current = takeColorSource(source);
  cell.locked = true;
  return true;
}

function returnBoardBeadToTarget(sourceRow, sourceCol) {
  const source = board[sourceRow]?.[sourceCol];
  if (!source?.current || source.locked) return false;
  const color = source.current;
  if (source.target?.key === color.key) {
    source.locked = true;
    return true;
  }
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      const target = board[row][col];
      if (!target?.target || target.locked || target.target.key !== color.key) continue;
      if (target.current?.key === color.key) {
        target.locked = true;
        continue;
      }
      if (target.current && !moveBlockingBead(row, col)) continue;
      target.current = color;
      target.locked = true;
      source.current = null;
      return true;
    }
  }
  return false;
}

function useClearTrayTool(index) {
  const color = tray[index];
  if (!color) {
    showToast("请点击有拼豆的暂存格");
    return;
  }
  const moved = placeColorBeads(color.key, { trayOnly: true });
  activeTool = null;
  showToast(moved ? `清空槽位 ${moved} 个拼豆` : "该颜色暂时无法清空");
  renderGame();
}

function useClearColorTool() {
  const colors = [...new Set([
    ...board.flat().filter((cell) => cell?.current && !cell.locked).map((cell) => cell.current.key),
    ...tray.filter(Boolean).map((color) => color.key),
  ])];
  const colorKey = shuffle(colors)[0];
  if (!colorKey) {
    activeTool = null;
    showToast("当前没有可消除颜色");
    renderGame();
    return;
  }
  const moved = placeColorBeads(colorKey);
  activeTool = null;
  showToast(moved ? `消色归位 ${moved} 个拼豆` : "没有可归位的颜色");
  renderGame();
}

function placeColorBeads(colorKey, options = {}) {
  const targets = [];
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      const cell = board[row][col];
      if (cell?.target?.key === colorKey && !cell.locked) targets.push({ row, col, cell });
    }
  }
  let moved = 0;
  targets.forEach(({ row, col, cell }) => {
    if (cell.current?.key === colorKey) {
      cell.locked = true;
      moved += 1;
      return;
    }
    if (cell.current && !moveBlockingBead(row, col)) return;
    const source = findColorSource(colorKey, options);
    if (!source) return;
    cell.current = takeColorSource(source);
    cell.locked = true;
    moved += 1;
  });
  return moved;
}

function findColorSource(colorKey, options = {}) {
  if (!options.boardOnly) {
    const trayIndex = tray.findIndex((color) => color?.key === colorKey);
    if (trayIndex !== -1) return { type: "tray", index: trayIndex };
  }
  if (!options.trayOnly) {
    for (let row = 0; row < board.length; row += 1) {
      for (let col = 0; col < board[row].length; col += 1) {
        const cell = board[row][col];
        if (cell?.current?.key === colorKey && !cell.locked && cell.target?.key !== colorKey) {
          return { type: "board", row, col };
        }
      }
    }
  }
  return null;
}

function takeColorSource(source) {
  if (source.type === "tray") {
    const color = tray[source.index];
    tray[source.index] = null;
    return color;
  }
  const cell = board[source.row]?.[source.col];
  const color = cell.current;
  cell.current = null;
  return color;
}

function moveBlockingBead(row, col) {
  const source = board[row]?.[col];
  if (!source?.current || source.locked) return true;
  for (let r = 0; r < board.length; r += 1) {
    for (let c = 0; c < board[r].length; c += 1) {
      const target = board[r][c];
      if (!target?.target || target.locked || target.current) continue;
      if (target.target.key === source.current.key) continue;
      target.current = source.current;
      source.current = null;
      return true;
    }
  }
  return false;
}

function checkWin() {
  if (won) return;
  const complete = board.flat().every((cell) => !cell || (cell.current && cell.current.key === cell.target.key));
  if (!complete) return;
  won = true;
  board.flat().forEach((cell) => {
    if (cell?.target) cell.locked = true;
  });
  saveCurrentLevelProgress(100, true);
  clearIdleHint();
  window.clearInterval(timerId);
  elements.coinCount.textContent = String(getCoinTotal());
  window.setTimeout(() => showResultModal("win"), 250);
}

function showResultModal(type) {
  clearIdleHint();
  const isWin = type === "win";
  if (!isWin) saveCurrentLevelProgress(calculateLevelCompletionPercent(), false);
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

function getActiveProgressLevelId() {
  return String(getLevelNumber(activeGameLevel?.id || selectedLevelId));
}

function calculateLevelCompletionPercent() {
  const cells = board.flat().filter(Boolean);
  if (!cells.length) return 0;
  const locked = cells.filter((cell) => cell.locked).length;
  return Math.round((locked / cells.length) * 100);
}

function saveCurrentLevelProgress(percent, completed) {
  const levelId = getActiveProgressLevelId();
  const previous = levelProgress[levelId] || {};
  levelProgress[levelId] = {
    percent: completed ? 100 : Math.max(previous.percent || 0, percent),
    completed: Boolean(completed || previous.completed),
  };
  saveLevelProgress();
}

function showToast(message) {
  elements.toast.textContent = message;
  positionPlayerToast();
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => elements.toast.classList.remove("show"), 1200);
}

function positionPlayerToast() {
  if (!playerMode || !elements.toast || !elements.boardSection || elements.gameView.classList.contains("hidden")) {
    if (elements.toast) {
      elements.toast.style.removeProperty("top");
      elements.toast.style.removeProperty("left");
      elements.toast.style.removeProperty("bottom");
    }
    return;
  }
  const boardRect = elements.boardSection.getBoundingClientRect();
  if (!boardRect.width || !boardRect.height) return;
  const toastHeight = elements.toast.offsetHeight || 20;
  const top = Math.max(boardRect.top, boardRect.bottom - toastHeight + 32);
  const centerX = boardRect.left + boardRect.width / 2;
  elements.toast.style.top = `${Math.round(top)}px`;
  elements.toast.style.left = `${Math.round(centerX)}px`;
  elements.toast.style.bottom = "auto";
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
  const baseScale = Number.parseFloat(getComputedStyle(elements.board).getPropertyValue("--board-base-scale")) || 1;
  const scale = baseScale * (zoomed ? zoomScale : 1);
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
  window.addEventListener("resize", updateGameScale);
  window.visualViewport?.addEventListener("resize", updateGameScale);
  elements.homeTab.addEventListener("click", () => setActiveView("home"));
  elements.generatorTab.addEventListener("click", async () => {
    await loadLevelIntoGenerator(selectedLevelId);
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
  elements.generateButton.addEventListener("click", () => {
    generateAndStoreLevel().catch((error) => {
      console.error(error);
      showToast("固定关卡保存失败");
    });
  });
  elements.playGeneratedButton.addEventListener("click", async () => {
    const level = await generateAndStoreLevel();
    if (!level) return;
    setActiveView("game");
    initGame().catch((error) => handleGameLoadError(error));
  });
  elements.levelSelect.addEventListener("change", async () => {
    selectedLevelId = elements.levelSelect.value;
    await loadLevelIntoGenerator(selectedLevelId);
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
    const levelId = button.dataset.level;
    ensureFixedLevel(levelId).then((level) => {
      if (!isPlayableLevel(level)) {
        showToast("固定关卡生成失败，请检查素材");
        return;
      }
      if (!isLevelPlayable(levelId)) {
        showToast("先完成上一关");
        return;
      }
      selectedLevelId = levelId;
      elements.levelSelect.value = selectedLevelId;
      currentGeneratedLevel = level;
      renderPatternPreview(level);
      syncHomeLevelButtons();
      setActiveView("game");
      initGame().catch((error) => handleGameLoadError(error));
    }).catch((error) => {
      console.error(error);
      showToast("固定关卡生成失败，请检查素材");
    });
  });
  if (elements.startLevelButton) {
    elements.startLevelButton.addEventListener("click", () => {
      if (!isLevelPlayable(selectedLevelId)) {
        showToast("先完成上一关");
        return;
      }
      setActiveView("game");
      initGame().catch((error) => handleGameLoadError(error));
    });
  }
  if (elements.returnHomeButton) {
    elements.returnHomeButton.addEventListener("click", () => {
      activeTool = null;
      areaToolCenter = null;
      setActiveView("home");
    });
  }
  elements.toolButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveTool(button.dataset.tool));
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
      const nextLevel = Math.min(totalHomeLevels, getLevelNumber(selectedLevelId) + 1);
      selectedLevelId = String(nextLevel);
      elements.resultModal.classList.add("hidden");
      activeTool = null;
      areaToolCenter = null;
      zoomed = false;
      elements.zoomSliderWrap.classList.add("hidden");
      setActiveView("home");
      syncHomeLevelButtons();
      return;
    }
    elements.resultModal.classList.add("hidden");
    activeTool = null;
    areaToolCenter = null;
    zoomed = false;
    elements.zoomSliderWrap.classList.add("hidden");
    setActiveView("home");
    syncHomeLevelButtons();
  });
  elements.modalCloseButton.addEventListener("click", () => elements.resultModal.classList.add("hidden"));
}

async function boot() {
  bindEvents();
  sourceImageName = "level-1.png";
  sourceImageDataUrl = fixedLevelConfigs["1"]?.src || null;
  sourceImage = sourceImageDataUrl ? await loadImage(sourceImageDataUrl) : null;
  syncControls();
  if (playerMode) {
    await buildFixedLevels();
    renderHomePreview(generatedLevels[selectedLevelId]);
  } else {
    await buildFixedLevels();
    currentGeneratedLevel = generatedLevels[selectedLevelId];
    await loadLevelIntoGenerator(selectedLevelId);
    renderPatternPreview(currentGeneratedLevel);
    renderHomePreview(currentGeneratedLevel);
  }
  setActiveView("home");
  updateGameScale();
}

boot().catch((error) => {
  console.error(error);
  showToast("内置素材加载失败，请导入图片");
});
