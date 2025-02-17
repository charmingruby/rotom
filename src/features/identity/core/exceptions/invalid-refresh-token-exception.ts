import { DomainException } from "@shared/core/exceptions/domain-exception";

export class InvalidRefreshTokenException extends DomainException {
    constructor() {
        super('invalid refresh token');
    }
}