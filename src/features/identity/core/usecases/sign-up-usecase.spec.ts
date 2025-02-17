import { ResourceAlreadyExistsException } from "@shared/core/exceptions/resource-already-exists-exeception"
import { makeAccount } from "../../__tests__/factories/make-account"
import { makeUser } from "../../__tests__/factories/make-user"
import { FakeIdentityProviderClient } from "../../__tests__/fake/fake-identity-provider-client"
import { InMemoryAccountsRepository } from "../../__tests__/in-memory-repositories/in-memory-accounts-repository"
import { InMemoryUsersRepository } from "../../__tests__/in-memory-repositories/in-memory-users-repository"
import { SignUpUseCase, SignUpUseCaseRequest } from "./sign-up-usecase"

describe('[IDENTITY] Sign Up UseCase', () => {
    let sut: SignUpUseCase
    let fakeIdentityProvider: FakeIdentityProviderClient
    let accountsRepository: InMemoryAccountsRepository
    let usersRepository: InMemoryUsersRepository

    const baseRequest: SignUpUseCaseRequest = {
        firstName: 'Dummy',
        lastName: 'Doe',
        email: 'dummy@dummy.com',
        password: 'password123',
        birthDate: new Date('2003-05-31'),
        provider: 'cognito',
    }

    beforeAll(() => {
        accountsRepository = new InMemoryAccountsRepository()
        usersRepository = new InMemoryUsersRepository()
        fakeIdentityProvider = new FakeIdentityProviderClient()
        sut = new SignUpUseCase(fakeIdentityProvider, usersRepository, accountsRepository)
    })

    beforeEach(() => {
        accountsRepository.clear()
        usersRepository.clear()
        fakeIdentityProvider.clear()
    })

    it('should be able sign up a new user', async () => {
        const result = await sut.perform(baseRequest)

        expect(result).toBeTruthy()

        const userId = usersRepository.items[0].id
        const accountId = accountsRepository.items[0].id

        expect(result).toEqual({
            userId,
            accountId
        })

        expect(accountsRepository.items[0].userId).toBe(userId)

        expect(fakeIdentityProvider.items).toHaveLength(1)
        expect(fakeIdentityProvider.items[0].email).toBe(baseRequest.email)
    })

    it('should be not able sign up if account already exists in provider', async () => {
        const user = makeUser()
        await usersRepository.store(user)

        const userIdFromProvider = await fakeIdentityProvider.signUp(
            {
                birthDate: user.birthDate,
                email: user.email,
                password: baseRequest.password,
                firstName: user.firstName,
                lastName: user.lastName
            }
        )

        const account = makeAccount({
            email: user.email,
            userId: user.id,
            userIdFromProvider
        })

        await accountsRepository.store(account)

        await expect(() => sut.perform({
            ...baseRequest,
            email: account.email,
            provider: account.provider
        })).rejects.toThrowError(ResourceAlreadyExistsException)

        expect(usersRepository.items).toHaveLength(1)
        expect(accountsRepository.items).toHaveLength(1)
        expect(fakeIdentityProvider.items).toHaveLength(1)
    })

    it('should be able to sign up if user already exists', async () => {
        const user = makeUser()
        await usersRepository.store(user)

        expect(usersRepository.items).toHaveLength(1)
        expect(accountsRepository.items).toHaveLength(0)
        expect(fakeIdentityProvider.items).toHaveLength(0)

        const result = await sut.perform({
            ...baseRequest,
            email: user.email
        })

        const userId = usersRepository.items[0].id
        const accountId = accountsRepository.items[0].id

        expect(accountsRepository.items[0].userId).toBe(userId)

        expect(usersRepository.items).toHaveLength(1)
        expect(accountsRepository.items).toHaveLength(1)
        expect(fakeIdentityProvider.items).toHaveLength(1)

        expect(result).toEqual({
            userId,
            accountId
        })
    })
})