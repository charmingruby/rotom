import { makeAccount } from "../../__tests__/factories/make-account"
import { makeUser } from "../../__tests__/factories/make-user"
import { FakeIdentityProviderClient } from "../../__tests__/fake/fake-identity-provider-client"
import { InMemoryAccountsRepository } from "../../__tests__/in-memory-repositories/in-memory-accounts-repository"
import { InMemoryUsersRepository } from "../../__tests__/in-memory-repositories/in-memory-users-repository"
import { InvalidCredentialsException } from "../exceptions/invalid-credentials-exception"
import { ForgotPasswordUseCase } from "./forgot-password-usecase"

describe('[IDENTITY] Forgot Password UseCase', () => {
    let sut: ForgotPasswordUseCase
    let fakeIdentityProvider: FakeIdentityProviderClient
    let usersRepository: InMemoryUsersRepository
    let accountsRepository: InMemoryAccountsRepository

    beforeAll(() => {
        fakeIdentityProvider = new FakeIdentityProviderClient()
        usersRepository = new InMemoryUsersRepository()
        accountsRepository = new InMemoryAccountsRepository()
        sut = new ForgotPasswordUseCase(fakeIdentityProvider, accountsRepository)
    })

    beforeEach(() => {
        accountsRepository.clear()
        usersRepository.clear()
        fakeIdentityProvider.clear()
    })

    it('should be able to forgot password if exists', async () => {
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

        await expect(
            sut.execute({
                provider: account.provider,
                email: account.email
            })
        ).resolves.not.toThrow()
    })

    it('should be not able to forgot password that does not exists', async () => {
        await expect(
            sut.execute({
                provider: "invalid provider",
                email: "invalid email"
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsException)
    })
})