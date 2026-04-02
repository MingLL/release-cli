import {Command, Flags} from '@oclif/core'
import path from 'node:path'

import {applyWritePlan} from '../../core/fs/apply-write-plan.js'
import {buildWritePlan} from '../../core/fs/write-plan.js'
import {detectRepo} from '../../core/git/detect-repo.js'
import {collectCreateOptions} from '../../core/prompts/create-options.js'
import {renderTemplateDirectory} from '../../core/templates/render-template.js'
import {resolveTemplatePath} from '../../core/templates/resolve-template-path.js'

export default class Create extends Command {
  static description = '创建发布流程模板（当前里程碑仅支持 GitHub + Node.js）'
  static flags = {
    branch: Flags.string({description: '默认分支，默认 main'}),
    'dry-run': Flags.boolean({default: false, description: '仅预览，不写入文件'}),
    name: Flags.string({description: '项目名'}),
    'node-version': Flags.string({description: 'Node 版本，默认 20'}),
    'package-manager': Flags.string({description: '包管理器（npm|pnpm|yarn），默认 npm'}),
    platform: Flags.string({description: '发布平台（github）'}),
    stack: Flags.string({description: '技术栈（node）'}),
    'target-dir': Flags.string({description: '目标目录，默认当前目录下项目名目录'}),
    'with-build': Flags.boolean({default: false, description: '在 workflow 中附加 build 步骤'}),
    'with-lint': Flags.boolean({default: false, description: '在 workflow 中附加 lint 步骤'}),
    yes: Flags.boolean({char: 'y', default: false, description: '使用默认值并跳过交互'}),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Create)

    const options = await collectCreateOptions({
      branch: flags.branch,
      dryRun: Boolean(flags['dry-run']),
      name: flags.name,
      nodeVersion: flags['node-version'],
      packageManager: flags['package-manager'],
      platform: flags.platform,
      stack: flags.stack,
      targetDir: flags['target-dir'],
      withBuild: Boolean(flags['with-build']),
      withLint: Boolean(flags['with-lint']),
      yes: Boolean(flags.yes),
    })

    if (options.platform !== 'github') {
      throw new Error('当前仅支持 platform=github')
    }

    if (options.stack !== 'node') {
      throw new Error('当前仅支持 stack=node')
    }

    const packageManagerCommands = {
      npm: {build: 'npm run build', install: 'npm ci', lint: 'npm run lint', test: 'npm test'},
      pnpm: {build: 'pnpm build', install: 'pnpm install --frozen-lockfile', lint: 'pnpm lint', test: 'pnpm test'},
      yarn: {build: 'yarn build', install: 'yarn install --frozen-lockfile', lint: 'yarn lint', test: 'yarn test'},
    } as const
    const commands = packageManagerCommands[options.packageManager]
    const extraSteps: string[] = []
    if (options.withLint) {
      extraSteps.push(`      - run: ${commands.lint}`)
    }

    if (options.withBuild) {
      extraSteps.push(`      - run: ${commands.build}`)
    }

    const paths = await resolveTemplatePath(options.platform, options.stack, this.config.root)
    const variables = {
      defaultBranch: options.branch,
      extraSteps: extraSteps.length > 0 ? `\n${extraSteps.join('\n')}` : '',
      installCommand: commands.install,
      nodeVersion: options.nodeVersion,
      packageManager: options.packageManager,
      projectName: options.name,
      targetDirName: path.basename(options.targetDir),
      testCommand: commands.test,
    }

    const sharedFiles = await renderTemplateDirectory(paths.sharedTemplateDir, variables)
    const stackFiles = await renderTemplateDirectory(paths.stackTemplateDir, variables)
    const plan = buildWritePlan(options.targetDir, [...sharedFiles, ...stackFiles])

    if (options.dryRun) {
      this.log('[dry-run] 将写入以下文件:')
    } else {
      this.log('将写入以下文件:')
    }

    for (const entry of plan) {
      const relativeOutputPath = path.relative(options.targetDir, entry.path).split(path.sep).join('/')
      this.log(`- ${relativeOutputPath}`)
    }

    const result = await applyWritePlan(plan, {dryRun: options.dryRun})

    if (result.conflicts.length > 0) {
      this.error(`检测到已存在文件，已终止写入:\n${result.conflicts.join('\n')}`)
    }

    if (options.dryRun) {
      this.log('[dry-run] 预览完成，未写入文件。')
      return
    }

    const isGitRepo = await detectRepo(options.targetDir)
    this.log(`写入完成，共 ${result.written.length} 个文件。`)
    this.log(isGitRepo ? '已检测到 git 仓库。' : '未检测到 git 仓库，可后续执行 git init。')
  }
}
