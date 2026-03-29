import path from "node:path";
import { listFiles, writeJsonFile, writeTextFile } from "../utils/fs.js";
import { ingestPaper } from "../pipelines/ingest.js";
import { analyzePaper } from "../pipelines/analyze.js";
import { synthesizeReview } from "../pipelines/synthesize.js";
import { writeReviewArtifacts } from "../../tools/review_exporter.js";

async function main(): Promise<void> {
  const rawDir = process.argv[2] ?? path.join("papers", "raw");
  const pdfs = await listFiles(rawDir, [".pdf"]);
  const summaries: Array<Record<string, unknown>> = [];

  for (const pdfPath of pdfs) {
    const enriched = await ingestPaper(pdfPath);
    const analysis = analyzePaper(enriched);
    const review = synthesizeReview(enriched, analysis.sectionReviews, analysis.issues, analysis.strengths, analysis.weaknesses, analysis.questionsForAuthors, analysis.redFlags);
    await writeReviewArtifacts(review);
    summaries.push({ paper_id: review.paper_id, recommendation: review.recommendation, confidence: review.confidence, issue_count: review.issues.length });
  }

  await writeJsonFile(path.join("reviews", "json", "portfolio.summary.json"), summaries);
  await writeTextFile(path.join("reviews", "markdown", "portfolio.summary.md"), ["# Portfolio Summary","",...summaries.map((item) => `- ${item.paper_id}: ${item.recommendation} (confidence ${Number(item.confidence).toFixed(2)})`)].join("\n"));
  await writeTextFile(path.join("reviews", "html", "portfolio.summary.html"), `<!doctype html><html><body><h1>Portfolio Summary</h1><ul>${summaries.map((item) => `<li>${item.paper_id}: ${item.recommendation} (confidence ${Number(item.confidence).toFixed(2)})</li>`).join("")}</ul></body></html>`);
  console.log(`Processed ${pdfs.length} paper(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
