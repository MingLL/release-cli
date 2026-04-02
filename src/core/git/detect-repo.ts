import {access} from 'node:fs/promises'
import path from 'node:path'

export async function detectRepo(targetDir: string): Promise<boolean> {
  const gitPath = path.join(targetDir, '.git')

  try {
    await access(gitPath)
    return true
  } catch {
    return false
  }
}
