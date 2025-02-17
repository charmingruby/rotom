import { DomainException } from "@shared/core/exceptions/domain-exception";

export class InvalidCodeException extends DomainException {
    constructor(codeType: string) {
        super(`invalid ${codeType} code`)
    }
}