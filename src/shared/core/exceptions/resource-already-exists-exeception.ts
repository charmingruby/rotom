import { DomainException } from "./domain-exception";

export class ResourceAlreadyExistsException extends DomainException {
    constructor(resource: string) {
        super(`${resource} already exists`)
    }
}