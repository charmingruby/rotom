import { AccountModel } from "../models/account-model"

export interface AccountsRepository {
    store(model: AccountModel): Promise<void>
    findByEmailAndProvider(email: string, provider: string): Promise<AccountModel | null>
}