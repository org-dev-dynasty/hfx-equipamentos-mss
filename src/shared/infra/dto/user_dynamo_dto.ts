/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../../domain/entities/user'

type UserDynamoDTOProps = {
  name: string
  email: string
  password: string
}

export class UserDynamoDTO {
  private name: string
  private email: string
  private password: string

  constructor(props: UserDynamoDTOProps) {
    this.name = props.name
    this.email = props.email
    this.password = props.password
  }

  static fromEntity(user: User): UserDynamoDTO {
    return new UserDynamoDTO({
      name: user.name,
      email: user.email,
      password: user.password,
    })
  }

  toDynamo() {
    return {
      entity: 'user',
      name: this.name,
      email: this.email,
      password: this.password,
    }
  }

  static fromDynamo(userData: any) {
    const name =
      userData['name'] && userData['name']['S'] ? userData['name']['S'] : null
    const email =
      userData['email'] && userData['email']['S']
        ? userData['email']['S']
        : null
    const password =
      userData['password'] && userData['password']['S']
        ? userData['password']['S']
        : null
    return new UserDynamoDTO({
      name,
      email,
      password,
    })
  }

  toEntity() {
    return new User({
      name: this.name,
      email: this.email,
      password: this.password,
    })
  }
}
