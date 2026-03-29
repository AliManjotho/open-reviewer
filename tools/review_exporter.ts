import path from "node:path";
import { writeJsonFile, writeTextFile } from "../src/utils/fs.js";
import type { ReviewArtifact } from "../src/types.js";
import { severityHistogram } from "../src/utils/review.js";

function renderMarkdown(review: ReviewArtifact): string {
  const histogram = severityHistogram(review.issues);
  return [
    `# Review: ${review.paper_id}`,
    '',
    `Recommendation: **${review.recommendation}**`,
    `Confidence: **${review.confidence.toFixed(2)}**`,
    '',
    '## Severity Distribution',
    `- Critical: ${histogram.critical}`,
    `- Major: ${histogram.major}`,
    `- Minor: ${histogram.minor}`
  ].join('\n');
}

function renderHtml(review: ReviewArtifact): string {
  return `<!doctype html><html><body><h1>Review: ${review.paper_id}</h1><p>Recommendation: ${review.recommendation}</p><p>Confidence: ${review.confidence.toFixed(2)}</p></body></html>`;
}

export async function writeReviewArtifacts(review: ReviewArtifact): Promise<{jsonPath: string; markdownPath: string; htmlPath: string;}> {
  const jsonPath = path.join('reviews', 'json', `${review.paper_id}.review.json`);
  const markdownPath = path.join('reviews', 'markdown', `${review.paper_id}.review.md`);
  const htmlPath = path.join('reviews', 'html', `${review.paper_id}.review.html`);
  await writeJsonFile(jsonPath, review);
  await writeTextFile(markdownPath, renderMarkdown(review));
  await writeTextFile(htmlPath, renderHtml(review));
  return { jsonPath, markdownPath, htmlPath };
}
