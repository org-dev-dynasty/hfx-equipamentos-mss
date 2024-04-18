import { BaseError } from './base_error'

export class InvalidRequest extends BaseError {
  constructor(parameter?: string) {
    if (parameter) {
      super(parameter + ' not found')
    } else {
      super('No request found')
    }
  }
}

export class InvalidParameter extends BaseError {
  constructor(parameter: string, value: string) {
    super(`Invalid parameter: ${parameter}: ${value}`)
  }
}

export class MissingParameter extends BaseError {
  constructor(parameter: string) {
    super(`Missing parameter: ${parameter}`)
  }
}

export class UserNotAuthenticated extends BaseError {
  constructor(message?: string) {
    if (message) {
      super(message)
    } else {
      super('User not authentificated')
    }
  }
}

export class ConflictError extends BaseError {
  constructor(message: string) {
    super(message)
  }
}
