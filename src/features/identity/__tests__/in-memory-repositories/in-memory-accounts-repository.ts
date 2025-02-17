import { AccountModel } from "../../core/models/account-model"
import { AccountsRepository } from "../../core/repositories/accounts-repository"

export class InMemoryAccountsRepository implements AccountsRepository {
    public items: AccountModel[] = []

    async store(model: AccountModel): Promise<void> {
        this.items.push(model)
    }

    async save(model: AccountModel): Promise<void> {
        const index = this.items.findIndex(item => item.id === model.id)
        if (index === -1) return

        this.items[index] = model
    }

    async findByEmailAndProvider(email: string, provider: string): Promise<AccountModel | null> {
        return this.items.find(item => item.email === email && item.provider === provider) || null
    }

    clear() { this.items = [] }
}