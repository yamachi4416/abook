import { JournalEditModel } from '~~/libs/models'
import { journalEdtitor } from '~~/libs/models/editors/journal'
import {
  getCreditAccounts,
  getDebitAccounts,
  getFeeAccounts,
} from '~~/libs/models/utils/journal'

export async function useJournalEdit({ id }: { id: string }) {
  const { getAllAccounts } = useAccountsStore()

  const { getJournal, newJournal, createJournal, updateJournal } =
    useJournalsStore()

  const [accounts, original] = await Promise.all([
    getAllAccounts(),
    id === 'new' ? newJournal() : await getJournal(id),
  ])

  const { hasErrors, getErrors, clearErrors, setErrors } =
    useApiValidationError<JournalEditModel>('journal')

  const { cloned: journal } = useCloned<JournalEditModel>(original)

  const debitAccounts = computed(() =>
    getDebitAccounts({
      original,
      journal: journal.value,
      accounts,
    }),
  )

  const creditAccounts = computed(() =>
    getCreditAccounts({
      original,
      journal: journal.value,
      accounts,
    }),
  )

  const feeAccounts = computed(() => getFeeAccounts({ original, accounts }))

  const editor = journalEdtitor({
    journal,
    accounts,
  })

  async function saveJournal() {
    clearErrors()
    try {
      if (journal.value.id) {
        return await updateJournal(journal.value)
      } else {
        return await createJournal(journal.value)
      }
    } catch (e: unknown) {
      if (e instanceof ApiValidationError) {
        setErrors(e.errors)
      } else {
        throw e
      }
    }
  }

  return {
    journal: reactive(editor),
    debitAccounts,
    creditAccounts,
    feeAccounts,
    errors: {
      hasErrors,
      getErrors,
    },
    saveJournal,
  }
}
