import { IdentityProviderClient } from "../clients/identity-provider-client"
import { InvalidCredentialsException } from "../exceptions/invalid-credentials-exception"
import { AccountsRepository } from "../repositories/accounts-repository"

export interface SignInUseCaseRequest {
    provider: string
    email: string
    password: string
}

export interface SignInUseCaseResponse {
    accessToken: string
    refreshToken: string
}

export class SignInUseCase {
    constructor(
        private readonly identityProviderClient: IdentityProviderClient,
        private readonly accountsRepository: AccountsRepository,
    ) { }

    async execute(req: SignInUseCaseRequest): Promise<SignInUseCaseResponse> {
        const { provider, email, password } = req

        const accountExists = await this.accountsRepository.findByEmailAndProvider(email, provider)
        if (!accountExists) {
            throw new InvalidCredentialsException()
        }

        return await this.identityProviderClient.signIn({ email, password })
    }
}