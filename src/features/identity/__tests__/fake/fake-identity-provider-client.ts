import { generateId } from "../../../../shared/core/models/id"
import { IdentityProviderClient, SignInParams, SignInResult, SignUpParams } from "../../core/clients/identity-provider-client"
import { InvalidCredentialsException } from "../../core/exceptions/invalid-credentials-exception"

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

    async signIn(params: SignInParams): Promise<SignInResult> {
        const account = this.items.find(item => item.email === params.email && item.password === params.password)

        if (!account) {
            throw new InvalidCredentialsException()
        }

        return {
            accessToken: 'fake-access-token',
            refreshToken: 'fake-refresh-token',
        }
    }

    clear() { this.items = [] }
}