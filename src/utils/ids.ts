import path from "node:path";

export function makePaperId(inputPath: string): string {
  const base = path.basename(inputPath, path.extname(inputPath));
  return base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function issueId(category: string, index: number): string {
  return `${category.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}-${String(index).padStart(3, "0")}`;
}
