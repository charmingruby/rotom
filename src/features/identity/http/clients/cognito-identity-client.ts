import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { IdentityProviderClient } from "../../core/clients/identity-provider-client";

export class CognitoIdentityClient implements IdentityProviderClient {
    constructor(private readonly cognito: CognitoIdentityProviderClient) { }

    signUp(email: string, password: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    signIn(email: string, password: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    confirmAccount(email: string, code: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    resetPassword(email: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    forgotPassword(email: string, code: string, newPassword: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    refreshSession(refreshToken: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}