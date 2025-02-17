import { IdentityProviderClient } from "../clients/identity-provider-client"
import { InvalidCredentialsException } from "../exceptions/invalid-credentials-exception"
import { AccountsRepository } from "../repositories/accounts-repository"

export interface ForgotPasswordUseCaseRequest {
    provider: string
    email: string
}

export class ForgotPasswordUseCase {
    constructor(
        private readonly identityProviderClient: IdentityProviderClient,
        private readonly accountsRepository: AccountsRepository,
    ) { }

    async execute(req: ForgotPasswordUseCaseRequest): Promise<void> {
        const { provider, email } = req

        const accountExists = await this.accountsRepository.findByEmailAndProvider(email, provider)
        if (!accountExists) {
            throw new InvalidCredentialsException()
        }

        return await this.identityProviderClient.forgotPassword(email)
    }
}