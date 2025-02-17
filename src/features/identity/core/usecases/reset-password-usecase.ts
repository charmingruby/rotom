import { IdentityProviderClient } from "../clients/identity-provider-client"
import { InvalidCredentialsException } from "../exceptions/invalid-credentials-exception"
import { AccountsRepository } from "../repositories/accounts-repository"

export interface ResetPasswordUseCaseRequest {
    provider: string
    email: string
    code: string
    newPassword: string
}

export interface ResetPasswordUseCaseResponse {
    accessToken: string
    refreshToken: string
}

export class ResetPasswordUseCase {
    constructor(
        private readonly identityProviderClient: IdentityProviderClient,
        private readonly accountsRepository: AccountsRepository,
    ) { }

    async execute(req: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
        const { provider, email } = req

        const accountExists = await this.accountsRepository.findByEmailAndProvider(email, provider)
        if (!accountExists) {
            throw new InvalidCredentialsException()
        }

        return await this.identityProviderClient.resetPassword(req)
    }
}