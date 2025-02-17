import { BaseModel } from "@shared/core/models/base";
import { TransactionType } from "./types/transaction-types";

export interface TransactionModel extends BaseModel {
    name: string
    description: string
    relatedEntity: string // bank, person name, etc.
    categoryIds: string[]
    rulesIds: string[]
    amount: number
    type: TransactionType
    ocurredAt: Date
    scheduledTransactionId?: string
}
