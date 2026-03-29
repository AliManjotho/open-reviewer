import type { NormalizedPaper } from "../src/types.js";

export function enrichParsedPaper(paper: NormalizedPaper): NormalizedPaper & Record<string, unknown> {
  return {
    ...paper,
    enriched_at: new Date().toISOString(),
    section_order: paper.sections.map((section, index) => ({
      index,
      id: String((section as { id?: string }).id ?? `SEC-${String(index + 1).padStart(3, "0")}`),
      title: String((section as { title?: string }).title ?? `Section ${index + 1}`)
    }))
  };
}
