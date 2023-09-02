export interface AbookViewModel {
  abookId: string
  name: string
  memo: string
  startOfMonthDate: number
  startOfMonthIsPrev: boolean
}

export interface AbookEditModel {
  name: string
  memo?: string
  startOfMonthDate: number
  startOfMonthIsPrev: boolean
}
