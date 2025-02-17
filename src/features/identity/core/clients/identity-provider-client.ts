export interface SignUpParams {
    email: string
    firstName: string
    lastName: string
    birthDate: Date
    password: string
}

export interface SignInParams {
    email: string
    password: string
}

export interface SignInResult {
    accessToken: string
    refreshToken: string
}

export interface RefreshSessionResult {
    refreshToken: string
    accessToken: string
}

export interface ResetPasswordParams {
    code: string
    email: string
    newPassword: string
}

export interface ResetPasswordResult {
    refreshToken: string
    accessToken: string
}

export interface IdentityProviderClient {
    signUp(params: SignUpParams): Promise<string>

    signIn(params: SignInParams): Promise<SignInResult>

    confirmAccount(email: string, code: string): Promise<void>

    refreshSession(refreshToken: string): Promise<RefreshSessionResult>

    resetPassword(params: ResetPasswordParams): Promise<ResetPasswordResult>

    forgotPassword(email: string): Promise<void>
}