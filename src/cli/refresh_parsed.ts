import path from "node:path";
import { listFiles } from "../utils/fs.js";
import { ingestPaper } from "../pipelines/ingest.js";

async function main(): Promise<void> {
  const rawDir = process.argv[2] ?? path.join("papers", "raw");
  const pdfs = await listFiles(rawDir, [".pdf"]);
  for (const pdf of pdfs) {
    await ingestPaper(pdf);
    console.log(`Refreshed parsed artifacts for ${pdf}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
