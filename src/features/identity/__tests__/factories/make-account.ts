import { faker } from '@faker-js/faker'
import { generateId } from '../../../../shared/core/models/id'
import { AccountModel } from '../../core/models/account-model'

export function makeAccount(override: Partial<AccountModel> = {}): AccountModel {
    return {
        id: generateId(),
        email: faker.internet.email(),
        provider: faker.internet.domainName(),
        userId: generateId(),
        userIdFromProvider: generateId(),
        completedAt: new Date(),
        confirmedAt: new Date(),
        createdAt: faker.date.recent(),
        ...override
    }
}