import { BaseModel } from "@shared/core/models/base"

export interface WalletRuleModel extends BaseModel {
    name: string
    type: 'max' | 'min'
    unit: 'flat' | 'percent'
    amount: number
    intervalType: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'always'
    interval: number
    lastTriggeredAt?: Date
    walletId: string
}