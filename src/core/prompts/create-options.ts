import path from 'node:path'
import {stdin as input, stdout as output} from 'node:process'
import readline from 'node:readline'

export type CreateCommandFlags = {
  dryRun: boolean
  name?: string
  platform?: string
  stack?: string
  targetDir?: string
  yes: boolean
}

export type CreateOptions = {
  dryRun: boolean
  name: string
  platform: string
  stack: string
  targetDir: string
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

export async function collectCreateOptions(flags: CreateCommandFlags): Promise<CreateOptions> {
  const platform = flags.platform ?? (flags.yes ? 'github' : await ask('平台 (github): '))
  const stack = flags.stack ?? (flags.yes ? 'node' : await ask('技术栈 (node): '))
  const name = flags.name ?? (flags.yes ? 'release-project' : await ask('项目名: '))

  if (name.length === 0) {
    throw new Error('项目名不能为空')
  }

  const targetDir = flags.targetDir ?? path.resolve(process.cwd(), name)

  return {
    dryRun: Boolean(flags.dryRun),
    name,
    platform: platform || 'github',
    stack: stack || 'node',
    targetDir: path.resolve(targetDir),
  }
}
