import { BaseModel } from "@shared/core/models/base"

export interface AccountModel extends BaseModel {
    email: string
    userId: string
    userIdFromProvider: string
    provider: string
    confirmedAt?: Date
}
