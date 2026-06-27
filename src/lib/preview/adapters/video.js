// Preview adapter for video highlights. Renders the public HighlightPageClient
// with the single highlight being edited (the embed comes from youtube_url).
const videoAdapter = {
  entity: 'video',
  device: 'page',
  defaultViewport: 'desktop',
  component: () => import('@/app/(public)/highlight/HighlightPageClient'),

  toProps(state = {}) {
    return {
      highlights: [
        {
          id: state.id || 'preview',
          title: state.title || '',
          youtube_url: state.youtubeUrl || '',
          thumbnail_url: state.thumbnailUrl || null,
          channel_name: 'WoodSmith',
          duration: '',
        },
      ],
      bannerUrl: '',
    }
  },
}

export default videoAdapter
