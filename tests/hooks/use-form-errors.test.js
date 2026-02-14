import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFormErrors } from '@/lib/hooks/use-form-errors'

describe('useFormErrors', () => {
  it('starts with empty errors', () => {
    const { result } = renderHook(() => useFormErrors())
    expect(result.current.errors).toEqual({})
  })

  it('setFieldErrors sets multiple field errors', () => {
    const { result } = renderHook(() => useFormErrors())
    act(() => {
      result.current.setFieldErrors({ name: 'Required', code: 'Too short' })
    })
    expect(result.current.errors).toEqual({ name: 'Required', code: 'Too short' })
  })

  it('getError returns error for a specific field', () => {
    const { result } = renderHook(() => useFormErrors())
    act(() => {
      result.current.setFieldErrors({ name: 'Required' })
    })
    expect(result.current.getError('name')).toBe('Required')
  })

  it('getError returns undefined for a field without error', () => {
    const { result } = renderHook(() => useFormErrors())
    act(() => {
      result.current.setFieldErrors({ name: 'Required' })
    })
    expect(result.current.getError('code')).toBeUndefined()
  })

  it('clearError removes a specific field error', () => {
    const { result } = renderHook(() => useFormErrors())
    act(() => {
      result.current.setFieldErrors({ name: 'Required', code: 'Too short' })
    })
    act(() => {
      result.current.clearError('name')
    })
    expect(result.current.getError('name')).toBeUndefined()
    expect(result.current.getError('code')).toBe('Too short')
  })

  it('clearAll removes all errors', () => {
    const { result } = renderHook(() => useFormErrors())
    act(() => {
      result.current.setFieldErrors({ name: 'Required', code: 'Too short' })
    })
    act(() => {
      result.current.clearAll()
    })
    expect(result.current.errors).toEqual({})
  })

  it('setFieldErrors replaces previous errors', () => {
    const { result } = renderHook(() => useFormErrors())
    act(() => {
      result.current.setFieldErrors({ name: 'Required' })
    })
    act(() => {
      result.current.setFieldErrors({ code: 'Invalid' })
    })
    expect(result.current.getError('name')).toBeUndefined()
    expect(result.current.getError('code')).toBe('Invalid')
  })
})
