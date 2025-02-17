import { BaseModel } from "@shared/core/models/base"

export interface UserModel extends BaseModel {
    email: string
    firstName: string
    lastName: string
    birthDate: Date
    avatarUrl?: string
}