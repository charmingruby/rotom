export class ResourceAlreadyExistsException extends Error {
    constructor(resource: string) {
        super(`${resource} already exists`)
    }
}