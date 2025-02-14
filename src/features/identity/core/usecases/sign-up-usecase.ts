import { ResourceAlreadyExistsException } from "../../../../shared/core/exceptions/resource-already-exists-exeception";
import { generateId } from "../../../../shared/core/models/id";
import { IdentityProviderClient } from "../clients/identity-provider-client";
import { AccountModel } from "../models/account-model";
import { UserModel } from "../models/user-model";
import { AccountRepository } from "../repository/account-repository";
import { UserRepository } from "../repository/user-repository";

interface SignUpUseCaseRequest {
    email: string
    firstName: string
    lastName: string
    birthDate: Date
    password: string
    provider: string
}


export class SignUpUseCase {
    constructor(
        private readonly identityProviderClient: IdentityProviderClient,
        private readonly userRepository: UserRepository,
        private readonly accountRepository: AccountRepository,
    ) { }

    async perform(req: SignUpUseCaseRequest): Promise<void> {
        const { email, password, firstName, lastName, birthDate, provider } = req

        const accountAlreadyExistsInProvider = await this.accountRepository.findByEmailAndProvider(email, provider)
        if (accountAlreadyExistsInProvider) {
            throw new ResourceAlreadyExistsException('account')
        }

        const userIdFromProvider = await this.identityProviderClient.signUp({
            firstName,
            lastName,
            email,
            password,
            birthDate,
        })

        const user: UserModel = {
            id: generateId(),
            birthDate,
            email,
            firstName,
            lastName,
            avatarUrl: undefined,
            createdAt: new Date(),
        }

        const account: AccountModel = {
            id: generateId(),
            userId: user.id,
            userIdFromProvider,
            provider,
            completedAt: undefined,
            confirmedAt: undefined,
            createdAt: new Date(),
        }

        await this.userRepository.store(user)

        await this.accountRepository.store(account)
    }
}