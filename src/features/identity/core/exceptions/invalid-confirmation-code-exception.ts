export class InvalidConfirmationCodeException extends Error {
    constructor() {
        super('invalid confirmation code')
    }
}