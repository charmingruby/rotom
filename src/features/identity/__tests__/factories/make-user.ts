import { faker } from '@faker-js/faker'
import { generateId } from '@shared/core/models/id'
import { UserModel } from '../../core/models/user-model'

export function makeUser(override: Partial<UserModel> = {}): UserModel {
    return {
        id: generateId(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        avatarUrl: faker.image.avatar(),
        birthDate: faker.date.past(),
        email: faker.internet.email(),
        createdAt: faker.date.recent(),
        updatedAt: undefined,
        ...override
    }
}