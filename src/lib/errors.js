export class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message)
    this.statusCode = statusCode
    this.details = details
    this.name = 'AppError'
  }
}

export function notFound(message = 'Not found') {
  return new AppError(message, 404)
}

export function unauthorized(message = 'Unauthorized') {
  return new AppError(message, 401)
}

export function forbidden(message = 'Forbidden') {
  return new AppError(message, 403)
}

export function badRequest(message = 'Bad request', details = null) {
  return new AppError(message, 400, details)
}
