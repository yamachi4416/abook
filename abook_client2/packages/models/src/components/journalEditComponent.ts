import { journalEdtitor } from '../editors'
import {
  AccountsService,
  JournalsService,
  apiValidationErrorService,
} from '../services'
import { ApiValidationError, JournalEditModel } from '../share'
import {
  getCreditAccounts,
  getDebitAccounts,
  getFeeAccounts,
} from '../utils/journal'
import { JournalEditState } from './interfaces'

export function journalEditComponent<State extends JournalEditState>({
  journalsService,
  accountsService,
  state,
}: {
  journalsService: JournalsService
  accountsService: AccountsService
  state: State
}) {
  const errors = apiValidationErrorService<JournalEditModel>({
    state,
    obj: 'journal',
  })

  async function readJournal(id?: string) {
    const [accounts, original] = await Promise.all([
      accountsService.getAllAccounts(),
      id ? await journalsService.getJournal(id) : journalsService.newJournal(),
    ])

    state.accounts = accounts
    state.original = original

    const journal = JSON.parse(JSON.stringify(original))
    state.journal = journal
    if (state.journal) {
      state.editor = journalEdtitor({ journal, accounts })
    }
  }

  async function saveJournal() {
    errors.clearErrors()
    try {
      const journal = state.journal!
      if (journal.id) {
        return await journalsService.updateJournal(journal)
      } else {
        return await journalsService.createJournal(journal)
      }
    } catch (e: unknown) {
      if (e instanceof ApiValidationError) {
        errors.setErrors(e.errors)
      } else {
        throw e
      }
    }
  }

  return {
    state,
    errors,
    options: {
      get debitAccounts() {
        const original = state.original
        const journal = state.journal
        const accounts = state.accounts
        if (original && journal && accounts) {
          return getDebitAccounts({ original, journal, accounts })
        } else {
          return []
        }
      },
      get feeAccounts() {
        const original = state.original
        const accounts = state.accounts
        if (original && accounts) {
          return getFeeAccounts({ original, accounts })
        } else {
          return []
        }
      },
      get creditAccounts() {
        const original = state.original
        const journal = state.journal
        const accounts = state.accounts
        if (original && journal && accounts) {
          return getCreditAccounts({ original, journal, accounts })
        } else {
          return []
        }
      },
    },
    readJournal,
    saveJournal,
  }
}
