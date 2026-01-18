const fs = require("fs");
function main() {
  const inputFile = "questions_deduplicated.json";

  try {
    // Read JSON file
    const data = fs.readFileSync(inputFile, "utf8");
    const questions = JSON.parse(data);

    questions.forEach((q) => {
      console.log("# " + q.question);
      console.log("### " + q.correct_answer);
      console.log(q.explanation);
    });
  } catch (e) {
    console.error(e);
  }
}

main();
