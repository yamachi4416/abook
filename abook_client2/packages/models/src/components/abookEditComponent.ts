import { AbooksService, apiValidationErrorService } from '../services'
import { AbookEditModel, ApiValidationError } from '../share'
import { AbookEditState } from './interfaces'

export function abookEditComponent<State extends AbookEditState>({
  abookService,
  state,
}: {
  abookService: AbooksService
  state: State
}) {
  const errors = apiValidationErrorService<AbookEditModel>({
    state,
    obj: 'abook',
  })

  async function readAbook() {
    const abook = await abookService.fetchCurrent()
    if (abook) {
      state.abook = abook
    } else {
      state.abook = abookService.newAbook()
    }
  }

  async function saveAbook() {
    errors.clearErrors()
    try {
      const abook = state.abook!
      await abookService.saveAbook({ abook })
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
    readAbook,
    saveAbook,
  }
}
