export interface IdentityProviderClient {
    signUp(email: string, password: string): Promise<void>

    signIn(email: string, password: string): Promise<void>

    confirmAccount(email: string, code: string): Promise<void>

    resetPassword(email: string): Promise<void>

    forgotPassword(email: string, code: string, newPassword: string): Promise<void>

    refreshSession(refreshToken: string): Promise<void>
}