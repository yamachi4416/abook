import {
  AccountsService,
  ApiValidationError,
  EditorUtils,
  JournalEditComponent,
  JournalEditModel,
  JournalEditState,
  JournalUtils,
  JournalsService,
  ValidateUtils,
} from './deps'

export function journalEditComponent<State extends JournalEditState>({
  journalsService,
  accountsService,
  state,
}: {
  journalsService: JournalsService
  accountsService: AccountsService
  state: State
}): JournalEditComponent<State> {
  const errors = ValidateUtils.validateErrors<JournalEditModel>({
    state,
    obj: 'journal',
  })

  return {
    state,
    errors,
    options: {
      get debitAccounts() {
        const original = state.original
        const journal = state.journal
        const accounts = state.accounts
        if (original && journal && accounts) {
          return JournalUtils.getDebitAccounts({ original, journal, accounts })
        } else {
          return []
        }
      },
      get feeAccounts() {
        const original = state.original
        const accounts = state.accounts
        if (original && accounts) {
          return JournalUtils.getFeeAccounts({ original, accounts })
        } else {
          return []
        }
      },
      get creditAccounts() {
        const original = state.original
        const journal = state.journal
        const accounts = state.accounts
        if (original && journal && accounts) {
          return JournalUtils.getCreditAccounts({ original, journal, accounts })
        } else {
          return []
        }
      },
    },
    async readJournal({ id, signal }) {
      const [accounts, original] = await Promise.all([
        accountsService.getAllAccounts({ signal }),
        id
          ? await journalsService.getJournal({ id, signal })
          : journalsService.newJournal(),
      ])

      state.accounts = accounts
      state.original = original

      const journal = JSON.parse(JSON.stringify(original))
      state.journal = journal
      if (state.journal) {
        state.editor = EditorUtils.journalEdtitor({ journal, accounts })
      }
    },

    async saveJournal() {
      errors.clearErrors()
      try {
        const journal = state.journal!
        if (journal.id) {
          return await journalsService.updateJournal({ journal })
        } else {
          return await journalsService.createJournal({ journal })
        }
      } catch (e: unknown) {
        if (e instanceof ApiValidationError) {
          errors.setErrors(e.errors)
        } else {
          throw e
        }
      }
    },
  }
}
