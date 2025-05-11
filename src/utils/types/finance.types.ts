export type ArrivalInputs = {
    clientId: number
    amount: number | null
    date: Date
    financeAccountId: number
    financeCategoryId: number | undefined
    contragentId: number | undefined
    comment: string
}

export type TransferInputs = {
    fromAccountId: number
    amount: number | null
    toAccountId: number
    date: Date
    comment: string
}
