import { ResourceAlreadyExistsException } from "@shared/core/exceptions/resource-already-exists-exeception"
import { generateId } from "@shared/core/models/id"
import { IdentityProviderClient } from "../clients/identity-provider-client"
import { AccountModel } from "../models/account-model"
import { UserModel } from "../models/user-model"
import { AccountsRepository } from "../repositories/accounts-repository"
import { UsersRepository } from "../repositories/users-repository"

export interface SignUpUseCaseRequest {
    email: string
    firstName: string
    lastName: string
    birthDate: Date
    password: string
    provider: string
}

export interface SignUpUseCaseResponse {
    accountId: string
    userId: string
}

export class SignUpUseCase {
    constructor(
        private readonly identityProviderClient: IdentityProviderClient,
        private readonly usersRepository: UsersRepository,
        private readonly accountsRepository: AccountsRepository,
    ) { }

    async perform(req: SignUpUseCaseRequest): Promise<SignUpUseCaseResponse> {
        const { email, password, firstName, lastName, birthDate, provider } = req

        const accountAlreadyExistsInProvider = await this.accountsRepository.findByEmailAndProvider(email, provider)
        if (accountAlreadyExistsInProvider) {
            throw new ResourceAlreadyExistsException('account')
        }

        const userAlreadyExists = await this.usersRepository.findByEmail(email)
        let userId: string = userAlreadyExists?.id || ''

        if (!userAlreadyExists) {
            const user: UserModel = {
                id: generateId(),
                birthDate,
                email,
                firstName,
                lastName,
                avatarUrl: undefined,
                createdAt: new Date(),
                updatedAt: undefined
            }

            await this.usersRepository.store(user)

            userId = user.id
        }

        const userIdFromProvider = await this.identityProviderClient.signUp({
            firstName,
            lastName,
            email,
            password,
            birthDate,
        })

        const account: AccountModel = {
            id: generateId(),
            email,
            userId,
            userIdFromProvider,
            provider,
            confirmedAt: undefined,
            createdAt: new Date(),
            updatedAt: undefined
        }

        await this.accountsRepository.store(account)

        return {
            accountId: account.id,
            userId,
        }
    }
}