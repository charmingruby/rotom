export interface SignUpParams {
    email: string
    firstName: string
    lastName: string
    birthDate: Date
    password: string
}

export interface IdentityProviderClient {
    signUp(params: SignUpParams): Promise<string>

    signIn(email: string, password: string): Promise<void>

    confirmAccount(email: string, code: string): Promise<void>

    resetPassword(email: string): Promise<void>

    forgotPassword(email: string, code: string, newPassword: string): Promise<void>

    refreshSession(refreshToken: string): Promise<void>
}