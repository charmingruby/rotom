export interface UserModel {
    id: string
    email: string
    firstName: string
    lastName: string
    birthDate: Date
    password: string
    provider: string
    confirmedAt?: Date
    completedAt?: Date
    createdAt: Date
}