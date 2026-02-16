'use client'

import { useState, useEffect, useCallback } from 'react'

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="white" fillOpacity="0.8" />
      <path d="M19 10L13 16L19 22" stroke="#35383b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="white" fillOpacity="0.8" />
      <path d="M13 10L19 16L13 22" stroke="#35383b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Lightbox({ images, startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex)
  const hasMultiple = images.length > 1

  const goNext = useCallback(() => {
    setIndex(prev => (prev + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setIndex(prev => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' && hasMultiple) goNext()
      else if (e.key === 'ArrowLeft' && hasMultiple) goPrev()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, goNext, goPrev, hasMultiple])

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-[16px] right-[16px] z-10 size-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors border-0 cursor-pointer"
      >
        <CloseIcon />
      </button>

      {/* Previous arrow */}
      {hasMultiple && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev() }}
          className="absolute left-[12px] lg:left-[24px] top-1/2 -translate-y-1/2 z-10 border-0 bg-transparent cursor-pointer p-0"
        >
          <ChevronLeft />
        </button>
      )}

      {/* Image */}
      <img
        src={images[index]}
        alt=""
        className="max-w-[90vw] max-h-[85vh] object-contain select-none"
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />

      {/* Next arrow */}
      {hasMultiple && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext() }}
          className="absolute right-[12px] lg:right-[24px] top-1/2 -translate-y-1/2 z-10 border-0 bg-transparent cursor-pointer p-0"
        >
          <ChevronRight />
        </button>
      )}

      {/* Counter */}
      {hasMultiple && (
        <div className="absolute bottom-[24px] left-1/2 -translate-x-1/2 bg-black/60 rounded-full px-[16px] py-[6px]">
          <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] text-white">
            {index + 1} / {images.length}
          </span>
        </div>
      )}
    </div>
  )
}
