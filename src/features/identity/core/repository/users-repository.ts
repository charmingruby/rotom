import { UserModel } from "../models/user-model"

export interface UsersRepository {
    store(model: UserModel): Promise<void>
    findByEmail(email: string): Promise<UserModel | null>
}