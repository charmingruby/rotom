import { faker } from '@faker-js/faker'
import { SignUpParams } from '../../core/clients/identity-provider-client'

export function makeFakeProviderItem(override: Partial<SignUpParams> = {}): SignUpParams {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        birthDate: faker.date.past(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        ...override
    }
}