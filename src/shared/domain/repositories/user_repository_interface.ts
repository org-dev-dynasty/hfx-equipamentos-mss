import { User } from '../entities/user'

export interface IUserRepository {
  getUserByEmail(email: string): Promise<User | null>
  createUser(user: User): Promise<User>
  login(email: string): Promise<User>
  // updateUser(email: string, newPassword: string): Promise<User>
  // forgotPassword(email: string): Promise<User>
  // confirmForgotPassword(email: string, newPassword: string): Promise<User>
}
