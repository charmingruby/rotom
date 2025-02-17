import { DomainException } from "@shared/core/exceptions/domain-exception";

export class InvalidCredentialsException extends DomainException {
    constructor() {
        super('invalid credentials');
    }
}