import { describe, it, expect } from 'vitest'
import legalAdapter from '@/lib/preview/adapters/legal'
import aboutAdapter from '@/lib/preview/adapters/about'

describe('legal preview adapter', () => {
  it('maps content and resolves the public title from the slug', () => {
    const props = legalAdapter.toProps({ slug: 'terms', content: '<p>x</p>' })
    expect(props.content).toBe('<p>x</p>')
    expect(props.title).toBe('ข้อกำหนดและเงื่อนไขการใช้งาน')
  })

  it('never throws on empty state', () => {
    const props = legalAdapter.toProps({})
    expect(props.content).toBe('')
    expect(props.title).toBe('')
  })
})

describe('about preview adapter', () => {
  it('maps companyDetail to html', () => {
    expect(aboutAdapter.toProps({ companyDetail: '<p>hi</p>' }).html).toBe('<p>hi</p>')
  })

  it('never throws on empty state', () => {
    expect(aboutAdapter.toProps({}).html).toBe('')
  })
})
