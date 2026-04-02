import {expect} from 'chai'
import {mkdtemp, readFile, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'

import type {WritePlanEntry} from '../../../src/core/fs/write-plan.js'

import {applyWritePlan} from '../../../src/core/fs/apply-write-plan.js'

describe('applyWritePlan', () => {
  it('writes files when no conflicts exist', async () => {
    const baseDir = await mkdtemp(path.join(tmpdir(), 'release-cli-write-'))
    const filePath = path.join(baseDir, 'docs', 'release.md')
    const plan: WritePlanEntry[] = [{content: 'ok', path: filePath}]

    const result = await applyWritePlan(plan, {dryRun: false})

    expect(result.written).to.deep.equal([filePath])
    expect(result.conflicts).to.deep.equal([])
    expect(await readFile(filePath, 'utf8')).to.equal('ok')
  })

  it('does not write files in dry run mode', async () => {
    const baseDir = await mkdtemp(path.join(tmpdir(), 'release-cli-dry-'))
    const filePath = path.join(baseDir, 'docs', 'release.md')
    const plan: WritePlanEntry[] = [{content: 'ok', path: filePath}]

    const result = await applyWritePlan(plan, {dryRun: true})

    expect(result.written).to.deep.equal([])
    expect(result.conflicts).to.deep.equal([])
  })

  it('returns conflicts for existing files and keeps them unchanged', async () => {
    const baseDir = await mkdtemp(path.join(tmpdir(), 'release-cli-conflict-'))
    const filePath = path.join(baseDir, 'release.yml')
    await writeFile(filePath, 'existing', 'utf8')
    const plan: WritePlanEntry[] = [{content: 'new-content', path: filePath}]

    const result = await applyWritePlan(plan, {dryRun: false})

    expect(result.written).to.deep.equal([])
    expect(result.conflicts).to.deep.equal([filePath])
    expect(await readFile(filePath, 'utf8')).to.equal('existing')
  })
})
