import path from "node:path";
import { listFiles, readJsonFile } from "../utils/fs.js";
import type { ReviewArtifact } from "../types.js";

async function main(): Promise<void> {
  const reviewDir = process.argv[2] ?? path.join("reviews", "json");
  const reviewFiles = (await listFiles(reviewDir, [".json"])).filter((filePath) => !filePath.endsWith("portfolio.summary.json"));
  const reviews: ReviewArtifact[] = [];
  for (const filePath of reviewFiles) reviews.push(await readJsonFile<ReviewArtifact>(filePath));
  const sorted = reviews.sort((a, b) => b.confidence - a.confidence);
  for (const review of sorted) console.log(`${review.paper_id}: ${review.recommendation} | confidence=${review.confidence.toFixed(2)} | issues=${review.issues.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
