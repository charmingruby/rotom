import { UserModel } from "../models/user-model";

export interface UserRepository {
    store(model: UserModel): Promise<void>
}