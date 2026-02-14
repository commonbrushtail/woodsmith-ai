'use client'

import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback({
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error', 5000),
    info: (msg) => addToast(msg, 'info'),
  }, [addToast])

  // Make toast callable directly as well
  toast.remove = removeToast

  return (
    <ToastContext value={{ toast, toasts, removeToast }}>
      {children}
    </ToastContext>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    // Fallback when used outside provider — use alert
    return {
      toast: {
        success: (msg) => {},
        error: (msg) => {},
        info: (msg) => {},
      },
    }
  }
  return ctx
}
