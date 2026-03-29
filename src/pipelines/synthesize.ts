import type { NormalizedPaper, ReviewArtifact } from "../types.js";
import { defaultScorecard, sortIssues } from "../utils/review.js";

export function synthesizeReview(
  paper: NormalizedPaper,
  sectionReviews: Record<string, unknown>,
  issues: ReviewArtifact["issues"],
  strengths: string[],
  weaknesses: string[],
  questionsForAuthors: string[],
  redFlags: string[]
): ReviewArtifact {
  const sortedIssues = sortIssues(issues);
  const criticalCount = sortedIssues.filter((issue) => issue.severity === "critical").length;
  const majorCount = sortedIssues.filter((issue) => issue.severity === "major").length;

  const recommendation =
    criticalCount > 0 ? "reject" :
    majorCount >= 4 ? "weak_reject" :
    majorCount >= 2 ? "borderline" :
    "weak_accept";

  const confidence = paper.parse_quality.status === "good" ? 0.8 : paper.parse_quality.status === "partial" ? 0.65 : 0.45;

  return {
    paper_id: paper.paper_id,
    metadata: paper.metadata,
    section_reviews: sectionReviews,
    issues: sortedIssues,
    scorecard: defaultScorecard(sortedIssues),
    red_flags: redFlags,
    strengths,
    weaknesses,
    questions_for_authors: questionsForAuthors,
    recommendation,
    confidence
  };
}
