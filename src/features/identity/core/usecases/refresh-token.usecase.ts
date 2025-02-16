import { IdentityProviderClient } from "../clients/identity-provider-client"

export interface RefreshTokenUseCaseRequest {
    refreshToken: string
}

export interface RefreshTokenUseCaseResponse {
    accessToken: string
    refreshToken: string
}

export class RefreshTokenUseCase {
    constructor(
        private readonly identityProviderClient: IdentityProviderClient,
    ) { }

    async execute(req: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
        const { refreshToken } = req

        return await this.identityProviderClient.refreshSession(refreshToken)
    }
}