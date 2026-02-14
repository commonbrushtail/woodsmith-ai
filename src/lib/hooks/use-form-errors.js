'use client'

import { useState, useCallback } from 'react'

export function useFormErrors() {
  const [errors, setErrors] = useState({})

  const setFieldErrors = useCallback((fieldErrors) => {
    setErrors(fieldErrors || {})
  }, [])

  const clearError = useCallback((field) => {
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    setErrors({})
  }, [])

  const getError = useCallback((field) => {
    return errors[field]
  }, [errors])

  return { errors, setFieldErrors, clearError, clearAll, getError }
}
