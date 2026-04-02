import {access} from 'node:fs/promises'
import path from 'node:path'

export type TemplatePathResolution = {
  sharedTemplateDir: string
  stackTemplateDir: string
}

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await access(dirPath)
  } catch {
    throw new Error(`模板目录不存在: ${dirPath}`)
  }
}

export async function resolveTemplatePath(platform: string, stack: string, baseDir = process.cwd()): Promise<TemplatePathResolution> {
  const sharedTemplateDir = path.resolve(baseDir, 'templates', 'shared')
  const stackTemplateDir = path.resolve(baseDir, 'templates', platform, stack)

  await ensureDirectoryExists(sharedTemplateDir)
  await ensureDirectoryExists(stackTemplateDir)

  return {sharedTemplateDir, stackTemplateDir}
}
