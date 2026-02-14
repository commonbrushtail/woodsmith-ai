'use client'

import { ToastProvider } from '@/lib/toast-context'
import ToastContainer from './Toast'

export default function Providers({ children }) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  )
}
