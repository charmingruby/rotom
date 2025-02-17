import { BaseModel } from "@shared/core/models/base"

export interface TransactionCategoryModel extends BaseModel {
    name: string
    description: string
    userId: string
}