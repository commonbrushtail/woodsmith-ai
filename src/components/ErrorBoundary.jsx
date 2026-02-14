'use client'

import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-[16px] p-[24px]">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h2 className="font-['IBM_Plex_Sans_Thai'] text-[18px] font-bold text-[#1f2937] m-0">
            เกิดข้อผิดพลาด
          </h2>
          <p className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-[#6b7280] text-center m-0">
            ขออภัย เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง
          </p>
          <button
            onClick={this.handleRetry}
            className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-white bg-orange border-0 rounded-[8px] px-[20px] py-[8px] cursor-pointer hover:bg-[#e56f15] transition-colors"
          >
            ลองใหม่
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
