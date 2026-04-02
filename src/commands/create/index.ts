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
    'dry-run': Flags.boolean({default: false, description: '仅预览，不写入文件'}),
    name: Flags.string({description: '项目名'}),
    platform: Flags.string({description: '发布平台（github）'}),
    stack: Flags.string({description: '技术栈（node）'}),
    'target-dir': Flags.string({description: '目标目录，默认当前目录下项目名目录'}),
    yes: Flags.boolean({char: 'y', default: false, description: '使用默认值并跳过交互'}),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Create)

    const options = await collectCreateOptions({
      dryRun: Boolean(flags['dry-run']),
      name: flags.name,
      platform: flags.platform,
      stack: flags.stack,
      targetDir: flags['target-dir'],
      yes: Boolean(flags.yes),
    })

    if (options.platform !== 'github') {
      throw new Error('当前仅支持 platform=github')
    }

    if (options.stack !== 'node') {
      throw new Error('当前仅支持 stack=node')
    }

    const paths = await resolveTemplatePath(options.platform, options.stack, this.config.root)
    const variables = {
      projectName: options.name,
      targetDirName: path.basename(options.targetDir),
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
