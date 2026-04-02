import path from 'node:path'

export type WritePlanEntry = {
  content: string
  path: string
}

export function buildWritePlan(baseDir: string, files: Array<{content: string; relativePath: string}>): WritePlanEntry[] {
  return files.map((file) => ({
    content: file.content,
    path: path.resolve(baseDir, file.relativePath),
  }))
}
