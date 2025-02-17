import { BaseModel } from "@shared/core/models/base"
import { IntervalType } from "./types/recurrence-types"
import { RuleUnit } from "./types/rule-types"
import { TransactionType } from "./types/transaction-types"

export interface TransactionRuleModel extends BaseModel {
    name: string
    amount: number
    unit: RuleUnit
    intervalType: IntervalType
    interval: number
    nextTriggerAt?: Date
    lastTriggeredAt?: Date
    type: TransactionType
    walletIds: string[]
    transactionId: string
}