import type { Issue, NormalizedPaper } from "../types.js";
import { issueId } from "../utils/ids.js";

function hasAbstract(paper: NormalizedPaper): boolean {
  return typeof paper.abstract === "string" && paper.abstract.trim().length > 0;
}

function hasSection(paper: NormalizedPaper, keyword: string): boolean {
  return paper.sections.some((section) => String((section as { title?: string }).title ?? "").toLowerCase().includes(keyword.toLowerCase()));
}

export function analyzePaper(paper: NormalizedPaper) {
  const issues: Issue[] = [];
  let counter = 1;
  const addIssue = (category: string, severity: Issue["severity"], title: string, description: string, anchorId: string, suggestedFix: string) => {
    issues.push({
      id: issueId(category, counter++),
      category,
      severity,
      title,
      description,
      location: { anchor_type: "section", anchor_id: anchorId },
      evidence: [{ type: "section", pointer: anchorId, support_level: "direct" }],
      suggested_fix: suggestedFix,
      confidence: 0.7
    });
  };

  if (!hasAbstract(paper)) {
    addIssue("abstract", "major", "Abstract content missing from parsed artifact", "The parsed artifact does not contain a usable abstract.", "ABSTRACT", "Re-run parsing or verify that the paper contains a machine-readable abstract.");
  }

  for (const [keyword, fallbackId] of [["introduction","SEC-001"],["related work","SEC-002"],["method","SEC-003"],["experiment","SEC-004"],["discussion","SEC-005"],["conclusion","SEC-006"]] as const) {
    if (!hasSection(paper, keyword)) {
      addIssue("structure", "major", `Missing or non-standard section for ${keyword}`, `The normalized paper does not expose a clear "${keyword}" section.`, fallbackId, `Ensure the paper contains a clearly titled ${keyword} section or update the parser mapping.`);
    }
  }

  if (paper.parse_quality.status !== "good") {
    addIssue("parsing", "major", "Parsed artifact quality is incomplete", "The parser marked this paper as partial or poor quality.", "PARSER", "Replace the placeholder parser with a higher-fidelity PDF extraction pipeline.");
  }

  return {
    sectionReviews: {
      language: { summary: "Heuristic placeholder review", confidence: 0.6 },
      abstract: { summary: hasAbstract(paper) ? "Abstract present" : "Abstract missing", confidence: 0.7 },
      structure: { summary: "Structure checked against expected core sections", confidence: 0.7 }
    },
    issues,
    strengths: [
      "Pipeline preserves deterministic issue structure and confidence scoring.",
      "Section coverage expectations are explicit and production-friendly."
    ],
    weaknesses: [
      "This starter bundle uses a placeholder parser and heuristic analysis rules.",
      "Reference-level DOI and metadata verification still requires live integrations or a richer local metadata store."
    ],
    questionsForAuthors: [
      "Can you provide complete implementation details, datasets, and evaluation settings if they are omitted in the current manuscript?",
      "Are all claimed contributions directly supported by dedicated experiments or analyses?"
    ],
    redFlags: paper.parse_quality.status === "poor" ? ["Low parser confidence may conceal or distort issues in the source manuscript."] : []
  };
}
