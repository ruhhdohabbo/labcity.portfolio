import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { projects } from "./projects.js";
import {
  SCENE_CONFIG_STORAGE_KEY,
  cloneSceneConfig,
  createDefaultSceneConfig,
  normalizeSceneConfig
} from "./sceneConfig.js";

const canvas = document.querySelector(".scene");
const label = document.querySelector(".project-label");
const clientLabel = document.querySelector(".project-client");
const dateLabel = document.querySelector(".project-date");
const panel = document.querySelector(".project-panel");
const panelClose = document.querySelector(".panel-close");
const panelTitle = document.querySelector(".panel-title");
const panelMeta = document.querySelector(".panel-meta");
const panelDescription = document.querySelector(".panel-description");
const panelKicker = document.querySelector(".panel-kicker");
const header = document.querySelector(".header");
const hint = document.querySelector(".hint");
const aboutTrigger = document.querySelector(".about-trigger");
const aboutPanel = document.querySelector(".about-panel");
const aboutClose = document.querySelector(".about-close");
const customizeTrigger = document.querySelector(".customize-trigger");
const customizePanel = document.querySelector(".customize-panel");
const customizeClose = document.querySelector(".customize-close");
const cameraYawInput = document.querySelector(".camera-yaw");
const cameraPitchInput = document.querySelector(".camera-pitch");
const cameraDistanceInput = document.querySelector(".camera-distance");
const cameraFovInput = document.querySelector(".camera-fov");
const cameraTargetXInput = document.querySelector(".camera-target-x");
const cameraTargetYInput = document.querySelector(".camera-target-y");
const cameraTargetZInput = document.querySelector(".camera-target-z");
const cameraYawValue = document.querySelector(".camera-yaw-value");
const cameraPitchValue = document.querySelector(".camera-pitch-value");
const cameraDistanceValue = document.querySelector(".camera-distance-value");
const cameraFovValue = document.querySelector(".camera-fov-value");
const cameraPresetNameInput = document.querySelector(".camera-preset-name");
const cameraDataOutput = document.querySelector(".camera-data-output");
const editorModeSelect = document.querySelector(".editor-mode-select");
const configExportButton = document.querySelector(".config-export");
const configImportButton = document.querySelector(".config-import");
const configResetButton = document.querySelector(".config-reset");
const configImportInput = document.querySelector(".config-import-input");
const cameraUseCurrentButton = document.querySelector(".camera-use-current");
const cameraCopyDataButton = document.querySelector(".camera-copy-data");
const buildingSelect = document.querySelector(".building-select");
const buildingAddButton = document.querySelector(".building-add");
const buildingDuplicateButton = document.querySelector(".building-duplicate");
const buildingDeleteButton = document.querySelector(".building-delete");
const buildingEnabledInput = document.querySelector(".building-enabled");
const buildingXInput = document.querySelector(".building-x");
const buildingZInput = document.querySelector(".building-z");
const buildingRotationInput = document.querySelector(".building-rotation");
const buildingWidthInput = document.querySelector(".building-width");
const buildingDepthInput = document.querySelector(".building-depth");
const buildingHeightInput = document.querySelector(".building-height");
const buildingCapEnabledInput = document.querySelector(".building-cap-enabled");
const buildingCapWidthInput = document.querySelector(".building-cap-width");
const buildingCapDepthInput = document.querySelector(".building-cap-depth");
const buildingCapHeightInput = document.querySelector(".building-cap-height");
const buildingCoreEnabledInput = document.querySelector(".building-core-enabled");
const buildingCoreWidthInput = document.querySelector(".building-core-width");
const buildingCoreDepthInput = document.querySelector(".building-core-depth");
const buildingCoreHeightInput = document.querySelector(".building-core-height");
const buildingCoreOffsetXInput = document.querySelector(".building-core-offset-x");
const buildingCoreOffsetZInput = document.querySelector(".building-core-offset-z");
const buildingLabelEnabledInput = document.querySelector(".building-label-enabled");
const buildingLabelTextInput = document.querySelector(".building-label-text");
const buildingLabelColorInput = document.querySelector(".building-label-color");
const buildingLabelOffsetYInput = document.querySelector(".building-label-offset-y");
const buildingBeaconEnabledInput = document.querySelector(".building-beacon-enabled");
const buildingBeaconColorInput = document.querySelector(".building-beacon-color");
const buildingBeaconOffsetYInput = document.querySelector(".building-beacon-offset-y");
const screenSelect = document.querySelector(".screen-select");
const screenAddButton = document.querySelector(".screen-add");
const screenDuplicateButton = document.querySelector(".screen-duplicate");
const screenDeleteButton = document.querySelector(".screen-delete");
const screenEnabledInput = document.querySelector(".screen-enabled");
const screenProjectSelect = document.querySelector(".screen-project");
const screenSideSelect = document.querySelector(".screen-side");
const screenWidthInput = document.querySelector(".screen-width");
const screenHeightInput = document.querySelector(".screen-height");
const screenTopOffsetInput = document.querySelector(".screen-top-offset");
const screenOffsetAlongInput = document.querySelector(".screen-offset-along");
const screenOffsetOutwardInput = document.querySelector(".screen-offset-outward");
const toolPreviewScreenButton = document.querySelector(".tool-preview-screen");
const toolTopScreenButton = document.querySelector(".tool-top-screen");
const toolAlignScreenButton = document.querySelector(".tool-align-screen");
const sceneBgColorInput = document.querySelector(".scene-bg-color");
const sceneFogColorInput = document.querySelector(".scene-fog-color");
const sceneFogNearInput = document.querySelector(".scene-fog-near");
const sceneFogFarInput = document.querySelector(".scene-fog-far");
const sceneAmbientInput = document.querySelector(".scene-ambient");
const sceneFrontLightInput = document.querySelector(".scene-front-light");
const sceneBackLightInput = document.querySelector(".scene-back-light");
const toolFaceBuildingButton = document.querySelector(".tool-face-building");
const toolRebalanceHeightsButton = document.querySelector(".tool-rebalance-heights");
const toolDistributeRingButton = document.querySelector(".tool-distribute-ring");
const introOverlay = document.querySelector(".intro-overlay");
const introOverlayText = document.querySelector(".intro-overlay-text");
const playerOverlay = document.querySelector(".video-player-overlay");
const playerElement = document.querySelector(".video-player");

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = window.innerWidth > 800;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const setColor = 0xf02050;
scene.background = new THREE.Color(setColor);
scene.fog = new THREE.Fog(setColor, 11.6, 20.6);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(
  new RoomEnvironment(undefined, { intensity: 0.55 })
).texture;
pmremGenerator.dispose();

const camera = new THREE.PerspectiveCamera(
  27.8,
  window.innerWidth / window.innerHeight,
  1,
  500
);
camera.position.set(0.1, 4.7, 16.7);
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enabled = false;
orbitControls.enableDamping = true;
orbitControls.enablePan = true;
orbitControls.enableZoom = true;
orbitControls.enableRotate = true;
orbitControls.addEventListener("change", () => {
  if (editorState.mode !== "edit") {
    return;
  }
  syncSceneConfigCameraFromOrbitControls();
  interactionDirty = true;
  labelDirty = true;
  overlayDirty = true;
});

const city = new THREE.Group();
const smoke = new THREE.Group();
const town = new THREE.Group();
scene.add(city);
city.add(smoke);
city.add(town);

const ambientLight = new THREE.AmbientLight(0xffffff, 4);
scene.add(ambientLight);

const frontSpotLight = new THREE.SpotLight(0xffffff, 20, 14);
frontSpotLight.position.set(5, 5, 5);
frontSpotLight.castShadow = renderer.shadowMap.enabled;
frontSpotLight.shadow.mapSize.width = 1024;
frontSpotLight.shadow.mapSize.height = 1024;
frontSpotLight.penumbra = 0.1;
city.add(frontSpotLight);

const backLight = new THREE.PointLight(0xffffff, 0.5);
backLight.position.set(0, 6, 0);
scene.add(backLight);

const pointer = new THREE.Vector2(0, 0);
const raycaster = new THREE.Raycaster();
const clock = new THREE.Clock();
const tempVector = new THREE.Vector3();
const focusVector = new THREE.Vector3();
const scaleVector = new THREE.Vector3();
const normalVector = new THREE.Vector3();
const tempQuaternion = new THREE.Quaternion();
const occlusionLine = new THREE.Line3();
const occlusionDirection = new THREE.Vector3();
const occlusionCenter = new THREE.Vector3();
const occlusionRay = new THREE.Ray();
const occlusionHit = new THREE.Vector3();
const occlusionBox = new THREE.Box3();
const occlusionRight = new THREE.Vector3();
const occlusionUp = new THREE.Vector3();
const occlusionTargetPoint = new THREE.Vector3();
const cameraSpaceVector = new THREE.Vector3();
const selectedScreenRect = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
const buildingRect = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
const billboardCornerPoints = [0, 1, 2, 3].map(() => new THREE.Vector3());
const boxCornerPoints = Array.from({ length: 8 }, () => new THREE.Vector3());
const playerCornerPoints = Array.from({ length: 4 }, () => new THREE.Vector3());
const occlusionOffsets = [
  [0, 0],
  [-0.74, 0],
  [0.74, 0],
  [0, -0.74],
  [0, 0.74],
  [-0.46, -0.46],
  [0.46, -0.46],
  [-0.46, 0.46],
  [0.46, 0.46],
  [-0.74, -0.74],
  [0.74, -0.74],
  [-0.74, 0.74],
  [0.74, 0.74]
];

const billboardMeshes = [];
const interactiveMeshes = [];
const buildingSelectMeshes = [];
const billboardTargets = [];
const buildings = [];
const roadLines = [];
const occludableBuildings = [];
const buildingMaterials = [];
const roofLights = [];
const smokeParticles = [];
const sharedVideoAssets = new Map();
const posterTextureCache = new Map();
const labelTextureCache = new Map();
const buildingEntriesById = new Map();
const screenTargetsByKey = new Map();
let hoveredBillboard = null;
let selectedBillboard = null;
let settledRotationY = 0;
let settledRotationX = 0.18;
let occlusionFocused = false;
let occlusionSelection = null;
let aboutOpen = false;
let customizeOpen = false;
let introHidden = false;
let homeIdleStartedAt = 0;
let qualityMode = window.innerWidth < 900 ? "reduced" : "high";
let interactionDirty = true;
let labelDirty = true;
let overlayDirty = true;
let occlusionDirty = true;
let resizeDirty = true;
let smokePhase = 0;
const introReturnDelay = 10000;
const defaultSceneConfig = createDefaultSceneConfig(projects);
let sceneConfig = cloneSceneConfig(defaultSceneConfig);
const editorState = {
  open: false,
  mode: "browse",
  selectedBuildingId: null,
  selectedScreenId: null,
  previewScreenKey: null
};
let sceneRebuildQueued = false;
const cloneValue = (value) => JSON.parse(JSON.stringify(value));

const cameraState = {
  currentPosition: camera.position.clone(),
  currentTarget: new THREE.Vector3(0, 3.6, 0),
  goalPosition: camera.position.clone(),
  goalTarget: new THREE.Vector3(0, 3.6, 0),
  basePosition: new THREE.Vector3(0.1, 4.7, 16.7),
  baseTarget: new THREE.Vector3(0, 3.6, 0)
};

const defaultCustomization = {
  bgColor: "#f02050",
  fogColor: "#f02050",
  fogNear: 11.6,
  fogFar: 20.6,
  cameraFov: 27.8,
  cameraX: 0.1,
  cameraY: 4.7,
  cameraZ: 16.7,
  cameraYaw: 0.34,
  cameraPitch: 3.77,
  cameraDistance: 16.74,
  targetX: 0,
  targetY: 3.6,
  targetZ: 0,
  rotateYStrength: 0.8,
  rotateXStrength: 0.38,
  rotationLerp: 0.03,
  ambientIntensity: 4,
  frontLightIntensity: 20,
  backLightIntensity: 0.5,
  roofLightIntensity: 1.3,
  buildingColor: "#050607",
  buildingRoughness: 0.95,
  buildingMetalness: 0.91,
  buildingClearcoat: 0.11,
  buildingClearcoatRoughness: 1,
  buildingEnvMapIntensity: 1.81,
  screenLightIntensity: 1.9,
  screenEmissiveIntensity: 0.38,
  selectedScale: 1.32
};

const customization = { ...defaultCustomization };
const mutedLeftTowerKeys = new Set(["-4,-3", "-3,0"]);
const removedBackScreenTowerKeys = new Set(["-1,-4"]);
const raisedScreenTowerOffsets = new Map([
  ["-1,2", 0.52],
  ["-1,-1", 0.42]
]);

const mathRandom = (num = 8) => -Math.random() * num + Math.random() * num;
const getBuildingKey = ({ x, z }) => `${x},${z}`;
const radToDeg = (value) => (value * 180) / Math.PI;
const degToRad = (value) => (value * Math.PI) / 180;

const syncCameraCartesianFromOrbit = () => {
  const yaw = degToRad(customization.cameraYaw);
  const pitch = degToRad(customization.cameraPitch);
  const horizontalDistance = Math.cos(pitch) * customization.cameraDistance;
  customization.cameraX = customization.targetX + Math.sin(yaw) * horizontalDistance;
  customization.cameraY = customization.targetY + Math.sin(pitch) * customization.cameraDistance;
  customization.cameraZ = customization.targetZ + Math.cos(yaw) * customization.cameraDistance;
};

const syncCameraOrbitFromCartesian = () => {
  const offsetX = customization.cameraX - customization.targetX;
  const offsetY = customization.cameraY - customization.targetY;
  const offsetZ = customization.cameraZ - customization.targetZ;
  const distance = Math.max(0.001, Math.hypot(offsetX, offsetY, offsetZ));
  customization.cameraDistance = distance;
  customization.cameraYaw = radToDeg(Math.atan2(offsetX, offsetZ));
  customization.cameraPitch = radToDeg(Math.asin(offsetY / distance));
};

syncCameraOrbitFromCartesian();

const dismissIntro = () => {
  if (introHidden) {
    return;
  }
  introHidden = true;
  homeIdleStartedAt = 0;
  document.body.dataset.introHidden = "true";
  introOverlay?.setAttribute("aria-hidden", "true");
};

const restoreIntro = () => {
  introHidden = false;
  homeIdleStartedAt = 0;
  document.body.dataset.introHidden = "false";
  introOverlay?.setAttribute("aria-hidden", "false");
};

const setAboutOpen = (open) => {
  aboutOpen = open;
  document.body.dataset.about = open ? "true" : "false";
  if (aboutPanel) {
    aboutPanel.hidden = !open;
    aboutPanel.setAttribute("aria-hidden", open ? "false" : "true");
  }
  aboutTrigger?.setAttribute("aria-expanded", open ? "true" : "false");
  interactionDirty = true;
  overlayDirty = true;
  occlusionDirty = true;
};

const setCustomizeOpen = (open) => {
  customizeOpen = open;
  editorState.open = open;
  if (customizePanel) {
    customizePanel.hidden = !open;
    customizePanel.setAttribute("aria-hidden", open ? "false" : "true");
  }
  customizeTrigger?.setAttribute("aria-expanded", open ? "true" : "false");
  interactionDirty = true;
  labelDirty = true;
  if (open) {
    renderEditorControls();
  }
};

const updateQualityMode = () => {
  qualityMode = window.innerWidth < 900 ? "reduced" : "high";
  renderer.shadowMap.enabled = qualityMode === "high" && window.innerWidth > 800;
  frontSpotLight.castShadow = renderer.shadowMap.enabled;
};

const saveSceneConfigToStorage = () => {
  sceneConfig.meta.updatedAt = new Date().toISOString();
  window.localStorage.setItem(SCENE_CONFIG_STORAGE_KEY, JSON.stringify(sceneConfig));
};

const loadSceneConfigFromStorage = () => {
  try {
    const raw = window.localStorage.getItem(SCENE_CONFIG_STORAGE_KEY);
    if (!raw) {
      return cloneSceneConfig(defaultSceneConfig);
    }
    return normalizeSceneConfig(JSON.parse(raw), projects);
  } catch {
    return cloneSceneConfig(defaultSceneConfig);
  }
};

const findProjectBySlug = (slug) => projects.find((project) => project.slug === slug) ?? projects[0];
const getScreenKey = (buildingId, screenId) => `${buildingId}:${screenId}`;

const applySceneConfigToCustomization = () => {
  customization.bgColor = sceneConfig.scene.bgColor;
  customization.fogColor = sceneConfig.scene.fogColor;
  customization.fogNear = sceneConfig.scene.fogNear;
  customization.fogFar = sceneConfig.scene.fogFar;
  customization.ambientIntensity = sceneConfig.scene.ambientIntensity;
  customization.frontLightIntensity = sceneConfig.scene.frontLightIntensity;
  customization.backLightIntensity = sceneConfig.scene.backLightIntensity;
  customization.roofLightIntensity = sceneConfig.scene.roofLightIntensity;
  customization.buildingColor = sceneConfig.scene.buildingColor;
  customization.buildingRoughness = sceneConfig.scene.buildingRoughness;
  customization.buildingMetalness = sceneConfig.scene.buildingMetalness;
  customization.buildingClearcoat = sceneConfig.scene.buildingClearcoat;
  customization.buildingClearcoatRoughness = sceneConfig.scene.buildingClearcoatRoughness;
  customization.buildingEnvMapIntensity = sceneConfig.scene.buildingEnvMapIntensity;
  customization.screenLightIntensity = sceneConfig.scene.screenLightIntensity;
  customization.screenEmissiveIntensity = sceneConfig.scene.screenEmissiveIntensity;
  customization.selectedScale = sceneConfig.scene.selectedScale;
  customization.cameraFov = sceneConfig.camera.fov;
  customization.cameraYaw = sceneConfig.camera.orbitYaw;
  customization.cameraPitch = sceneConfig.camera.orbitPitch;
  customization.cameraDistance = sceneConfig.camera.orbitDistance;
  customization.targetX = sceneConfig.camera.target.x;
  customization.targetY = sceneConfig.camera.target.y;
  customization.targetZ = sceneConfig.camera.target.z;
  customization.cameraX = customization.targetX;
  customization.cameraY = customization.targetY;
  customization.cameraZ = customization.targetZ + customization.cameraDistance;
  syncCameraCartesianFromOrbit();
};

const syncOrbitControlsFromSceneConfig = () => {
  orbitControls.target.set(
    sceneConfig.camera.target.x,
    sceneConfig.camera.target.y,
    sceneConfig.camera.target.z
  );
  const yaw = degToRad(sceneConfig.camera.orbitYaw);
  const pitch = degToRad(sceneConfig.camera.orbitPitch);
  const horizontalDistance = Math.cos(pitch) * sceneConfig.camera.orbitDistance;
  camera.position.set(
    sceneConfig.camera.target.x + Math.sin(yaw) * horizontalDistance,
    sceneConfig.camera.target.y + Math.sin(pitch) * sceneConfig.camera.orbitDistance,
    sceneConfig.camera.target.z + Math.cos(yaw) * sceneConfig.camera.orbitDistance
  );
  orbitControls.update();
};

const syncSceneConfigCameraFromOrbitControls = () => {
  const offsetX = camera.position.x - orbitControls.target.x;
  const offsetY = camera.position.y - orbitControls.target.y;
  const offsetZ = camera.position.z - orbitControls.target.z;
  const distance = Math.max(0.001, Math.hypot(offsetX, offsetY, offsetZ));
  sceneConfig.camera.orbitDistance = distance;
  sceneConfig.camera.orbitYaw = radToDeg(Math.atan2(offsetX, offsetZ));
  sceneConfig.camera.orbitPitch = radToDeg(Math.asin(offsetY / distance));
  sceneConfig.camera.fov = camera.fov;
  sceneConfig.camera.target.x = orbitControls.target.x;
  sceneConfig.camera.target.y = orbitControls.target.y;
  sceneConfig.camera.target.z = orbitControls.target.z;
  applySceneConfigToCustomization();
  syncCustomizeControls();
  saveSceneConfigToStorage();
};

const syncCameraStateFromCurrentView = (target = null) => {
  const nextTarget = target ?? orbitControls.target;
  cameraState.currentPosition.copy(camera.position);
  cameraState.goalPosition.copy(camera.position);
  cameraState.currentTarget.copy(nextTarget);
  cameraState.goalTarget.copy(nextTarget);
  cameraState.basePosition.copy(camera.position);
  cameraState.baseTarget.copy(nextTarget);
};

const updateOrbitControlsEnabledState = () => {
  orbitControls.enabled = editorState.mode === "edit" && !editorState.previewScreenKey;
};

const clearEditorPreview = () => {
  editorState.previewScreenKey = null;
  selectedBillboard = null;
  frameSelection(null);
  updateOrbitControlsEnabledState();
  if (editorState.mode === "edit") {
    syncOrbitControlsFromSceneConfig();
    syncCameraStateFromCurrentView();
  }
};

const setEditorMode = (mode) => {
  editorState.mode = mode;
  sceneConfig.camera.mode = mode;
  document.body.dataset.editorMode = mode;
  if (mode === "edit") {
    clearEditorPreview();
    syncOrbitControlsFromSceneConfig();
    syncCameraStateFromCurrentView();
    frameSelection(null);
  } else {
    editorState.previewScreenKey = null;
    applySceneConfigToCustomization();
    applyCustomization();
  }
  updateOrbitControlsEnabledState();
  interactionDirty = true;
  labelDirty = true;
  overlayDirty = true;
  occlusionDirty = true;
  saveSceneConfigToStorage();
};

const createFacadeTextures = () => {
  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = 512;
  colorCanvas.height = 1024;
  const colorContext = colorCanvas.getContext("2d");

  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = 512;
  roughCanvas.height = 1024;
  const roughContext = roughCanvas.getContext("2d");

  const gradient = colorContext.createLinearGradient(0, 0, 0, 1024);
  gradient.addColorStop(0, "#0d1015");
  gradient.addColorStop(0.55, "#05070a");
  gradient.addColorStop(1, "#020305");
  colorContext.fillStyle = gradient;
  colorContext.fillRect(0, 0, 512, 1024);

  roughContext.fillStyle = "#707070";
  roughContext.fillRect(0, 0, 512, 1024);

  colorContext.strokeStyle = "rgba(255,255,255,0.015)";
  roughContext.strokeStyle = "#646464";
  for (let x = 24; x < 512; x += 64) {
    colorContext.beginPath();
    colorContext.moveTo(x, 0);
    colorContext.lineTo(x, 1024);
    colorContext.stroke();
    roughContext.beginPath();
    roughContext.moveTo(x, 0);
    roughContext.lineTo(x, 1024);
    roughContext.stroke();
  }

  for (let y = 36; y < 1024; y += 46) {
    for (let x = 30; x < 512; x += 68) {
      colorContext.fillStyle = "rgba(70,78,92,0.10)";
      colorContext.fillRect(x, y, 12, 20);
      colorContext.fillStyle = "rgba(255,255,255,0.012)";
      colorContext.fillRect(x + 1, y + 1, 8, 2);

      roughContext.fillStyle = "#565656";
      roughContext.fillRect(x, y, 12, 20);
    }
  }

  const colorMap = new THREE.CanvasTexture(colorCanvas);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.magFilter = THREE.LinearFilter;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.magFilter = THREE.LinearFilter;

  return { colorMap, roughnessMap };
};

const facadeTextures = createFacadeTextures();

const createGlowTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(128, 128, 8, 128, 128, 118);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(255,255,255,0.78)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.26)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

const glowTexture = createGlowTexture();
const beaconLabelWords = [
  "brand",
  "films",
  "motion",
  "studio",
  "edits",
  "visual",
  "color",
  "sound",
  "craft",
  "frames",
  "ideas",
  "future"
];

const createBeaconLabelTexture = (text, color) => {
  const cacheKey = `${text}::${color}`;
  if (labelTextureCache.has(cacheKey)) {
    return labelTextureCache.get(cacheKey);
  }
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 192;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  const labelText = text.toUpperCase();
  let fontSize = 82;
  const horizontalPadding = 56;
  context.font = `700 ${fontSize}px Inter, Arial, Helvetica, sans-serif`;
  while (context.measureText(labelText).width > canvas.width - horizontalPadding * 2 && fontSize > 44) {
    fontSize -= 4;
    context.font = `700 ${fontSize}px Inter, Arial, Helvetica, sans-serif`;
  }
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = color;
  context.shadowColor = color;
  context.shadowBlur = 18;
  context.fillText(labelText, canvas.width / 2, canvas.height / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  labelTextureCache.set(cacheKey, texture);
  return texture;
};

const createBuildingMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(customization.buildingColor),
    map: facadeTextures.colorMap,
    roughnessMap: facadeTextures.roughnessMap,
    roughness: customization.buildingRoughness,
    metalness: customization.buildingMetalness,
    clearcoat: customization.buildingClearcoat,
    clearcoatRoughness: customization.buildingClearcoatRoughness,
    envMapIntensity: customization.buildingEnvMapIntensity,
    emissive: new THREE.Color("#16040a"),
    emissiveIntensity: 0.08,
    transparent: true,
    opacity: 1
  });

const roofMaterial = new THREE.MeshStandardMaterial({
  color: "#08090b",
  roughness: 0.46,
  metalness: 0.12
});

const redBeaconMaterial = new THREE.MeshStandardMaterial({
  color: "#450a15",
  emissive: "#ff4a73",
  emissiveIntensity: 1.1,
  roughness: 0.2,
  metalness: 0.08
});

const makeVideoAsset = (project) => {
  if (sharedVideoAssets.has(project.videoSrc)) {
    return sharedVideoAssets.get(project.videoSrc);
  }

  const video = document.createElement("video");
  video.src = project.videoSrc;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.crossOrigin = "anonymous";

  const frameCanvas = document.createElement("canvas");
  frameCanvas.width = 320;
  frameCanvas.height = 180;
  const frameContext = frameCanvas.getContext("2d");
  frameContext.fillStyle = "#050505";
  frameContext.fillRect(0, 0, frameCanvas.width, frameCanvas.height);

  const texture = new THREE.CanvasTexture(frameCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const asset = {
    video,
    texture,
    frameCanvas,
    frameContext,
    pendingSeek: false
  };

  const drawCurrentFrame = () => {
    if (!video.videoWidth || !video.videoHeight) {
      return;
    }
    frameContext.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
    frameContext.drawImage(video, 0, 0, frameCanvas.width, frameCanvas.height);
    texture.needsUpdate = true;
  };

  video.addEventListener("loadedmetadata", () => {
    video.currentTime = 0;
  });

  video.addEventListener("loadeddata", () => {
    drawCurrentFrame();
    video.pause();
  });

  video.addEventListener("seeked", () => {
    asset.pendingSeek = false;
    drawCurrentFrame();
  });

  video.load();
  sharedVideoAssets.set(project.videoSrc, asset);
  return asset;
};

const createPosterTexture = (project) => {
  if (posterTextureCache.has(project.slug)) {
    return posterTextureCache.get(project.slug);
  }
  const surface = document.createElement("canvas");
  surface.width = 640;
  surface.height = 360;
  const context = surface.getContext("2d");

  const gradient = context.createLinearGradient(0, 0, 640, 360);
  gradient.addColorStop(0, project.accent);
  gradient.addColorStop(1, "#130106");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 640, 360);

  context.fillStyle = "rgba(255,255,255,0.08)";
  context.fillRect(20, 20, 600, 320);
  context.strokeStyle = "rgba(255,255,255,0.12)";
  context.lineWidth = 4;
  context.strokeRect(24, 24, 592, 312);

  context.fillStyle = "rgba(255,255,255,0.92)";
  context.font = "700 52px Arial";
  context.fillText(project.title.toUpperCase(), 38, 90);
  context.fillStyle = "rgba(255,255,255,0.66)";
  context.font = "500 24px Arial";
  context.fillText(project.client, 38, 136);
  context.fillText(project.date, 38, 170);

  const texture = new THREE.CanvasTexture(surface);
  texture.colorSpace = THREE.SRGBColorSpace;
  posterTextureCache.set(project.slug, texture);
  return texture;
};

const getBeaconLabelText = (project) => project.title;

const computeOutwardRotation = (x, z, organicOffset = 0) => {
  const outward = new THREE.Vector2(x, z);
  if (outward.lengthSq() === 0) {
    return organicOffset;
  }
  outward.normalize();
  return Math.atan2(outward.x, outward.y) + organicOffset * 0.45;
};

const computeRaisedScreenY = (config) => {
  const topPadding = Math.max(0.46, config.capHeight + 0.18);
  const maxCenter = config.height - config.screenHeight / 2 - topPadding;
  const desiredCenter = config.height * 0.76;
  return THREE.MathUtils.clamp(
    desiredCenter,
    config.screenHeight / 2 + 0.65,
    maxCenter
  );
};

const getScreenMount = (entry) => {
  const toCamera = new THREE.Vector3(
    cameraState.basePosition.x - entry.x,
    0,
    cameraState.basePosition.z - entry.z
  ).normalize();

  const localToCamera = toCamera.clone().applyAxisAngle(
    new THREE.Vector3(0, 1, 0),
    -entry.group.rotation.y
  );

  const candidates = [
    {
      normal: new THREE.Vector3(0, 0, 1),
      position: new THREE.Vector3(0, entry.screenY, entry.depth / 2 + 0.03),
      rotationY: 0
    },
    {
      normal: new THREE.Vector3(0, 0, -1),
      position: new THREE.Vector3(0, entry.screenY, -entry.depth / 2 - 0.03),
      rotationY: Math.PI
    },
    {
      normal: new THREE.Vector3(1, 0, 0),
      position: new THREE.Vector3(entry.width / 2 + 0.03, entry.screenY, 0),
      rotationY: Math.PI / 2
    },
    {
      normal: new THREE.Vector3(-1, 0, 0),
      position: new THREE.Vector3(-entry.width / 2 - 0.03, entry.screenY, 0),
      rotationY: -Math.PI / 2
    }
  ];

  return candidates.reduce((best, candidate) =>
    candidate.normal.dot(localToCamera) > best.normal.dot(localToCamera) ? candidate : best
  );
};

const setBuildingVisibilityTarget = (entry, targetOpacity) => {
  if (!entry?.group) {
    return;
  }
  entry.targetOpacity = targetOpacity;
  if (targetOpacity > 0) {
    entry.renderMeshes.forEach((mesh) => {
      mesh.visible = true;
    });
  }
};

const projectPointsToRect = (points, cameraRef, targetRect) => {
  targetRect.minX = Infinity;
  targetRect.maxX = -Infinity;
  targetRect.minY = Infinity;
  targetRect.maxY = -Infinity;

  points.forEach((point) => {
    focusVector.copy(point).project(cameraRef);
    targetRect.minX = Math.min(targetRect.minX, focusVector.x);
    targetRect.maxX = Math.max(targetRect.maxX, focusVector.x);
    targetRect.minY = Math.min(targetRect.minY, focusVector.y);
    targetRect.maxY = Math.max(targetRect.maxY, focusVector.y);
  });
};

const rectsOverlap = (a, b, margin = 0.04) =>
  a.maxX >= b.minX - margin &&
  a.minX <= b.maxX + margin &&
  a.maxY >= b.minY - margin &&
  a.minY <= b.maxY + margin;

const addScreenToBuilding = (entry, project) => {
  const buildingKey = getBuildingKey(entry);
  if (mutedLeftTowerKeys.has(buildingKey) || removedBackScreenTowerKeys.has(buildingKey)) {
    return;
  }

  const asset = makeVideoAsset(project);
  const posterTexture = createPosterTexture(project);
  const width = entry.screenWidth;
  const height = entry.screenHeight;
  const mount = getScreenMount(entry);
  const extraScreenYOffsetBySlug = {
    "adobe-spectrum-night": 0.72,
    "beats-midnight-cut": 1.02
  };
  const verticalScreenLift = height > width ? 0.34 : 0;
  const towerScreenLift = raisedScreenTowerOffsets.get(buildingKey) ?? 0;
  const extraScreenYOffset =
    (extraScreenYOffsetBySlug[project.slug] ?? 0) + verticalScreenLift + towerScreenLift;

  const screenMount = new THREE.Group();
  screenMount.position.copy(mount.position);
  screenMount.position.y += extraScreenYOffset;
  screenMount.rotation.y = mount.rotationY;
  entry.group.add(screenMount);

  const bezel = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.12, height + 0.12, 0.05),
    new THREE.MeshStandardMaterial({
      color: "#0d0e12",
      roughness: 0.28,
      metalness: 0.34,
      emissive: "#16040a",
      emissiveIntensity: 0.06,
      transparent: true,
      opacity: 1
    })
  );
  bezel.position.set(0, 0, 0);
  screenMount.add(bezel);

  const screenMaterial = new THREE.MeshStandardMaterial({
    map: asset.texture,
    emissiveMap: asset.texture,
    emissive: new THREE.Color("#ffffff"),
    emissiveIntensity: 0.18,
    roughness: 0.18,
    metalness: 0.02,
    transparent: true,
    opacity: 1
  });

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(width, height), screenMaterial);
  screen.position.set(0, 0, 0.031);
  screen.userData = {
    project,
    normal: mount.normal.clone(),
    buildingEntry: entry
  };
  screenMount.add(screen);
  interactiveMeshes.push(screen);

  const glow = new THREE.PointLight(project.accent, 1.2, 3.6, 2);
  glow.position.set(0, 0, 0.35);
  screenMount.add(glow);

  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color: project.accent,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  halo.scale.set(width * 1.3, height * 1.3, 1);
  halo.position.set(0, 0, 0.04);
  screenMount.add(halo);

  billboardMeshes.push(screen);
  billboardTargets.push({
    billboard: screen,
    mount: screenMount,
    buildingEntry: entry,
    frame: bezel,
    halo,
    pointLight: glow,
    posterTexture,
    videoTexture: asset.texture,
    video: asset.video,
    videoAsset: asset,
    screenMaterial,
    isVideoActive: false
  });

  if (entry.beaconLabel && entry.beaconLabelMaterial) {
    const nextTexture = createBeaconLabelTexture(getBeaconLabelText(project), "#ffffff");
    if (entry.beaconLabelMaterial.map) {
      entry.beaconLabelMaterial.map.dispose();
    }
    entry.beaconLabelMaterial.map = nextTexture;
    entry.beaconLabelMaterial.color.set("#ffffff");
    entry.beaconLabelMaterial.needsUpdate = true;
    entry.beaconLabel.userData.project = project;
    entry.beaconLabel.userData.linkedBillboard = screen;
    interactiveMeshes.push(entry.beaconLabel);
  }
};

const updateSelectedFrame = () => {
  if (!selectedBillboard) {
    return;
  }

  selectedBillboard.getWorldPosition(tempVector);
  selectedBillboard.getWorldQuaternion(tempQuaternion);
  normalVector.set(0, 0, 1).applyQuaternion(tempQuaternion).normalize();

  cameraState.goalPosition.copy(tempVector).addScaledVector(normalVector, 3.1);
  cameraState.goalPosition.y = tempVector.y;
  cameraState.goalTarget.copy(tempVector);
};

const updateFocusedOcclusionTargets = () => {
  const buildingEntries = occludableBuildings;

  if (aboutOpen) {
    if (!occlusionFocused) {
      return;
    }
    buildingEntries.forEach((entry) => {
      entry.occlusionLocked = false;
      setBuildingVisibilityTarget(entry, 1);
    });
    occlusionFocused = false;
    occlusionSelection = null;
    return;
  }

  if (!selectedBillboard) {
    if (!occlusionFocused) {
      return;
    }
    buildingEntries.forEach((entry) => {
      entry.occlusionLocked = false;
      setBuildingVisibilityTarget(entry, 1);
    });
    occlusionFocused = false;
    occlusionSelection = null;
    return;
  }

  const selectedEntry = selectedBillboard.userData.buildingEntry;
  if (!selectedEntry) {
    return;
  }
  occlusionFocused = true;
  if (occlusionSelection !== selectedBillboard) {
    occlusionSelection = selectedBillboard;
    buildingEntries.forEach((entry) => {
      entry.occlusionLocked = false;
    });
  }

  selectedBillboard.getWorldPosition(tempVector);
  selectedBillboard.getWorldQuaternion(tempQuaternion);
  occlusionRight.set(1, 0, 0).applyQuaternion(tempQuaternion).normalize();
  occlusionUp.set(0, 1, 0).applyQuaternion(tempQuaternion).normalize();

  const geometryWidth = selectedBillboard.geometry.parameters.width;
  const geometryHeight = selectedBillboard.geometry.parameters.height;
  const halfWidth = (geometryWidth * selectedBillboard.scale.x) / 2;
  const halfHeight = (geometryHeight * selectedBillboard.scale.y) / 2;

  billboardCornerPoints[0]
    .copy(tempVector)
    .addScaledVector(occlusionRight, -halfWidth)
    .addScaledVector(occlusionUp, -halfHeight);
  billboardCornerPoints[1]
    .copy(tempVector)
    .addScaledVector(occlusionRight, halfWidth)
    .addScaledVector(occlusionUp, -halfHeight);
  billboardCornerPoints[2]
    .copy(tempVector)
    .addScaledVector(occlusionRight, -halfWidth)
    .addScaledVector(occlusionUp, halfHeight);
  billboardCornerPoints[3]
    .copy(tempVector)
    .addScaledVector(occlusionRight, halfWidth)
    .addScaledVector(occlusionUp, halfHeight);
  projectPointsToRect(billboardCornerPoints, camera, selectedScreenRect);
  let selectedClosestDepth = -Infinity;
  billboardCornerPoints.forEach((point) => {
    const depth = cameraSpaceVector.copy(point).applyMatrix4(camera.matrixWorldInverse).z;
    selectedClosestDepth = Math.max(selectedClosestDepth, depth);
  });

  buildingEntries.forEach((entry) => {
    if (entry === selectedEntry) {
      entry.occlusionLocked = false;
      setBuildingVisibilityTarget(entry, 1);
      return;
    }

    entry.worldBounds.copy(entry.localBounds).applyMatrix4(entry.group.matrixWorld);
    occlusionBox.copy(entry.worldBounds).expandByScalar(0.28);
    occlusionBox.getCenter(occlusionCenter);
    let isBlocker = false;

    boxCornerPoints[0].set(occlusionBox.min.x, occlusionBox.min.y, occlusionBox.min.z);
    boxCornerPoints[1].set(occlusionBox.min.x, occlusionBox.min.y, occlusionBox.max.z);
    boxCornerPoints[2].set(occlusionBox.min.x, occlusionBox.max.y, occlusionBox.min.z);
    boxCornerPoints[3].set(occlusionBox.min.x, occlusionBox.max.y, occlusionBox.max.z);
    boxCornerPoints[4].set(occlusionBox.max.x, occlusionBox.min.y, occlusionBox.min.z);
    boxCornerPoints[5].set(occlusionBox.max.x, occlusionBox.min.y, occlusionBox.max.z);
    boxCornerPoints[6].set(occlusionBox.max.x, occlusionBox.max.y, occlusionBox.min.z);
    boxCornerPoints[7].set(occlusionBox.max.x, occlusionBox.max.y, occlusionBox.max.z);
    projectPointsToRect(boxCornerPoints, camera, buildingRect);
    let closestBuildingDepth = -Infinity;
    boxCornerPoints.forEach((point) => {
      const depth = cameraSpaceVector.copy(point).applyMatrix4(camera.matrixWorldInverse).z;
      closestBuildingDepth = Math.max(closestBuildingDepth, depth);
    });

    if (
      closestBuildingDepth > selectedClosestDepth - 0.04 &&
      rectsOverlap(buildingRect, selectedScreenRect, 0.08)
    ) {
      isBlocker = true;
    }

    for (const [offsetX, offsetY] of occlusionOffsets) {
      if (isBlocker) {
        break;
      }
      occlusionTargetPoint
        .copy(tempVector)
        .addScaledVector(occlusionRight, halfWidth * offsetX)
        .addScaledVector(occlusionUp, halfHeight * offsetY);

      occlusionLine.start.copy(cameraState.goalPosition);
      occlusionLine.end.copy(occlusionTargetPoint);
      occlusionDirection.subVectors(occlusionLine.end, occlusionLine.start);
      const focusDistance = occlusionDirection.length();

      if (focusDistance < 0.001) {
        continue;
      }

      occlusionDirection.normalize();
      const projectedDistance = occlusionCenter
        .clone()
        .sub(cameraState.goalPosition)
        .dot(occlusionDirection);
      const isBetweenCameraAndScreen =
        projectedDistance > 0.2 && projectedDistance < focusDistance - 0.12;
      occlusionRay.origin.copy(occlusionLine.start);
      occlusionRay.direction.copy(occlusionDirection);
      const hitPoint = occlusionRay.intersectBox(occlusionBox, occlusionHit);
      const hitDistance = hitPoint ? hitPoint.distanceTo(occlusionLine.start) : Infinity;

      if (isBetweenCameraAndScreen && hitDistance < focusDistance - 0.12) {
        isBlocker = true;
        break;
      }
    }

    if (isBlocker) {
      entry.occlusionLocked = true;
    }
    setBuildingVisibilityTarget(entry, entry.occlusionLocked ? 0 : 1);
  });
};

const updateBuildingOcclusion = () => {
  occludableBuildings.forEach((entry) => {
    entry.currentOpacity = THREE.MathUtils.lerp(
      entry.currentOpacity,
      entry.targetOpacity,
      0.16
    );

    const hidden = entry.currentOpacity < 0.02 && entry.targetOpacity === 0;

    entry.renderMeshes.forEach((mesh) => {
      mesh.visible = !hidden;
    });

    entry.fadeMaterials.forEach((material) => {
      material.opacity = entry.currentOpacity;
      material.depthWrite = entry.currentOpacity > 0.08;
    });

    entry.roofPointLights.forEach((light) => {
      light.intensity = hidden ? 0 : customization.roofLightIntensity * entry.currentOpacity;
    });
  });
};

const createBuilding = (config) => {
  const group = new THREE.Group();
  const material = createBuildingMaterial();
  buildingMaterials.push(material);
  const renderMeshes = [];
  const fadeMaterials = [material];
  const hideBeacon = mutedLeftTowerKeys.has(getBuildingKey(config));

  const tower = new THREE.Mesh(
    new THREE.BoxGeometry(config.width, config.height, config.depth),
    material
  );
  tower.position.y = config.height / 2;
  tower.castShadow = true;
  tower.receiveShadow = true;
  group.add(tower);
  renderMeshes.push(tower);

  if (config.capHeight > 0) {
    const capMaterial = roofMaterial.clone();
    capMaterial.transparent = true;
    capMaterial.opacity = 1;
    fadeMaterials.push(capMaterial);
    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(config.capWidth, config.capHeight, config.capDepth),
      capMaterial
    );
    cap.position.set(0, config.height + config.capHeight / 2, 0);
    cap.castShadow = true;
    cap.receiveShadow = true;
    group.add(cap);
    renderMeshes.push(cap);
  }

  if (config.sideCoreWidth > 0) {
    const core = new THREE.Mesh(
      new THREE.BoxGeometry(config.sideCoreWidth, config.sideCoreHeight, config.sideCoreDepth),
      material
    );
    core.position.set(
      config.sideCoreOffset,
      config.sideCoreHeight / 2,
      -config.depth * 0.16
    );
    core.castShadow = true;
    core.receiveShadow = true;
    group.add(core);
    renderMeshes.push(core);
  }

  let roofGlow = null;
  let beaconLabel = null;
  let beaconLabelMaterial = null;

  if (!hideBeacon) {
    const beaconMaterial = redBeaconMaterial.clone();
    beaconMaterial.transparent = true;
    beaconMaterial.opacity = 1;
    fadeMaterials.push(beaconMaterial);
    const roofBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), beaconMaterial);
    roofBeacon.position.set(0, config.height + config.capHeight + 0.18, 0);
    group.add(roofBeacon);
    renderMeshes.push(roofBeacon);

    roofGlow = new THREE.PointLight("#ff4a73", customization.roofLightIntensity, 3.4, 2);
    roofGlow.position.set(0, config.height + config.capHeight + 0.22, 0);
    group.add(roofGlow);
    roofLights.push(roofGlow);

    const beaconLabelTexture = createBeaconLabelTexture(
      beaconLabelWords[buildings.length % beaconLabelWords.length],
      "#ffffff"
    );
    beaconLabel = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: beaconLabelTexture,
        transparent: true,
        depthWrite: false,
        opacity: 1,
        color: "#ffffff"
      })
    );
    beaconLabel.position.set(0, config.height + config.capHeight + 0.44, 0);
    beaconLabel.scale.set(1.16, 0.28, 1);
    group.add(beaconLabel);
    renderMeshes.push(beaconLabel);
    fadeMaterials.push(beaconLabel.material);
    beaconLabelMaterial = beaconLabel.material;
  }

  group.position.set(config.x, 0, config.z);
  group.rotation.y = config.rotationY;
  town.add(group);

  const localBounds = new THREE.Box3().setFromObject(group);

  buildings.push({
    group,
    x: config.x,
    z: config.z,
    width: config.width,
    depth: config.depth,
    height: config.height,
    screenY: config.screenY,
    screenWidth: config.screenWidth,
    screenHeight: config.screenHeight,
    prominence: config.height + Math.max(0, -config.z),
    renderMeshes,
    fadeMaterials,
    roofPointLights: roofGlow ? [roofGlow] : [],
    localBounds,
    worldBounds: new THREE.Box3(),
    currentOpacity: 1,
    targetOpacity: 1,
    beaconLabel,
    beaconLabelMaterial
  });
  occludableBuildings.push(buildings[buildings.length - 1]);
};

const createGround = () => {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshPhongMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.001;
  ground.receiveShadow = true;
  city.add(ground);

  const gridHelper = new THREE.GridHelper(60, 120, 0xff0000, 0x000000);
  gridHelper.material.opacity = 0.12;
  gridHelper.material.transparent = true;
  city.add(gridHelper);
};

const updateBeaconLabels = () => {
  occludableBuildings.forEach((entry) => {
    if (!entry.beaconLabel) {
      return;
    }

    const isSelectedBuilding = editorState.selectedBuildingId === entry.id;
    const isHovered = hoveredBillboard?.userData?.buildingId === entry.id;
    const targetColor = new THREE.Color(
      isSelectedBuilding ? "#ffdf68" : entry.config.label.color || "#ffffff"
    );
    const scale = isSelectedBuilding ? 1.18 : isHovered ? 1.08 : 1;
    entry.beaconLabelMaterial.color.lerp(targetColor, 0.18);
    entry.beaconLabel.scale.lerp(new THREE.Vector3(1.16 * scale, 0.28 * scale, 1), 0.18);

    entry.roofPointLights.forEach((light) => {
      const multiplier = isSelectedBuilding ? 1.55 : 1;
      light.intensity = THREE.MathUtils.lerp(
        light.intensity,
        customization.roofLightIntensity * multiplier * entry.currentOpacity,
        0.18
      );
    });
  });
};

const createParticles = () => {
  const particularMaterial = new THREE.MeshToonMaterial({
    color: 0xffff99,
    side: THREE.DoubleSide
  });
  const particularGeometry = new THREE.CircleGeometry(0.015, 4);
  const particleCount = qualityMode === "reduced" ? 96 : 160;
  for (let i = 0; i < particleCount; i += 1) {
    const particle = new THREE.Mesh(particularGeometry, particularMaterial);
    particle.position.set(mathRandom(6), mathRandom(6), mathRandom(6));
    particle.rotation.set(mathRandom(), mathRandom(), mathRandom());
    smoke.add(particle);
    smokeParticles.push(particle);
  }
  smoke.position.y = 2;
};

const createRoadLines = () => {
  const colors = [0xffff66, 0xffffff, 0xff8e5c];
  for (let i = 0; i < 18; i += 1) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.03, 0.05),
      new THREE.MeshToonMaterial({ color: colors[i % colors.length] })
    );
    const lane = i % 2 === 0 ? "x" : "z";
    line.userData = {
      lane,
      speed: 0.04 + Math.random() * 0.03,
      amplitude: 10 + Math.random() * 6
    };
    if (lane === "x") {
      line.position.set(-12 + Math.random() * 24, 0.04 + Math.random() * 0.1, mathRandom(3));
    } else {
      line.position.set(mathRandom(3), 0.04 + Math.random() * 0.1, -12 + Math.random() * 24);
      line.rotation.y = Math.PI / 2;
    }
    city.add(line);
    roadLines.push(line);
  }
};

const clearCollection = (collection) => {
  collection.splice(0, collection.length);
};

const clearCityAuthoringState = () => {
  clearCollection(billboardMeshes);
  clearCollection(interactiveMeshes);
  clearCollection(buildingSelectMeshes);
  clearCollection(billboardTargets);
  clearCollection(buildings);
  clearCollection(occludableBuildings);
  clearCollection(buildingMaterials);
  clearCollection(roofLights);
  buildingEntriesById.clear();
  screenTargetsByKey.clear();
  while (town.children.length) {
    town.remove(town.children[0]);
  }
};

const getScreenMountFromConfig = (entry, screenConfig) => {
  const centerY = THREE.MathUtils.clamp(
    entry.height - screenConfig.topOffset - screenConfig.height / 2,
    screenConfig.height / 2 + 0.35,
    entry.height - screenConfig.height / 2 - 0.05
  );
  const outward = screenConfig.offsetOutward ?? 0.03;
  const along = screenConfig.offsetAlongFace ?? 0;
  const side = screenConfig.side ?? "front";

  if (side === "back") {
    return {
      normal: new THREE.Vector3(0, 0, -1),
      position: new THREE.Vector3(along, centerY, -entry.depth / 2 - outward),
      rotationY: Math.PI
    };
  }

  if (side === "left") {
    return {
      normal: new THREE.Vector3(-1, 0, 0),
      position: new THREE.Vector3(-entry.width / 2 - outward, centerY, along),
      rotationY: -Math.PI / 2
    };
  }

  if (side === "right") {
    return {
      normal: new THREE.Vector3(1, 0, 0),
      position: new THREE.Vector3(entry.width / 2 + outward, centerY, along),
      rotationY: Math.PI / 2
    };
  }

  return {
    normal: new THREE.Vector3(0, 0, 1),
    position: new THREE.Vector3(along, centerY, entry.depth / 2 + outward),
    rotationY: 0
  };
};

const createScreenTargetFromConfig = (entry, screenConfig) => {
  if (!screenConfig.enabled) {
    return null;
  }

  const project = findProjectBySlug(screenConfig.projectSlug);
  const asset = makeVideoAsset(project);
  const posterTexture = createPosterTexture(project);
  const mount = getScreenMountFromConfig(entry, screenConfig);

  const screenMount = new THREE.Group();
  screenMount.position.copy(mount.position);
  screenMount.rotation.y = mount.rotationY;
  entry.group.add(screenMount);

  const bezel = new THREE.Mesh(
    new THREE.BoxGeometry(screenConfig.width + 0.12, screenConfig.height + 0.12, 0.05),
    new THREE.MeshStandardMaterial({
      color: "#0d0e12",
      roughness: 0.28,
      metalness: 0.34,
      emissive: "#16040a",
      emissiveIntensity: 0.06,
      transparent: true,
      opacity: 1
    })
  );
  screenMount.add(bezel);

  const screenMaterial = new THREE.MeshStandardMaterial({
    map: posterTexture,
    emissiveMap: posterTexture,
    emissive: new THREE.Color("#ffffff"),
    emissiveIntensity: 0.18,
    roughness: 0.18,
    metalness: 0.02,
    transparent: true,
    opacity: 1
  });

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(screenConfig.width, screenConfig.height), screenMaterial);
  screen.position.set(0, 0, 0.031);
  screen.userData = {
    project,
    normal: mount.normal.clone(),
    buildingEntry: entry,
    buildingId: entry.id,
    screenId: screenConfig.id
  };
  screenMount.add(screen);
  interactiveMeshes.push(screen);
  billboardMeshes.push(screen);

  const glow = new THREE.PointLight(project.accent, 1.2, 3.6, 2);
  glow.position.set(0, 0, 0.35);
  screenMount.add(glow);

  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color: project.accent,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  halo.scale.set(screenConfig.width * 1.3, screenConfig.height * 1.3, 1);
  halo.position.set(0, 0, 0.04);
  screenMount.add(halo);

  const target = {
    key: getScreenKey(entry.id, screenConfig.id),
    screenId: screenConfig.id,
    buildingId: entry.id,
    billboard: screen,
    mount: screenMount,
    buildingEntry: entry,
    frame: bezel,
    halo,
    pointLight: glow,
    posterTexture,
    videoTexture: asset.texture,
    video: asset.video,
    videoAsset: asset,
    screenMaterial,
    isVideoActive: false,
    config: screenConfig
  };

  billboardTargets.push(target);
  screenTargetsByKey.set(target.key, target);
  return target;
};

const createBuildingFromConfig = (buildingConfig) => {
  const group = new THREE.Group();
  const material = createBuildingMaterial();
  buildingMaterials.push(material);
  const renderMeshes = [];
  const fadeMaterials = [material];
  const roofPointLights = [];

  const tower = new THREE.Mesh(
    new THREE.BoxGeometry(
      buildingConfig.dimensions.width,
      buildingConfig.dimensions.height,
      buildingConfig.dimensions.depth
    ),
    material
  );
  tower.position.y = buildingConfig.dimensions.height / 2;
  tower.castShadow = true;
  tower.receiveShadow = true;
  tower.userData = { buildingId: buildingConfig.id };
  group.add(tower);
  renderMeshes.push(tower);
  buildingSelectMeshes.push(tower);
  interactiveMeshes.push(tower);

  if (buildingConfig.cap.enabled) {
    const capMaterial = roofMaterial.clone();
    capMaterial.transparent = true;
    capMaterial.opacity = 1;
    fadeMaterials.push(capMaterial);
    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(
        buildingConfig.cap.width,
        buildingConfig.cap.height,
        buildingConfig.cap.depth
      ),
      capMaterial
    );
    cap.position.set(0, buildingConfig.dimensions.height + buildingConfig.cap.height / 2, 0);
    cap.castShadow = true;
    cap.receiveShadow = true;
    cap.userData = { buildingId: buildingConfig.id };
    group.add(cap);
    renderMeshes.push(cap);
    buildingSelectMeshes.push(cap);
    interactiveMeshes.push(cap);
  }

  if (buildingConfig.sideCore.enabled) {
    const core = new THREE.Mesh(
      new THREE.BoxGeometry(
        buildingConfig.sideCore.width,
        buildingConfig.sideCore.height,
        buildingConfig.sideCore.depth
      ),
      material
    );
    core.position.set(
      buildingConfig.sideCore.offsetX,
      buildingConfig.sideCore.height / 2,
      buildingConfig.sideCore.offsetZ
    );
    core.castShadow = true;
    core.receiveShadow = true;
    core.userData = { buildingId: buildingConfig.id };
    group.add(core);
    renderMeshes.push(core);
    buildingSelectMeshes.push(core);
    interactiveMeshes.push(core);
  }

  let roofBeacon = null;
  let roofGlow = null;
  let beaconLabel = null;
  let beaconLabelMaterial = null;
  const topCapHeight = buildingConfig.cap.enabled ? buildingConfig.cap.height : 0;

  if (buildingConfig.beacon.enabled) {
    const beaconMaterial = redBeaconMaterial.clone();
    beaconMaterial.color.set(buildingConfig.beacon.color);
    beaconMaterial.emissive.set(buildingConfig.beacon.color);
    beaconMaterial.transparent = true;
    beaconMaterial.opacity = 1;
    fadeMaterials.push(beaconMaterial);
    roofBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), beaconMaterial);
    roofBeacon.position.set(0, buildingConfig.dimensions.height + topCapHeight + buildingConfig.beacon.offsetY, 0);
    roofBeacon.userData = { buildingId: buildingConfig.id };
    group.add(roofBeacon);
    renderMeshes.push(roofBeacon);

    roofGlow = new THREE.PointLight(
      buildingConfig.beacon.color,
      customization.roofLightIntensity,
      3.4,
      2
    );
    roofGlow.position.set(0, buildingConfig.dimensions.height + topCapHeight + buildingConfig.beacon.offsetY, 0);
    group.add(roofGlow);
    roofLights.push(roofGlow);
    roofPointLights.push(roofGlow);
  }

  if (buildingConfig.label.enabled) {
    const beaconLabelTexture = createBeaconLabelTexture(
      buildingConfig.label.text || buildingConfig.id,
      buildingConfig.label.color
    );
    beaconLabel = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: beaconLabelTexture,
        transparent: true,
        depthWrite: false,
        opacity: 1,
        color: buildingConfig.label.color
      })
    );
    beaconLabel.position.set(
      0,
      buildingConfig.dimensions.height + topCapHeight + buildingConfig.label.offsetY,
      0
    );
    beaconLabel.scale.set(1.16, 0.28, 1);
    beaconLabel.userData = { buildingId: buildingConfig.id };
    group.add(beaconLabel);
    renderMeshes.push(beaconLabel);
    fadeMaterials.push(beaconLabel.material);
    beaconLabelMaterial = beaconLabel.material;
    interactiveMeshes.push(beaconLabel);
  }

  group.position.set(buildingConfig.position.x, 0, buildingConfig.position.z);
  group.rotation.y = buildingConfig.rotationY;
  town.add(group);

  const localBounds = new THREE.Box3().setFromObject(group);

  const entry = {
    id: buildingConfig.id,
    key: buildingConfig.key ?? getBuildingKey({ x: buildingConfig.position.x, z: buildingConfig.position.z }),
    config: buildingConfig,
    group,
    x: buildingConfig.position.x,
    z: buildingConfig.position.z,
    width: buildingConfig.dimensions.width,
    depth: buildingConfig.dimensions.depth,
    height: buildingConfig.dimensions.height,
    prominence: buildingConfig.dimensions.height + Math.max(0, -buildingConfig.position.z),
    renderMeshes,
    fadeMaterials,
    roofPointLights,
    localBounds,
    worldBounds: new THREE.Box3(),
    currentOpacity: 1,
    targetOpacity: 1,
    beaconLabel,
    beaconLabelMaterial,
    roofBeacon,
    screens: []
  };

  buildings.push(entry);
  occludableBuildings.push(entry);
  buildingEntriesById.set(entry.id, entry);

  buildingConfig.screens.forEach((screenConfig) => {
    const target = createScreenTargetFromConfig(entry, screenConfig);
    if (target) {
      entry.screens.push(target);
    }
  });
};

const ensureEditorSelection = () => {
  const enabledBuildings = sceneConfig.buildings.filter((building) => building.enabled);
  if (!enabledBuildings.length) {
    editorState.selectedBuildingId = null;
    editorState.selectedScreenId = null;
    return;
  }

  if (!enabledBuildings.some((building) => building.id === editorState.selectedBuildingId)) {
    editorState.selectedBuildingId = enabledBuildings[0].id;
  }

  const selectedBuilding = sceneConfig.buildings.find((building) => building.id === editorState.selectedBuildingId);
  const enabledScreens = selectedBuilding?.screens.filter((screen) => screen.enabled) ?? selectedBuilding?.screens ?? [];
  if (!enabledScreens.length) {
    editorState.selectedScreenId = null;
    return;
  }
  if (!enabledScreens.some((screen) => screen.id === editorState.selectedScreenId)) {
    editorState.selectedScreenId = enabledScreens[0].id;
  }
};

const buildCityFromConfig = (config) => {
  const currentSelectionKey =
    selectedBillboard?.userData?.buildingId && selectedBillboard?.userData?.screenId
      ? getScreenKey(selectedBillboard.userData.buildingId, selectedBillboard.userData.screenId)
      : null;
  clearCityAuthoringState();
  config.buildings.filter((building) => building.enabled).forEach(createBuildingFromConfig);
  ensureEditorSelection();
  if (editorState.previewScreenKey) {
    const previewTarget = screenTargetsByKey.get(editorState.previewScreenKey);
    if (previewTarget) {
      selectedBillboard = previewTarget.billboard;
      frameSelection(previewTarget.billboard);
    } else {
      editorState.previewScreenKey = null;
      selectedBillboard = null;
      frameSelection(null);
    }
  } else if (currentSelectionKey) {
    const nextSelectedTarget = screenTargetsByKey.get(currentSelectionKey);
    if (nextSelectedTarget && editorState.mode === "browse") {
      selectedBillboard = nextSelectedTarget.billboard;
      frameSelection(nextSelectedTarget.billboard);
    } else {
      selectedBillboard = null;
      frameSelection(null);
    }
  } else {
    selectedBillboard = null;
    frameSelection(null);
  }
  interactionDirty = true;
  labelDirty = true;
  overlayDirty = true;
  occlusionDirty = true;
};

const scheduleCityRebuild = () => {
  if (sceneRebuildQueued) {
    return;
  }
  sceneRebuildQueued = true;
  requestAnimationFrame(() => {
    sceneRebuildQueued = false;
    buildCityFromConfig(sceneConfig);
    renderEditorControls();
  });
};

const cityLayoutSeed = [
  { x: -4, z: -3, width: 1.4, depth: 1.3, height: 5.4, capHeight: 0.4, capWidth: 1.0, capDepth: 1.0, sideCoreWidth: 0.34, sideCoreHeight: 2.8, sideCoreDepth: 0.6, sideCoreOffset: -0.55, rotationY: 0.02, screenY: 2.2, screenWidth: 1.02, screenHeight: 0.66 },
  { x: -3, z: 0, width: 1.2, depth: 1.2, height: 4.6, capHeight: 0.28, capWidth: 0.9, capDepth: 0.9, sideCoreWidth: 0.28, sideCoreHeight: 2.2, sideCoreDepth: 0.5, sideCoreOffset: 0.48, rotationY: -0.04, screenY: 2.0, screenWidth: 0.92, screenHeight: 1.18 },
  { x: -3, z: 2, width: 1.4, depth: 1.3, height: 6.6, capHeight: 0.42, capWidth: 1.1, capDepth: 1.02, sideCoreWidth: 0.34, sideCoreHeight: 3.1, sideCoreDepth: 0.55, sideCoreOffset: -0.5, rotationY: 0.06, screenY: 2.55, screenWidth: 1.08, screenHeight: 0.68 },
  { x: -1, z: -4, width: 1.1, depth: 1.1, height: 8.8, capHeight: 0.5, capWidth: 0.88, capDepth: 0.82, sideCoreWidth: 0.28, sideCoreHeight: 3.4, sideCoreDepth: 0.46, sideCoreOffset: 0.46, rotationY: -0.08, screenY: 3.3, screenWidth: 0.92, screenHeight: 1.42 },
  { x: -1, z: -1, width: 1.6, depth: 1.45, height: 7.2, capHeight: 0.46, capWidth: 1.2, capDepth: 1.1, sideCoreWidth: 0.44, sideCoreHeight: 3.0, sideCoreDepth: 0.68, sideCoreOffset: -0.58, rotationY: 0.02, screenY: 3.0, screenWidth: 1.18, screenHeight: 0.72 },
  { x: -1, z: 2, width: 1.22, depth: 1.16, height: 6.1, capHeight: 0.3, capWidth: 0.88, capDepth: 0.8, sideCoreWidth: 0.22, sideCoreHeight: 2.4, sideCoreDepth: 0.42, sideCoreOffset: 0.42, rotationY: -0.04, screenY: 2.6, screenWidth: 0.92, screenHeight: 1.22 },
  { x: 1, z: -3, width: 1.35, depth: 1.24, height: 10.4, capHeight: 0.46, capWidth: 0.98, capDepth: 0.9, sideCoreWidth: 0.26, sideCoreHeight: 4.2, sideCoreDepth: 0.42, sideCoreOffset: -0.44, rotationY: 0.06, screenY: 3.6, screenWidth: 0.96, screenHeight: 1.5 },
  { x: 1, z: 0, width: 1.84, depth: 1.58, height: 8.4, capHeight: 0.5, capWidth: 1.34, capDepth: 1.2, sideCoreWidth: 0.46, sideCoreHeight: 3.2, sideCoreDepth: 0.62, sideCoreOffset: 0.66, rotationY: -0.06, screenY: 3.2, screenWidth: 1.28, screenHeight: 0.78 },
  { x: 1, z: 3, width: 1.3, depth: 1.22, height: 5.2, capHeight: 0.32, capWidth: 0.94, capDepth: 0.86, sideCoreWidth: 0.24, sideCoreHeight: 2.2, sideCoreDepth: 0.44, sideCoreOffset: -0.42, rotationY: 0.08, screenY: 2.2, screenWidth: 0.96, screenHeight: 0.62 },
  { x: 3, z: -4, width: 1.52, depth: 1.36, height: 9.4, capHeight: 0.46, capWidth: 1.08, capDepth: 1.0, sideCoreWidth: 0.38, sideCoreHeight: 3.6, sideCoreDepth: 0.56, sideCoreOffset: 0.56, rotationY: -0.08, screenY: 3.6, screenWidth: 1.12, screenHeight: 0.72 },
  { x: 3, z: -1, width: 1.24, depth: 1.12, height: 7.4, capHeight: 0.36, capWidth: 0.92, capDepth: 0.84, sideCoreWidth: 0.24, sideCoreHeight: 2.8, sideCoreDepth: 0.4, sideCoreOffset: -0.38, rotationY: 0.04, screenY: 2.9, screenWidth: 0.94, screenHeight: 1.24 },
  { x: 3, z: 2, width: 1.62, depth: 1.42, height: 6.6, capHeight: 0.38, capWidth: 1.16, capDepth: 1.02, sideCoreWidth: 0.36, sideCoreHeight: 2.6, sideCoreDepth: 0.56, sideCoreOffset: 0.54, rotationY: -0.04, screenY: 2.7, screenWidth: 1.16, screenHeight: 0.72 }
];

const maxLayoutRadius = Math.max(
  ...cityLayoutSeed.map((config) => Math.hypot(config.x, config.z))
);

const cityLayout = cityLayoutSeed.map((config) => {
  const radius = Math.hypot(config.x, config.z);
  const radialFactor = 1 - radius / maxLayoutRadius;
  const heightScale = THREE.MathUtils.lerp(0.76, 1.22, radialFactor);
  const adjustedHeight = config.height * heightScale;
  const adjustedCapHeight = config.capHeight * THREE.MathUtils.lerp(0.9, 1.18, radialFactor);
  const adjustedSideCoreHeight = config.sideCoreHeight * THREE.MathUtils.lerp(0.9, 1.12, radialFactor);
  const adjustedScreenHeight = config.screenHeight * THREE.MathUtils.lerp(0.92, 1.08, radialFactor);
  const adjustedScreenWidth = config.screenWidth * THREE.MathUtils.lerp(0.95, 1.04, radialFactor);

  const nextConfig = {
    ...config,
    height: adjustedHeight,
    capHeight: adjustedCapHeight,
    sideCoreHeight: adjustedSideCoreHeight,
    screenHeight: adjustedScreenHeight,
    screenWidth: adjustedScreenWidth
  };

  nextConfig.rotationY = computeOutwardRotation(config.x, config.z, config.rotationY);
  nextConfig.screenY = computeRaisedScreenY(nextConfig);
  nextConfig.prominence = adjustedHeight + radialFactor * 4;

  return nextConfig;
});

const getHomeScreenScore = (entry) => {
  const forwardness = entry.z * 2.4;
  const centerBias = -Math.abs(entry.x) * 0.35;
  const heightBias = entry.height * 0.45;
  const prominenceBias = entry.prominence * 0.25;
  return forwardness + centerBias + heightBias + prominenceBias;
};

const init = () => {
  sceneConfig = loadSceneConfigFromStorage();
  editorState.mode = sceneConfig.camera.mode ?? "browse";
  createGround();
  createParticles();
  createRoadLines();
  applySceneConfigToCustomization();
  buildCityFromConfig(sceneConfig);
};

const clampInputValue = (input, value) => {
  if (!input) {
    return value;
  }

  const min = input.min === "" ? -Infinity : Number(input.min);
  const max = input.max === "" ? Infinity : Number(input.max);
  return THREE.MathUtils.clamp(value, min, max);
};

const syncCustomizeControls = () => {
  if (!cameraYawInput || !cameraPitchInput || !cameraDistanceInput || !cameraFovInput) {
    return;
  }

  const yaw = clampInputValue(cameraYawInput, customization.cameraYaw);
  const pitch = clampInputValue(cameraPitchInput, customization.cameraPitch);
  const distance = clampInputValue(cameraDistanceInput, customization.cameraDistance);
  const fov = clampInputValue(cameraFovInput, customization.cameraFov);

  cameraYawInput.value = `${yaw}`;
  cameraPitchInput.value = `${pitch}`;
  cameraDistanceInput.value = `${distance}`;
  cameraFovInput.value = `${fov}`;
  if (cameraTargetXInput) {
    cameraTargetXInput.value = `${customization.targetX.toFixed(2)}`;
  }
  if (cameraTargetYInput) {
    cameraTargetYInput.value = `${customization.targetY.toFixed(2)}`;
  }
  if (cameraTargetZInput) {
    cameraTargetZInput.value = `${customization.targetZ.toFixed(2)}`;
  }
  cameraYawValue.textContent = `${yaw.toFixed(0)} deg`;
  cameraPitchValue.textContent = `${pitch.toFixed(0)} deg`;
  cameraDistanceValue.textContent = `${distance.toFixed(1)}`;
  cameraFovValue.textContent = `${fov.toFixed(1)}`;

  if (cameraPresetNameInput) {
    cameraPresetNameInput.value = sceneConfig.camera.presetName || "Current framing";
  }

  if (cameraDataOutput) {
    cameraDataOutput.value = [
      `preset: ${sceneConfig.camera.presetName || "Current framing"}`,
      `yaw: ${customization.cameraYaw.toFixed(2)}`,
      `pitch: ${customization.cameraPitch.toFixed(2)}`,
      `distance: ${customization.cameraDistance.toFixed(2)}`,
      `fov: ${customization.cameraFov.toFixed(2)}`,
      `position: x ${customization.cameraX.toFixed(2)}, y ${customization.cameraY.toFixed(2)}, z ${customization.cameraZ.toFixed(2)}`,
      `target: x ${customization.targetX.toFixed(2)}, y ${customization.targetY.toFixed(2)}, z ${customization.targetZ.toFixed(2)}`
    ].join("\n");
  }
};

const getSelectedBuildingConfig = () =>
  sceneConfig.buildings.find((building) => building.id === editorState.selectedBuildingId) ?? null;

const getSelectedScreenConfig = () => {
  const building = getSelectedBuildingConfig();
  return building?.screens.find((screen) => screen.id === editorState.selectedScreenId) ?? null;
};

const populateSelect = (select, options, selectedValue, fallbackLabel) => {
  if (!select) {
    return;
  }
  select.innerHTML = "";
  if (!options.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = fallbackLabel;
    select.append(option);
    return;
  }
  options.forEach(({ value, label }) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.selected = value === selectedValue;
    select.append(option);
  });
};

const renderEditorControls = () => {
  syncCustomizeControls();
  if (editorModeSelect) {
    editorModeSelect.value = editorState.mode;
  }

  const buildingOptions = sceneConfig.buildings.map((building) => ({
    value: building.id,
    label: `${building.id} ${building.label.text ? `• ${building.label.text}` : ""}`.trim()
  }));
  populateSelect(buildingSelect, buildingOptions, editorState.selectedBuildingId, "No buildings");

  const selectedBuilding = getSelectedBuildingConfig();
  const selectedScreen = getSelectedScreenConfig();
  const screenOptions = selectedBuilding
    ? selectedBuilding.screens.map((screen) => ({
        value: screen.id,
        label: `${screen.id} • ${screen.projectSlug}`
      }))
    : [];
  populateSelect(screenSelect, screenOptions, editorState.selectedScreenId, "No screens");
  populateSelect(
    screenProjectSelect,
    projects.map((project) => ({ value: project.slug, label: project.title })),
    selectedScreen?.projectSlug,
    "No projects"
  );

  const hasBuilding = Boolean(selectedBuilding);
  const hasScreen = Boolean(selectedScreen);
  [
    buildingDuplicateButton,
    buildingDeleteButton,
    buildingEnabledInput,
    buildingXInput,
    buildingZInput,
    buildingRotationInput,
    buildingWidthInput,
    buildingDepthInput,
    buildingHeightInput,
    buildingCapEnabledInput,
    buildingCapWidthInput,
    buildingCapDepthInput,
    buildingCapHeightInput,
    buildingCoreEnabledInput,
    buildingCoreWidthInput,
    buildingCoreDepthInput,
    buildingCoreHeightInput,
    buildingCoreOffsetXInput,
    buildingCoreOffsetZInput,
    buildingLabelEnabledInput,
    buildingLabelTextInput,
    buildingLabelColorInput,
    buildingLabelOffsetYInput,
    buildingBeaconEnabledInput,
    buildingBeaconColorInput,
    buildingBeaconOffsetYInput,
    screenAddButton
  ].forEach((element) => {
    if (element) {
      element.disabled = !hasBuilding;
    }
  });

  [
    screenDuplicateButton,
    screenDeleteButton,
    screenEnabledInput,
    screenProjectSelect,
    screenSideSelect,
    screenWidthInput,
    screenHeightInput,
    screenTopOffsetInput,
    screenOffsetAlongInput,
    screenOffsetOutwardInput,
    toolPreviewScreenButton,
    toolTopScreenButton,
    toolAlignScreenButton
  ].forEach((element) => {
    if (element) {
      element.disabled = !hasScreen;
    }
  });

  [toolFaceBuildingButton, toolRebalanceHeightsButton].forEach((element) => {
    if (element) {
      element.disabled = !hasBuilding;
    }
  });

  if (selectedBuilding) {
    buildingEnabledInput.checked = selectedBuilding.enabled;
    buildingXInput.value = `${selectedBuilding.position.x.toFixed(2)}`;
    buildingZInput.value = `${selectedBuilding.position.z.toFixed(2)}`;
    buildingRotationInput.value = `${selectedBuilding.rotationY.toFixed(2)}`;
    buildingWidthInput.value = `${selectedBuilding.dimensions.width.toFixed(2)}`;
    buildingDepthInput.value = `${selectedBuilding.dimensions.depth.toFixed(2)}`;
    buildingHeightInput.value = `${selectedBuilding.dimensions.height.toFixed(2)}`;
    buildingCapEnabledInput.checked = selectedBuilding.cap.enabled;
    buildingCapWidthInput.value = `${selectedBuilding.cap.width.toFixed(2)}`;
    buildingCapDepthInput.value = `${selectedBuilding.cap.depth.toFixed(2)}`;
    buildingCapHeightInput.value = `${selectedBuilding.cap.height.toFixed(2)}`;
    buildingCoreEnabledInput.checked = selectedBuilding.sideCore.enabled;
    buildingCoreWidthInput.value = `${selectedBuilding.sideCore.width.toFixed(2)}`;
    buildingCoreDepthInput.value = `${selectedBuilding.sideCore.depth.toFixed(2)}`;
    buildingCoreHeightInput.value = `${selectedBuilding.sideCore.height.toFixed(2)}`;
    buildingCoreOffsetXInput.value = `${selectedBuilding.sideCore.offsetX.toFixed(2)}`;
    buildingCoreOffsetZInput.value = `${selectedBuilding.sideCore.offsetZ.toFixed(2)}`;
    buildingLabelEnabledInput.checked = selectedBuilding.label.enabled;
    buildingLabelTextInput.value = selectedBuilding.label.text;
    buildingLabelColorInput.value = selectedBuilding.label.color;
    buildingLabelOffsetYInput.value = `${selectedBuilding.label.offsetY.toFixed(2)}`;
    buildingBeaconEnabledInput.checked = selectedBuilding.beacon.enabled;
    buildingBeaconColorInput.value = selectedBuilding.beacon.color;
    buildingBeaconOffsetYInput.value = `${selectedBuilding.beacon.offsetY.toFixed(2)}`;
  } else {
    buildingEnabledInput.checked = false;
    buildingCapEnabledInput.checked = false;
    buildingCoreEnabledInput.checked = false;
    buildingLabelEnabledInput.checked = false;
    buildingBeaconEnabledInput.checked = false;
    buildingLabelColorInput.value = "#ffffff";
    buildingBeaconColorInput.value = "#ff4a73";
    [
      buildingXInput,
      buildingZInput,
      buildingRotationInput,
      buildingWidthInput,
      buildingDepthInput,
      buildingHeightInput,
      buildingCapWidthInput,
      buildingCapDepthInput,
      buildingCapHeightInput,
      buildingCoreWidthInput,
      buildingCoreDepthInput,
      buildingCoreHeightInput,
      buildingCoreOffsetXInput,
      buildingCoreOffsetZInput,
      buildingLabelTextInput,
      buildingLabelOffsetYInput,
      buildingBeaconOffsetYInput
    ].forEach((input) => {
      input.value = "";
    });
  }

  if (selectedScreen) {
    screenEnabledInput.checked = selectedScreen.enabled;
    screenProjectSelect.value = selectedScreen.projectSlug;
    screenSideSelect.value = selectedScreen.side;
    screenWidthInput.value = `${selectedScreen.width.toFixed(2)}`;
    screenHeightInput.value = `${selectedScreen.height.toFixed(2)}`;
    screenTopOffsetInput.value = `${selectedScreen.topOffset.toFixed(2)}`;
    screenOffsetAlongInput.value = `${selectedScreen.offsetAlongFace.toFixed(2)}`;
    screenOffsetOutwardInput.value = `${selectedScreen.offsetOutward.toFixed(2)}`;
  } else {
    screenEnabledInput.checked = false;
    screenProjectSelect.value = "";
    screenSideSelect.value = "front";
    screenWidthInput.value = "";
    screenHeightInput.value = "";
    screenTopOffsetInput.value = "";
    screenOffsetAlongInput.value = "";
    screenOffsetOutwardInput.value = "";
  }

  sceneBgColorInput.value = sceneConfig.scene.bgColor;
  sceneFogColorInput.value = sceneConfig.scene.fogColor;
  sceneFogNearInput.value = `${sceneConfig.scene.fogNear}`;
  sceneFogFarInput.value = `${sceneConfig.scene.fogFar}`;
  sceneAmbientInput.value = `${sceneConfig.scene.ambientIntensity}`;
  sceneFrontLightInput.value = `${sceneConfig.scene.frontLightIntensity}`;
  sceneBackLightInput.value = `${sceneConfig.scene.backLightIntensity}`;
};

const getUniqueBuildingId = () => {
  let index = sceneConfig.buildings.length + 1;
  while (sceneConfig.buildings.some((building) => building.id === `tower-${String(index).padStart(2, "0")}`)) {
    index += 1;
  }
  return `tower-${String(index).padStart(2, "0")}`;
};

const getUniqueScreenId = (building) => {
  let index = building.screens.length + 1;
  while (building.screens.some((screen) => screen.id === `${building.id}-screen-${String(index).padStart(2, "0")}`)) {
    index += 1;
  }
  return `${building.id}-screen-${String(index).padStart(2, "0")}`;
};

const refreshEditorFromSceneConfig = ({ rebuildCity = false, syncView = false } = {}) => {
  if (syncView) {
    applySceneConfigToCustomization();
    applyCustomization();
    if (editorState.mode === "edit" && !editorState.previewScreenKey) {
      syncOrbitControlsFromSceneConfig();
      syncCameraStateFromCurrentView();
    }
  }
  saveSceneConfigToStorage();
  if (rebuildCity) {
    scheduleCityRebuild();
    return;
  }
  renderEditorControls();
};

const selectBuilding = (buildingId, preferredScreenId = null) => {
  editorState.selectedBuildingId = buildingId;
  const building = getSelectedBuildingConfig();
  if (!building) {
    editorState.selectedScreenId = null;
    renderEditorControls();
    return;
  }
  if (preferredScreenId && building.screens.some((screen) => screen.id === preferredScreenId)) {
    editorState.selectedScreenId = preferredScreenId;
  } else {
    editorState.selectedScreenId = building.screens[0]?.id ?? null;
  }
  labelDirty = true;
  renderEditorControls();
};

const selectScreen = (buildingId, screenId) => {
  editorState.selectedBuildingId = buildingId;
  editorState.selectedScreenId = screenId;
  labelDirty = true;
  renderEditorControls();
};

const createBuildingConfig = (template = null) => {
  const fallback = template ? cloneValue(template) : cloneValue(defaultSceneConfig.buildings[0]);
  const index = sceneConfig.buildings.length;
  const id = getUniqueBuildingId();
  const x = template ? template.position.x + 1.1 : Math.cos(index * 0.75) * 4;
  const z = template ? template.position.z + 1.1 : Math.sin(index * 0.75) * 3.4;
  fallback.id = id;
  fallback.position.x = Number(x.toFixed(2));
  fallback.position.z = Number(z.toFixed(2));
  fallback.key = getBuildingKey({ x: fallback.position.x, z: fallback.position.z });
  fallback.label.text = template ? `${template.label.text || template.id} copy` : id;
  fallback.screens = (template ? template.screens : []).map((screen, screenIndex) => ({
    ...cloneValue(screen),
    id: `${id}-screen-${String(screenIndex + 1).padStart(2, "0")}`
  }));
  return fallback;
};

const createScreenConfig = (building, template = null) => ({
  id: getUniqueScreenId(building),
  enabled: template?.enabled ?? true,
  projectSlug: template?.projectSlug ?? projects[0].slug,
  side: template?.side ?? "front",
  width: template?.width ?? building.defaultScreen?.width ?? 1,
  height: template?.height ?? building.defaultScreen?.height ?? 0.8,
  topOffset: template?.topOffset ?? 0.28,
  offsetAlongFace: template?.offsetAlongFace ?? 0,
  offsetOutward: template?.offsetOutward ?? 0.03
});

const getCameraFacingSideForBuilding = (building) => {
  const toCamera = new THREE.Vector3(
    camera.position.x - building.position.x,
    0,
    camera.position.z - building.position.z
  ).normalize();
  const local = toCamera.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -building.rotationY);
  const scores = [
    { side: "front", score: local.z },
    { side: "back", score: -local.z },
    { side: "right", score: local.x },
    { side: "left", score: -local.x }
  ];
  scores.sort((a, b) => b.score - a.score);
  return scores[0].side;
};

const downloadSceneConfig = () => {
  const json = JSON.stringify(sceneConfig, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "lab-city-scene-config.json";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const loadSceneConfigState = (nextConfig) => {
  sceneConfig = normalizeSceneConfig(nextConfig, projects);
  editorState.selectedBuildingId = null;
  editorState.selectedScreenId = null;
  editorState.previewScreenKey = null;
  applySceneConfigToCustomization();
  buildCityFromConfig(sceneConfig);
  applyCustomization();
  setEditorMode(sceneConfig.camera.mode ?? "browse");
  renderEditorControls();
  saveSceneConfigToStorage();
};

const mutateSelectedBuilding = (mutator) => {
  const building = getSelectedBuildingConfig();
  if (!building) {
    return;
  }
  mutator(building);
  building.key = getBuildingKey({
    x: Number(building.position.x.toFixed(2)),
    z: Number(building.position.z.toFixed(2))
  });
  refreshEditorFromSceneConfig({ rebuildCity: true });
};

const mutateSelectedScreen = (mutator) => {
  const screen = getSelectedScreenConfig();
  if (!screen) {
    return;
  }
  mutator(screen, getSelectedBuildingConfig());
  refreshEditorFromSceneConfig({ rebuildCity: true });
};

const updateCameraConfigFromInputs = () => {
  sceneConfig.camera.orbitYaw = Number(cameraYawInput.value);
  sceneConfig.camera.orbitPitch = Number(cameraPitchInput.value);
  sceneConfig.camera.orbitDistance = Number(cameraDistanceInput.value);
  sceneConfig.camera.fov = Number(cameraFovInput.value);
  sceneConfig.camera.target.x = Number(cameraTargetXInput.value);
  sceneConfig.camera.target.y = Number(cameraTargetYInput.value);
  sceneConfig.camera.target.z = Number(cameraTargetZInput.value);
  refreshEditorFromSceneConfig({ syncView: true });
};

const bindNumberInput = (input, callback) => {
  input?.addEventListener("input", () => {
    const value = Number(input.value);
    if (!Number.isFinite(value)) {
      return;
    }
    callback(value);
  });
};

const bindCheckboxInput = (input, callback) => {
  input?.addEventListener("input", () => {
    callback(input.checked);
  });
};

const updatePanel = (project) => {
  if (!project) {
    panel.dataset.open = "false";
    panelKicker.textContent = "Case Study";
    panelTitle.textContent = "Escolha uma tela";
    panelMeta.textContent = "Passe o mouse sobre um prédio e clique para abrir o case.";
    panelDescription.textContent =
      "A cidade mistura o mood original Lab City com os outdoors de vídeo do portfólio.";
    return;
  }

  panel.dataset.open = "true";
  panelKicker.textContent = "Case Study";
  panelTitle.textContent = project.title;
  panelMeta.textContent = `${project.client}  •  ${project.date}`;
  panelDescription.textContent = project.description;
};

const setBillboardVideoState = (target, active) => {
  if (target.isVideoActive === active) {
    return;
  }

  target.isVideoActive = active;

  if (active) {
    target.screenMaterial.map = target.videoTexture;
    target.screenMaterial.emissiveMap = target.videoTexture;
    target.screenMaterial.needsUpdate = true;
    return;
  }

  target.screenMaterial.map = target.posterTexture;
  target.screenMaterial.emissiveMap = target.posterTexture;
  target.screenMaterial.needsUpdate = true;
};

const refreshVideoTargets = () => {
  billboardTargets.forEach((target) => {
    const active =
      target.billboard === selectedBillboard ||
      target.billboard === hoveredBillboard;
    setBillboardVideoState(target, active);
  });
};

const setHover = (billboard) => {
  if (hoveredBillboard === billboard) {
    return;
  }

  hoveredBillboard = billboard;
  labelDirty = true;
  overlayDirty = true;
  if (!billboard) {
    label.dataset.visible = "false";
    refreshVideoTargets();
    return;
  }

  clientLabel.textContent = billboard.userData.project.client;
  dateLabel.textContent = billboard.userData.project.date;
  label.dataset.visible = "true";
  refreshVideoTargets();
};

const frameSelection = (billboard) => {
  if (!billboard) {
    header.dataset.dimmed = "false";
    hint.dataset.dimmed = "false";
    document.body.dataset.focused = "false";
    updatePanel(null);
    overlayDirty = true;
    occlusionDirty = true;
    labelDirty = true;
    refreshVideoTargets();
    return;
  }

  billboard.getWorldPosition(tempVector);
  billboard.getWorldQuaternion(tempQuaternion);
  normalVector.set(0, 0, 1).applyQuaternion(tempQuaternion).normalize();

  cameraState.goalPosition.copy(tempVector).addScaledVector(normalVector, 3.1);
  cameraState.goalPosition.y = tempVector.y;
  cameraState.goalTarget.copy(tempVector);

  settledRotationY = 0;
  settledRotationX = 0;

  header.dataset.dimmed = "true";
  hint.dataset.dimmed = "true";
  document.body.dataset.focused = "true";
  updatePanel(billboard.userData.project);
  overlayDirty = true;
  occlusionDirty = true;
  labelDirty = true;
  refreshVideoTargets();
};

const updateBillboardFeedback = (elapsed) => {
  billboardTargets.forEach(({ billboard, frame, halo, pointLight, screenMaterial, buildingEntry }) => {
    const isHovered = hoveredBillboard === billboard;
    const isSelected = selectedBillboard === billboard;
    const isEditorSelected =
      editorState.mode === "edit" &&
      billboard.userData.buildingId === editorState.selectedBuildingId &&
      billboard.userData.screenId === editorState.selectedScreenId;
    const occlusionFactor = buildingEntry?.currentOpacity ?? 1;
    const hiddenByOcclusion = !isSelected && occlusionFactor < 0.02;
    const pulse = 1 + Math.sin(elapsed * 2) * 0.02;
    const baseScale = isSelected
      ? customization.selectedScale
      : isEditorSelected
        ? 1.12
        : isHovered
          ? 1.05
          : 1;
    const animatedScale = isSelected ? baseScale * pulse : baseScale;
    scaleVector.set(animatedScale, animatedScale, 1);
    billboard.scale.lerp(scaleVector, 0.12);
    halo.scale.lerp(scaleVector, 0.1);

    billboard.visible = !hiddenByOcclusion;
    frame.visible = !hiddenByOcclusion;
    halo.visible = !hiddenByOcclusion;

    screenMaterial.opacity = occlusionFactor;
    frame.material.opacity = occlusionFactor;

    halo.material.opacity = THREE.MathUtils.lerp(
      halo.material.opacity,
      (isSelected ? 0.28 : isEditorSelected ? 0.24 : isHovered ? 0.22 : 0.18) * occlusionFactor,
      0.12
    );

    pointLight.intensity = THREE.MathUtils.lerp(
      pointLight.intensity,
      (isSelected ? 1.8 : isEditorSelected ? 1.55 : isHovered ? 1.4 : 1.2) * occlusionFactor,
      0.12
    );

    frame.material.emissiveIntensity = THREE.MathUtils.lerp(
      frame.material.emissiveIntensity,
      (isSelected ? 0.18 : isEditorSelected ? 0.14 : isHovered ? 0.1 : 0.06) * occlusionFactor,
      0.12
    );
  });
};

const updateLabelPosition = () => {
  if (!hoveredBillboard) {
    return;
  }

  hoveredBillboard.getWorldPosition(focusVector);
  focusVector.project(camera);

  const x = (focusVector.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-focusVector.y * 0.5 + 0.5) * window.innerHeight;
  label.style.transform = `translate3d(${x}px, ${y - 60}px, 0)`;
  labelDirty = false;
};

const updateOverviewMotion = () => {
  if (selectedBillboard) {
    city.rotation.y += (settledRotationY - city.rotation.y) * 0.08;
    city.rotation.x += (settledRotationX - city.rotation.x) * 0.08;
    updateSelectedFrame();
    return;
  }

  const lateralOffset = -pointer.x * customization.rotateYStrength * 0.82;
  const verticalOffset = pointer.y * customization.rotateXStrength * 1.56;
  const targetRotationY = -pointer.x * customization.rotateYStrength * 0.108;
  const targetRotationX = THREE.MathUtils.clamp(
    0.22 - pointer.y * customization.rotateXStrength * 0.042,
    0.14,
    0.32
  );

  cameraState.goalPosition.set(
    cameraState.basePosition.x + lateralOffset,
    cameraState.basePosition.y + verticalOffset,
    cameraState.basePosition.z
  );
  cameraState.goalTarget.set(
    cameraState.baseTarget.x + lateralOffset * 0.12,
    cameraState.baseTarget.y + verticalOffset * 0.34,
    cameraState.baseTarget.z
  );

  city.rotation.y += (targetRotationY - city.rotation.y) * customization.rotationLerp;
  city.rotation.x += (targetRotationX - city.rotation.x) * customization.rotationLerp;
  settledRotationY = city.rotation.y;
  settledRotationX = city.rotation.x;
};

const updateIntroParallax = () => {
  if (!introOverlayText || introHidden) {
    return;
  }

  const lateralOffset = -pointer.x * customization.rotateYStrength * 0.82;
  const offsetX = lateralOffset * -3.1;
  const offsetY = 0;
  introOverlayText.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
};

const updateIntroReturn = () => {
  if (!introHidden) {
    homeIdleStartedAt = 0;
    return;
  }

  if (selectedBillboard || aboutOpen) {
    homeIdleStartedAt = 0;
    return;
  }

  if (!homeIdleStartedAt) {
    homeIdleStartedAt = performance.now();
    return;
  }

  if (performance.now() - homeIdleStartedAt >= introReturnDelay) {
    restoreIntro();
  }
};

const updateRoadLines = (elapsed) => {
  roadLines.forEach((line) => {
    if (line.userData.lane === "x") {
      line.position.x += line.userData.speed;
      if (line.position.x > line.userData.amplitude) {
        line.position.x = -line.userData.amplitude;
      }
    } else {
      line.position.z += line.userData.speed;
      if (line.position.z > line.userData.amplitude) {
        line.position.z = -line.userData.amplitude;
      }
    }
  });
  smoke.rotation.y += 0.003;
  smoke.rotation.x += 0.0015;

  smokePhase = (smokePhase + 1) % 2;
  const smokeAmplitude = qualityMode === "reduced" ? 0.00035 : 0.0006;
  smokeParticles.forEach((particle, index) => {
    if (qualityMode === "reduced" && index % 2 !== smokePhase) {
      return;
    }
    particle.position.y += Math.sin(elapsed * 0.8 + index) * smokeAmplitude;
  });
};

const hidePlayerOverlay = () => {
  playerOverlay.setAttribute("aria-hidden", "true");
  overlayDirty = false;
  if (!playerElement.paused) {
    playerElement.pause();
  }
  if (playerElement.dataset.src) {
    playerElement.removeAttribute("src");
    playerElement.dataset.src = "";
    playerElement.load();
  }
};

const updatePlayerOverlay = () => {
  if (!playerOverlay || !playerElement) {
    return;
  }

  if (!selectedBillboard || aboutOpen) {
    hidePlayerOverlay();
    return;
  }

  const target = billboardTargets.find(({ billboard }) => billboard === selectedBillboard);
  if (!target) {
    hidePlayerOverlay();
    return;
  }

  const cameraReady =
    cameraState.currentPosition.distanceTo(cameraState.goalPosition) < 0.34 &&
    cameraState.currentTarget.distanceTo(cameraState.goalTarget) < 0.26;

  if (!cameraReady) {
    hidePlayerOverlay();
    return;
  }

  const width = target.billboard.geometry.parameters.width * target.billboard.scale.x;
  const height = target.billboard.geometry.parameters.height * target.billboard.scale.y;
  const corners = [
    [-width / 2, -height / 2, 0.032],
    [width / 2, -height / 2, 0.032],
    [width / 2, height / 2, 0.032],
    [-width / 2, height / 2, 0.032]
  ];

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  corners.forEach(([x, y, z], index) => {
    playerCornerPoints[index].set(x, y, z).applyMatrix4(target.billboard.matrixWorld).project(camera);
    const screenX = (playerCornerPoints[index].x * 0.5 + 0.5) * window.innerWidth;
    const screenY = (-playerCornerPoints[index].y * 0.5 + 0.5) * window.innerHeight;
    minX = Math.min(minX, screenX);
    maxX = Math.max(maxX, screenX);
    minY = Math.min(minY, screenY);
    maxY = Math.max(maxY, screenY);
  });

  const insetX = (maxX - minX) * 0.12;
  const insetY = (maxY - minY) * 0.12;
  const availableWidth = Math.max(120, maxX - minX - insetX * 2);
  const availableHeight = Math.max(80, maxY - minY - insetY * 2);
  const nextWidth = Math.max(120, availableWidth * 0.8);
  const nextHeight = Math.max(80, availableHeight * 0.8);
  const centeredLeft = minX + insetX + (availableWidth - nextWidth) / 2;
  const centeredTop = minY + insetY + (availableHeight - nextHeight) / 2;
  playerOverlay.style.left = `${centeredLeft}px`;
  playerOverlay.style.top = `${centeredTop}px`;
  playerOverlay.style.width = `${nextWidth}px`;
  playerOverlay.style.height = `${nextHeight}px`;
  playerOverlay.setAttribute("aria-hidden", "false");
  overlayDirty = false;

  const nextSrc = target.billboard.userData.project.videoSrc;
  if (playerElement.dataset.src !== nextSrc) {
    playerElement.dataset.src = nextSrc;
    playerElement.src = nextSrc;
    playerElement.currentTime = 0;
    playerElement.play().catch(() => {});
  }
};

const isCameraMoving = () =>
  cameraState.currentPosition.distanceToSquared(cameraState.goalPosition) > 0.0004 ||
  cameraState.currentTarget.distanceToSquared(cameraState.goalTarget) > 0.0004;

const applyCustomization = () => {
  scene.background.set(customization.bgColor);
  scene.fog.color.set(customization.fogColor);
  scene.fog.near = customization.fogNear;
  scene.fog.far = customization.fogFar;

  camera.fov = customization.cameraFov;
  camera.updateProjectionMatrix();
  syncCameraCartesianFromOrbit();

  cameraState.basePosition.set(
    customization.cameraX,
    customization.cameraY,
    customization.cameraZ
  );
  cameraState.baseTarget.set(
    customization.targetX,
    customization.targetY,
    customization.targetZ
  );
  if (!selectedBillboard) {
    cameraState.goalPosition.copy(cameraState.basePosition);
    cameraState.goalTarget.copy(cameraState.baseTarget);
  }

  ambientLight.intensity = customization.ambientIntensity;
  frontSpotLight.intensity = customization.frontLightIntensity;
  backLight.intensity = customization.backLightIntensity;
  roofLights.forEach((light) => {
    light.intensity = customization.roofLightIntensity;
  });

  buildingMaterials.forEach((material) => {
    material.color.set(customization.buildingColor);
    material.roughness = customization.buildingRoughness;
    material.metalness = customization.buildingMetalness;
    material.clearcoat = customization.buildingClearcoat;
    material.clearcoatRoughness = customization.buildingClearcoatRoughness;
    material.envMapIntensity = customization.buildingEnvMapIntensity;
    material.needsUpdate = true;
  });

  billboardTargets.forEach(({ pointLight, screenMaterial }) => {
    pointLight.intensity = customization.screenLightIntensity;
    screenMaterial.emissiveIntensity = customization.screenEmissiveIntensity;
    screenMaterial.needsUpdate = true;
  });

  interactionDirty = true;
  overlayDirty = true;
  occlusionDirty = true;
  labelDirty = true;
  syncCustomizeControls();
};

const onMouseMove = (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  interactionDirty = true;
  labelDirty = true;
};

const onTouch = (event) => {
  if (event.touches.length !== 1) {
    return;
  }
  event.preventDefault();
  pointer.x = (event.touches[0].pageX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.touches[0].pageY / window.innerHeight) * 2 + 1;
  interactionDirty = true;
  labelDirty = true;
};

window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("touchstart", onTouch, false);
window.addEventListener("touchmove", onTouch, false);

canvas.addEventListener("click", () => {
  if (aboutOpen) {
    return;
  }
  raycaster.setFromCamera(pointer, camera);
  if (editorState.mode === "edit") {
    dismissIntro();
    const editTargets = [...billboardMeshes, ...buildingSelectMeshes];
    const hit = raycaster.intersectObjects(editTargets)[0];
    if (!hit) {
      clearEditorPreview();
      return;
    }
    if (hit.object.userData?.screenId) {
      selectScreen(hit.object.userData.buildingId, hit.object.userData.screenId);
      clearEditorPreview();
      return;
    }
    if (hit.object.userData?.buildingId) {
      selectBuilding(hit.object.userData.buildingId);
      clearEditorPreview();
    }
    return;
  }
  const hit = raycaster.intersectObjects(billboardMeshes)[0];
  if (hit) {
    dismissIntro();
    editorState.previewScreenKey = null;
    selectedBillboard = hit.object;
    frameSelection(hit.object);
  }
});

panelClose.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  selectedBillboard = null;
  frameSelection(null);
});

aboutTrigger?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  dismissIntro();
  setCustomizeOpen(false);
  if (!aboutOpen && selectedBillboard) {
    selectedBillboard = null;
    frameSelection(null);
  }
  setAboutOpen(!aboutOpen);
});

aboutClose?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  setAboutOpen(false);
});

customizeTrigger?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  dismissIntro();
  setAboutOpen(false);
  setCustomizeOpen(!customizeOpen);
  syncCustomizeControls();
});

customizeClose?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  setCustomizeOpen(false);
});

cameraYawInput?.addEventListener("input", () => {
  updateCameraConfigFromInputs();
});

cameraPitchInput?.addEventListener("input", () => {
  updateCameraConfigFromInputs();
});

cameraDistanceInput?.addEventListener("input", () => {
  updateCameraConfigFromInputs();
});

cameraFovInput?.addEventListener("input", () => {
  updateCameraConfigFromInputs();
});

cameraPresetNameInput?.addEventListener("input", () => {
  sceneConfig.camera.presetName = cameraPresetNameInput.value;
  refreshEditorFromSceneConfig();
});

[cameraTargetXInput, cameraTargetYInput, cameraTargetZInput].forEach((input) => {
  input?.addEventListener("input", () => {
    updateCameraConfigFromInputs();
  });
});

editorModeSelect?.addEventListener("input", () => {
  setEditorMode(editorModeSelect.value);
  renderEditorControls();
});

cameraUseCurrentButton?.addEventListener("click", () => {
  if (editorState.mode === "edit") {
    syncSceneConfigCameraFromOrbitControls();
    return;
  }
  syncCameraOrbitFromCartesian();
  sceneConfig.camera.orbitYaw = customization.cameraYaw;
  sceneConfig.camera.orbitPitch = customization.cameraPitch;
  sceneConfig.camera.orbitDistance = customization.cameraDistance;
  sceneConfig.camera.fov = customization.cameraFov;
  sceneConfig.camera.target.x = customization.targetX;
  sceneConfig.camera.target.y = customization.targetY;
  sceneConfig.camera.target.z = customization.targetZ;
  refreshEditorFromSceneConfig();
});

cameraCopyDataButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(cameraDataOutput?.value ?? "");
  } catch {
    cameraDataOutput?.focus();
    cameraDataOutput?.select();
  }
});

configExportButton?.addEventListener("click", () => {
  downloadSceneConfig();
});

configImportButton?.addEventListener("click", () => {
  configImportInput?.click();
});

configImportInput?.addEventListener("change", async () => {
  const file = configImportInput.files?.[0];
  if (!file) {
    return;
  }
  try {
    const contents = await file.text();
    loadSceneConfigState(JSON.parse(contents));
  } catch (error) {
    console.error("Failed to import scene config", error);
  } finally {
    configImportInput.value = "";
  }
});

configResetButton?.addEventListener("click", () => {
  loadSceneConfigState(cloneSceneConfig(defaultSceneConfig));
});

buildingSelect?.addEventListener("input", () => {
  selectBuilding(buildingSelect.value);
});

buildingAddButton?.addEventListener("click", () => {
  const nextBuilding = createBuildingConfig();
  sceneConfig.buildings.push(nextBuilding);
  selectBuilding(nextBuilding.id);
  refreshEditorFromSceneConfig({ rebuildCity: true });
});

buildingDuplicateButton?.addEventListener("click", () => {
  const building = getSelectedBuildingConfig();
  if (!building) {
    return;
  }
  const duplicate = createBuildingConfig(building);
  sceneConfig.buildings.push(duplicate);
  selectBuilding(duplicate.id);
  refreshEditorFromSceneConfig({ rebuildCity: true });
});

buildingDeleteButton?.addEventListener("click", () => {
  const currentId = editorState.selectedBuildingId;
  if (!currentId) {
    return;
  }
  sceneConfig.buildings = sceneConfig.buildings.filter((building) => building.id !== currentId);
  editorState.selectedBuildingId = sceneConfig.buildings[0]?.id ?? null;
  editorState.selectedScreenId =
    sceneConfig.buildings[0]?.screens[0]?.id ?? null;
  clearEditorPreview();
  refreshEditorFromSceneConfig({ rebuildCity: true });
});

bindCheckboxInput(buildingEnabledInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.enabled = value;
  });
});
bindNumberInput(buildingXInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.position.x = value;
  });
});
bindNumberInput(buildingZInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.position.z = value;
  });
});
bindNumberInput(buildingRotationInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.rotationY = value;
  });
});
bindNumberInput(buildingWidthInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.dimensions.width = Math.max(0.2, value);
  });
});
bindNumberInput(buildingDepthInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.dimensions.depth = Math.max(0.2, value);
  });
});
bindNumberInput(buildingHeightInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.dimensions.height = Math.max(0.5, value);
  });
});
bindCheckboxInput(buildingCapEnabledInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.cap.enabled = value;
  });
});
bindNumberInput(buildingCapWidthInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.cap.width = Math.max(0.1, value);
  });
});
bindNumberInput(buildingCapDepthInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.cap.depth = Math.max(0.1, value);
  });
});
bindNumberInput(buildingCapHeightInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.cap.height = Math.max(0.05, value);
  });
});
bindCheckboxInput(buildingCoreEnabledInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.sideCore.enabled = value;
  });
});
bindNumberInput(buildingCoreWidthInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.sideCore.width = Math.max(0.05, value);
  });
});
bindNumberInput(buildingCoreDepthInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.sideCore.depth = Math.max(0.05, value);
  });
});
bindNumberInput(buildingCoreHeightInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.sideCore.height = Math.max(0.05, value);
  });
});
bindNumberInput(buildingCoreOffsetXInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.sideCore.offsetX = value;
  });
});
bindNumberInput(buildingCoreOffsetZInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.sideCore.offsetZ = value;
  });
});
bindCheckboxInput(buildingLabelEnabledInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.label.enabled = value;
  });
});
buildingLabelTextInput?.addEventListener("input", () => {
  mutateSelectedBuilding((building) => {
    building.label.text = buildingLabelTextInput.value;
  });
});
buildingLabelColorInput?.addEventListener("input", () => {
  mutateSelectedBuilding((building) => {
    building.label.color = buildingLabelColorInput.value;
  });
});
bindNumberInput(buildingLabelOffsetYInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.label.offsetY = value;
  });
});
bindCheckboxInput(buildingBeaconEnabledInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.beacon.enabled = value;
  });
});
buildingBeaconColorInput?.addEventListener("input", () => {
  mutateSelectedBuilding((building) => {
    building.beacon.color = buildingBeaconColorInput.value;
  });
});
bindNumberInput(buildingBeaconOffsetYInput, (value) => {
  mutateSelectedBuilding((building) => {
    building.beacon.offsetY = value;
  });
});

screenSelect?.addEventListener("input", () => {
  const building = getSelectedBuildingConfig();
  if (!building) {
    return;
  }
  selectScreen(building.id, screenSelect.value);
});

screenAddButton?.addEventListener("click", () => {
  const building = getSelectedBuildingConfig();
  if (!building) {
    return;
  }
  const screen = createScreenConfig(building);
  building.screens.push(screen);
  selectScreen(building.id, screen.id);
  refreshEditorFromSceneConfig({ rebuildCity: true });
});

screenDuplicateButton?.addEventListener("click", () => {
  const building = getSelectedBuildingConfig();
  const screen = getSelectedScreenConfig();
  if (!building || !screen) {
    return;
  }
  const duplicate = createScreenConfig(building, screen);
  building.screens.push(duplicate);
  selectScreen(building.id, duplicate.id);
  refreshEditorFromSceneConfig({ rebuildCity: true });
});

screenDeleteButton?.addEventListener("click", () => {
  const building = getSelectedBuildingConfig();
  const currentId = editorState.selectedScreenId;
  if (!building || !currentId) {
    return;
  }
  building.screens = building.screens.filter((screen) => screen.id !== currentId);
  editorState.selectedScreenId = building.screens[0]?.id ?? null;
  clearEditorPreview();
  refreshEditorFromSceneConfig({ rebuildCity: true });
});

bindCheckboxInput(screenEnabledInput, (value) => {
  mutateSelectedScreen((screen) => {
    screen.enabled = value;
  });
});
screenProjectSelect?.addEventListener("input", () => {
  mutateSelectedScreen((screen) => {
    screen.projectSlug = screenProjectSelect.value;
  });
});
screenSideSelect?.addEventListener("input", () => {
  mutateSelectedScreen((screen) => {
    screen.side = screenSideSelect.value;
  });
});
bindNumberInput(screenWidthInput, (value) => {
  mutateSelectedScreen((screen) => {
    screen.width = Math.max(0.2, value);
  });
});
bindNumberInput(screenHeightInput, (value) => {
  mutateSelectedScreen((screen) => {
    screen.height = Math.max(0.2, value);
  });
});
bindNumberInput(screenTopOffsetInput, (value) => {
  mutateSelectedScreen((screen) => {
    screen.topOffset = Math.max(0.02, value);
  });
});
bindNumberInput(screenOffsetAlongInput, (value) => {
  mutateSelectedScreen((screen) => {
    screen.offsetAlongFace = value;
  });
});
bindNumberInput(screenOffsetOutwardInput, (value) => {
  mutateSelectedScreen((screen) => {
    screen.offsetOutward = value;
  });
});

toolPreviewScreenButton?.addEventListener("click", () => {
  const building = getSelectedBuildingConfig();
  const screen = getSelectedScreenConfig();
  if (!building || !screen) {
    return;
  }
  const key = getScreenKey(building.id, screen.id);
  const target = screenTargetsByKey.get(key);
  if (!target) {
    return;
  }
  editorState.previewScreenKey = key;
  selectedBillboard = target.billboard;
  updateOrbitControlsEnabledState();
  frameSelection(target.billboard);
});

toolTopScreenButton?.addEventListener("click", () => {
  mutateSelectedScreen((screen) => {
    screen.topOffset = 0.18;
  });
});

toolAlignScreenButton?.addEventListener("click", () => {
  const building = getSelectedBuildingConfig();
  if (!building) {
    return;
  }
  mutateSelectedScreen((screen) => {
    screen.side = getCameraFacingSideForBuilding(building);
    screen.offsetAlongFace = 0;
  });
});

sceneBgColorInput?.addEventListener("input", () => {
  sceneConfig.scene.bgColor = sceneBgColorInput.value;
  refreshEditorFromSceneConfig({ syncView: true });
});
sceneFogColorInput?.addEventListener("input", () => {
  sceneConfig.scene.fogColor = sceneFogColorInput.value;
  refreshEditorFromSceneConfig({ syncView: true });
});
bindNumberInput(sceneFogNearInput, (value) => {
  sceneConfig.scene.fogNear = value;
  refreshEditorFromSceneConfig({ syncView: true });
});
bindNumberInput(sceneFogFarInput, (value) => {
  sceneConfig.scene.fogFar = value;
  refreshEditorFromSceneConfig({ syncView: true });
});
bindNumberInput(sceneAmbientInput, (value) => {
  sceneConfig.scene.ambientIntensity = value;
  refreshEditorFromSceneConfig({ syncView: true });
});
bindNumberInput(sceneFrontLightInput, (value) => {
  sceneConfig.scene.frontLightIntensity = value;
  refreshEditorFromSceneConfig({ syncView: true });
});
bindNumberInput(sceneBackLightInput, (value) => {
  sceneConfig.scene.backLightIntensity = value;
  refreshEditorFromSceneConfig({ syncView: true });
});

toolFaceBuildingButton?.addEventListener("click", () => {
  mutateSelectedBuilding((building) => {
    building.rotationY = Math.atan2(
      camera.position.x - building.position.x,
      camera.position.z - building.position.z
    );
  });
});

toolRebalanceHeightsButton?.addEventListener("click", () => {
  const center = new THREE.Vector2(0, 0);
  sceneConfig.buildings.forEach((building) => {
    const distance = center.distanceTo(new THREE.Vector2(building.position.x, building.position.z));
    const factor = THREE.MathUtils.clamp(1 - distance / 6.5, 0.45, 1);
    building.dimensions.height = Number((4.8 + factor * 5.6).toFixed(2));
    if (building.cap.enabled) {
      building.cap.height = Number((0.22 + factor * 0.34).toFixed(2));
    }
  });
  refreshEditorFromSceneConfig({ rebuildCity: true });
});

toolDistributeRingButton?.addEventListener("click", () => {
  const radius = 4.6;
  sceneConfig.buildings.forEach((building, index) => {
    const angle = (index / Math.max(1, sceneConfig.buildings.length)) * Math.PI * 2;
    building.position.x = Number((Math.sin(angle) * radius).toFixed(2));
    building.position.z = Number((Math.cos(angle) * radius * 0.8).toFixed(2));
    building.rotationY = Math.atan2(-building.position.x, -building.position.z);
    building.key = getBuildingKey({ x: building.position.x, z: building.position.z });
  });
  refreshEditorFromSceneConfig({ rebuildCity: true });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && editorState.mode === "edit" && editorState.previewScreenKey) {
    clearEditorPreview();
    return;
  }
  if (event.key === "Escape" && customizeOpen) {
    setCustomizeOpen(false);
    return;
  }
  if (event.key === "Escape" && aboutOpen) {
    setAboutOpen(false);
    return;
  }
  if (event.key === "Escape" && selectedBillboard) {
    selectedBillboard = null;
    frameSelection(null);
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
  updateQualityMode();
  interactionDirty = true;
  labelDirty = true;
  overlayDirty = true;
  occlusionDirty = true;
  resizeDirty = true;
});

init();
updatePanel(null);
refreshVideoTargets();
updateQualityMode();
applyCustomization();
setAboutOpen(false);
setCustomizeOpen(false);
setEditorMode(sceneConfig.camera.mode ?? "browse");
renderEditorControls();
restoreIntro();

const animate = () => {
  const elapsed = clock.getElapsedTime();
  requestAnimationFrame(animate);

  updateIntroReturn();
  updateIntroParallax();
  updateRoadLines(elapsed);

  const previewingInEditMode = editorState.mode === "edit" && Boolean(editorState.previewScreenKey);
  let cameraMovingBeforeRender = false;
  let cameraMovingAfterRender = false;

  if (editorState.mode === "edit" && !previewingInEditMode) {
    orbitControls.update();
    syncCameraStateFromCurrentView();
    if (hoveredBillboard) {
      setHover(null);
    }
    interactionDirty = false;
  } else {
    updateOverviewMotion();
    cameraMovingBeforeRender = isCameraMoving();
    const shouldRaycast =
      editorState.mode === "browse" && !selectedBillboard && !aboutOpen;
    if (shouldRaycast && (interactionDirty || cameraMovingBeforeRender || resizeDirty)) {
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(billboardMeshes)[0];
      setHover(hit?.object ?? null);
      interactionDirty = false;
    } else if ((!shouldRaycast || editorState.mode === "edit") && hoveredBillboard) {
      setHover(null);
    }

    cameraState.currentPosition.lerp(cameraState.goalPosition, 0.08);
    cameraState.currentTarget.lerp(cameraState.goalTarget, 0.1);
    camera.position.copy(cameraState.currentPosition);
    camera.lookAt(cameraState.currentTarget);
    cameraMovingAfterRender = isCameraMoving();
  }

  updateBillboardFeedback(elapsed);

  if (hoveredBillboard && (labelDirty || cameraMovingAfterRender || resizeDirty)) {
    updateLabelPosition();
  }

  updateBeaconLabels();
  if (
    (selectedBillboard && editorState.mode === "browse") ||
    previewingInEditMode
  ) {
    if (occlusionDirty || cameraMovingAfterRender || resizeDirty) {
      updateFocusedOcclusionTargets();
      occlusionDirty = false;
    }
  } else if (occlusionFocused || occlusionDirty) {
    updateFocusedOcclusionTargets();
    occlusionDirty = false;
  }
  updateBuildingOcclusion();
  if (
    selectedBillboard ||
    overlayDirty ||
    playerOverlay?.getAttribute("aria-hidden") === "false" ||
    cameraMovingAfterRender ||
    resizeDirty
  ) {
    updatePlayerOverlay();
  }

  renderer.render(scene, camera);
  resizeDirty = false;
};

frameSelection(null);
animate();
