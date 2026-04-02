import path from 'node:path'
import {stdin as input, stdout as output} from 'node:process'
import readline from 'node:readline'

export type CreateCommandFlags = {
  branch?: string
  dryRun: boolean
  name?: string
  nodeVersion?: string
  packageManager?: string
  platform?: string
  stack?: string
  targetDir?: string
  withBuild: boolean
  withLint: boolean
  yes: boolean
}

export type CreateOptions = {
  branch: string
  dryRun: boolean
  name: string
  nodeVersion: string
  packageManager: 'npm' | 'pnpm' | 'yarn'
  platform: string
  stack: string
  targetDir: string
  withBuild: boolean
  withLint: boolean
}

async function ask(question: string): Promise<string> {
  const rl = readline.createInterface({input, output})
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

function normalizeOrDefault(value: string | undefined, fallback: string): string {
  const normalized = (value ?? fallback).trim()
  return normalized.length === 0 ? fallback : normalized
}

async function resolvePromptValue(flagValue: string | undefined, yes: boolean, fallback: string, question: string): Promise<string> {
  if (flagValue !== undefined) {
    return flagValue
  }

  return yes ? fallback : ask(question)
}

function parseYesNoAnswer(answer: string): boolean {
  return /^y(es)?$/i.test(answer.trim())
}

export async function collectCreateOptions(flags: CreateCommandFlags): Promise<CreateOptions> {
  const platform = await resolvePromptValue(flags.platform, flags.yes, 'github', '平台 (github): ')
  const stack = await resolvePromptValue(flags.stack, flags.yes, 'node', '技术栈 (node): ')
  const name = await resolvePromptValue(flags.name, flags.yes, 'release-project', '项目名: ')
  const packageManager = await resolvePromptValue(
    flags.packageManager,
    flags.yes,
    'npm',
    '包管理器 (npm/pnpm/yarn，默认 npm): ',
  )
  const branch = await resolvePromptValue(flags.branch, flags.yes, 'main', '默认分支 (main): ')
  const nodeVersion = await resolvePromptValue(flags.nodeVersion, flags.yes, '20', 'Node 版本 (20): ')

  if (name.length === 0) {
    throw new Error('项目名不能为空')
  }

  const normalizedPackageManager = normalizeOrDefault(packageManager, 'npm') as CreateOptions['packageManager']
  if (!['npm', 'pnpm', 'yarn'].includes(normalizedPackageManager)) {
    throw new Error('当前仅支持 package-manager=npm|pnpm|yarn')
  }

  const normalizedBranch = normalizeOrDefault(branch, 'main')
  if (normalizedBranch.length === 0) {
    throw new Error('默认分支不能为空')
  }

  const normalizedNodeVersion = normalizeOrDefault(nodeVersion, '20')
  if (normalizedNodeVersion.length === 0) {
    throw new Error('Node 版本不能为空')
  }

  const withLint =
    flags.withLint || (!flags.yes && parseYesNoAnswer(await ask('附加 lint 步骤? (y/N): ')))
  const withBuild =
    flags.withBuild || (!flags.yes && parseYesNoAnswer(await ask('附加 build 步骤? (y/N): ')))

  const targetDir = flags.targetDir ?? path.resolve(process.cwd(), name)

  return {
    branch: normalizedBranch,
    dryRun: Boolean(flags.dryRun),
    name,
    nodeVersion: normalizedNodeVersion,
    packageManager: normalizedPackageManager,
    platform: platform || 'github',
    stack: stack || 'node',
    targetDir: path.resolve(targetDir),
    withBuild,
    withLint,
  }
}
