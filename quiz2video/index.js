const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");
const devices = puppeteer.devices;

// Set screen dimensions
let w = 720;
let h = 1280;

async function runQuizAutomation() {
  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, "screenshots");
  if (fs.existsSync(screenshotsDir)) {
    // Clean up existing screenshots to avoid mixing with new ones
    fs.readdirSync(screenshotsDir)
      .filter(file => file.endsWith('.png'))
      .forEach(file => fs.unlinkSync(path.join(screenshotsDir, file)));
    console.log("Cleaned up existing screenshots");
  } else {
    fs.mkdirSync(screenshotsDir);
  }
  
  // Screenshot counter for sequential numbering
  let screenshotCounter = 1;

  // Launch browser
  const browser = await puppeteer.launch({
    headless: false, // Use non-headless mode to better see the automation
    defaultViewport: {
      width: w,
      height: h,
    },
    args: [`--window-size=${w},${h}`],
  });

  try {
    // Create new page
    const page = await browser.newPage();

    // Sample quiz data with correct answers at various positions
    const sampleQuizData = [
      {
        question: "What is JavaScript?",
        options: [
          "A programming language",
          "A markup language",
          "A database",
          "An operating system",
        ],
        correct_answer: "A programming language",
        explanation:
          "JavaScript is a programming language used for web development.",
      },
      {
        question: "What does HTML stand for?",
        options: [
          "High Tech Machine Learning",
          "Hyper Text Markup Language", // Correct answer at index 1
          "Home Tool Management Language",
          "Hyperlink Text Making Language",
        ],
        correct_answer: "Hyper Text Markup Language",
        explanation:
          "HTML is the standard markup language for documents designed to be displayed in a web browser.",
      },
      {
        question: "Which tool is used for automating browsers?",
        options: [
          "MongoDB",
          "React",
          "Puppeteer", // Correct answer at index 2
          "Excel",
        ],
        correct_answer: "Puppeteer",
        explanation:
          "Puppeteer is a Node.js library which provides a high-level API to control headless Chrome or Chromium.",
      },
      {
        question: "What does CSS stand for?",
        options: [
          "Computer Style Systems",
          "Creative Style Solutions",
          "Colorful Style Sheets",
          "Cascading Style Sheets", // Correct answer at index 3
        ],
        correct_answer: "Cascading Style Sheets",
        explanation:
          "CSS stands for Cascading Style Sheets and is used to style web pages.",
      },
    ];

    // Convert quiz data to base64
    const quizDataBase64 = Buffer.from(JSON.stringify(sampleQuizData)).toString(
      "base64",
    );

    // Load the HTML file with encoded quiz data
    const filePath = `file://${path.resolve("index.html")}?data=${encodeURIComponent(quizDataBase64)}`;

    await page.goto(filePath, { waitUntil: "networkidle0" });
    console.log("Page loaded successfully");

    // Get the full height of the page
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);

    // Custom mobile device configuration
    const customMobileDevice = {
      viewport: {
        width: w,
        height: pageHeight,
        isMobile: true,
        hasTouch: true,
        isLandscape: false,
        deviceScaleFactor: 1,
      },
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
    };

    await page.setViewport(customMobileDevice.viewport);
    await page.setUserAgent(customMobileDevice.userAgent);

    console.log("Taking screenshots during quiz navigation...");
    
    // Wait for the quiz to load
    await page.waitForSelector(".options", { timeout: 5000 });
    console.log("Quiz loaded");

    // Take screenshot of initial quiz state
    // await page.screenshot({
    //   path: path.join(screenshotsDir, `${String(screenshotCounter++).padStart(2, '0')}_quiz_start.png`),
    //   fullPage: true,
    // });
    // console.log("Initial screenshot taken");

    // Pause for a moment to see the initial state
    await page.waitForTimeout(2000);

    // Handle all quiz questions
    console.log("Starting to answer all questions...");

    let isLastQuestion = false;

    // Continue until we reach the end of the quiz
    while (!isLastQuestion) {
      // Wait for options to be visible
      await page.waitForSelector(".options", { visible: true });

      // Get current question number (0-based index)
      let questionIndex = await page.evaluate(() => {
        const questionNumberText =
          document.querySelector(".question-number").textContent;
        const match = questionNumberText.match(/Question (\d+) of/);
        return match ? parseInt(match[1]) - 1 : 0;
      });

      console.log(`Currently on question ${questionIndex + 1}`);

      // Get the current question text
      const currentQuestionText = await page.evaluate(() => {
        return document.querySelector(".question").textContent;
      });
      console.log(`Question: ${currentQuestionText}`);

      // Take screenshot before selecting answer
      await page.screenshot({
        path: path.join(screenshotsDir, `${String(screenshotCounter++).padStart(2, '0')}_question_${questionIndex + 1}.png`),
        fullPage: true,
      });

      // Find the correct answer for this question by extracting options text and comparing with quizData
      const correctAnswerIndex = await page.evaluate((questionData) => {
        // Get all available options on the page
        const optionElements = document.querySelectorAll(".option");
        const options = Array.from(optionElements).map((el) =>
          el.querySelector("label").textContent.trim(),
        );

        // Find the index of the correct answer
        const correctAnswer = questionData.correct_answer;
        return options.findIndex((option) => option.includes(correctAnswer));
      }, sampleQuizData[questionIndex]);

      console.log(`Found correct answer at index: ${correctAnswerIndex}`);

      // Click the correct option
      console.log(`Selecting correct answer (option ${correctAnswerIndex})...`);
      await page.click(`.option[data-index="${correctAnswerIndex}"]`);

      // Wait to see the selection and feedback
      await page.waitForTimeout(1000);

      // Take screenshot after selecting answer (showing feedback)
      await page.screenshot({
        path: path.join(screenshotsDir, `${String(screenshotCounter++).padStart(2, '0')}_question_${questionIndex + 1}_answered.png`),
        fullPage: true,
      });

      // Check if this is the last question by looking for the result button
      const isResultButtonVisible = await page.evaluate(() => {
        const resultButton = document.querySelector(".btn-result");
        return (
          !!resultButton &&
          window.getComputedStyle(resultButton).display !== "none"
        );
      });

      isLastQuestion = isResultButtonVisible;

      if (isLastQuestion) {
        // Click the "See Results" button on the last question
        console.log("Clicking See Results button...");
        await page.click(".btn-result");
      } else {
        // Click the Next button
        console.log("Clicking Next button...");
        await page.click(".btn-next");
      }

      // Wait to see the next question or results
      await page.waitForTimeout(1000);
    }

    // Wait for results page and take final screenshot
    console.log("Reached quiz results page");
    await page.waitForTimeout(1000);
    
    // Take screenshot of results page
    // await page.screenshot({
    //   path: path.join(screenshotsDir, `${String(screenshotCounter++).padStart(2, '0')}_quiz_results.png`),
    //   fullPage: true,
    // });
    
    console.log(`All screenshots have been saved to: ${screenshotsDir}`);
    
    // Generate video from screenshots using ffmpeg
    console.log("Converting screenshots to video...");
    
    try {
      const outputVideoPath = path.join(__dirname, "quiz_recording.mp4");
      
      // Check if ffmpeg is installed
      try {
        execSync("ffmpeg -version", { stdio: 'ignore' });
      } catch (ffmpegError) {
        throw new Error("ffmpeg is not installed or not in PATH. Please install ffmpeg to create videos.");
      }
      
      // Use ffmpeg to convert the PNG files to an MP4 video
      // -framerate: Sets frames per second (adjust as needed)
      // -pattern_type glob -i: Uses glob pattern to match all PNG files
      // -c:v libx264: Uses H.264 codec for video compression
      // -pix_fmt yuv420p: Sets pixel format for better compatibility
      // -vf "fps=2": Sets the output framerate to 2 FPS (adjust as needed)
      // execSync(
      //   `ffmpeg -framerate 0.2 -pattern_type glob -i "${screenshotsDir}/*.png" -c:v libx264 -pix_fmt yuv420p "${outputVideoPath}"`,
      //   { stdio: 'inherit' }
      // );
      
execSync(
  `ffmpeg -loop 1 -t 4 -i "${screenshotsDir}/$(ls ${screenshotsDir} | head -n 1)" -framerate 0.25 -pattern_type glob -i "${screenshotsDir}/*.png" -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0" -c:v libx264 -pix_fmt yuv420p "${outputVideoPath}"`,
  { stdio: 'inherit' }
);
      console.log(`Video created successfully at: ${outputVideoPath}`);
    } catch (ffmpegError) {
      console.error("Error creating video:", ffmpegError.message);
      console.log("Screenshots are still available in the screenshots directory.");
    }
    
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // Close browser
    await browser.close();
    console.log("Browser closed");
  }
}

// Run the automation script
runQuizAutomation().catch(console.error);
