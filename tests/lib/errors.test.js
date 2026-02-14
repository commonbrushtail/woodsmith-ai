import { describe, it, expect } from 'vitest'
import { AppError, notFound, unauthorized, forbidden, badRequest } from '@/lib/errors'

describe('AppError', () => {
  it('creates an error with status code and message', () => {
    const error = new AppError('Not found', 404)
    expect(error.message).toBe('Not found')
    expect(error.statusCode).toBe(404)
    expect(error instanceof Error).toBe(true)
  })
})

describe('error factories', () => {
  it('notFound returns 404 error', () => {
    const error = notFound('Product not found')
    expect(error.statusCode).toBe(404)
    expect(error.message).toBe('Product not found')
  })

  it('unauthorized returns 401 error', () => {
    const error = unauthorized()
    expect(error.statusCode).toBe(401)
  })

  it('forbidden returns 403 error', () => {
    const error = forbidden()
    expect(error.statusCode).toBe(403)
  })

  it('badRequest returns 400 error with details', () => {
    const error = badRequest('Invalid input', { field: 'name' })
    expect(error.statusCode).toBe(400)
    expect(error.details).toEqual({ field: 'name' })
  })
})
