'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Render the preview inside an <iframe> so the iframe's own width drives CSS
// media queries — that's the only way Tailwind `lg:` (which keys off the real
// viewport, not a container) reflects the chosen device. The desktop frame is
// scaled down to fit the panel; the mobile frame renders 1:1 and centered.
const DEVICE_WIDTH = { desktop: 1280, mobile: 390 }
const STYLE_SELECTOR =
  'style, link[rel="stylesheet"], link[rel="preconnect"], link[rel="dns-prefetch"], link[as="font"]'

// Mirror the app's stylesheets/fonts into the iframe AND keep mirroring any
// that get injected later — Next.js loads a dynamically-imported component's
// CSS (e.g. Swiper's `import 'swiper/css'`) as a separate chunk that lands in
// the parent <head> after the iframe is first set up. A one-time clone misses
// it, which left the gallery carousel unstyled (slides stacked vertically).
function mirrorStyles(doc) {
  doc.head.replaceChildren()
  document.querySelectorAll(STYLE_SELECTOR).forEach((node) => doc.head.appendChild(node.cloneNode(true)))
  doc.documentElement.style.background = '#ffffff'
  doc.body.style.margin = '0'

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1 && node.matches?.(STYLE_SELECTOR)) {
          doc.head.appendChild(node.cloneNode(true))
        }
      }
    }
  })
  observer.observe(document.head, { childList: true })
  return observer
}

/**
 * Width-accurate preview frame. `children` are portaled into an iframe whose
 * width equals the chosen device, so the previewed component lays out exactly
 * as it will on that device.
 *
 * @param {{ viewport?: 'desktop'|'mobile', children: React.ReactNode }} props
 */
export default function PreviewViewport({ viewport = 'desktop', children }) {
  const containerRef = useRef(null)
  const iframeRef = useRef(null)
  const observerRef = useRef(null)
  const [body, setBody] = useState(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  const deviceWidth = DEVICE_WIDTH[viewport] || DEVICE_WIDTH.desktop

  // Track the container so we can scale a wide desktop frame to fit.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const setup = () => {
    const doc = iframeRef.current?.contentDocument
    if (!doc) return
    observerRef.current?.disconnect()
    observerRef.current = mirrorStyles(doc)
    setBody(doc.body)
  }

  // contentDocument can be ready before onLoad fires.
  useEffect(() => {
    setup()
    return () => observerRef.current?.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scale = size.w && deviceWidth > size.w ? size.w / deviceWidth : 1
  const scaledWidth = deviceWidth * scale
  const offsetX = Math.max(0, (size.w - scaledWidth) / 2)
  const frameHeight = size.h ? size.h / scale : 0

  return (
    <div ref={containerRef} className="h-full w-full overflow-hidden bg-[#f3f4f6]">
      <div
        style={{
          width: deviceWidth,
          height: frameHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          marginLeft: offsetX,
        }}
      >
        <iframe
          ref={iframeRef}
          onLoad={setup}
          title="ตัวอย่าง"
          className="block h-full w-full border-0 bg-white"
        />
      </div>
      {body && createPortal(children, body)}
    </div>
  )
}
