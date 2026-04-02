import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import {constants} from 'node:fs'
import {access, mkdtemp, readFile, stat} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'

describe('create', () => {
  it('supports github + node with dry-run and does not write files', async () => {
    const baseDir = await mkdtemp(path.join(tmpdir(), 'release-cli-create-'))
    const projectDir = path.join(baseDir, 'demo-app')

    const {stdout} = await runCommand(
      `create --yes --platform github --stack node --name demo-app --target-dir ${projectDir} --dry-run`,
    )

    expect(stdout).to.contain('[dry-run]')
    expect(stdout).to.contain('.github/workflows/release.yml')

    try {
      await stat(path.join(projectDir, '.github', 'workflows', 'release.yml'))
      expect.fail('dry-run should not write files')
    } catch (error) {
      const accessError = error as NodeJS.ErrnoException
      expect(accessError.code).to.equal('ENOENT')
    }
  })

  it('fails when platform is not github in current milestone', async () => {
    const {error} = await runCommand('create --yes --platform gitlab --stack node --name demo-app')
    expect(error?.message ?? '').to.contain('当前仅支持 platform=github')
  })

  it('writes files when dry-run is not enabled', async () => {
    const baseDir = await mkdtemp(path.join(tmpdir(), 'release-cli-create-write-'))
    const projectDir = path.join(baseDir, 'demo-app')

    const {stdout} = await runCommand(`create --yes --platform github --stack node --name demo-app --target-dir ${projectDir}`)

    expect(stdout).to.contain('写入完成')
    await access(path.join(projectDir, '.github', 'workflows', 'release.yml'), constants.F_OK)
  })

  it('renders workflow with custom package manager, branch, node version and optional steps', async () => {
    const baseDir = await mkdtemp(path.join(tmpdir(), 'release-cli-create-custom-'))
    const projectDir = path.join(baseDir, 'demo-app')

    await runCommand(
      [
        'create',
        '--yes',
        '--platform github',
        '--stack node',
        '--name demo-app',
        `--target-dir ${projectDir}`,
        '--package-manager pnpm',
        '--branch develop',
        '--node-version 22',
        '--with-lint',
        '--with-build',
      ].join(' '),
    )

    const workflow = await readFile(path.join(projectDir, '.github', 'workflows', 'release.yml'), 'utf8')
    expect(workflow).to.contain('branches:')
    expect(workflow).to.contain('- develop')
    expect(workflow).to.contain('node-version: 22')
    expect(workflow).to.contain('run: pnpm install --frozen-lockfile')
    expect(workflow).to.contain('run: pnpm test')
    expect(workflow).to.contain('run: pnpm lint')
    expect(workflow).to.contain('run: pnpm build')
  })

  it('fails when package manager is unsupported', async () => {
    const {error} = await runCommand('create --yes --platform github --stack node --name demo-app --package-manager bun')
    expect(error?.message ?? '').to.contain('当前仅支持 package-manager=npm|pnpm|yarn')
  })
})
