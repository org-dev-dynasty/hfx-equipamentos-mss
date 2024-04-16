/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../../domain/entities/user'
import { IUserRepository } from '../../domain/repositories/user_repository_interface'
import { NoItemsFound } from '../../helpers/errors/usecase_errors'
import { UserDynamoDTO } from '../dto/user_dynamo_dto'
import { DynamoDatasource } from '../external/dynamo/datasources/dynamo_datasource'
import { Environments } from '../../../shared/environments'
import { hash } from 'bcryptjs'

export class UserRepositoryDynamo implements IUserRepository {
  static partitionKeyFormat(email: string): string {
    return `user#${email}`
  }

  static sortKeyFormat(email: string): string {
    return `#${email}`
  }

  constructor(
    private dynamo: DynamoDatasource = new DynamoDatasource(
      Environments.getEnvs().dynamoTableName,
      Environments.getEnvs().dynamoPartitionKey,
      Environments.getEnvs().region,
      undefined,
      undefined,
      Environments.getEnvs().endpointUrl,
      Environments.getEnvs().dynamoSortKey,
    ),
  ) {}

  async getUserByEmail(email: string): Promise<User | null> {
    const resp = await this.dynamo.getItem(
      UserRepositoryDynamo.partitionKeyFormat(email),
      UserRepositoryDynamo.sortKeyFormat(email),
    )
    if (!resp.Item) {
      throw new NoItemsFound('email')
    }

    const userDto = UserDynamoDTO.fromDynamo(resp['Item'])

    return Promise.resolve(userDto.toEntity())
  }

  async createUser(user: User): Promise<User> {
    user.setPassword = await hash(user.password, 10)
    const userDto = UserDynamoDTO.fromEntity(user)
    await this.dynamo.putItem(
      userDto.toDynamo(),
      UserRepositoryDynamo.partitionKeyFormat(user.email),
      UserRepositoryDynamo.sortKeyFormat(user.email),
    )

    return Promise.resolve(userDto.toEntity())
  }

  async login(email: string): Promise<User> {
    const user = await this.getUserByEmail(email)

    if (!user) throw new NoItemsFound('email')

    return Promise.resolve(user)
  }

  //   async forgotPassword(email: string): Promise<User> {
  //     const user = await this.getUserByEmail(email)

  //     if (!user) throw new NoItemsFound('email')

  //     return Promise.resolve(user)
  //   }

  //   async confirmForgotPassword(
  //     email: string,
  //     newPassword: string,
  //   ): Promise<User> {
  //     const user = await this.getUserByEmail(email)

  //     if (!user) throw new NoItemsFound('email')

  //     user.setPassword(await hash(newPassword, 10))

  //     await this.updateUser(email, newPassword)

  //     return Promise.resolve(user)
  //   }
}
