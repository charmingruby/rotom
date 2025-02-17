import { BaseModel } from "@shared/core/models/base"

export interface WalletModel extends BaseModel {
    name: string
    description: string
    currency: string
    currentBalance: number
    userId: string
    categoryIds: string[]
}