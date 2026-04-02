import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import {constants} from 'node:fs'
import {access, mkdtemp, stat} from 'node:fs/promises'
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
})
