import { makeAccount } from "../../__tests__/factories/make-account"
import { makeUser } from "../../__tests__/factories/make-user"
import { FakeIdentityProviderClient } from "../../__tests__/fake/fake-identity-provider-client"
import { InMemoryAccountsRepository } from "../../__tests__/in-memory-repositories/in-memory-accounts-repository"
import { InMemoryUsersRepository } from "../../__tests__/in-memory-repositories/in-memory-users-repository"
import { InvalidCredentialsException } from "../exceptions/invalid-credentials-exception"
import { SignInUseCase } from "./sign-in-usecase"

describe('[IDENTITY] Sign In UseCase', () => {
    let sut: SignInUseCase
    let fakeIdentityProvider: FakeIdentityProviderClient
    let accountsRepository: InMemoryAccountsRepository
    let usersRepository: InMemoryUsersRepository

    beforeAll(() => {
        accountsRepository = new InMemoryAccountsRepository()
        fakeIdentityProvider = new FakeIdentityProviderClient()
        usersRepository = new InMemoryUsersRepository()
        sut = new SignInUseCase(fakeIdentityProvider, accountsRepository)
    })

    beforeEach(() => {
        accountsRepository.clear()
        usersRepository.clear()
        fakeIdentityProvider.clear()
    })

    it('should be able sign in a valid user', async () => {
        const user = makeUser()
        await usersRepository.store(user)

        const password = "dummy-pass"
        const userIdFromProvider = await fakeIdentityProvider.signUp({
            ...user,
            password
        })

        const provider = 'Cognito'

        await accountsRepository.store(makeAccount({
            email: user.email,
            userId: user.id,
            provider,
            userIdFromProvider
        }))

        const result = await sut.execute({
            provider: provider,
            email: user.email,
            password
        })

        expect(result).toMatchObject({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
        })
    })

    it('should be not able sign in a user that does not have a account for the provider', async () => {
        const user = makeUser()
        await usersRepository.store(user)

        const password = "dummy-pass"
        const userIdFromProvider = await fakeIdentityProvider.signUp({
            ...user,
            password
        })

        const provider = 'Cognito'

        await accountsRepository.store(makeAccount({
            email: user.email,
            userId: user.id,
            provider,
            userIdFromProvider
        }))

        await expect(() => sut.execute({
            provider: "Auth0",
            email: user.email,
            password
        })).rejects.toBeInstanceOf(InvalidCredentialsException)
    })

    it('should be not able sign in a user that does not have a account', async () => {
        const user = makeUser()
        await usersRepository.store(user)

        const password = "dummy-passpassword"

        await fakeIdentityProvider.signUp({
            ...user,
            password
        })

        await expect(() => sut.execute({
            provider: "Cognito",
            email: user.email,
            password
        })).rejects.toBeInstanceOf(InvalidCredentialsException)
    })

    it('should be not able sign in a user that credentials does not match', async () => {
        const user = makeUser()
        await usersRepository.store(user)

        const password = "dummy-pass"
        const userIdFromProvider = await fakeIdentityProvider.signUp({
            ...user,
            password
        })

        const provider = 'Cognito'

        await accountsRepository.store(makeAccount({
            email: user.email,
            userId: user.id,
            provider,
            userIdFromProvider
        }))

        await expect(() => sut.execute({
            provider: "Cognito",
            email: user.email,
            password: password + "1"
        })).rejects.toBeInstanceOf(InvalidCredentialsException)
    })
})