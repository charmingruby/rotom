import { BaseModel } from "@shared/core/models/base";
import { TransactionType } from "./types/transaction-types";
import { RecurrenceType } from "./types/recurrence-types";

export interface ScheduledTransactionModel extends BaseModel {
    name: string
    description: string
    relatedEntity: string // bank, person name, etc.
    categoryIds: string[]
    rulesIds: string[]
    amount: number
    type: TransactionType
    recurrence: RecurrenceType
    startDate: Date
    endDate: Date
}
