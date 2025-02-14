export interface AccountModel {
    id: string
    userId: string
    userIdFromProvider: string
    provider: string
    confirmedAt?: Date
    completedAt?: Date
    createdAt: Date
}
