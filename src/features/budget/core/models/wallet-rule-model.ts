import { BaseModel } from "@shared/core/models/base"
import { IntervalType } from "./types/recurrence-types"
import { RuleType, RuleUnit } from "./types/rule-types"

export interface WalletRuleModel extends BaseModel {
    name: string
    type: RuleType
    unit: RuleUnit
    amount: number
    intervalType: IntervalType
    interval: number
    lastTriggeredAt?: Date
    walletId: string
}