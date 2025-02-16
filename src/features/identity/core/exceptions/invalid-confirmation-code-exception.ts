import { DomainException } from "../../../../shared/core/exceptions/domain-exception";

export class InvalidConfirmationCodeException extends DomainException {
    constructor() {
        super('invalid confirmation code')
    }
}