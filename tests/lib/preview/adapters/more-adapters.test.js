import { describe, it, expect } from 'vitest'
import banner from '@/lib/preview/adapters/banner'
import branch from '@/lib/preview/adapters/branch'
import manual from '@/lib/preview/adapters/manual'
import video from '@/lib/preview/adapters/video'
import gallery from '@/lib/preview/adapters/gallery'
import faq from '@/lib/preview/adapters/faq'
import siteSettings from '@/lib/preview/adapters/site-settings'
import category from '@/lib/preview/adapters/category'
import blogCategory from '@/lib/preview/adapters/blog-category'

// Every adapter's toProps must be total (never throw) and produce the prop
// shape its target public component expects.
describe('adapter totality + mapping', () => {
  it('banner -> HeroSection banners[]', () => {
    expect(() => banner.toProps({})).not.toThrow()
    expect(banner.toProps({ imagePreview: 'u', linkUrl: '/x' }).banners[0]).toEqual({ image_url: 'u', link_url: '/x' })
  })

  it('branch -> BranchesPageClient single branch', () => {
    expect(() => branch.toProps({})).not.toThrow()
    const p = branch.toProps({ name: 'สาขา', region: 'เหนือ' })
    expect(p.branches[0].name).toBe('สาขา')
    expect(p.branches[0].region).toBe('เหนือ')
    expect(p.hqBranch).toBeNull()
  })

  it('manual -> ManualPageClient single manual', () => {
    expect(() => manual.toProps({})).not.toThrow()
    const p = manual.toProps({ title: 'คู่มือ', coverPreview: 'c', youtubeUrl: 'y' })
    expect(p.manuals[0]).toMatchObject({ title: 'คู่มือ', cover_image_url: 'c', youtube_url: 'y' })
  })

  it('video -> HighlightPageClient single highlight', () => {
    expect(() => video.toProps({})).not.toThrow()
    expect(video.toProps({ title: 'v', youtubeUrl: 'yt' }).highlights[0]).toMatchObject({ title: 'v', youtube_url: 'yt' })
  })

  it('gallery -> GallerySection items', () => {
    expect(gallery.toProps({}).items).toEqual([])
    expect(gallery.toProps({ items: [{ image_url: 'a' }] }).items).toHaveLength(1)
  })

  it('faq -> FaqPageClient faqGroups', () => {
    expect(faq.toProps({}).faqGroups).toEqual([])
    expect(faq.toProps({ groups: [{ name: 'g' }] }).faqGroups[0].name).toBe('g')
  })

  it('site-settings -> FooterView settings (snake_case)', () => {
    expect(() => siteSettings.toProps({})).not.toThrow()
    const p = siteSettings.toProps({ companyName: 'ACME', phoneNumber: '123', facebookUrl: 'fb' })
    expect(p.settings).toMatchObject({ company_name: 'ACME', phone_number: '123', facebook_url: 'fb' })
  })

  it('blog-category -> BlogPageClient categories (tabs)', () => {
    expect(blogCategory.toProps({}).categories).toEqual([])
    const p = blogCategory.toProps({ categories: [{ slug: 'trend', name: 'เทรนด์' }] })
    expect(p.categories[0]).toMatchObject({ slug: 'trend', name: 'เทรนด์' })
    expect(p.posts).toEqual([])
  })

  it('category -> TaxonomyCardPreview card', () => {
    expect(() => category.toProps({})).not.toThrow()
    expect(category.toProps({ name: 'ไม้', imagePreview: 'img', typeLabel: 'วัสดุ' })).toEqual({
      name: 'ไม้',
      imageUrl: 'img',
      typeLabel: 'วัสดุ',
    })
  })
})
