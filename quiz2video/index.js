const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");
const devices = puppeteer.devices;

// Set screen dimensions
let w = 720;
let h = 1280;

const encodedData =
  "W3sicXVlc3Rpb24iOiJXaGF0IHdpbGwgYGNvbnNvbGUubG9nKFtdICsge30pYCBvdXRwdXQ/Iiwib3B0aW9ucyI6WyInW29iamVjdCBPYmplY3RdJyIsIidbb2JqZWN0IE9iamVjdF0nIiwiJ3t9JyIsIid1bmRlZmluZWQnIl0sImNvcnJlY3RfYW5zd2VyIjoiJ1tvYmplY3QgT2JqZWN0XSciLCJleHBsYW5hdGlvbiI6IkFuIGVtcHR5IGFycmF5IGlzIGNvbnZlcnRlZCB0byBhbiBlbXB0eSBzdHJpbmcsIGFuZCBhbiBlbXB0eSBvYmplY3QgaXMgY29udmVydGVkIHRvIGBbb2JqZWN0IE9iamVjdF1gLCByZXN1bHRpbmcgaW4gdGhlIGNvbmNhdGVuYXRpb24gYCcnICsgJ1tvYmplY3QgT2JqZWN0XSdgLiJ9LHsicXVlc3Rpb24iOiJXaGljaCBtZXRob2QgY2FuIGJlIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIGFuIGFycmF5IGluY2x1ZGVzIGEgc3BlY2lmaWMgdmFsdWU/Iiwib3B0aW9ucyI6WyJmaW5kKCkiLCJjb250YWlucygpIiwiaW5jbHVkZXMoKSIsImhhcygpIl0sImNvcnJlY3RfYW5zd2VyIjoiaW5jbHVkZXMoKSIsImV4cGxhbmF0aW9uIjoiYGluY2x1ZGVzKClgIGNoZWNrcyB3aGV0aGVyIGFuIGFycmF5IGNvbnRhaW5zIGEgc3BlY2lmaWVkIGVsZW1lbnQsIHJldHVybmluZyBgdHJ1ZWAgb3IgYGZhbHNlYC4ifSx7InF1ZXN0aW9uIjoiV2hhdCB3aWxsIGBjb25zb2xlLmxvZyh0eXBlb2YgZnVuY3Rpb24oKSB7fSlgIG91dHB1dD8iLCJvcHRpb25zIjpbIidmdW5jdGlvbiciLCInb2JqZWN0JyIsIid1bmRlZmluZWQnIiwiJ3N0cmluZyciXSwiY29ycmVjdF9hbnN3ZXIiOiInZnVuY3Rpb24nIiwiZXhwbGFuYXRpb24iOiJGdW5jdGlvbnMgaW4gSmF2YVNjcmlwdCBhcmUgb2YgdHlwZSBgJ2Z1bmN0aW9uJ2AsIGFzIGluZGljYXRlZCBieSB0aGUgYHR5cGVvZmAgb3BlcmF0b3IuIn0seyJxdWVzdGlvbiI6IldoYXQgZG9lcyB0aGUgYE9iamVjdC5lbnRyaWVzKClgIG1ldGhvZCByZXR1cm4/Iiwib3B0aW9ucyI6WyJBcnJheSBvZiB2YWx1ZXMiLCJBcnJheSBvZiBrZXlzIiwiQXJyYXkgb2Yga2V5LXZhbHVlIHBhaXJzIiwiT2JqZWN0IG9mIGtleS12YWx1ZSBwYWlycyJdLCJjb3JyZWN0X2Fuc3dlciI6IkFycmF5IG9mIGtleS12YWx1ZSBwYWlycyIsImV4cGxhbmF0aW9uIjoiYE9iamVjdC5lbnRyaWVzKClgIHJldHVybnMgYW4gYXJyYXkgb2Yga2V5LXZhbHVlIHBhaXJzIGZyb20gYW4gb2JqZWN0IGFzIG5lc3RlZCBhcnJheXMuIn0seyJxdWVzdGlvbiI6IldoYXQgd2lsbCBgY29uc29sZS5sb2coJzInICogJzMnKWAgb3V0cHV0PyIsIm9wdGlvbnMiOlsiJzIzJyIsIjYiLCJOYU4iLCInNiciXSwiY29ycmVjdF9hbnN3ZXIiOiI2IiwiZXhwbGFuYXRpb24iOiJUaGUgYCpgIG9wZXJhdG9yIGNvbnZlcnRzIHN0cmluZ3MgdG8gbnVtYmVycyBiZWZvcmUgbXVsdGlwbHlpbmcsIHJlc3VsdGluZyBpbiBgMiAqIDMgPSA2YC4ifSx7InF1ZXN0aW9uIjoiV2hhdCB3aWxsIGBjb25zb2xlLmxvZyh0eXBlb2YgTmFOKWAgb3V0cHV0PyIsIm9wdGlvbnMiOlsiJ05hTiciLCIndW5kZWZpbmVkJyIsIidudW1iZXInIiwiJ3N0cmluZyciXSwiY29ycmVjdF9hbnN3ZXIiOiInbnVtYmVyJyIsImV4cGxhbmF0aW9uIjoiYE5hTmAgaXMgY29uc2lkZXJlZCBhIG51bWVyaWMgdHlwZSBpbiBKYXZhU2NyaXB0LCBzbyBgdHlwZW9mIE5hTmAgcmV0dXJucyBgJ251bWJlcidgLiJ9LHsicXVlc3Rpb24iOiJXaGF0IGRvZXMgdGhlIGBzb21lKClgIG1ldGhvZCBkbz8iLCJvcHRpb25zIjpbIkNoZWNrcyBpZiBhbGwgZWxlbWVudHMgcGFzcyBhIHRlc3QiLCJDaGVja3MgaWYgYXQgbGVhc3Qgb25lIGVsZW1lbnQgcGFzc2VzIGEgdGVzdCIsIlJldHVybnMgYSBmaWx0ZXJlZCBhcnJheSIsIkNvbWJpbmVzIGVsZW1lbnRzIGludG8gYSBzaW5nbGUgdmFsdWUiXSwiY29ycmVjdF9hbnN3ZXIiOiJDaGVja3MgaWYgYXQgbGVhc3Qgb25lIGVsZW1lbnQgcGFzc2VzIGEgdGVzdCIsImV4cGxhbmF0aW9uIjoiYHNvbWUoKWAgdGVzdHMgd2hldGhlciBhdCBsZWFzdCBvbmUgZWxlbWVudCBpbiB0aGUgYXJyYXkgcGFzc2VzIHRoZSBzcGVjaWZpZWQgdGVzdCBmdW5jdGlvbi4ifSx7InF1ZXN0aW9uIjoiV2hhdCB3aWxsIGBjb25zb2xlLmxvZygnNScgLSAzKWAgb3V0cHV0PyIsIm9wdGlvbnMiOlsiMiIsIic1MyciLCJOYU4iLCInMiciXSwiY29ycmVjdF9hbnN3ZXIiOiIyIiwiZXhwbGFuYXRpb24iOiJUaGUgYC1gIG9wZXJhdG9yIGNvbnZlcnRzIGAnNSdgIHRvIGEgbnVtYmVyIGJlZm9yZSBzdWJ0cmFjdGlvbiwgcmVzdWx0aW5nIGluIGA1IC0gMyA9IDJgLiJ9LHsicXVlc3Rpb24iOiJXaGF0IGlzIHRoZSByZXN1bHQgb2YgYHR5cGVvZiBudWxsYCBpbiBKYXZhU2NyaXB0PyIsIm9wdGlvbnMiOlsiJ251bGwnIiwiJ29iamVjdCciLCIndW5kZWZpbmVkJyIsIidzdHJpbmcnIl0sImNvcnJlY3RfYW5zd2VyIjoiJ29iamVjdCciLCJleHBsYW5hdGlvbiI6ImB0eXBlb2YgbnVsbGAgcmV0dXJucyBgJ29iamVjdCdgIGR1ZSB0byBhIGhpc3RvcmljYWwgYnVnIGluIEphdmFTY3JpcHQuIn0seyJxdWVzdGlvbiI6IldoaWNoIG1ldGhvZCBjYW4gYmUgdXNlZCB0byBjb252ZXJ0IGFuIG9iamVjdCB0byBhIHN0cmluZyByZXByZXNlbnRhdGlvbj8iLCJvcHRpb25zIjpbIkpTT04ucGFyc2UoKSIsIkpTT04uc3RyaW5naWZ5KCkiLCJ0b1N0cmluZygpIiwiU3RyaW5nKCkiXSwiY29ycmVjdF9hbnN3ZXIiOiJKU09OLnN0cmluZ2lmeSgpIiwiZXhwbGFuYXRpb24iOiJgSlNPTi5zdHJpbmdpZnkoKWAgY29udmVydHMgYW4gb2JqZWN0IHRvIGEgSlNPTi1mb3JtYXR0ZWQgc3RyaW5nLiJ9XQ==";
async function runQuizAutomation() {
  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, "screenshots");
  if (fs.existsSync(screenshotsDir)) {
    // Clean up existing screenshots to avoid mixing with new ones
    fs.readdirSync(screenshotsDir)
      .filter((file) => file.endsWith(".png"))
      .forEach((file) => fs.unlinkSync(path.join(screenshotsDir, file)));
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

    const jsonData = decodeURIComponent(escape(atob(encodedData)));
    const sampleQuizData = JSON.parse(jsonData);

    // Load the HTML file with encoded quiz data
    const filePath = `file://${path.resolve("index.html")}?data=${encodedData}`;

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
        path: path.join(
          screenshotsDir,
          `${String(screenshotCounter++).padStart(2, "0")}_question_${questionIndex + 1}.png`,
        ),
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
        path: path.join(
          screenshotsDir,
          `${String(screenshotCounter++).padStart(2, "0")}_question_${questionIndex + 1}_answered.png`,
        ),
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
        execSync("ffmpeg -version", { stdio: "ignore" });
      } catch (ffmpegError) {
        throw new Error(
          "ffmpeg is not installed or not in PATH. Please install ffmpeg to create videos.",
        );
      }

      // execSync(
      //   `ffmpeg -loop 1 -t 10 -i "${screenshotsDir}/$(ls ${screenshotsDir} | head -n 1)" -framerate 0.5 -pattern_type glob -i "${screenshotsDir}/*.png" -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0" -c:v libx264 -pix_fmt yuv420p "${outputVideoPath}"`,
      //   { stdio: "inherit" },
      // );

      const fNames = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "freepd/a",
        "freepd/b",
        "freepd/c",
        "freepd/d",
        "freepd/e",
        "freepd/f",
        "freepd/g",
        "freepd/h",
        "freepd/i",
        "freepd/j",
        "freepd/k",
        "freepd/l",
        "freepd/m",
        "freepd/n",
        "freepd/o",
        "freepd/p",
        "freepd/q",
        "freepd/r",
        "freepd/s",
        "freepd/t",
        "freepd/u",
        "freepd/v",
        "freepd/w",
        "freepd/x",
        "freepd/y",
        "freepd/z",
      ];
      const audioDir = path.join(__dirname, "yt");
      const fName = fNames[Math.floor(Math.random() * fNames.length)] + "_59";
      const audioFilePath = `${audioDir}/${fName}.mp3`;
      execSync(
        `ffmpeg -framerate 1/3 -pattern_type glob -i "${screenshotsDir}/*.png"  -i "${audioFilePath}" -c:v libx264 -pix_fmt yuv420p -r 30 "${outputVideoPath}"`,
        { stdio: "inherit" },
      );
      console.log(`Video created successfully at: ${outputVideoPath}`);
    } catch (ffmpegError) {
      console.error("Error creating video:", ffmpegError.message);
      console.log(
        "Screenshots are still available in the screenshots directory.",
      );
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
