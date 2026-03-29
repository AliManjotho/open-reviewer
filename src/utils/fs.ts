import fs from "node:fs/promises";
import path from "node:path";

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function writeTextFile(filePath: string, content: string): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf8");
}

export async function listFiles(dirPath: string, extensions?: string[]): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true }).catch(() => []);
  return entries.filter(e => e.isFile()).map(e => path.join(dirPath, e.name)).filter(file => !extensions || extensions.some(ext => file.toLowerCase().endsWith(ext)));
}
