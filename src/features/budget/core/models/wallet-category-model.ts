import { BaseModel } from "@shared/core/models/base"

export interface WalletCategoryModel extends BaseModel {
    name: string
    description: string
    userId: string
}