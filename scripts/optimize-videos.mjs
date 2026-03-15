import { copyFile, mkdir, rename, rm, stat, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const publicVideosDir = path.join(repoRoot, "public", "videos");
const sourceVideosDir = path.join(repoRoot, "assets", "videos and descriptions");
const tempDir = path.join(repoRoot, ".tmp", "video-optimize");

const sourceOverrides = new Map([
  ["elena-natal.mp4", "elenahorto-natal.mp4"],
  ["flamengo-telas-anamorficas.mp4", "flamengo-telasanamorficas.mp4"],
  ["prio-campos-maduros.mp4", "prio-camposmaduros.mp4"],
  ["liveaction-fullmetal.mp4", "liveaction-fullmetal.MP4"],
  ["liveaction-invincible-1.mp4", "liveaction-invincible-1.MP4"]
]);

const heavyVideoOverrides = new Map([
  ["tokyonights-elena.mp4", { crf: 30 }],
  ["flamengo-telas-anamorficas.mp4", { crf: 30 }],
  ["formula1-hometree.mp4", { crf: 30 }],
  ["elena-natal.mp4", { crf: 30 }],
  ["natal-riosul.mp4", { crf: 30 }],
  ["prio-campos-maduros.mp4", { crf: 29 }],
  ["prio-esta-em-tudo.mp4", { crf: 29 }]
]);

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const onlyArg = process.argv.find((arg) => arg.startsWith("--only="));
const only = onlyArg
  ? new Set(
      onlyArg
        .slice("--only=".length)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  : null;

const run = (command, commandArgs, options = {}) => {
  const result = spawnSync(command, commandArgs, {
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    cwd: repoRoot,
    encoding: "utf8"
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    const stderr = options.capture ? `\n${result.stderr}` : "";
    throw new Error(`Command failed: ${command} ${commandArgs.join(" ")}${stderr}`);
  }

  return result;
};

const formatMegabytes = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const ensureTooling = () => {
  const ffmpeg = spawnSync("ffmpeg", ["-version"], { encoding: "utf8" });
  const ffprobe = spawnSync("ffprobe", ["-version"], { encoding: "utf8" });
  if (ffmpeg.error || ffmpeg.status !== 0 || ffprobe.error || ffprobe.status !== 0) {
    throw new Error(
      "ffmpeg and ffprobe are required. Install them first, then rerun `npm run videos:optimize`."
    );
  }
};

const getPublicVideoFiles = async () => {
  const entries = await readdir(publicVideosDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".mp4"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
};

const resolveSourcePath = async (outputName) => {
  const candidates = [];
  const override = sourceOverrides.get(outputName);
  if (override) {
    candidates.push(path.join(sourceVideosDir, override));
  }
  candidates.push(path.join(sourceVideosDir, outputName));
  candidates.push(path.join(publicVideosDir, outputName));

  for (const candidate of candidates) {
    try {
      const candidateStats = await stat(candidate);
      if (candidateStats.isFile()) {
        return { path: candidate, stats: candidateStats };
      }
    } catch {
      // Try next candidate.
    }
  }

  throw new Error(`No source video found for ${outputName}`);
};

const getVideoDimensions = (filePath) => {
  const result = run(
    "ffprobe",
    [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height,r_frame_rate",
      "-of",
      "json",
      filePath
    ],
    { capture: true }
  );

  const payload = JSON.parse(result.stdout);
  const stream = payload.streams?.[0];
  if (!stream) {
    throw new Error(`Could not read video stream info for ${filePath}`);
  }

  const [numerator, denominator] = `${stream.r_frame_rate ?? "0/1"}`
    .split("/")
    .map((value) => Number(value));
  const fps = denominator ? numerator / denominator : 0;

  return {
    width: Number(stream.width) || 0,
    height: Number(stream.height) || 0,
    fps
  };
};

const buildFilter = ({ width, height, fps }) => {
  const filters = [];
  if (width > 1280 || height > 720) {
    filters.push("scale=w=1280:h=720:force_original_aspect_ratio=decrease:force_divisible_by=2");
  }
  if (fps > 30.01) {
    filters.push("fps=30");
  }
  return filters.join(",");
};

const encodeVideo = async (outputName) => {
  const destinationPath = path.join(publicVideosDir, outputName);
  const destinationStats = await stat(destinationPath).catch(() => null);
  const { path: sourcePath, stats: sourceStats } = await resolveSourcePath(outputName);

  if (
    force &&
    destinationStats &&
    sourcePath !== destinationPath &&
    sourceStats.size < destinationStats.size
  ) {
    await copyFile(sourcePath, destinationPath);
    return {
      outputName,
      sourcePath,
      destinationPath,
      skipped: false,
      mode: "restored-source",
      beforeBytes: destinationStats.size,
      afterBytes: sourceStats.size
    };
  }

  if (!force && destinationStats && destinationStats.mtimeMs >= sourceStats.mtimeMs) {
    return {
      outputName,
      sourcePath,
      destinationPath,
      skipped: true,
      beforeBytes: destinationStats.size,
      afterBytes: destinationStats.size
    };
  }

  await mkdir(tempDir, { recursive: true });
  const tempPath = path.join(tempDir, `${outputName}.tmp.mp4`);
  await rm(tempPath, { force: true });

  const { width, height, fps } = getVideoDimensions(sourcePath);
  const filter = buildFilter({ width, height, fps });
  const crf = heavyVideoOverrides.get(outputName)?.crf ?? 28;
  const ffmpegArgs = [
    "-y",
    "-i",
    sourcePath,
    "-map",
    "0:v:0",
    "-map",
    "0:a?",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    String(crf),
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-profile:v",
    "high",
    "-level:v",
    "4.1",
    "-c:a",
    "aac",
    "-b:a",
    "96k",
    "-ac",
    "2",
    "-ar",
    "48000",
    "-map_metadata",
    "-1"
  ];

  if (filter) {
    ffmpegArgs.push("-vf", filter);
  }

  ffmpegArgs.push(tempPath);
  run("ffmpeg", ffmpegArgs);

  const tempStats = await stat(tempPath);
  let mode = "encoded";
  let finalBytes = tempStats.size;

  if (destinationStats && tempStats.size >= destinationStats.size) {
    await rm(tempPath, { force: true });
    return {
      outputName,
      sourcePath,
      destinationPath,
      skipped: true,
      mode: "kept-existing",
      beforeBytes: destinationStats.size,
      afterBytes: destinationStats.size
    };
  }

  if (sourcePath !== destinationPath && sourceStats.size <= tempStats.size) {
    await copyFile(sourcePath, destinationPath);
    await rm(tempPath, { force: true });
    mode = "copied-source";
    finalBytes = sourceStats.size;
  } else {
    await rename(tempPath, destinationPath);
  }

  return {
    outputName,
    sourcePath,
    destinationPath,
    skipped: false,
    mode,
    beforeBytes: destinationStats?.size ?? sourceStats.size,
    afterBytes: finalBytes
  };
};

const main = async () => {
  ensureTooling();

  const publicVideos = await getPublicVideoFiles();
  const outputs = only ? publicVideos.filter((name) => only.has(name)) : publicVideos;
  if (!outputs.length) {
    console.log("No matching video outputs found.");
    return;
  }

  let totalBefore = 0;
  let totalAfter = 0;

  for (const outputName of outputs) {
    const result = await encodeVideo(outputName);
    totalBefore += result.beforeBytes;
    totalAfter += result.afterBytes;

    const delta = result.afterBytes - result.beforeBytes;
    const deltaText =
      delta === 0
        ? "0.0 MB"
        : `${delta > 0 ? "+" : "-"}${formatMegabytes(Math.abs(delta))}`;

    console.log(
      [
        result.skipped ? "SKIP" : "DONE",
        outputName,
        `source=${path.relative(repoRoot, result.sourcePath)}`,
        `mode=${result.mode ?? (result.skipped ? "skipped" : "encoded")}`,
        `before=${formatMegabytes(result.beforeBytes)}`,
        `after=${formatMegabytes(result.afterBytes)}`,
        `delta=${deltaText}`
      ].join(" | ")
    );
  }

  console.log(
    `TOTAL | before=${formatMegabytes(totalBefore)} | after=${formatMegabytes(totalAfter)} | delta=${formatMegabytes(Math.abs(totalAfter - totalBefore))} ${totalAfter <= totalBefore ? "saved" : "added"}`
  );
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
