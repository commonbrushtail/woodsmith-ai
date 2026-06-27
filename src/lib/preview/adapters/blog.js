// Preview adapter for blog posts.
// Maps the blog edit form's live state onto the props that the public
// BlogPostPageClient expects ({ post, relatedPosts, categories }), so the live
// panel renders with the exact same component + sanitizer as production.

const blogAdapter = {
  entity: 'blog',
  device: 'page',
  defaultViewport: 'desktop',
  component: () => import('@/app/(public)/blog/[id]/BlogPostPageClient'),

  toProps(state = {}) {
    return {
      post: {
        id: state.id || 'preview',
        slug: state.slug || null,
        title: state.title || '',
        content: state.content || '',
        cover_image_url: state.coverPreview || null,
        category: state.category || '',
        view_count: state.viewCount ?? 0,
        publish_date: state.publishDate ? `${state.publishDate}T00:00:00` : null,
        created_at: state.createdAt || null,
      },
      // Related posts have no live analog while editing; the component guards [].
      relatedPosts: [],
      categories: state.categories || [],
    }
  },
}

export default blogAdapter
