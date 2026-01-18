const fs = require("fs");

// Levenshtein distance for edit distance calculation
function levenshtein(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Normalize text aggressively
function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .replace(/\s+/g, " ") // Collapse whitespace
    .trim();
}

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
  "who",
  "how",
]);

// Tokenize and remove stop words
function tokenize(text) {
  const normalized = normalizeText(text);
  const tokens = normalized.split(" ").filter((token) => token.length > 0);
  return tokens.filter((token) => !STOP_WORDS.has(token));
}

// Calculate similarity between two tokens using edit distance
function tokenSimilarity(token1, token2) {
  const maxLen = Math.max(token1.length, token2.length);
  if (maxLen === 0) return 1.0;

  const distance = levenshtein(token1, token2);
  return 1 - distance / maxLen;
}

// Weighted token scoring - find best match for each query token
function weightedTokenScore(queryTokens, targetTokens) {
  if (queryTokens.length === 0) return 0;

  let totalScore = 0;

  for (const queryToken of queryTokens) {
    let bestMatch = 0;

    for (const targetToken of targetTokens) {
      const similarity = tokenSimilarity(queryToken, targetToken);
      bestMatch = Math.max(bestMatch, similarity);
    }

    totalScore += bestMatch;
  }

  return totalScore / queryTokens.length;
}

// Jaccard similarity for set overlap
function jaccardSimilarity(tokens1, tokens2) {
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return union.size === 0 ? 0 : intersection.size / union.size;
}

// Overall fuzzy matching with combined techniques
function fuzzyMatch(query, target) {
  const queryTokens = tokenize(query);
  const targetTokens = tokenize(target);

  // Different scoring methods
  const weightedScore = weightedTokenScore(queryTokens, targetTokens);
  const jaccardScore = jaccardSimilarity(queryTokens, targetTokens);

  // Normalized text comparison for exact matches after normalization
  const normalizedQuery = normalizeText(query);
  const normalizedTarget = normalizeText(target);
  const exactMatchScore = normalizedQuery === normalizedTarget ? 1.0 : 0;

  // String similarity on full normalized text
  const fullTextSimilarity = tokenSimilarity(normalizedQuery, normalizedTarget);

  // Combined score (weighted average)
  const combinedScore =
    weightedScore * 0.4 +
    jaccardScore * 0.3 +
    fullTextSimilarity * 0.2 +
    exactMatchScore * 0.1;

  return {
    combinedScore,
    weightedTokenScore: weightedScore,
    jaccardScore,
    fullTextSimilarity,
    exactMatch: exactMatchScore === 1.0,
    queryTokens,
    targetTokens,
  };
}

// Main function
function analyzeQuestions(inputFile, queryQuestion) {
  try {
    // Read JSON file
    const data = JSON.parse(fs.readFileSync(inputFile, "utf8"));

    console.log("=".repeat(80));
    console.log("FUZZY QUESTION MATCHING ANALYSIS");
    console.log("=".repeat(80));
    console.log(`\nQuery Question: "${queryQuestion}"\n`);
    console.log("Normalized Query:", normalizeText(queryQuestion));
    console.log("Query Tokens:", tokenize(queryQuestion).join(", "));
    console.log("\n" + "=".repeat(80) + "\n");

    // Score all questions
    const results = data.map((item, index) => {
      const matchResult = fuzzyMatch(queryQuestion, item.question);
      return {
        index: index + 1,
        question: item.question,
        ...matchResult,
      };
    });

    // Sort by combined score
    results.sort((a, b) => b.combinedScore - a.combinedScore);

    // Display results
    results.forEach((result) => {
      console.log(`Question #${result.index}:`);
      console.log(`  Text: "${result.question}"`);
      console.log(`  Target Tokens: ${result.targetTokens.join(", ")}`);
      console.log(`\n  SCORES:`);
      console.log(
        `    Combined Score:        ${(result.combinedScore * 100).toFixed(2)}%`,
      );
      console.log(
        `    Weighted Token Score:  ${(result.weightedTokenScore * 100).toFixed(2)}%`,
      );
      console.log(
        `    Jaccard Similarity:    ${(result.jaccardScore * 100).toFixed(2)}%`,
      );
      console.log(
        `    Full Text Similarity:  ${(result.fullTextSimilarity * 100).toFixed(2)}%`,
      );
      console.log(
        `    Exact Match:           ${result.exactMatch ? "YES" : "NO"}`,
      );
      console.log("\n" + "-".repeat(80) + "\n");
    });

    // Summary
    console.log("SUMMARY:");
    console.log(`Total questions analyzed: ${results.length}`);
    console.log(
      `Best match: Question #${results[0].index} (${(results[0].combinedScore * 100).toFixed(2)}%)`,
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Compare all questions with each other
function findSimilarQuestions(inputFile, threshold = 0.9) {
  try {
    // Read JSON file
    const data = JSON.parse(fs.readFileSync(inputFile, "utf8"));

    console.log("=".repeat(80));
    console.log("DUPLICATE/SIMILAR QUESTION DETECTION");
    console.log("=".repeat(80));
    console.log(
      `Threshold: Full Text Similarity > ${(threshold * 100).toFixed(0)}%`,
    );
    console.log(`Total Questions: ${data.length}\n`);
    console.log("=".repeat(80) + "\n");

    const similarPairs = [];

    // Compare each question with every other question
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const question1 = data[i].question;
        const question2 = data[j].question;

        const matchResult = fuzzyMatch(question1, question2);

        // Check if full text similarity exceeds threshold
        if (matchResult.fullTextSimilarity > threshold) {
          similarPairs.push({
            index1: i + 1,
            index2: j + 1,
            question1,
            question2,
            fullTextSimilarity: matchResult.fullTextSimilarity,
            combinedScore: matchResult.combinedScore,
            weightedTokenScore: matchResult.weightedTokenScore,
            jaccardScore: matchResult.jaccardScore,
            exactMatch: matchResult.exactMatch,
            tokens1: matchResult.queryTokens,
            tokens2: matchResult.targetTokens,
          });
        }
      }
    }

    // Display results
    if (similarPairs.length === 0) {
      console.log("✓ No similar questions found above the threshold.\n");
    } else {
      console.log(
        `⚠ Found ${similarPairs.length} similar question pair(s):\n`,
      );

      similarPairs.forEach((pair, idx) => {
        console.log(`MATCH #${idx + 1}:`);
        console.log(`  Question #${pair.index1}:`);
        console.log(`    "${pair.question1}"`);
        console.log(`    Tokens: [${pair.tokens1.join(", ")}]`);
        console.log();
        console.log(`  Question #${pair.index2}:`);
        console.log(`    "${pair.question2}"`);
        console.log(`    Tokens: [${pair.tokens2.join(", ")}]`);
        console.log();
        console.log(`  SIMILARITY SCORES:`);
        console.log(
          `    Full Text Similarity:  ${(pair.fullTextSimilarity * 100).toFixed(2)}% ⭐`,
        );
        console.log(
          `    Combined Score:        ${(pair.combinedScore * 100).toFixed(2)}%`,
        );
        console.log(
          `    Weighted Token Score:  ${(pair.weightedTokenScore * 100).toFixed(2)}%`,
        );
        console.log(
          `    Jaccard Similarity:    ${(pair.jaccardScore * 100).toFixed(2)}%`,
        );
        console.log(
          `    Exact Match:           ${pair.exactMatch ? "YES" : "NO"}`,
        );
        console.log("\n" + "-".repeat(80) + "\n");
      });
    }

    // Summary
    console.log("SUMMARY:");
    console.log(
      `  Total comparisons made: ${(data.length * (data.length - 1)) / 2}`,
    );
    console.log(`  Similar pairs found: ${similarPairs.length}`);
    console.log(`  Similarity threshold: ${(threshold * 100).toFixed(0)}%`);

    return similarPairs;
  } catch (error) {
    console.error("Error:", error.message);
    return [];
  }
}

// Example usage - choose one mode:

// MODE 1: Compare all questions with each other (NEW FEATURE)
const inputFile = "questions.json";
findSimilarQuestions(inputFile, 0.9); // 90% threshold

// MODE 2: Search for a specific question (commented out)
// const queryQuestion = 'Which vitamin helps in blood clotting?';
// analyzeQuestions(inputFile, queryQuestion);

// Export for use as module
module.exports = {
  normalizeText,
  tokenize,
  fuzzyMatch,
  analyzeQuestions,
  findSimilarQuestions,
};
