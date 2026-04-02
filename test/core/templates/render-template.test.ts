import {expect} from 'chai'

import {renderTemplateString} from '../../../src/core/templates/render-template.js'

describe('renderTemplateString', () => {
  it('replaces placeholders with provided variables', () => {
    const rendered = renderTemplateString('name={{projectName}}', {projectName: 'demo-app'})
    expect(rendered).to.equal('name=demo-app')
  })

  it('keeps unknown placeholders unchanged', () => {
    const rendered = renderTemplateString('owner={{owner}}', {})
    expect(rendered).to.equal('owner={{owner}}')
  })
})
