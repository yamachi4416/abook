import { AbookEditModel } from '~~/libs/models'

export async function useAbookEdit() {
  const { fetchCurrent, newAbook, saveAbook } = useAbooksStore()

  const abook = ref({ ...(await fetchCurrent()) } || newAbook())

  const { hasErrors, getErrors, clearErrors, setErrors } =
    useApiValidationError<AbookEditModel>('abook')

  async function save() {
    clearErrors()
    try {
      await saveAbook(abook.value)
      useRouter().back()
    } catch (e: unknown) {
      if (e instanceof ApiValidationError) {
        setErrors(e.errors)
      } else {
        throw e
      }
    }
  }

  return {
    abook,
    save,
    errors: {
      hasErrors,
      getErrors,
    },
  }
}
