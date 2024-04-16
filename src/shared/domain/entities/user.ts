import bcrypt from 'bcryptjs'
import { EntityError } from '../../helpers/errors/domain_errors'

export type UserProps = {
  name: string
  email: string
  password: string
}

export class User {
  constructor(public props: UserProps) {
    if (!User.validateName(props.name)) {
      throw new EntityError('props.name')
    }
    this.props.name = props.name

    if (!User.validateEmail(props.email)) {
      throw new EntityError('props.email')
    }
    this.props.email = props.email

    if (!User.validatePassword(props.password)) {
      throw new EntityError('props.password')
    }

    const hashedPassword = bcrypt.hashSync(props.password, 10)
    this.props.password = hashedPassword
  }

  get name() {
    return this.props.name
  }

  set setName(name: string) {
    if (!User.validateName(name)) {
      throw new EntityError('props.name')
    }
    this.props.name = name
  }

  get email() {
    return this.props.email
  }

  set setEmail(email: string) {
    if (!User.validateEmail(email)) {
      throw new EntityError('props.email')
    }
    this.props.email = email
  }

  get password() {
    return this.props.password
  }

  set setPassword(password: string) {
    if (!User.validatePassword(password)) {
      throw new EntityError('props.password')
    }
    this.props.password = password
  }

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
    }
  }

  static validateName(name: string): boolean {
    if (name == null) {
      return false
    } else if (typeof name !== 'string') {
      return false
    } else if (name.length < 3) {
      return false
    }
    return true
  }

  static validateEmail(email: string): boolean {
    const regexp = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'

    if (email == null) {
      return false
    }
    if (typeof email !== 'string') {
      return false
    }
    if (!email.match(regexp)) {
      return false
    }
    return true
  }

  static validatePassword(password: string): boolean {
    if (password == null) {
      return false
    } else if (typeof password !== 'string') {
      return false
    } else if (password.length < 6) {
      return false
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(password)) {
      return false
    }
    return true
  }
}
