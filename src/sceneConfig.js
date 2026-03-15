export const SCENE_CONFIG_STORAGE_KEY = "lab-city-scene-config-v8";

const clone = (value) => JSON.parse(JSON.stringify(value));
const normalizeNumber = (value, fallback) => (Number.isFinite(Number(value)) ? Number(value) : fallback);
const normalizeString = (value, fallback) => (typeof value === "string" ? value : fallback);
const normalizeBool = (value, fallback) => (typeof value === "boolean" ? value : fallback);

const DEFAULT_SCENE_TEMPLATE = {
  "meta": {
    "version": 2,
    "updatedAt": "2026-03-15T05:28:54.292Z"
  },
  "camera": {
    "mode": "browse",
    "presetName": "Current framing",
    "orbitYaw": 0,
    "orbitPitch": 39,
    "orbitDistance": 17.3,
    "target": {
      "x": -0.9,
      "y": 4.5,
      "z": 0
    },
    "fov": 36.900000000000006
  },
  "scene": {
    "bgColor": "#f02050",
    "fogColor": "#f02050",
    "fogNear": 13.4,
    "fogFar": 21.8,
    "ambientIntensity": 4,
    "frontLightIntensity": 20,
    "backLightIntensity": 0.5,
    "roofLightIntensity": 1.3,
    "buildingColor": "#050607",
    "buildingRoughness": 0.95,
    "buildingMetalness": 0.91,
    "buildingClearcoat": 0.11,
    "buildingClearcoatRoughness": 1,
    "buildingEnvMapIntensity": 1.81,
    "screenLightIntensity": 1.9,
    "screenEmissiveIntensity": 0.38,
    "selectedScale": 1.32
  },
  "buildings": [
    {
      "id": "tower-12",
      "key": "-2,3.5",
      "enabled": true,
      "position": {
        "x": -2,
        "z": 3.5
      },
      "rotationY": -1.7,
      "dimensions": {
        "width": 1.7,
        "depth": 1.7,
        "height": 6.9
      },
      "cap": {
        "enabled": false,
        "width": 1.16,
        "depth": 1.02,
        "height": 0.6
      },
      "sideCore": {
        "enabled": true,
        "width": 0.36,
        "depth": 0.56,
        "height": 2.49952493408692,
        "offsetX": 0.54,
        "offsetZ": -0.22719999999999999
      },
      "label": {
        "enabled": true,
        "text": "RIO SUL",
        "color": "#ffffff",
        "offsetY": 0.44
      },
      "beacon": {
        "enabled": true,
        "color": "#ff4a73",
        "offsetY": 0.22
      },
      "defaultScreen": {
        "width": 1.1311160893683119,
        "height": 0.6945280986133097
      },
      "prominence": 6.978268245167074,
      "screens": [
        {
          "id": "tower-12-screen-01",
          "enabled": true,
          "projectSlug": "riosul-natal-2025",
          "side": "right",
          "width": 1.4,
          "height": 1.8,
          "topOffset": 0.28,
          "offsetAlongFace": 0,
          "offsetOutward": 0.03
        }
      ]
    },
    {
      "id": "tower-02",
      "key": "-4.2,2.3",
      "enabled": true,
      "position": {
        "x": -4.2,
        "z": 2.3
      },
      "rotationY": -2.22,
      "dimensions": {
        "width": 1.1,
        "depth": 1.7,
        "height": 5.2
      },
      "cap": {
        "enabled": true,
        "width": 0.7,
        "depth": 0.7,
        "height": 0.2
      },
      "sideCore": {
        "enabled": true,
        "width": 0.36,
        "depth": 0.56,
        "height": 2.49952493408692,
        "offsetX": 0.54,
        "offsetZ": -0.22719999999999999
      },
      "label": {
        "enabled": true,
        "text": "live action",
        "color": "#ffffff",
        "offsetY": 0.44
      },
      "beacon": {
        "enabled": true,
        "color": "#ff4a73",
        "offsetY": 0.22
      },
      "defaultScreen": {
        "width": 1.1311160893683119,
        "height": 0.6945280986133097
      },
      "prominence": 6.978268245167074,
      "screens": [
        {
          "id": "tower-02-screen-01",
          "enabled": true,
          "projectSlug": "invincible-live-action-1-2025",
          "side": "right",
          "width": 1.1311160893683119,
          "height": 0.6945280986133097,
          "topOffset": 0.28,
          "offsetAlongFace": 0,
          "offsetOutward": 0.03
        }
      ]
    },
    {
      "id": "tower-03",
      "key": "-3.2,0.1",
      "enabled": true,
      "position": {
        "x": -3.2,
        "z": 0.1
      },
      "rotationY": -2.13,
      "dimensions": {
        "width": 1,
        "depth": 1.2,
        "height": 7.4
      },
      "cap": {
        "enabled": false,
        "width": 1.16,
        "depth": 1.02,
        "height": 0.37
      },
      "sideCore": {
        "enabled": true,
        "width": 0.36,
        "depth": 0.56,
        "height": 2.49952493408692,
        "offsetX": 0.54,
        "offsetZ": -0.22719999999999999
      },
      "label": {
        "enabled": true,
        "text": "Beats by Dre",
        "color": "#ffffff",
        "offsetY": 0.44
      },
      "beacon": {
        "enabled": true,
        "color": "#ff4a73",
        "offsetY": 0.22
      },
      "defaultScreen": {
        "width": 1.1311160893683119,
        "height": 0.6945280986133097
      },
      "prominence": 6.978268245167074,
      "screens": [
        {
          "id": "tower-03-screen-01",
          "enabled": true,
          "projectSlug": "beats-midnight-cut",
          "side": "right",
          "width": 0.9,
          "height": 1.6,
          "topOffset": 0.28,
          "offsetAlongFace": 0,
          "offsetOutward": 0.03
        }
      ]
    },
    {
      "id": "tower-04",
      "key": "-1.1,1.4",
      "enabled": true,
      "position": {
        "x": -1.1,
        "z": 1.4
      },
      "rotationY": -1.59,
      "dimensions": {
        "width": 1.4,
        "depth": 1.4,
        "height": 9.8
      },
      "cap": {
        "enabled": true,
        "width": 0.5,
        "depth": 0.5,
        "height": 0.2
      },
      "sideCore": {
        "enabled": true,
        "width": 0.36,
        "depth": 0.56,
        "height": 2.49952493408692,
        "offsetX": 0.54,
        "offsetZ": -0.22719999999999999
      },
      "label": {
        "enabled": true,
        "text": "Elena Horto",
        "color": "#ffffff",
        "offsetY": 0.44
      },
      "beacon": {
        "enabled": true,
        "color": "#ff4a73",
        "offsetY": 0.22
      },
      "defaultScreen": {
        "width": 1.1311160893683119,
        "height": 0.6945280986133097
      },
      "prominence": 6.978268245167074,
      "screens": [
        {
          "id": "tower-04-screen-01",
          "enabled": true,
          "projectSlug": "elena-tokyo-nights-2025",
          "side": "right",
          "width": 1.15,
          "height": 1.8,
          "topOffset": 0.28,
          "offsetAlongFace": 0,
          "offsetOutward": 0.03
        }
      ]
    },
    {
      "id": "tower-05",
      "key": "0.5,4.2",
      "enabled": true,
      "position": {
        "x": 0.5,
        "z": 4.2
      },
      "rotationY": -0.96,
      "dimensions": {
        "width": 1,
        "depth": 1.3,
        "height": 7.4
      },
      "cap": {
        "enabled": true,
        "width": 0.6,
        "depth": 0.9,
        "height": 0.2
      },
      "sideCore": {
        "enabled": true,
        "width": 0.36,
        "depth": 0.56,
        "height": 2.49952493408692,
        "offsetX": 0.54,
        "offsetZ": -0.22719999999999999
      },
      "label": {
        "enabled": true,
        "text": "PRIO",
        "color": "#ffffff",
        "offsetY": 0.44
      },
      "beacon": {
        "enabled": true,
        "color": "#ff4a73",
        "offsetY": 0.22
      },
      "defaultScreen": {
        "width": 1.1311160893683119,
        "height": 0.6945280986133097
      },
      "prominence": 6.978268245167074,
      "screens": [
        {
          "id": "tower-05-screen-01",
          "enabled": true,
          "projectSlug": "prio-campos-maduros-2025",
          "side": "right",
          "width": 1,
          "height": 1.8,
          "topOffset": 0.28,
          "offsetAlongFace": 0,
          "offsetOutward": 0.03
        }
      ]
    },
    {
      "id": "tower-06",
      "key": "1.2,0.2",
      "enabled": true,
      "position": {
        "x": 1.2,
        "z": 0.2
      },
      "rotationY": -0.94,
      "dimensions": {
        "width": 1,
        "depth": 1.3,
        "height": 8.1
      },
      "cap": {
        "enabled": false,
        "width": 0.6,
        "depth": 0.6,
        "height": 0.1
      },
      "sideCore": {
        "enabled": true,
        "width": 0.36,
        "depth": 0.56,
        "height": 2.49952493408692,
        "offsetX": 0.54,
        "offsetZ": -0.22719999999999999
      },
      "label": {
        "enabled": true,
        "text": "PRIO",
        "color": "#ffffff",
        "offsetY": 0.44
      },
      "beacon": {
        "enabled": true,
        "color": "#ff4a73",
        "offsetY": 0.22
      },
      "defaultScreen": {
        "width": 1.1311160893683119,
        "height": 0.6945280986133097
      },
      "prominence": 6.978268245167074,
      "screens": [
        {
          "id": "tower-06-screen-01",
          "enabled": true,
          "projectSlug": "prio-esta-em-tudo-2025",
          "side": "right",
          "width": 1,
          "height": 1.8,
          "topOffset": 0.28,
          "offsetAlongFace": 0,
          "offsetOutward": 0.03
        }
      ]
    },
    {
      "id": "tower-07",
      "key": "2.6,2.3",
      "enabled": true,
      "position": {
        "x": 2.6,
        "z": 2.3
      },
      "rotationY": -1.11,
      "dimensions": {
        "width": 1,
        "depth": 1.7,
        "height": 5.35
      },
      "cap": {
        "enabled": true,
        "width": 0.3,
        "depth": 0.6,
        "height": 0.2
      },
      "sideCore": {
        "enabled": true,
        "width": 0.36,
        "depth": 0.56,
        "height": 2.49952493408692,
        "offsetX": 0.54,
        "offsetZ": -0.22719999999999999
      },
      "label": {
        "enabled": true,
        "text": "Elena Horto",
        "color": "#ffffff",
        "offsetY": 0.44
      },
      "beacon": {
        "enabled": true,
        "color": "#ff4a73",
        "offsetY": 0.22
      },
      "defaultScreen": {
        "width": 1.1311160893683119,
        "height": 0.6945280986133097
      },
      "prominence": 6.978268245167074,
      "screens": [
        {
          "id": "tower-07-screen-01",
          "enabled": true,
          "projectSlug": "elena-natal-2025",
          "side": "right",
          "width": 1.1311160893683119,
          "height": 1.8,
          "topOffset": 0.28,
          "offsetAlongFace": 0,
          "offsetOutward": 0.03
        }
      ]
    },
    {
      "id": "tower-08",
      "key": "0.3,-2.6",
      "enabled": true,
      "position": {
        "x": 0.3,
        "z": -2.6
      },
      "rotationY": -1.25,
      "dimensions": {
        "width": 1.1,
        "depth": 1.1,
        "height": 9
      },
      "cap": {
        "enabled": true,
        "width": 0.5,
        "depth": 0.5,
        "height": 0.1
      },
      "sideCore": {
        "enabled": true,
        "width": 0.36,
        "depth": 0.56,
        "height": 2.49952493408692,
        "offsetX": 0.54,
        "offsetZ": -0.22719999999999999
      },
      "label": {
        "enabled": true,
        "text": "LIVE ACTION",
        "color": "#ffffff",
        "offsetY": 0.44
      },
      "beacon": {
        "enabled": true,
        "color": "#ff4a73",
        "offsetY": 0.22
      },
      "defaultScreen": {
        "width": 1.1311160893683119,
        "height": 0.6945280986133097
      },
      "prominence": 6.978268245167074,
      "screens": [
        {
          "id": "tower-08-screen-01",
          "enabled": true,
          "projectSlug": "full-metal-live-action-2025",
          "side": "right",
          "width": 0.9,
          "height": 0.6945280986133097,
          "topOffset": 0.28,
          "offsetAlongFace": 0,
          "offsetOutward": 0.03
        }
      ]
    },
    {
      "id": "tower-09",
      "key": "-2,-1.5",
      "enabled": true,
      "position": {
        "x": -2,
        "z": -1.5
      },
      "rotationY": -1.84,
      "dimensions": {
        "width": 1.1,
        "depth": 1.1,
        "height": 9.7
      },
      "cap": {
        "enabled": true,
        "width": 0.5,
        "depth": 0.5,
        "height": 0.1
      },
      "sideCore": {
        "enabled": true,
        "width": 0.36,
        "depth": 0.56,
        "height": 2.49952493408692,
        "offsetX": 0.54,
        "offsetZ": -0.22719999999999999
      },
      "label": {
        "enabled": true,
        "text": "LIVE ACTION",
        "color": "#ffffff",
        "offsetY": 0.44
      },
      "beacon": {
        "enabled": true,
        "color": "#ff4a73",
        "offsetY": 0.22
      },
      "defaultScreen": {
        "width": 1.1311160893683119,
        "height": 0.6945280986133097
      },
      "prominence": 6.978268245167074,
      "screens": [
        {
          "id": "tower-09-screen-01",
          "enabled": true,
          "projectSlug": "invincible-live-action-1-2025",
          "side": "right",
          "width": 0.85,
          "height": 0.6945280986133097,
          "topOffset": 0.28,
          "offsetAlongFace": 0,
          "offsetOutward": 0.03
        }
      ]
    },
    {
      "id": "tower-10",
      "key": "-7,-0.5",
      "enabled": true,
      "position": {
        "x": -7,
        "z": -0.5
      },
      "rotationY": -1.06,
      "dimensions": {
        "width": 1.4,
        "depth": 1.5,
        "height": 4.35
      },
      "cap": {
        "enabled": false,
        "width": 1.16,
        "depth": 1.02,
        "height": 0.37
      },
      "sideCore": {
        "enabled": true,
        "width": 0.36,
        "depth": 0.56,
        "height": 2.49952493408692,
        "offsetX": 0.54,
        "offsetZ": -0.22719999999999999
      },
      "label": {
        "enabled": false,
        "text": "Midnight Cut copy copy copy",
        "color": "#ffffff",
        "offsetY": 0.44
      },
      "beacon": {
        "enabled": false,
        "color": "#ff4a73",
        "offsetY": 0.22
      },
      "defaultScreen": {
        "width": 1.1311160893683119,
        "height": 0.6945280986133097
      },
      "prominence": 6.978268245167074,
      "screens": [
        {
          "id": "tower-10-screen-01",
          "enabled": false,
          "projectSlug": "beats-midnight-cut",
          "side": "right",
          "width": 1.1311160893683119,
          "height": 0.6945280986133097,
          "topOffset": 0.28,
          "offsetAlongFace": 0,
          "offsetOutward": 0.03
        }
      ]
    },
    {
      "id": "tower-11",
      "key": "4.6,-0.6",
      "enabled": true,
      "position": {
        "x": 4.6,
        "z": -0.6
      },
      "rotationY": 0.89,
      "dimensions": {
        "width": 1.2,
        "depth": 1,
        "height": 4.55
      },
      "cap": {
        "enabled": false,
        "width": 1.16,
        "depth": 1.02,
        "height": 0.37
      },
      "sideCore": {
        "enabled": true,
        "width": 0.36,
        "depth": 0.56,
        "height": 2.49952493408692,
        "offsetX": 0.54,
        "offsetZ": -0.22719999999999999
      },
      "label": {
        "enabled": false,
        "text": "Midnight Cut copy copy copy copy",
        "color": "#ffffff",
        "offsetY": 0.44
      },
      "beacon": {
        "enabled": false,
        "color": "#ff4a73",
        "offsetY": 0.22
      },
      "defaultScreen": {
        "width": 1.1311160893683119,
        "height": 0.6945280986133097
      },
      "prominence": 6.978268245167074,
      "screens": [
        {
          "id": "tower-11-screen-01",
          "enabled": false,
          "projectSlug": "beats-midnight-cut",
          "side": "right",
          "width": 1.1311160893683119,
          "height": 0.6945280986133097,
          "topOffset": 0.28,
          "offsetAlongFace": 0,
          "offsetOutward": 0.03
        }
      ]
    },
    {
      "id": "tower-13",
      "key": "-5.3,-3.5",
      "enabled": true,
      "position": {
        "x": -5.3,
        "z": -3.5
      },
      "rotationY": -0.83,
      "dimensions": {
        "width": 1.4,
        "depth": 1,
        "height": 7.45
      },
      "cap": {
        "enabled": false,
        "width": 1.16,
        "depth": 1.02,
        "height": 0.37
      },
      "sideCore": {
        "enabled": true,
        "width": 0.36,
        "depth": 0.56,
        "height": 2.49952493408692,
        "offsetX": 0.54,
        "offsetZ": -0.22719999999999999
      },
      "label": {
        "enabled": false,
        "text": "Midnight Cut copy copy copy copy",
        "color": "#ffffff",
        "offsetY": 0.44
      },
      "beacon": {
        "enabled": false,
        "color": "#ff4a73",
        "offsetY": 0.22
      },
      "defaultScreen": {
        "width": 1.1311160893683119,
        "height": 0.6945280986133097
      },
      "prominence": 6.978268245167074,
      "screens": [
        {
          "id": "tower-13-screen-01",
          "enabled": false,
          "projectSlug": "beats-midnight-cut",
          "side": "right",
          "width": 1.1311160893683119,
          "height": 0.6945280986133097,
          "topOffset": 0.28,
          "offsetAlongFace": 0,
          "offsetOutward": 0.03
        }
      ]
    },
    {
      "id": "tower-14",
      "key": "4.2,-2.9",
      "enabled": true,
      "position": {
        "x": 4.2,
        "z": -2.9
      },
      "rotationY": 0.88,
      "dimensions": {
        "width": 1.3,
        "depth": 1.1,
        "height": 7.4
      },
      "cap": {
        "enabled": false,
        "width": 1.16,
        "depth": 1.02,
        "height": 0.37
      },
      "sideCore": {
        "enabled": true,
        "width": 0.36,
        "depth": 0.56,
        "height": 2.49952493408692,
        "offsetX": 0.54,
        "offsetZ": -0.22719999999999999
      },
      "label": {
        "enabled": false,
        "text": "Midnight Cut copy copy copy copy copy",
        "color": "#ffffff",
        "offsetY": 0.44
      },
      "beacon": {
        "enabled": false,
        "color": "#ff4a73",
        "offsetY": 0.22
      },
      "defaultScreen": {
        "width": 1.1311160893683119,
        "height": 0.6945280986133097
      },
      "prominence": 6.978268245167074,
      "screens": [
        {
          "id": "tower-14-screen-01",
          "enabled": false,
          "projectSlug": "beats-midnight-cut",
          "side": "right",
          "width": 1.1311160893683119,
          "height": 0.6945280986133097,
          "topOffset": 0.28,
          "offsetAlongFace": 0,
          "offsetOutward": 0.03
        }
      ]
    },
    {
      "id": "tower-15",
      "key": "6.6,-2.7",
      "enabled": true,
      "position": {
        "x": 6.6,
        "z": -2.7
      },
      "rotationY": 1.14,
      "dimensions": {
        "width": 1.3,
        "depth": 0.9,
        "height": 5.4
      },
      "cap": {
        "enabled": false,
        "width": 1.16,
        "depth": 1.02,
        "height": 0.37
      },
      "sideCore": {
        "enabled": true,
        "width": 0.36,
        "depth": 0.56,
        "height": 2.49952493408692,
        "offsetX": 0.54,
        "offsetZ": -0.22719999999999999
      },
      "label": {
        "enabled": false,
        "text": "Midnight Cut copy copy copy copy copy copy",
        "color": "#ffffff",
        "offsetY": 0.44
      },
      "beacon": {
        "enabled": false,
        "color": "#ff4a73",
        "offsetY": 0.22
      },
      "defaultScreen": {
        "width": 1.1311160893683119,
        "height": 0.6945280986133097
      },
      "prominence": 6.978268245167074,
      "screens": [
        {
          "id": "tower-15-screen-01",
          "enabled": false,
          "projectSlug": "beats-midnight-cut",
          "side": "right",
          "width": 1.1311160893683119,
          "height": 0.6945280986133097,
          "topOffset": 0.28,
          "offsetAlongFace": 0,
          "offsetOutward": 0.03
        }
      ]
    },
    {
      "id": "tower-16",
      "key": "-10.95,-1.15",
      "enabled": true,
      "position": {
        "x": -10.95,
        "z": -1.15
      },
      "rotationY": -1.23,
      "dimensions": {
        "width": 1.4,
        "depth": 1.5,
        "height": 3.7
      },
      "cap": {
        "enabled": false,
        "width": 1.16,
        "depth": 1.02,
        "height": 0.37
      },
      "sideCore": {
        "enabled": true,
        "width": 0.36,
        "depth": 0.56,
        "height": 2.49952493408692,
        "offsetX": 0.54,
        "offsetZ": -0.22719999999999999
      },
      "label": {
        "enabled": false,
        "text": "Midnight Cut copy copy copy copy",
        "color": "#ffffff",
        "offsetY": 0.44
      },
      "beacon": {
        "enabled": false,
        "color": "#ff4a73",
        "offsetY": 0.22
      },
      "defaultScreen": {
        "width": 1.1311160893683119,
        "height": 0.6945280986133097
      },
      "prominence": 6.978268245167074,
      "screens": [
        {
          "id": "tower-16-screen-01",
          "enabled": false,
          "projectSlug": "beats-midnight-cut",
          "side": "right",
          "width": 1.1311160893683119,
          "height": 0.6945280986133097,
          "topOffset": 0.28,
          "offsetAlongFace": 0,
          "offsetOutward": 0.03
        }
      ]
    },
    {
      "id": "tower-17",
      "key": "-12.05,-3.6",
      "enabled": true,
      "position": {
        "x": -12.05,
        "z": -3.6
      },
      "rotationY": -1.16,
      "dimensions": {
        "width": 1.4,
        "depth": 1,
        "height": 6.95
      },
      "cap": {
        "enabled": false,
        "width": 1.16,
        "depth": 1.02,
        "height": 0.37
      },
      "sideCore": {
        "enabled": true,
        "width": 0.36,
        "depth": 0.56,
        "height": 2.49952493408692,
        "offsetX": 0.54,
        "offsetZ": -0.22719999999999999
      },
      "label": {
        "enabled": false,
        "text": "Midnight Cut copy copy copy copy copy",
        "color": "#ffffff",
        "offsetY": 0.44
      },
      "beacon": {
        "enabled": false,
        "color": "#ff4a73",
        "offsetY": 0.22
      },
      "defaultScreen": {
        "width": 1.1311160893683119,
        "height": 0.6945280986133097
      },
      "prominence": 6.978268245167074,
      "screens": [
        {
          "id": "tower-17-screen-01",
          "enabled": false,
          "projectSlug": "beats-midnight-cut",
          "side": "right",
          "width": 1.1311160893683119,
          "height": 0.6945280986133097,
          "topOffset": 0.28,
          "offsetAlongFace": 0,
          "offsetOutward": 0.03
        }
      ]
    },
    {
      "id": "tower-18",
      "key": "10.2,-2.9",
      "enabled": true,
      "position": {
        "x": 10.2,
        "z": -2.9
      },
      "rotationY": 0.88,
      "dimensions": {
        "width": 1.3,
        "depth": 1.1,
        "height": 5.75
      },
      "cap": {
        "enabled": false,
        "width": 1.16,
        "depth": 1.02,
        "height": 0.37
      },
      "sideCore": {
        "enabled": true,
        "width": 0.36,
        "depth": 0.56,
        "height": 2.49952493408692,
        "offsetX": 0.54,
        "offsetZ": -0.22719999999999999
      },
      "label": {
        "enabled": false,
        "text": "Midnight Cut copy copy copy copy copy copy",
        "color": "#ffffff",
        "offsetY": 0.44
      },
      "beacon": {
        "enabled": false,
        "color": "#ff4a73",
        "offsetY": 0.22
      },
      "defaultScreen": {
        "width": 1.1311160893683119,
        "height": 0.6945280986133097
      },
      "prominence": 6.978268245167074,
      "screens": [
        {
          "id": "tower-18-screen-01",
          "enabled": false,
          "projectSlug": "beats-midnight-cut",
          "side": "right",
          "width": 1.1311160893683119,
          "height": 0.6945280986133097,
          "topOffset": 0.28,
          "offsetAlongFace": 0,
          "offsetOutward": 0.03
        }
      ]
    }
  ]
};

export const createDefaultSceneConfig = () => {
  const config = clone(DEFAULT_SCENE_TEMPLATE);
  config.meta.updatedAt = new Date().toISOString();
  return config;
};

export const cloneSceneConfig = (config) => clone(config);

export const normalizeSceneConfig = (input, projects) => {
  const defaults = createDefaultSceneConfig(projects);
  const remapLegacyProjectSlug = (slug) =>
    slug === "hometree-f1-2025" || slug === "prio-2025"
      ? "prio-campos-maduros-2025"
      : slug;
  const remapBuildingProjectSlug = (buildingId, slug) => {
    const normalizedSlug = remapLegacyProjectSlug(slug);
    if (buildingId === "tower-06" && normalizedSlug === "beats-midnight-cut") {
      return "prio-esta-em-tudo-2025";
    }
    if (buildingId === "tower-07" && normalizedSlug === "elena-tokyo-nights-2025") {
      return "elena-natal-2025";
    }
    return normalizedSlug;
  };
  if (!input || typeof input !== "object") {
    return defaults;
  }

  const config = clone(defaults);
  const source = input;
  config.meta.updatedAt = new Date().toISOString();
  config.meta.version = defaults.meta.version;

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
    config.scene[key] =
      typeof defaults.scene[key] === "string"
        ? normalizeString(source.scene?.[key], defaults.scene[key])
        : normalizeNumber(source.scene?.[key], defaults.scene[key]);
  });

  const defaultBuildingById = new Map(defaults.buildings.map((building) => [building.id, building]));
  config.buildings = Array.isArray(source.buildings)
    ? source.buildings.map((building, index) => {
        const fallback =
          defaultBuildingById.get(building.id) ??
          defaults.buildings[index] ??
          defaults.buildings[0];
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
            text: normalizeString(
              building.id === "tower-05" && building.label?.text === "Hometree"
                ? "PRIO"
                : building.id === "tower-06" && building.label?.text?.toUpperCase() === "PRIO"
                  ? "PRIO"
                : building.id === "tower-03" && building.label?.text === "PRIO"
                  ? "Beats by Dre"
                  : building.label?.text,
              fallback.label.text
            ),
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
                id: normalizeString(
                  screen.id,
                  `${fallback.id}-screen-${String(screenIndex + 1).padStart(2, "0")}`
                ),
                enabled: normalizeBool(screen.enabled, true),
                projectSlug: normalizeString(
                  remapBuildingProjectSlug(building.id, screen.projectSlug),
                  projects[screenIndex % projects.length]?.slug ?? projects[0].slug
                ),
                side: normalizeString(screen.side, fallback.screens[screenIndex]?.side ?? "front"),
                width: normalizeNumber(screen.width, fallback.screens[screenIndex]?.width ?? fallback.defaultScreen.width),
                height: normalizeNumber(screen.height, fallback.screens[screenIndex]?.height ?? fallback.defaultScreen.height),
                topOffset: normalizeNumber(screen.topOffset, fallback.screens[screenIndex]?.topOffset ?? 0.28),
                offsetAlongFace: normalizeNumber(screen.offsetAlongFace, fallback.screens[screenIndex]?.offsetAlongFace ?? 0),
                offsetOutward: normalizeNumber(screen.offsetOutward, fallback.screens[screenIndex]?.offsetOutward ?? 0.03)
              }))
            : clone(fallback.screens)
        };
      })
    : clone(defaults.buildings);

  return config;
};
