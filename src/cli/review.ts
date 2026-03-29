import path from "node:path";
import { ingestPaper } from "../pipelines/ingest.js";
import { analyzePaper } from "../pipelines/analyze.js";
import { synthesizeReview } from "../pipelines/synthesize.js";
import { writeReviewArtifacts } from "../../tools/review_exporter.js";

async function main(): Promise<void> {
  const input = process.argv[2] ?? path.join("papers", "raw", "sample-paper.pdf");
  const enriched = await ingestPaper(input);
  const analysis = analyzePaper(enriched);
  const review = synthesizeReview(
    enriched,
    analysis.sectionReviews,
    analysis.issues,
    analysis.strengths,
    analysis.weaknesses,
    analysis.questionsForAuthors,
    analysis.redFlags
  );
  const out = await writeReviewArtifacts(review);
  console.log(`Review written to: ${out.jsonPath}, ${out.markdownPath}, ${out.htmlPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
