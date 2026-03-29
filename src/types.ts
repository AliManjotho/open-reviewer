export type Severity = "minor" | "major" | "critical";
export type Recommendation = "accept" | "weak_accept" | "borderline" | "weak_reject" | "reject";

export interface EvidenceItem {
  type: "section" | "paragraph" | "figure" | "table" | "equation" | "reference" | "inferred";
  pointer: string;
  excerpt?: string;
  support_level: "direct" | "weak" | "inferred";
}

export interface Issue {
  id: string;
  category: string;
  severity: Severity;
  title: string;
  description: string;
  location: { anchor_type: string; anchor_id: string; section_title?: string; note?: string; };
  evidence: EvidenceItem[];
  suggested_fix: string;
  confidence: number;
}

export interface NormalizedPaper {
  paper_id: string;
  metadata: Record<string, unknown>;
  abstract: string;
  sections: Array<Record<string, unknown>>;
  references: Array<Record<string, unknown>>;
  figures: Array<Record<string, unknown>>;
  tables: Array<Record<string, unknown>>;
  equations: Array<Record<string, unknown>>;
  parse_quality: { status: "good" | "partial" | "poor"; notes?: string[]; };
}

export interface ReviewArtifact {
  paper_id: string;
  metadata: Record<string, unknown>;
  section_reviews: Record<string, unknown>;
  issues: Issue[];
  scorecard: Record<string, number>;
  red_flags: string[];
  strengths: string[];
  weaknesses: string[];
  questions_for_authors: string[];
  recommendation: Recommendation;
  confidence: number;
}
