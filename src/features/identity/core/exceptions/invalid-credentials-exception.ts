export class InvalidCredentialsException extends Error {
    constructor() {
        super('invalid credentials');
    }
}