const fs = require("fs");
const zlib = require("zlib");
const { promisify } = require("util");

const gunzip = promisify(zlib.gunzip);

async function decodeAndCombineData(filePath) {
  try {
    // Read the file
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Split by lines and filter out empty lines
    const lines = fileContent.split("\n").filter((line) => line.trim());

    console.log(`Found ${lines.length} lines to process`);

    const allData = [];

    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const encodedData = lines[i].trim();

      if (!encodedData) continue;

      try {
        // Replace URL-safe base64 characters with standard base64
        const base64 = encodedData
          .replace(/-/g, "+")
          .replace(/_/g, "/")
          .replace(/~/g, "=");

        // Convert base64 to buffer
        const compressedBuffer = Buffer.from(base64, "base64");

        // Decompress gzip data
        const decompressedBuffer = await gunzip(compressedBuffer);

        // Convert to string and parse JSON
        const jsonString = decompressedBuffer.toString("utf8");
        const jsonData = JSON.parse(jsonString);

        // Add to combined array
        allData.push(...jsonData);

        console.log(`Successfully processed line ${i + 1}`);
      } catch (err) {
        console.error(`Error processing line ${i + 1}:`, err.message);
      }
    }

    // Write to output file
    const outputPath = "combined_output.json";
    fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));

    console.log(`\nSuccessfully combined ${allData.length} records`);
    console.log(`Output written to: ${outputPath}`);

    return allData;
  } catch (err) {
    console.error("Error reading or processing file:", err);
    throw err;
  }
}

// Usage
const inputFile = "sc-6-jan-26.txt";

decodeAndCombineData(inputFile)
  .then((data) => {
    console.log("\nFirst record preview:");
    console.log(JSON.stringify(data[0], null, 2).substring(0, 200) + "...");
  })
  .catch((err) => {
    console.error("Failed:", err);
    process.exit(1);
  });
