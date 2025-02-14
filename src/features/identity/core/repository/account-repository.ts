import { AccountModel } from "../models/account-model";

export interface AccountRepository {
    store(model: AccountModel): Promise<void>
    findByEmailAndProvider(email: string, provider: string): Promise<AccountModel | null>
}