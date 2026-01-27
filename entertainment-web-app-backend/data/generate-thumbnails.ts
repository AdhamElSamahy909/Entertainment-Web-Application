import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { fileURLToPath } from "url";
import { dirname } from "path";

// 1. Define strict types for your configuration
interface ThumbnailConfig {
  videosDir: string;
  interval: number;
  width: number;
  height: number;
  cols: number;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Configuration (MUST Match your React Constants) ---
const CONFIG: ThumbnailConfig = {
  videosDir: path.join(
    __dirname,
    "../../entertainment-web-app-frontend/public/assets/videos",
  ),
  interval: 2, // 1 frame every 2 seconds
  width: 160, // Thumbnail width
  height: 90, // Thumbnail height
  cols: 2, // Images per row
};

// --- Helper Function: Generate Single Sprite Sheet ---
// Explicitly type arguments and return Promise<void>
const generateSprite = (
  videoPath: string,
  outputDir: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(outputDir, "thumbnails.jpg");

    console.log(`🎬 Processing: ${path.basename(videoPath)}`);

    ffmpeg(videoPath)
      // .complexFilter([
      //   `fps=1/${CONFIG.interval}`,
      //   `scale=${CONFIG.width}:${CONFIG.height}`,
      //   `tile=${CONFIG.cols}x1000`, // Allow up to 1000 rows
      // ])
      .complexFilter([
        `fps=1/${CONFIG.interval},scale=${CONFIG.width}:${CONFIG.height},tile=${CONFIG.cols}x100`,
      ])
      .output(outputPath)
      .on("end", () => {
        console.log(`✅ Created: ${outputPath}`);
        resolve();
      })
      .on("error", (err: Error) => {
        console.error(`❌ Error on ${path.basename(videoPath)}:`, err.message);
        reject(err);
      })
      .run();
  });
};

// --- Main Execution Function ---
const run = async (): Promise<void> => {
  if (!fs.existsSync(CONFIG.videosDir)) {
    console.error(`❌ Directory not found: ${CONFIG.videosDir}`);
    return;
  }

  // 1. Get all subdirectories (e.g., 'the-dark-knight', 'batman-begins')
  // We use the Dirent type implicitly provided by 'withFileTypes: true'
  const videoFolders: string[] = fs
    .readdirSync(CONFIG.videosDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  console.log(`📂 Found ${videoFolders.length} folders in assets/videos...`);

  // 2. Loop through each folder
  for (const folder of videoFolders) {
    const folderPath = path.join(CONFIG.videosDir, folder);

    // Find the .mp4 file inside this folder
    const files = fs.readdirSync(folderPath);
    const mp4File = files.find((file) => file.endsWith(".mp4"));

    if (mp4File) {
      const videoPath = path.join(folderPath, mp4File);

      // OPTIONAL: Skip if thumbnails.jpg already exists
      if (fs.existsSync(path.join(folderPath, "thumbnails.jpg"))) {
        console.log(`⏭️  Skipping ${folder} (thumbnails.jpg already exists)`);
        continue;
      }

      try {
        await generateSprite(videoPath, folderPath);
      } catch (error) {
        // Continue to next video even if one fails
        // Typescript knows 'error' is 'unknown', so we strictly don't use it or cast it if needed
      }
    } else {
      console.warn(`⚠️  No MP4 file found in folder: ${folder}`);
    }
  }

  console.log("\n✨ All operations complete!");
};

run();
