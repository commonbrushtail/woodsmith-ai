import { describe, it, expect } from 'vitest'
import blogAdapter from '@/lib/preview/adapters/blog'

describe('blog preview adapter', () => {
  it('never throws on empty form state and returns a valid post shape', () => {
    const props = blogAdapter.toProps({})
    expect(props.post).toBeTruthy()
    expect(props.post.title).toBe('')
    expect(props.post.content).toBe('')
    expect(props.post.cover_image_url).toBeNull()
    expect(props.relatedPosts).toEqual([])
  })

  it('maps live form fields onto the public post props', () => {
    const props = blogAdapter.toProps({
      id: 'p1',
      slug: 'my-post',
      title: 'หัวข้อ',
      content: '<p>เนื้อหา</p>',
      coverPreview: 'blob:http://x/abc',
      category: 'ideas',
      publishDate: '2026-01-15',
      viewCount: 7,
      createdAt: '2026-01-01T00:00:00Z',
    })
    expect(props.post.title).toBe('หัวข้อ')
    expect(props.post.content).toBe('<p>เนื้อหา</p>')
    expect(props.post.cover_image_url).toBe('blob:http://x/abc')
    expect(props.post.category).toBe('ideas')
    expect(props.post.view_count).toBe(7)
    // YYYY-MM-DD form value becomes a full timestamp the component can parse
    expect(props.post.publish_date).toBe('2026-01-15T00:00:00')
  })

  it('leaves publish_date null when no date is set', () => {
    const props = blogAdapter.toProps({ title: 'x' })
    expect(props.post.publish_date).toBeNull()
  })
})
