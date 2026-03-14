import "./style.css";

import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { projects } from "./projects.js";

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
frontSpotLight.shadow.mapSize.width = 2048;
frontSpotLight.shadow.mapSize.height = 2048;
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
const occlusionRight = new THREE.Vector3();
const occlusionUp = new THREE.Vector3();
const occlusionTargetPoint = new THREE.Vector3();
const occlusionOffsets = [
  [0, 0],
  [-0.46, -0.46],
  [0.46, -0.46],
  [-0.46, 0.46],
  [0.46, 0.46]
];

const billboardMeshes = [];
const billboardTargets = [];
const buildings = [];
const buildingMaterials = [];
const roofLights = [];
const sharedVideoAssets = new Map();
let hoveredBillboard = null;
let selectedBillboard = null;
let settledRotationY = 0;
let settledRotationX = 0.18;

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
  targetY: 3.6,
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

const mathRandom = (num = 8) => -Math.random() * num + Math.random() * num;

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
  video.preload = "auto";
  video.crossOrigin = "anonymous";

  const texture = new THREE.VideoTexture(video);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const asset = { video, texture };
  sharedVideoAssets.set(project.videoSrc, asset);
  return asset;
};

const createPosterTexture = (project) => {
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
  return texture;
};

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

const addScreenToBuilding = (entry, project) => {
  const asset = makeVideoAsset(project);
  const posterTexture = createPosterTexture(project);
  const width = entry.screenWidth;
  const height = entry.screenHeight;
  const mount = getScreenMount(entry);

  const screenMount = new THREE.Group();
  screenMount.position.copy(mount.position);
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
    screenMaterial,
    isVideoActive: false
  });
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
  const buildingEntries = buildings.filter((entry) => entry.group);

  if (!selectedBillboard) {
    buildingEntries.forEach((entry) => {
      setBuildingVisibilityTarget(entry, 1);
    });
    return;
  }

  const selectedEntry = selectedBillboard.userData.buildingEntry;
  if (!selectedEntry) {
    return;
  }

  selectedBillboard.getWorldPosition(tempVector);
  selectedBillboard.getWorldQuaternion(tempQuaternion);
  occlusionRight.set(1, 0, 0).applyQuaternion(tempQuaternion).normalize();
  occlusionUp.set(0, 1, 0).applyQuaternion(tempQuaternion).normalize();

  const geometryWidth = selectedBillboard.geometry.parameters.width;
  const geometryHeight = selectedBillboard.geometry.parameters.height;
  const halfWidth = (geometryWidth * selectedBillboard.scale.x) / 2;
  const halfHeight = (geometryHeight * selectedBillboard.scale.y) / 2;

  buildingEntries.forEach((entry) => {
    if (entry === selectedEntry) {
      setBuildingVisibilityTarget(entry, 1);
      return;
    }

    entry.worldBounds.copy(entry.localBounds).applyMatrix4(entry.group.matrixWorld);
    entry.worldBounds.getCenter(occlusionCenter);
    let isBlocker = false;

    for (const [offsetX, offsetY] of occlusionOffsets) {
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
      const hitPoint = occlusionRay.intersectBox(entry.worldBounds, occlusionHit);
      const hitDistance = hitPoint ? hitPoint.distanceTo(occlusionLine.start) : Infinity;

      if (isBetweenCameraAndScreen && hitDistance < focusDistance - 0.12) {
        isBlocker = true;
        break;
      }
    }

    setBuildingVisibilityTarget(entry, isBlocker ? 0 : 1);
  });
};

const updateBuildingOcclusion = () => {
  buildings
    .filter((entry) => entry.group)
    .forEach((entry) => {
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
        material.needsUpdate = true;
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

  const beaconMaterial = redBeaconMaterial.clone();
  beaconMaterial.transparent = true;
  beaconMaterial.opacity = 1;
  fadeMaterials.push(beaconMaterial);
  const roofBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), beaconMaterial);
  roofBeacon.position.set(0, config.height + config.capHeight + 0.18, 0);
  group.add(roofBeacon);
  renderMeshes.push(roofBeacon);

  const roofGlow = new THREE.PointLight("#ff4a73", customization.roofLightIntensity, 3.4, 2);
  roofGlow.position.set(0, config.height + config.capHeight + 0.22, 0);
  group.add(roofGlow);
  roofLights.push(roofGlow);

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
    roofPointLights: [roofGlow],
    localBounds,
    worldBounds: new THREE.Box3(),
    currentOpacity: 1,
    targetOpacity: 1
  });
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

const createParticles = () => {
  const particularMaterial = new THREE.MeshToonMaterial({
    color: 0xffff99,
    side: THREE.DoubleSide
  });
  const particularGeometry = new THREE.CircleGeometry(0.015, 4);
  for (let i = 0; i < 260; i += 1) {
    const particle = new THREE.Mesh(particularGeometry, particularMaterial);
    particle.position.set(mathRandom(6), mathRandom(6), mathRandom(6));
    particle.rotation.set(mathRandom(), mathRandom(), mathRandom());
    smoke.add(particle);
  }
  smoke.position.y = 2;
};

const createRoadLines = () => {
  const colors = [0xffff66, 0xffffff, 0xff8e5c];
  for (let i = 0; i < 28; i += 1) {
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
    buildings.push(line);
  }
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

const init = () => {
  createGround();
  createParticles();
  createRoadLines();
  cityLayout.forEach(createBuilding);

  buildings
    .filter((entry) => entry.group)
    .sort((a, b) => {
      const radiusA = Math.hypot(a.x, a.z);
      const radiusB = Math.hypot(b.x, b.z);
      return radiusB - radiusA || b.height - a.height;
    })
    .forEach((entry, index) => {
      addScreenToBuilding(entry, projects[index % projects.length]);
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
    target.video.play().catch(() => {});
    return;
  }

  target.video.pause();
  target.screenMaterial.map = target.posterTexture;
  target.screenMaterial.emissiveMap = target.posterTexture;
  target.screenMaterial.needsUpdate = true;
};

const refreshVideoTargets = () => {
  billboardTargets.forEach((target) => {
    const active =
      !selectedBillboard ||
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
  refreshVideoTargets();
};

const updateBillboardFeedback = (elapsed) => {
  billboardTargets.forEach(({ billboard, frame, halo, pointLight, screenMaterial, buildingEntry }) => {
    const isHovered = hoveredBillboard === billboard;
    const isSelected = selectedBillboard === billboard;
    const occlusionFactor = buildingEntry?.currentOpacity ?? 1;
    const hiddenByOcclusion = !isSelected && occlusionFactor < 0.02;
    const pulse = 1 + Math.sin(elapsed * 2) * 0.02;
    const baseScale = isSelected ? customization.selectedScale : isHovered ? 1.05 : 1;
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
      (isSelected ? 0.28 : isHovered ? 0.22 : 0.18) * occlusionFactor,
      0.12
    );

    pointLight.intensity = THREE.MathUtils.lerp(
      pointLight.intensity,
      (isSelected ? 1.8 : isHovered ? 1.4 : 1.2) * occlusionFactor,
      0.12
    );

    frame.material.emissiveIntensity = THREE.MathUtils.lerp(
      frame.material.emissiveIntensity,
      (isSelected ? 0.18 : isHovered ? 0.1 : 0.06) * occlusionFactor,
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
};

const updateOverviewMotion = () => {
  if (selectedBillboard) {
    city.rotation.y += (settledRotationY - city.rotation.y) * 0.08;
    city.rotation.x += (settledRotationX - city.rotation.x) * 0.08;
    updateSelectedFrame();
    return;
  }

  const lateralOffset = -pointer.x * customization.rotateYStrength * 0.55;
  const verticalOffset = -pointer.y * customization.rotateXStrength * 0.16;
  const targetRotationY = -pointer.x * customization.rotateYStrength * 0.07;
  const targetRotationX = THREE.MathUtils.clamp(
    0.22 - pointer.y * customization.rotateXStrength * 0.035,
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
    cameraState.baseTarget.y + verticalOffset * 0.28,
    cameraState.baseTarget.z
  );

  city.rotation.y += (targetRotationY - city.rotation.y) * customization.rotationLerp;
  city.rotation.x += (targetRotationX - city.rotation.x) * customization.rotationLerp;
  settledRotationY = city.rotation.y;
  settledRotationX = city.rotation.x;
};

const updateRoadLines = (elapsed) => {
  city.children.forEach((child) => {
    if (!child.userData?.lane) {
      return;
    }
    if (child.userData.lane === "x") {
      child.position.x += child.userData.speed;
      if (child.position.x > child.userData.amplitude) {
        child.position.x = -child.userData.amplitude;
      }
    } else {
      child.position.z += child.userData.speed;
      if (child.position.z > child.userData.amplitude) {
        child.position.z = -child.userData.amplitude;
      }
    }
  });
  smoke.rotation.y += 0.003;
  smoke.rotation.x += 0.0015;
  smoke.children.forEach((particle, index) => {
    particle.position.y += Math.sin(elapsed * 0.8 + index) * 0.0006;
  });
};

const applyCustomization = () => {
  scene.background.set(customization.bgColor);
  scene.fog.color.set(customization.fogColor);
  scene.fog.near = customization.fogNear;
  scene.fog.far = customization.fogFar;

  camera.fov = customization.cameraFov;
  camera.updateProjectionMatrix();

  cameraState.basePosition.set(
    customization.cameraX,
    customization.cameraY,
    customization.cameraZ
  );
  cameraState.baseTarget.set(0, customization.targetY, 0);
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
};

const onMouseMove = (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

const onTouch = (event) => {
  if (event.touches.length !== 1) {
    return;
  }
  event.preventDefault();
  pointer.x = (event.touches[0].pageX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.touches[0].pageY / window.innerHeight) * 2 + 1;
};

const resumeVideos = () => {
  sharedVideoAssets.forEach(({ video }) => {
    video.play().catch(() => {});
  });
};

window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("touchstart", onTouch, false);
window.addEventListener("touchmove", onTouch, false);
window.addEventListener("pointerdown", resumeVideos, { once: true });

window.addEventListener("click", () => {
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(billboardMeshes)[0];
  if (hit) {
    selectedBillboard = hit.object;
    frameSelection(hit.object);
  }
});

panelClose.addEventListener("click", () => {
  selectedBillboard = null;
  frameSelection(null);
});

window.addEventListener("keydown", (event) => {
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
});

init();
updatePanel(null);
refreshVideoTargets();
resumeVideos();
applyCustomization();

const animate = () => {
  const elapsed = clock.getElapsedTime();
  requestAnimationFrame(animate);

  updateOverviewMotion();
  updateRoadLines(elapsed);
  updateFocusedOcclusionTargets();
  updateBuildingOcclusion();

  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(billboardMeshes)[0];
  setHover(hit?.object ?? null);
  updateLabelPosition();
  updateBillboardFeedback(elapsed);

  cameraState.currentPosition.lerp(cameraState.goalPosition, 0.08);
  cameraState.currentTarget.lerp(cameraState.goalTarget, 0.1);
  camera.position.copy(cameraState.currentPosition);
  camera.lookAt(cameraState.currentTarget);

  renderer.render(scene, camera);
};

frameSelection(null);
animate();
