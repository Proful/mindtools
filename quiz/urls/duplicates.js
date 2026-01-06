const fs = require("fs");

// Common English stop words
const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "has",
  "he",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "that",
  "the",
  "to",
  "was",
  "will",
  "with",
  "which",
  "what",
  "where",
  "when",
  "who",
]);

/**
 * Normalize text for comparison
 * @param {string} text - Input text to normalize
 * @returns {string} Normalized text
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .replace(/\s+/g, " ") // Collapse whitespace
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove accents
}

/**
 * Tokenize text and remove stop words
 * @param {string} text - Input text to tokenize
 * @returns {string[]} Array of tokens
 */
function tokenize(text) {
  const normalized = normalizeText(text);
  return normalized
    .split(/\s+/)
    .filter((token) => token.length > 0 && !STOP_WORDS.has(token));
}

/**
 * Calculate Jaccard similarity between two token arrays
 * @param {string[]} tokens1 - First set of tokens
 * @param {string[]} tokens2 - Second set of tokens
 * @returns {number} Similarity score (0-1)
 */
function calculateSimilarity(tokens1, tokens2) {
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Compare all questions in the array
 * @param {Array} questions - Array of question objects
 * @returns {Array} Array of similar question pairs
 */
function compareQuestions(questions) {
  const results = [];

  for (let i = 0; i < questions.length; i++) {
    for (let j = i + 1; j < questions.length; j++) {
      const q1 = questions[i].question;
      const q2 = questions[j].question;

      const tokens1 = tokenize(q1);
      const tokens2 = tokenize(q2);

      const similarity = calculateSimilarity(tokens1, tokens2);

      // Store results for pairs with similarity > 0
      if (similarity > 0) {
        results.push({
          index1: i,
          index2: j,
          question1: q1,
          question2: q2,
          tokens1: tokens1,
          tokens2: tokens2,
          similarity: similarity,
          explanation1Length: questions[i].explanation
            ? questions[i].explanation.length
            : 0,
          explanation2Length: questions[j].explanation
            ? questions[j].explanation.length
            : 0,
        });
      }
    }
  }

  return results;
}

/**
 * Remove duplicates based on similarity threshold
 * @param {Array} questions - Array of question objects
 * @param {number} threshold - Similarity threshold (0-1)
 * @returns {Object} Object containing filtered questions and removed indices
 */
function removeDuplicates(questions, threshold = 0.9) {
  const similarities = compareQuestions(questions);
  const indicesToRemove = new Set();
  const duplicatePairs = [];

  // Find high similarity pairs (>= threshold)
  const highSimilarity = similarities.filter((s) => s.similarity >= threshold);

  highSimilarity.forEach((result) => {
    // Skip if either index is already marked for removal
    if (
      indicesToRemove.has(result.index1) ||
      indicesToRemove.has(result.index2)
    ) {
      return;
    }

    // Remove the one with shorter explanation
    const indexToRemove =
      result.explanation1Length < result.explanation2Length
        ? result.index1
        : result.index2;

    const indexToKeep =
      indexToRemove === result.index1 ? result.index2 : result.index1;

    indicesToRemove.add(indexToRemove);

    duplicatePairs.push({
      removed: {
        index: indexToRemove,
        question: questions[indexToRemove].question,
        explanationLength: questions[indexToRemove].explanation
          ? questions[indexToRemove].explanation.length
          : 0,
      },
      kept: {
        index: indexToKeep,
        question: questions[indexToKeep].question,
        explanationLength: questions[indexToKeep].explanation
          ? questions[indexToKeep].explanation.length
          : 0,
      },
      similarity: (result.similarity * 100).toFixed(1),
    });
  });

  // Filter out duplicate questions
  const filteredQuestions = questions.filter(
    (_, index) => !indicesToRemove.has(index),
  );

  return {
    filteredQuestions,
    duplicatePairs,
    originalCount: questions.length,
    removedCount: indicesToRemove.size,
    finalCount: filteredQuestions.length,
  };
}

/**
 * Main function
 */
function main() {
  const inputFile = "questions.json";
  const outputFile = "questions_deduplicated.json";
  const threshold = 0.9; // 90% similarity threshold

  try {
    // Read JSON file
    const data = fs.readFileSync(inputFile, "utf8");
    const questions = JSON.parse(data);

    console.log(`Loaded ${questions.length} questions from ${inputFile}\n`);

    // Compare questions and remove duplicates
    console.log("=== ANALYZING QUESTIONS ===\n");
    const result = removeDuplicates(questions, threshold);

    // Display duplicates found
    if (result.duplicatePairs.length > 0) {
      console.log(
        `Found ${result.duplicatePairs.length} duplicate pair(s) with ≥${threshold * 100}% similarity:\n`,
      );

      result.duplicatePairs.forEach((pair, idx) => {
        console.log(`Duplicate #${idx + 1} (${pair.similarity}% similar):`);
        console.log(
          `  ❌ REMOVED (Index ${pair.removed.index}): "${pair.removed.question}"`,
        );
        console.log(
          `     Explanation length: ${pair.removed.explanationLength} chars`,
        );
        console.log(
          `  ✓ KEPT (Index ${pair.kept.index}): "${pair.kept.question}"`,
        );
        console.log(
          `     Explanation length: ${pair.kept.explanationLength} chars`,
        );
        console.log();
      });
    } else {
      console.log(
        `No duplicates found with ≥${threshold * 100}% similarity.\n`,
      );
    }

    // Write deduplicated questions to new file
    fs.writeFileSync(
      outputFile,
      JSON.stringify(result.filteredQuestions, null, 2),
      "utf8",
    );

    // Summary
    console.log("=== SUMMARY ===");
    console.log(`Original questions: ${result.originalCount}`);
    console.log(`Duplicates removed: ${result.removedCount}`);
    console.log(`Final questions: ${result.finalCount}`);
    console.log(`\n✓ Deduplicated questions saved to: ${outputFile}`);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.code === "ENOENT") {
      console.error(
        `\nMake sure ${inputFile} exists in the current directory.`,
      );
    }
  }
}

// Run the program
main();
