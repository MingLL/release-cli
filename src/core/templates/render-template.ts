import {readdir, readFile} from 'node:fs/promises'
import path from 'node:path'

export type RenderedTemplateFile = {
  content: string
  relativePath: string
}

export function renderTemplateString(content: string, variables: Record<string, string>): string {
  return content.replaceAll(/\{\{\s*([\w.-]+)\s*\}\}/g, (match: string, rawKey: string) => {
    const value = variables[rawKey]
    return value === undefined ? match : value
  })
}

async function walkTemplateFiles(templateDir: string, baseDir: string): Promise<string[]> {
  const entries = await readdir(templateDir, {withFileTypes: true})
  const parts = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(templateDir, entry.name)
      if (entry.isDirectory()) {
        return walkTemplateFiles(entryPath, baseDir)
      }

      return [path.relative(baseDir, entryPath)]
    }),
  )

  return parts.flat()
}

export async function renderTemplateDirectory(
  templateDir: string,
  variables: Record<string, string>,
): Promise<RenderedTemplateFile[]> {
  const templateFiles = await walkTemplateFiles(templateDir, templateDir)
  return Promise.all(
    templateFiles.map(async (relativeTemplatePath) => {
      const absoluteTemplatePath = path.join(templateDir, relativeTemplatePath)
      const rawContent = await readFile(absoluteTemplatePath, 'utf8')
      const outputRelativePath = relativeTemplatePath.endsWith('.tmpl')
        ? relativeTemplatePath.slice(0, Math.max(0, relativeTemplatePath.length - '.tmpl'.length))
        : relativeTemplatePath

      return {
        content: renderTemplateString(rawContent, variables),
        relativePath: outputRelativePath,
      }
    }),
  )
}
