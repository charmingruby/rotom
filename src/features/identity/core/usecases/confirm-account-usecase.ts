import { IdentityProviderClient } from "../clients/identity-provider-client"
import { InvalidCredentialsException } from "../exceptions/invalid-credentials-exception"
import { AccountsRepository } from "../repositories/accounts-repository"

export interface ConfirmAccountUseCaseRequest {
    provider: string
    email: string
    code: string
}

export class ConfirmAccountUseCase {
    constructor(
        private readonly identityProviderClient: IdentityProviderClient,
        private readonly accountsRepository: AccountsRepository,
    ) { }

    async execute(req: ConfirmAccountUseCaseRequest): Promise<void> {
        const { provider, email, code } = req

        const account = await this.accountsRepository.findByEmailAndProvider(email, provider)
        if (!account) {
            throw new InvalidCredentialsException()
        }

        await this.identityProviderClient.confirmAccount(email, code)

        account.confirmedAt = new Date()
        await this.accountsRepository.save(account)
    }
}