import { makeAccount } from "../../__tests__/factories/make-account"
import { makeUser } from "../../__tests__/factories/make-user"
import { FakeIdentityProviderClient } from "../../__tests__/fake/fake-identity-provider-client"
import { InMemoryAccountsRepository } from "../../__tests__/in-memory-repositories/in-memory-accounts-repository"
import { InMemoryUsersRepository } from "../../__tests__/in-memory-repositories/in-memory-users-repository"
import { InvalidCodeException } from "../exceptions/invalid-confirmation-code-exception"
import { InvalidCredentialsException } from "../exceptions/invalid-credentials-exception"
import { ResetPasswordUseCase } from "./reset-password-usecase"

describe('[IDENTITY] Reset Password UseCase', () => {
    let sut: ResetPasswordUseCase
    let fakeIdentityProvider: FakeIdentityProviderClient
    let accountsRepository: InMemoryAccountsRepository
    let usersRepository: InMemoryUsersRepository

    beforeAll(() => {
        accountsRepository = new InMemoryAccountsRepository()
        fakeIdentityProvider = new FakeIdentityProviderClient()
        usersRepository = new InMemoryUsersRepository()
        sut = new ResetPasswordUseCase(fakeIdentityProvider, accountsRepository)
    })

    beforeEach(() => {
        accountsRepository.clear()
        usersRepository.clear()
        fakeIdentityProvider.clear()
    })

    it('should be able to reset a password with a valid account', async () => {
        const user = makeUser()
        await usersRepository.store(user)

        const userIdFromProvider = await fakeIdentityProvider.signUp({
            ...user,
            password: 'dummy-password'
        })

        const account = makeAccount({
            email: user.email,
            userId: user.id,
            userIdFromProvider
        })

        await accountsRepository.store(account)

        const result = await sut.execute({
            provider: account.provider,
            email: user.email,
            newPassword: "new-password",
            code: 'valid-code'
        })

        expect(result).toMatchObject({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
        })
    })

    it('should be not able to reset password on an account that does not exists on provider', async () => {
        const user = makeUser()
        await usersRepository.store(user)

        const userIdFromProvider = await fakeIdentityProvider.signUp({
            ...user,
            password: 'dummy-password'
        })

        const account = makeAccount({
            email: user.email,
            userId: user.id,
            userIdFromProvider
        })

        await accountsRepository.store(account)

        await expect(() => sut.execute({
            provider: account.provider + 'invalid',
            email: user.email,
            newPassword: "new-password",
            code: 'valid-code'
        })).rejects.toBeInstanceOf(InvalidCredentialsException)
    })

    it('should be not able to reset password of an account with invalid code', async () => {
        const user = makeUser()
        await usersRepository.store(user)

        const userIdFromProvider = await fakeIdentityProvider.signUp({
            ...user,
            password: 'dummy-password'
        })

        const account = makeAccount({
            email: user.email,
            userId: user.id,
            userIdFromProvider
        })

        await accountsRepository.store(account)

        await expect(() => sut.execute({
            provider: account.provider,
            email: user.email,
            code: 'not-valid-code',
            newPassword: "new-password"
        })).rejects.toBeInstanceOf(InvalidCodeException)
    })
})