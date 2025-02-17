import { BaseModel } from "@shared/core/models/base";

export interface GoalModel extends BaseModel {
    name: string
    description: string
    targetAmount: number
    expectedAmount: number
    dueDate: Date
    desactivatedAt?: Date
    walletId: string
}