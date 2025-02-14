import { generateId } from "../../../../shared/core/models/id"
import { IdentityProviderClient, SignUpParams } from "../../core/clients/identity-provider-client"

interface FakeIdentityProviderAccount {
    id: string
    email: string
    password: string
}

export class FakeIdentityProviderClient implements IdentityProviderClient {
    public items: FakeIdentityProviderAccount[] = []

    async signUp(params: SignUpParams): Promise<string> {
        const account: FakeIdentityProviderAccount = {
            id: generateId(),
            email: params.email,
            password: params.password
        }

        this.items.push(account)

        return account.id
    }

    clear() { this.items = [] }
}