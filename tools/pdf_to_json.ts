import path from "node:path";
import { writeJsonFile } from "../src/utils/fs.js";
import { makePaperId } from "../src/utils/ids.js";
import type { NormalizedPaper } from "../src/types.js";

export async function pdfToJson(pdfPath: string, outputPath?: string): Promise<NormalizedPaper> {
  const paperId = makePaperId(pdfPath);
  const parsedPath = outputPath ?? path.join("papers", "parsed", `${paperId}.parsed.json`);

  const result: NormalizedPaper = {
    paper_id: paperId,
    metadata: {
      title: paperId.replace(/-/g, " "),
      authors: [],
      source_pdf: pdfPath
    },
    abstract: "",
    sections: [
      { id: "SEC-001", title: "Introduction", text: "" },
      { id: "SEC-002", title: "Related Work", text: "" },
      { id: "SEC-003", title: "Methodology", text: "" },
      { id: "SEC-004", title: "Experiments", text: "" },
      { id: "SEC-005", title: "Discussion", text: "" },
      { id: "SEC-006", title: "Conclusion", text: "" }
    ],
    references: [],
    figures: [],
    tables: [],
    equations: [],
    parse_quality: {
      status: "partial",
      notes: ["Placeholder parser used. Replace tools/pdf_to_json.ts with your production parser."]
    }
  };

  await writeJsonFile(parsedPath, result);
  return result;
}
