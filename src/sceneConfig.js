export const SCENE_CONFIG_STORAGE_KEY = "lab-city-scene-config-v1";

const mutedLeftTowerKeys = new Set(["-4,-3", "-3,0"]);
const removedBackScreenTowerKeys = new Set(["-1,-4"]);
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

const baseBuildings = [
  { x: -4, z: -3, width: 1.4, depth: 1.3, height: 5.4, capHeight: 0.4, capWidth: 1.0, capDepth: 1.0, sideCoreWidth: 0.34, sideCoreHeight: 2.8, sideCoreDepth: 0.6, sideCoreOffset: -0.55, rotationY: 0.02, screenWidth: 1.02, screenHeight: 0.66 },
  { x: -3, z: 0, width: 1.2, depth: 1.2, height: 4.6, capHeight: 0.28, capWidth: 0.9, capDepth: 0.9, sideCoreWidth: 0.28, sideCoreHeight: 2.2, sideCoreDepth: 0.5, sideCoreOffset: 0.48, rotationY: -0.04, screenWidth: 0.92, screenHeight: 1.18 },
  { x: -3, z: 2, width: 1.4, depth: 1.3, height: 6.6, capHeight: 0.42, capWidth: 1.1, capDepth: 1.02, sideCoreWidth: 0.34, sideCoreHeight: 3.1, sideCoreDepth: 0.55, sideCoreOffset: -0.5, rotationY: 0.06, screenWidth: 1.08, screenHeight: 0.68 },
  { x: -1, z: -4, width: 1.1, depth: 1.1, height: 8.8, capHeight: 0.5, capWidth: 0.88, capDepth: 0.82, sideCoreWidth: 0.28, sideCoreHeight: 3.4, sideCoreDepth: 0.46, sideCoreOffset: 0.46, rotationY: -0.08, screenWidth: 0.92, screenHeight: 1.42 },
  { x: -1, z: -1, width: 1.6, depth: 1.45, height: 7.2, capHeight: 0.46, capWidth: 1.2, capDepth: 1.1, sideCoreWidth: 0.44, sideCoreHeight: 3.0, sideCoreDepth: 0.68, sideCoreOffset: -0.58, rotationY: 0.02, screenWidth: 1.18, screenHeight: 0.72 },
  { x: -1, z: 2, width: 1.22, depth: 1.16, height: 6.1, capHeight: 0.3, capWidth: 0.88, capDepth: 0.8, sideCoreWidth: 0.22, sideCoreHeight: 2.4, sideCoreDepth: 0.42, sideCoreOffset: 0.42, rotationY: -0.04, screenWidth: 0.92, screenHeight: 1.22 },
  { x: 1, z: -3, width: 1.35, depth: 1.24, height: 10.4, capHeight: 0.46, capWidth: 0.98, capDepth: 0.9, sideCoreWidth: 0.26, sideCoreHeight: 4.2, sideCoreDepth: 0.42, sideCoreOffset: -0.44, rotationY: 0.06, screenWidth: 0.96, screenHeight: 1.5 },
  { x: 1, z: 0, width: 1.84, depth: 1.58, height: 8.4, capHeight: 0.5, capWidth: 1.34, capDepth: 1.2, sideCoreWidth: 0.46, sideCoreHeight: 3.2, sideCoreDepth: 0.62, sideCoreOffset: 0.66, rotationY: -0.06, screenWidth: 1.28, screenHeight: 0.78 },
  { x: 1, z: 3, width: 1.3, depth: 1.22, height: 5.2, capHeight: 0.32, capWidth: 0.94, capDepth: 0.86, sideCoreWidth: 0.24, sideCoreHeight: 2.2, sideCoreDepth: 0.44, sideCoreOffset: -0.42, rotationY: 0.08, screenWidth: 0.96, screenHeight: 0.62 },
  { x: 3, z: -4, width: 1.52, depth: 1.36, height: 9.4, capHeight: 0.46, capWidth: 1.08, capDepth: 1.0, sideCoreWidth: 0.38, sideCoreHeight: 3.6, sideCoreDepth: 0.56, sideCoreOffset: 0.56, rotationY: -0.08, screenWidth: 1.12, screenHeight: 0.72 },
  { x: 3, z: -1, width: 1.24, depth: 1.12, height: 7.4, capHeight: 0.36, capWidth: 0.92, capDepth: 0.84, sideCoreWidth: 0.24, sideCoreHeight: 2.8, sideCoreDepth: 0.4, sideCoreOffset: -0.38, rotationY: 0.04, screenWidth: 0.94, screenHeight: 1.24 },
  { x: 3, z: 2, width: 1.62, depth: 1.42, height: 6.6, capHeight: 0.38, capWidth: 1.16, capDepth: 1.02, sideCoreWidth: 0.36, sideCoreHeight: 2.6, sideCoreDepth: 0.56, sideCoreOffset: 0.54, rotationY: -0.04, screenWidth: 1.16, screenHeight: 0.72 }
];

const maxLayoutRadius = Math.max(...baseBuildings.map((config) => Math.hypot(config.x, config.z)));

const computeOutwardRotation = (x, z, organicOffset = 0) => {
  const length = Math.hypot(x, z);
  if (!length) {
    return organicOffset;
  }
  return Math.atan2(x / length, z / length) + organicOffset * 0.45;
};

const getBuildingKey = ({ x, z }) => `${x},${z}`;

const getVisibleScreenSide = (building, camera) => {
  const toCamera = {
    x: camera.x - building.position.x,
    z: camera.z - building.position.z
  };
  const length = Math.hypot(toCamera.x, toCamera.z) || 1;
  const localX = (toCamera.x / length) * Math.cos(-building.rotationY) - (toCamera.z / length) * Math.sin(-building.rotationY);
  const localZ = (toCamera.x / length) * Math.sin(-building.rotationY) + (toCamera.z / length) * Math.cos(-building.rotationY);
  const scores = [
    { side: "front", score: localZ - 0.06 },
    { side: "back", score: -localZ - 0.25 },
    { side: "right", score: localX + 0.08 },
    { side: "left", score: -localX + 0.08 }
  ];
  return scores.sort((a, b) => b.score - a.score)[0].side;
};

const getHomeScreenScore = (entry) => {
  const forwardness = entry.position.z * 2.4;
  const centerBias = -Math.abs(entry.position.x) * 0.35;
  const heightBias = entry.dimensions.height * 0.45;
  const prominenceBias = entry.prominence * 0.25;
  return forwardness + centerBias + heightBias + prominenceBias;
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const normalizeNumber = (value, fallback) => (Number.isFinite(Number(value)) ? Number(value) : fallback);
const normalizeString = (value, fallback) => (typeof value === "string" ? value : fallback);
const normalizeBool = (value, fallback) => (typeof value === "boolean" ? value : fallback);

export const createDefaultSceneConfig = (projects) => {
  const defaultCamera = {
    mode: "browse",
    presetName: "Current framing",
    orbitYaw: 0.34,
    orbitPitch: 3.77,
    orbitDistance: 16.74,
    target: { x: 0, y: 3.6, z: 0 },
    fov: 27.8
  };

  const buildings = baseBuildings.map((config, index) => {
    const radius = Math.hypot(config.x, config.z);
    const radialFactor = 1 - radius / maxLayoutRadius;
    const buildingHeight = config.height * (0.76 + (1.22 - 0.76) * radialFactor);
    const capHeight = config.capHeight * (0.9 + (1.18 - 0.9) * radialFactor);
    const sideCoreHeight = config.sideCoreHeight * (0.9 + (1.12 - 0.9) * radialFactor);
    const screenHeight = config.screenHeight * (0.92 + (1.08 - 0.92) * radialFactor);
    const screenWidth = config.screenWidth * (0.95 + (1.04 - 0.95) * radialFactor);
    const key = getBuildingKey(config);

    return {
      id: `tower-${String(index + 1).padStart(2, "0")}`,
      key,
      enabled: true,
      position: { x: config.x, z: config.z },
      rotationY: computeOutwardRotation(config.x, config.z, config.rotationY),
      dimensions: {
        width: config.width,
        depth: config.depth,
        height: buildingHeight
      },
      cap: {
        enabled: config.capHeight > 0,
        width: config.capWidth,
        depth: config.capDepth,
        height: capHeight
      },
      sideCore: {
        enabled: config.sideCoreWidth > 0,
        width: config.sideCoreWidth,
        depth: config.sideCoreDepth,
        height: sideCoreHeight,
        offsetX: config.sideCoreOffset,
        offsetZ: -config.depth * 0.16
      },
      label: {
        enabled: !mutedLeftTowerKeys.has(key),
        text: beaconLabelWords[index % beaconLabelWords.length],
        color: "#ffffff",
        offsetY: 0.44
      },
      beacon: {
        enabled: !mutedLeftTowerKeys.has(key),
        color: "#ff4a73",
        offsetY: 0.22
      },
      defaultScreen: {
        width: screenWidth,
        height: screenHeight
      },
      prominence: buildingHeight + radialFactor * 4,
      screens: []
    };
  });

  const sortedByVisibility = [...buildings].sort((a, b) => {
    return getHomeScreenScore(b) - getHomeScreenScore(a) || b.dimensions.height - a.dimensions.height;
  });
  const hiddenHomeEntry = sortedByVisibility[sortedByVisibility.length - 1];

  sortedByVisibility
    .filter((entry) => entry !== hiddenHomeEntry)
    .forEach((entry, index) => {
      if (mutedLeftTowerKeys.has(entry.key) || removedBackScreenTowerKeys.has(entry.key)) {
        return;
      }
      const project = projects[index % projects.length];
      entry.label.text = project.title;
      entry.screens.push({
        id: `${entry.id}-screen-01`,
        enabled: true,
        projectSlug: project.slug,
        side: getVisibleScreenSide(entry, { x: 0.1, z: 16.7 }),
        width: entry.defaultScreen.width,
        height: entry.defaultScreen.height,
        topOffset: 0.28,
        offsetAlongFace: 0,
        offsetOutward: 0.03
      });
    });

  return {
    meta: {
      version: 2,
      updatedAt: new Date().toISOString()
    },
    camera: defaultCamera,
    scene: {
      bgColor: "#f02050",
      fogColor: "#f02050",
      fogNear: 11.6,
      fogFar: 20.6,
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
    },
    buildings
  };
};

export const cloneSceneConfig = (config) => clone(config);

export const normalizeSceneConfig = (input, projects) => {
  const defaults = createDefaultSceneConfig(projects);
  if (!input || typeof input !== "object") {
    return defaults;
  }

  const config = clone(defaults);
  const source = input;

  config.meta.updatedAt = new Date().toISOString();
  config.camera.mode = normalizeString(source.camera?.mode, defaults.camera.mode);
  config.camera.presetName = normalizeString(source.camera?.presetName, defaults.camera.presetName);
  config.camera.orbitYaw = normalizeNumber(source.camera?.orbitYaw, defaults.camera.orbitYaw);
  config.camera.orbitPitch = normalizeNumber(source.camera?.orbitPitch, defaults.camera.orbitPitch);
  config.camera.orbitDistance = normalizeNumber(source.camera?.orbitDistance, defaults.camera.orbitDistance);
  config.camera.target.x = normalizeNumber(source.camera?.target?.x, defaults.camera.target.x);
  config.camera.target.y = normalizeNumber(source.camera?.target?.y, defaults.camera.target.y);
  config.camera.target.z = normalizeNumber(source.camera?.target?.z, defaults.camera.target.z);
  config.camera.fov = normalizeNumber(source.camera?.fov, defaults.camera.fov);

  Object.keys(config.scene).forEach((key) => {
    config.scene[key] = normalizeNumber(source.scene?.[key], defaults.scene[key]);
    if (typeof defaults.scene[key] === "string") {
      config.scene[key] = normalizeString(source.scene?.[key], defaults.scene[key]);
    }
  });

  const defaultBuildingById = new Map(defaults.buildings.map((building) => [building.id, building]));
  config.buildings = Array.isArray(source.buildings)
    ? source.buildings.map((building, index) => {
        const fallback = defaultBuildingById.get(building.id) ?? defaults.buildings[index] ?? defaults.buildings[0];
        return {
          id: normalizeString(building.id, fallback.id),
          key: normalizeString(building.key, fallback.key),
          enabled: normalizeBool(building.enabled, fallback.enabled),
          position: {
            x: normalizeNumber(building.position?.x, fallback.position.x),
            z: normalizeNumber(building.position?.z, fallback.position.z)
          },
          rotationY: normalizeNumber(building.rotationY, fallback.rotationY),
          dimensions: {
            width: normalizeNumber(building.dimensions?.width, fallback.dimensions.width),
            depth: normalizeNumber(building.dimensions?.depth, fallback.dimensions.depth),
            height: normalizeNumber(building.dimensions?.height, fallback.dimensions.height)
          },
          cap: {
            enabled: normalizeBool(building.cap?.enabled, fallback.cap.enabled),
            width: normalizeNumber(building.cap?.width, fallback.cap.width),
            depth: normalizeNumber(building.cap?.depth, fallback.cap.depth),
            height: normalizeNumber(building.cap?.height, fallback.cap.height)
          },
          sideCore: {
            enabled: normalizeBool(building.sideCore?.enabled, fallback.sideCore.enabled),
            width: normalizeNumber(building.sideCore?.width, fallback.sideCore.width),
            depth: normalizeNumber(building.sideCore?.depth, fallback.sideCore.depth),
            height: normalizeNumber(building.sideCore?.height, fallback.sideCore.height),
            offsetX: normalizeNumber(building.sideCore?.offsetX, fallback.sideCore.offsetX),
            offsetZ: normalizeNumber(building.sideCore?.offsetZ, fallback.sideCore.offsetZ)
          },
          label: {
            enabled: normalizeBool(building.label?.enabled, fallback.label.enabled),
            text: normalizeString(building.label?.text, fallback.label.text),
            color: normalizeString(building.label?.color, fallback.label.color),
            offsetY: normalizeNumber(building.label?.offsetY, fallback.label.offsetY)
          },
          beacon: {
            enabled: normalizeBool(building.beacon?.enabled, fallback.beacon.enabled),
            color: normalizeString(building.beacon?.color, fallback.beacon.color),
            offsetY: normalizeNumber(building.beacon?.offsetY, fallback.beacon.offsetY)
          },
          defaultScreen: {
            width: normalizeNumber(building.defaultScreen?.width, fallback.defaultScreen.width),
            height: normalizeNumber(building.defaultScreen?.height, fallback.defaultScreen.height)
          },
          prominence: normalizeNumber(building.prominence, fallback.prominence),
          screens: Array.isArray(building.screens)
            ? building.screens.map((screen, screenIndex) => ({
                id: normalizeString(screen.id, `${fallback.id}-screen-${String(screenIndex + 1).padStart(2, "0")}`),
                enabled: normalizeBool(screen.enabled, true),
                projectSlug: normalizeString(screen.projectSlug, projects[screenIndex % projects.length]?.slug ?? projects[0].slug),
                side: normalizeString(screen.side, "front"),
                width: normalizeNumber(screen.width, fallback.defaultScreen.width),
                height: normalizeNumber(screen.height, fallback.defaultScreen.height),
                topOffset: normalizeNumber(screen.topOffset, 0.28),
                offsetAlongFace: normalizeNumber(screen.offsetAlongFace, 0),
                offsetOutward: normalizeNumber(screen.offsetOutward, 0.03)
              }))
            : clone(fallback.screens)
        };
      })
    : clone(defaults.buildings);

  if ((source.meta?.version ?? 1) < 2) {
    const legacyPitch = Math.abs(config.camera.orbitPitch - 16.4) < 0.01;
    const legacyDistance = Math.abs(config.camera.orbitDistance - 17.35) < 0.02;
    const defaultTarget =
      Math.abs(config.camera.target.x) < 0.01 &&
      Math.abs(config.camera.target.y - 3.6) < 0.01 &&
      Math.abs(config.camera.target.z) < 0.01;
    if (legacyPitch && legacyDistance && defaultTarget) {
      config.camera.orbitPitch = defaults.camera.orbitPitch;
      config.camera.orbitDistance = defaults.camera.orbitDistance;
    }
    config.meta.version = defaults.meta.version;
  }

  return config;
};
