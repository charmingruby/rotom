import { generateId } from "../../../../shared/core/models/id"
import { IdentityProviderClient, RefreshSessionResult, ResetPasswordParams, ResetPasswordResult, SignInParams, SignInResult, SignUpParams } from "../../core/clients/identity-provider-client"
import { InvalidCodeException } from "../../core/exceptions/invalid-confirmation-code-exception"
import { InvalidCredentialsException } from "../../core/exceptions/invalid-credentials-exception"
import { InvalidRefreshTokenException } from "../../core/exceptions/invalid-refresh-token-exception"

interface FakeIdentityProviderAccount {
    id: string
    email: string
    password: string
    confirmed?: boolean
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

    async confirmAccount(email: string, code: string): Promise<void> {
        const account = this.items.find(item => item.email === email)
        if (!account) {
            throw new InvalidCredentialsException()
        }

        const validCode = "valid-code"
        if (code !== validCode) {
            throw new InvalidCodeException("confirmation")
        }

        account.confirmed = true
    }

    async refreshSession(refreshToken: string): Promise<RefreshSessionResult> {
        if (refreshToken !== 'valid-refresh-token') {
            throw new InvalidRefreshTokenException()
        }

        return {
            accessToken: 'fake-access-token',
            refreshToken: refreshToken + '-refreshed'
        }
    }

    async forgotPassword(email: string): Promise<void> {
        const account = this.items.find(item => item.email === email)
        if (!account) {
            throw new InvalidCredentialsException()
        }
    }

    async resetPassword(params: ResetPasswordParams): Promise<ResetPasswordResult> {
        const account = this.items.find(item => item.email === params.email)

        if (!account) {
            throw new InvalidCredentialsException()
        }

        if (params.code !== 'valid-code') {
            throw new InvalidCodeException("reset password")
        }

        return {
            accessToken: 'fake-access-token',
            refreshToken: 'fake-refresh-token',
        }
    }

    clear() { this.items = [] }
}