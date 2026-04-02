import {access, mkdir, writeFile} from 'node:fs/promises'
import path from 'node:path'

import type {WritePlanEntry} from './write-plan.js'

export type ApplyWritePlanOptions = {
  dryRun: boolean
}

export type ApplyWritePlanResult = {
  conflicts: string[]
  written: string[]
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

export async function applyWritePlan(plan: WritePlanEntry[], options: ApplyWritePlanOptions): Promise<ApplyWritePlanResult> {
  const conflictChecks = await Promise.all(plan.map(async (entry) => ({exists: await exists(entry.path), path: entry.path})))
  const conflicts = conflictChecks.filter((item) => item.exists).map((item) => item.path)

  if (conflicts.length > 0) {
    return {conflicts, written: []}
  }

  if (options.dryRun) {
    return {conflicts: [], written: []}
  }

  await Promise.all(
    plan.map(async (entry) => {
      await mkdir(path.dirname(entry.path), {recursive: true})
      await writeFile(entry.path, entry.content, 'utf8')
    }),
  )

  return {conflicts: [], written: plan.map((entry) => entry.path)}
}
