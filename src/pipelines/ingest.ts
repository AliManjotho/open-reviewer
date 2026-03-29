import path from "node:path";
import { pdfToJson } from "../../tools/pdf_to_json.js";
import { enrichParsedPaper } from "../../tools/normalize_parsed.js";
import { makePaperId } from "../utils/ids.js";
import { writeJsonFile } from "../utils/fs.js";
import type { NormalizedPaper } from "../types.js";

export async function ingestPaper(pdfPath: string): Promise<NormalizedPaper & Record<string, unknown>> {
  const paperId = makePaperId(pdfPath);
  const parsedPath = path.join("papers", "parsed", `${paperId}.parsed.json`);
  const enrichedPath = path.join("papers", "enriched", `${paperId}.enriched.json`);
  const parsed = await pdfToJson(pdfPath, parsedPath);
  const enriched = enrichParsedPaper(parsed);
  await writeJsonFile(enrichedPath, enriched);
  return enriched;
}
