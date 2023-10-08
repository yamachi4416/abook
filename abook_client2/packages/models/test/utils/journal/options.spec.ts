import { describe, expect, it } from 'vitest'
import { AccountData } from '../../data'
import {
  AccountViewModel,
  FinanceDivs,
  JournalDivs,
  JournalEditModel,
  JournalUtils,
} from '../../../src/'

describe('JournalUtls', () => {
  const Accounts = {
    All: AccountData.AllAccounts,
    Incomes: AccountData.IncomeAccounts,
    Expencies: AccountData.ExpenseAccounts,
    Assets: AccountData.AssetsAccounts,
    Liabilities: AccountData.LiabilitiesAccounts,
  } as const

  describe('getAllDebitAccounts', () => {
    it.each<{
      journalDiv: keyof typeof JournalDivs | 'None'
      accountDiv: keyof typeof FinanceDivs | 'None'
      financeDivs: (keyof typeof Accounts)[]
    }>([
      {
        journalDiv: 'None',
        accountDiv: 'None',
        financeDivs: ['Expencies', 'Assets', 'Liabilities'],
      },
      {
        journalDiv: 'Income',
        accountDiv: 'None',
        financeDivs: ['Assets', 'Liabilities'],
      },
      {
        journalDiv: 'Expense',
        accountDiv: 'None',
        financeDivs: ['Expencies'],
      },
      {
        journalDiv: 'Transfer',
        accountDiv: 'None',
        financeDivs: ['Assets', 'Liabilities'],
      },
      {
        journalDiv: 'Transfer',
        accountDiv: 'Assets',
        financeDivs: ['Assets', 'Liabilities'],
      },
      {
        journalDiv: 'Transfer',
        accountDiv: 'Liabilities',
        financeDivs: ['Assets', 'Liabilities'],
      },
    ])(
      '({ journal: { journalDiv: $journalDiv, creditAccount: $accountDiv }})',
      ({ journalDiv, accountDiv, financeDivs }) => {
        const account =
          accountDiv === 'None'
            ? undefined
            : Accounts.All.find(
                (acc) => acc.financeDiv === FinanceDivs[accountDiv],
              )

        const actual = JournalUtils.getAllDebitAccounts({
          accounts: AccountData.AllAccounts,
          journal: {
            journalDiv:
              journalDiv === 'None' ? undefined : JournalDivs[journalDiv],
            creditAccount: account,
          },
        })

        expect(actual).toEqual(
          financeDivs
            .flatMap((finance) => Accounts[finance])
            .filter(({ id }) => account?.id !== id),
        )
      },
    )
  })

  describe('getAllCreditAccounts', () => {
    it.each<{
      journalDiv: keyof typeof JournalDivs | 'None'
      accountDiv: keyof typeof FinanceDivs | 'None'
      financeDivs: (keyof typeof Accounts)[]
    }>([
      {
        journalDiv: 'None',
        accountDiv: 'None',
        financeDivs: ['Incomes', 'Assets', 'Liabilities'],
      },
      {
        journalDiv: 'Income',
        accountDiv: 'None',
        financeDivs: ['Incomes'],
      },
      {
        journalDiv: 'Expense',
        accountDiv: 'None',
        financeDivs: ['Assets', 'Liabilities'],
      },
      {
        journalDiv: 'Transfer',
        accountDiv: 'None',
        financeDivs: ['Assets', 'Liabilities'],
      },
      {
        journalDiv: 'Transfer',
        accountDiv: 'Assets',
        financeDivs: ['Assets', 'Liabilities'],
      },
      {
        journalDiv: 'Transfer',
        accountDiv: 'Liabilities',
        financeDivs: ['Assets', 'Liabilities'],
      },
    ])(
      '({ journal: { journalDiv: $journalDiv, debitAccount: $accountDiv }})',
      ({ journalDiv, accountDiv, financeDivs }) => {
        const account =
          accountDiv === 'None'
            ? undefined
            : Accounts.All.find(
                (acc) => acc.financeDiv === FinanceDivs[accountDiv],
              )

        const actual = JournalUtils.getAllCreditAccounts({
          accounts: AccountData.AllAccounts,
          journal: {
            journalDiv:
              journalDiv === 'None' ? undefined : JournalDivs[journalDiv],
            debitAccount: account,
          },
        })

        expect(actual).toEqual(
          financeDivs
            .flatMap((finance) => Accounts[finance])
            .filter(({ id }) => account?.id !== id),
        )
      },
    )
  })

  describe('getDebitAccounts', () => {
    const accounts = Accounts.All.map((account) => ({
      ...account,
      avaliable: false,
    }))

    const assets = accounts.filter(
      ({ financeDiv }) => financeDiv === FinanceDivs.Assets,
    )

    it.each<{
      original: JournalEditModel
      journal: JournalEditModel
      expected: AccountViewModel[]
    }>([
      { original: {}, journal: {}, expected: [] },
      {
        original: { debitAccount: assets[0] },
        journal: {},
        expected: [assets[0]],
      },
      {
        original: {},
        journal: { debitAccount: assets[0] },
        expected: [assets[0]],
      },
      {
        original: { debitAccount: assets[1] },
        journal: { debitAccount: assets[0] },
        expected: [assets[0], assets[1]],
      },
      {
        original: { creditAccount: assets[1] },
        journal: { creditAccount: assets[0] },
        expected: [],
      },
    ])(
      '({ original: { debit: $original.debitAccount.name },' +
        ' journal: { debit: $journal.debitAccount.name } })',
      ({ original, journal, expected }) => {
        const actual = JournalUtils.getDebitAccounts({
          accounts,
          original,
          journal,
        })

        expect(actual).toEqual(expected)
      },
    )
  })

  describe('getCreditAccounts', () => {
    const accounts = Accounts.All.map((account) => ({
      ...account,
      avaliable: false,
    }))

    const assets = accounts.filter(
      ({ financeDiv }) => financeDiv === FinanceDivs.Assets,
    )

    it.each<{
      original: JournalEditModel
      journal: JournalEditModel
      expected: AccountViewModel[]
    }>([
      { original: {}, journal: {}, expected: [] },
      {
        original: { creditAccount: assets[0] },
        journal: {},
        expected: [assets[0]],
      },
      {
        original: {},
        journal: { creditAccount: assets[0] },
        expected: [assets[0]],
      },
      {
        original: { creditAccount: assets[1] },
        journal: { creditAccount: assets[0] },
        expected: [assets[0], assets[1]],
      },
      {
        original: { debitAccount: assets[1] },
        journal: { debitAccount: assets[0] },
        expected: [],
      },
    ])(
      '({ original: { credit: $original.creditAccount.name },' +
        ' journal: { credit: $journal.creditAccount.name } })',
      ({ original, journal, expected }) => {
        const actual = JournalUtils.getCreditAccounts({
          accounts,
          original,
          journal,
        })

        expect(actual).toEqual(expected)
      },
    )
  })
})
