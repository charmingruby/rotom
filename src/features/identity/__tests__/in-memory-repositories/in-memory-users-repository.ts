import { UserModel } from "../../core/models/user-model"
import { UsersRepository } from "../../core/repositories/users-repository"

export class InMemoryUsersRepository implements UsersRepository {
    public items: UserModel[] = []

    async store(model: UserModel): Promise<void> {
        this.items.push(model)
    }

    async findByEmail(email: string): Promise<UserModel | null> {
        return this.items.find(item => item.email === email) || null
    }

    clear() { this.items = [] }
}