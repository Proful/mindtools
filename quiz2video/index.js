const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");
const devices = puppeteer.devices;

// Set screen dimensions
let w = 720;
let h = 1280;

const encodedData =
  "W3sicXVlc3Rpb24iOiJXaGF0IGlzIHRoZSBwcmltYXJ5IGZ1bmN0aW9uIG9mIHdoaXRlIGJsb29kIGNlbGxzIChXQkNzKT8iLCJvcHRpb25zIjpbIkNhcnJ5IG94eWdlbiIsIkZpZ2h0IGluZmVjdGlvbnMiLCJDbG90IGJsb29kIiwiQ2FycnkgbnV0cmllbnRzIl0sImNvcnJlY3RfYW5zd2VyIjoiRmlnaHQgaW5mZWN0aW9ucyIsImV4cGxhbmF0aW9uIjoiV2hpdGUgYmxvb2QgY2VsbHMgcHJvdGVjdCB0aGUgYm9keSBhZ2FpbnN0IGdlcm1zLCBpbmZlY3Rpb25zLCBhbmQgb3RoZXIgaGFybWZ1bCBzdWJzdGFuY2VzLiJ9LHsicXVlc3Rpb24iOiJXaGljaCBvcmdhbiBzeXN0ZW0gaW5jbHVkZXMgdGhlIGJyYWluLCBzcGluYWwgY29yZCwgYW5kIG5lcnZlcz8iLCJvcHRpb25zIjpbIkNpcmN1bGF0b3J5IHN5c3RlbSIsIlNrZWxldGFsIHN5c3RlbSIsIk5lcnZvdXMgc3lzdGVtIiwiRGlnZXN0aXZlIHN5c3RlbSJdLCJjb3JyZWN0X2Fuc3dlciI6Ik5lcnZvdXMgc3lzdGVtIiwiZXhwbGFuYXRpb24iOiJUaGUgbmVydm91cyBzeXN0ZW0gY29uc2lzdHMgb2YgdGhlIGJyYWluLCBzcGluYWwgY29yZCwgYW5kIG5lcnZlcywgYW5kIGl0IGNvbnRyb2xzIGFsbCBib2R5IGZ1bmN0aW9ucy4ifSx7InF1ZXN0aW9uIjoiV2hhdCB0eXBlIG9mIGJsb29kIHZlc3NlbCBjYXJyaWVzIGJsb29kIGF3YXkgZnJvbSB0aGUgaGVhcnQ/Iiwib3B0aW9ucyI6WyJBcnRlcmllcyIsIlZlaW5zIiwiQ2FwaWxsYXJpZXMiLCJWYWx2ZXMiXSwiY29ycmVjdF9hbnN3ZXIiOiJBcnRlcmllcyIsImV4cGxhbmF0aW9uIjoiQXJ0ZXJpZXMgY2Fycnkgb3h5Z2VuLXJpY2ggYmxvb2QgYXdheSBmcm9tIHRoZSBoZWFydCB0byB2YXJpb3VzIHBhcnRzIG9mIHRoZSBib2R5LiJ9LHsicXVlc3Rpb24iOiJXaGljaCBjaGFtYmVyIG9mIHRoZSBoZWFydCBwdW1wcyBveHlnZW4tcG9vciBibG9vZCB0byB0aGUgbHVuZ3M/Iiwib3B0aW9ucyI6WyJSaWdodCBhdHJpdW0iLCJMZWZ0IGF0cml1bSIsIlJpZ2h0IHZlbnRyaWNsZSIsIkxlZnQgdmVudHJpY2xlIl0sImNvcnJlY3RfYW5zd2VyIjoiUmlnaHQgdmVudHJpY2xlIiwiZXhwbGFuYXRpb24iOiJUaGUgcmlnaHQgdmVudHJpY2xlIHB1bXBzIG94eWdlbi1wb29yIGJsb29kIHRvIHRoZSBsdW5ncyB0aHJvdWdoIHRoZSBwdWxtb25hcnkgYXJ0ZXJ5LiJ9LHsicXVlc3Rpb24iOiJXaGF0IGlzIHRoZSBmdW5jdGlvbiBvZiB0aGUgdmFsdmVzIGxvY2F0ZWQgYmV0d2VlbiB0aGUgaGVhcnQgY2hhbWJlcnM/Iiwib3B0aW9ucyI6WyJQcmV2ZW50IGJsb29kIGNsb3R0aW5nIiwiUHJldmVudCBiYWNrZmxvdyBvZiBibG9vZCIsIlN0b3JlIG94eWdlbiIsIlJlbW92ZSB3YXN0ZSJdLCJjb3JyZWN0X2Fuc3dlciI6IlByZXZlbnQgYmFja2Zsb3cgb2YgYmxvb2QiLCJleHBsYW5hdGlvbiI6IlZhbHZlcyBlbnN1cmUgdGhhdCBibG9vZCBmbG93cyBpbiB0aGUgY29ycmVjdCBkaXJlY3Rpb24gYW5kIHByZXZlbnQgaXQgZnJvbSBmbG93aW5nIGJhY2t3YXJkLiJ9LHsicXVlc3Rpb24iOiJXaGF0IGlzIHRoZSBwdXJwb3NlIG9mIGJsb29kIHBsYXRlbGV0cz8iLCJvcHRpb25zIjpbIkNhcnJ5IG94eWdlbiIsIkZvcm0gY2xvdHMiLCJUcmFuc3BvcnQgbnV0cmllbnRzIiwiU3RvcmUgZ2x1Y29zZSJdLCJjb3JyZWN0X2Fuc3dlciI6IkZvcm0gY2xvdHMiLCJleHBsYW5hdGlvbiI6IlBsYXRlbGV0cyBoZWxwIGJsb29kIHRvIGNsb3QsIHByZXZlbnRpbmcgZXhjZXNzaXZlIGJsZWVkaW5nIGZyb20gaW5qdXJpZXMuIn0seyJxdWVzdGlvbiI6IldoYXQgaGFwcGVucyB3aGVuIGFydGVyaWVzIGJlY29tZSBuYXJyb3cgZHVlIHRvIGZhdCBkZXBvc2l0cz8iLCJvcHRpb25zIjpbIkJsb29kIHByZXNzdXJlIGluY3JlYXNlcyIsIkJsb29kIHByZXNzdXJlIGRlY3JlYXNlcyIsIkhlYXJ0IHJhdGUgZGVjcmVhc2VzIiwiSGVhcnQgcmF0ZSByZW1haW5zIHRoZSBzYW1lIl0sImNvcnJlY3RfYW5zd2VyIjoiQmxvb2QgcHJlc3N1cmUgaW5jcmVhc2VzIiwiZXhwbGFuYXRpb24iOiJOYXJyb3dlZCBhcnRlcmllcyBpbmNyZWFzZSBibG9vZCBwcmVzc3VyZSBhcyB0aGUgaGVhcnQgaGFzIHRvIHdvcmsgaGFyZGVyIHRvIHB1bXAgYmxvb2QgdGhyb3VnaCB0aGVtLiJ9LHsicXVlc3Rpb24iOiJXaGljaCBvcmdhbiBzeXN0ZW0gaXMgZGlyZWN0bHkgcmVzcG9uc2libGUgZm9yIG94eWdlbmF0aW5nIGJsb29kPyIsIm9wdGlvbnMiOlsiRGlnZXN0aXZlIHN5c3RlbSIsIlJlc3BpcmF0b3J5IHN5c3RlbSIsIlNrZWxldGFsIHN5c3RlbSIsIkV4Y3JldG9yeSBzeXN0ZW0iXSwiY29ycmVjdF9hbnN3ZXIiOiJSZXNwaXJhdG9yeSBzeXN0ZW0iLCJleHBsYW5hdGlvbiI6IlRoZSByZXNwaXJhdG9yeSBzeXN0ZW0gdGFrZXMgaW4gb3h5Z2VuIGFuZCBleHBlbHMgY2FyYm9uIGRpb3hpZGUsIG94eWdlbmF0aW5nIHRoZSBibG9vZC4ifSx7InF1ZXN0aW9uIjoiV2hhdCBpcyB0aGUgbXVzY3VsYXIgb3JnYW4gdGhhdCBwdW1wcyBibG9vZCB0aHJvdWdob3V0IHRoZSBib2R5PyIsIm9wdGlvbnMiOlsiTHVuZ3MiLCJIZWFydCIsIktpZG5leXMiLCJMaXZlciJdLCJjb3JyZWN0X2Fuc3dlciI6IkhlYXJ0IiwiZXhwbGFuYXRpb24iOiJUaGUgaGVhcnQgaXMgYSBtdXNjdWxhciBvcmdhbiB0aGF0IGNvbnRpbnVvdXNseSBwdW1wcyBibG9vZCB0byB0aGUgYm9keSBhbmQgbHVuZ3MuIn0seyJxdWVzdGlvbiI6IldoYXQgaXMgdGhlIHRlcm0gZm9yIHRoZSByaHl0aG1pYyBleHBhbnNpb24gYW5kIGNvbnRyYWN0aW9uIG9mIGFydGVyaWVzIGFzIGJsb29kIGZsb3dzIHRocm91Z2ggdGhlbT8iLCJvcHRpb25zIjpbIlB1bHNlIiwiQmVhdCIsIldhdmUiLCJGbG93Il0sImNvcnJlY3RfYW5zd2VyIjoiUHVsc2UiLCJleHBsYW5hdGlvbiI6IlRoZSBwdWxzZSBpcyB0aGUgcmh5dGhtaWMgdGhyb2JiaW5nIG9mIGFydGVyaWVzIGNhdXNlZCBieSB0aGUgY29udHJhY3Rpb24gb2YgdGhlIGhlYXJ0LiJ9XQ==";
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
