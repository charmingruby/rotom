import { makeAccount } from "../../__tests__/factories/make-account"
import { makeUser } from "../../__tests__/factories/make-user"
import { FakeIdentityProviderClient } from "../../__tests__/fake/fake-identity-provider-client"
import { InMemoryAccountsRepository } from "../../__tests__/in-memory-repositories/in-memory-accounts-repository"
import { InMemoryUsersRepository } from "../../__tests__/in-memory-repositories/in-memory-users-repository"
import { InvalidConfirmationCodeException } from "../exceptions/invalid-confirmation-code-exception"
import { InvalidCredentialsException } from "../exceptions/invalid-credentials-exception"
import { ConfirmAccountUseCase } from "./confirm-account-usecase"

describe('[IDENTITY] Confirm Account UseCase', () => {
    let sut: ConfirmAccountUseCase
    let fakeIdentityProvider: FakeIdentityProviderClient
    let accountsRepository: InMemoryAccountsRepository
    let usersRepository: InMemoryUsersRepository

    beforeAll(() => {
        accountsRepository = new InMemoryAccountsRepository()
        fakeIdentityProvider = new FakeIdentityProviderClient()
        usersRepository = new InMemoryUsersRepository()
        sut = new ConfirmAccountUseCase(fakeIdentityProvider, accountsRepository)
    })

    beforeEach(() => {
        accountsRepository.clear()
        usersRepository.clear()
        fakeIdentityProvider.clear()
    })

    it('should be able to confirm an account', async () => {
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

        await sut.execute({
            provider: account.provider,
            email: user.email,
            code: 'valid-code'
        })

        const confirmedAccount = await accountsRepository.findByEmailAndProvider(user.email, account.provider)
        expect(confirmedAccount?.confirmedAt).toBeInstanceOf(Date)
    })

    it('should be not able to confirm an account that does not exists on provider', async () => {
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
            code: 'valid-code'
        })).rejects.toBeInstanceOf(InvalidCredentialsException)
    })

    it('should be not able to confirm an account with invalid code', async () => {
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
            code: 'not-valid-code'
        })).rejects.toBeInstanceOf(InvalidConfirmationCodeException)
    })
})