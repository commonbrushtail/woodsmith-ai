import { LEGAL_TITLES } from '@/components/LegalContentView'

// Preview adapter for legal pages (terms/privacy/cookies). These are always
// public (no draft state), so the LIVE panel is the meaningful preview — it
// shows unsaved edits before they go live. Renders the same LegalContentView
// the public pages use.
const legalAdapter = {
  entity: 'legal',
  device: 'page',
  defaultViewport: 'desktop',
  component: () => import('@/components/LegalContentView'),

  toProps(state = {}) {
    return {
      title: state.title || LEGAL_TITLES[state.slug] || '',
      content: state.content || '',
      updatedAt: state.updatedAt || null,
    }
  },
}

export default legalAdapter
