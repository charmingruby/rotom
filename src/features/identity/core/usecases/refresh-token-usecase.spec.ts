import { FakeIdentityProviderClient } from "../../__tests__/fake/fake-identity-provider-client"
import { InvalidRefreshTokenException } from "../exceptions/invalid-refresh-token-exception"
import { RefreshTokenUseCase } from "./refresh-token.usecase"

describe('[IDENTITY] Refresh Token UseCase', () => {
    let sut: RefreshTokenUseCase
    let fakeIdentityProvider: FakeIdentityProviderClient

    beforeAll(() => {
        fakeIdentityProvider = new FakeIdentityProviderClient()
        sut = new RefreshTokenUseCase(fakeIdentityProvider)
    })

    beforeEach(() => {
        fakeIdentityProvider.clear()
    })

    it('should be able to refresh a valid token', async () => {
        const result = await sut.execute({ refreshToken: 'valid-refresh-token' })

        expect(result).toMatchObject({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
        })
    })

    it('should be not able to refresh an invalid token', async () => {
        await expect(
            async () => sut.execute({ refreshToken: 'not-valid-refresh-token' })
        ).rejects.toBeInstanceOf(InvalidRefreshTokenException)
    })
})