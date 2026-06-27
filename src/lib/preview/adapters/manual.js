// Preview adapter for manuals. Renders the public ManualPageClient with the
// single manual being edited as its one card.
const manualAdapter = {
  entity: 'manual',
  device: 'page',
  defaultViewport: 'desktop',
  component: () => import('@/app/(public)/manual/ManualPageClient'),

  toProps(state = {}) {
    return {
      manuals: [
        {
          id: state.id || 'preview',
          title: state.title || '',
          cover_image_url: state.coverPreview || null,
          created_at: null,
          file_url: state.fileUrl || null,
          youtube_url: state.youtubeUrl || '',
        },
      ],
      bannerUrl: '',
    }
  },
}

export default manualAdapter
