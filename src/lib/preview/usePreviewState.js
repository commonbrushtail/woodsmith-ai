'use client'

import { useEffect, useState } from 'react'

/**
 * Compute the public-component props from live form state via an adapter,
 * debounced so the (potentially heavy) preview component doesn't re-render on
 * every keystroke.
 *
 * The adapter's toProps() is expected to be pure and total, but we guard it so
 * a transient bad state never crashes the editor — it surfaces as `__error`
 * which PreviewPanel renders as a friendly message.
 *
 * @param {object|null} adapter  preview adapter ({ toProps })
 * @param {object} formState     live form values
 * @param {number} [delay=150]   debounce ms
 * @returns {object|null} props to spread into the public component
 */
export function usePreviewState(adapter, formState, delay = 150) {
  const [props, setProps] = useState(() => safeToProps(adapter, formState))

  useEffect(() => {
    const id = setTimeout(() => setProps(safeToProps(adapter, formState)), delay)
    return () => clearTimeout(id)
  }, [adapter, formState, delay])

  return props
}

function safeToProps(adapter, formState) {
  if (!adapter) return null
  try {
    return adapter.toProps(formState)
  } catch (err) {
    return { __error: err?.message || 'ไม่สามารถสร้างตัวอย่างได้' }
  }
}
