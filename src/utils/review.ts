import type { Issue, ReviewArtifact } from "../types.js";

export function severityHistogram(issues: Issue[]): Record<string, number> {
  return issues.reduce<Record<string, number>>((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] ?? 0) + 1;
    return acc;
  }, { minor: 0, major: 0, critical: 0 });
}

export function sortIssues(issues: Issue[]): Issue[] {
  const rank = { critical: 0, major: 1, minor: 2 };
  return [...issues].sort((a, b) => rank[a.severity] - rank[b.severity] || a.id.localeCompare(b.id));
}

export function defaultScorecard(_issues: Issue[]): Record<string, number> {
  return {
    language: 3,
    novelty: 3,
    technical_soundness: 3,
    experimental_rigor: 3,
    clarity: 3,
    reproducibility: 3,
    reference_integrity: 3,
    citation_ethics_risk: 3,
    overall: 3
  };
}
