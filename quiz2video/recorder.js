const puppeteer = require("puppeteer");
const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const QUESTIONS_URL =
  "https://mindtools.vercel.app/quiz/utils/questions_2026-01-06.json";
const PAGE_URL =
  "https://mindtools.vercel.app/quiz/indexv5.html?revision=true&timer=7&subject=science";
const LOCALSTORAGE_KEY = "quiz-all-answers-science";
const OUTPUT_DIR = "/Users/sanvi/tmp/data/outputs";
const RAW_VIDEO = path.join("/Users/sanvi/tmp/claude", "raw_recording.webm");
const FINAL_VIDEO = path.join(OUTPUT_DIR, "quiz_recording.mp4");

// Screen dimensions - Full HD for Bravia TV compatibility
const WIDTH = 1920;
const HEIGHT = 1080;

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error("Failed to parse JSON: " + e.message));
          }
        });
      })
      .on("error", reject);
  });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("📥 Fetching quiz questions from:", QUESTIONS_URL);
  const questionsData = await fetchJSON(QUESTIONS_URL);
  console.log("✅ Questions fetched successfully");

  const jsonString = JSON.stringify(questionsData);

  console.log("🚀 Launching browser...");
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: WIDTH, height: HEIGHT },
    args: [
      `--window-size=${WIDTH},${HEIGHT}`,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-web-security",
      "--autoplay-policy=no-user-gesture-required",
      "--start-maximized",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });

  // Inject localStorage BEFORE page load using CDP
  console.log("💉 Setting up localStorage injection before page load...");
  const client = await page.target().createCDPSession();

  // Use Page.addScriptToEvaluateOnNewDocument to set localStorage before any script runs
  await page.evaluateOnNewDocument(
    (key, value) => {
      try {
        localStorage.setItem(key, value);
        console.log("[Injected] localStorage key set:", key);
      } catch (e) {
        console.error("[Injected] Failed to set localStorage:", e);
      }
    },
    LOCALSTORAGE_KEY,
    jsonString,
  );

  console.log("🌐 Navigating to quiz page...");
  await page.goto(PAGE_URL, { waitUntil: "networkidle2", timeout: 60000 });

  // Verify localStorage was set
  const storedValue = await page.evaluate((key) => {
    const val = localStorage.getItem(key);
    return val ? `Set ✓ (${val.length} chars)` : "NOT SET ✗";
  }, LOCALSTORAGE_KEY);
  console.log(`🔑 localStorage[${LOCALSTORAGE_KEY}]: ${storedValue}`);

  // Wait for page to fully render
  await sleep(3000);

  // Start screen recording using ffmpeg with x11grab
  console.log("🎬 Starting screen recording...");

  // Get the browser window position/display
  const ffmpegArgs = [
    "-y",
    "-f",
    "x11grab",
    "-r",
    "30",
    "-s",
    `${WIDTH}x${HEIGHT}`,
    "-i",
    ":99.0",
    "-t",
    "300", // Max 5 minutes recording
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-crf",
    "18",
    RAW_VIDEO,
  ];

  const ffmpegProcess = spawn("ffmpeg", ffmpegArgs, {
    stdio: ["pipe", "pipe", "pipe"],
  });

  ffmpegProcess.stderr.on("data", (data) => {
    const msg = data.toString();
    if (msg.includes("fps") || msg.includes("time=")) {
      process.stdout.write("\r🎥 Recording: " + msg.trim().split("\n").pop());
    }
  });

  // Let the quiz run - watch pages auto-advance with the 7-second timer
  console.log("\n⏱️  Quiz running with 7-second timer per question...");
  console.log("📹 Recording in progress...\n");

  // Monitor quiz completion
  let quizDone = false;
  const maxWait = 280000; // 4m40s max
  const startTime = Date.now();

  while (!quizDone && Date.now() - startTime < maxWait) {
    await sleep(5000);

    // Check if quiz has ended (look for results/completion indicators)
    const isDone = await page
      .evaluate(() => {
        const body = document.body.innerText || "";
        // Check for common completion indicators
        return (
          body.includes("Score") ||
          body.includes("Complete") ||
          body.includes("Finished") ||
          body.includes("Results") ||
          document.querySelector(".results") !== null ||
          document.querySelector("#results") !== null ||
          document.querySelector(".score") !== null
        );
      })
      .catch(() => false);

    if (isDone) {
      console.log(
        "\n✅ Quiz completed! Waiting 5 more seconds to capture results...",
      );
      await sleep(5000);
      quizDone = true;
    } else {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      console.log(`\r⏳ Elapsed: ${elapsed}s - Quiz still running...`);
    }
  }

  // Stop recording
  console.log("\n🛑 Stopping recording...");
  ffmpegProcess.stdin.write("q");

  await new Promise((resolve) => {
    ffmpegProcess.on("close", (code) => {
      console.log(`FFmpeg exited with code ${code}`);
      resolve();
    });
    setTimeout(resolve, 10000); // Fallback timeout
  });

  await browser.close();
  console.log("🔒 Browser closed");

  // Convert to Sony Bravia TV compatible MP4
  console.log("🎞️  Converting to Sony Bravia TV compatible MP4...");

  if (fs.existsSync(RAW_VIDEO)) {
    execSync(
      [
        "ffmpeg -y",
        `-i "${RAW_VIDEO}"`,
        // Sony Bravia TV compatibility settings
        "-c:v libx264",
        "-profile:v high", // H.264 High Profile
        "-level:v 4.1", // Level 4.1 - widely supported
        "-preset slow", // Better compression
        "-crf 20", // Good quality
        "-pix_fmt yuv420p", // Required for broad compatibility
        "-movflags +faststart", // Web optimization, also helps TV playback
        "-c:a aac", // AAC audio
        "-b:a 192k",
        "-r 30", // 30fps
        `-s ${WIDTH}x${HEIGHT}`, // 1920x1080
        "-aspect 16:9",
        `"${FINAL_VIDEO}"`,
      ].join(" "),
      { stdio: "inherit" },
    );

    console.log(`\n✅ Final video saved: ${FINAL_VIDEO}`);

    // Clean up raw file
    fs.unlinkSync(RAW_VIDEO);
    console.log("🧹 Cleaned up temporary files");
  } else {
    console.error("❌ Raw video file not found! Recording may have failed.");
    process.exit(1);
  }

  console.log("\n🎉 Done! Quiz recording complete.");
  console.log(`📁 Output: ${FINAL_VIDEO}`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
