import {
  AbookEditComponent,
  AbookEditModel,
  AbookEditState,
  AbooksService,
  ApiValidationError,
  ValidateUtils,
} from './deps'

export function abookEditComponent<State extends AbookEditState>({
  abookService,
  state,
}: {
  abookService: AbooksService
  state: State
}): AbookEditComponent<State> {
  const errors = ValidateUtils.validateErrors<AbookEditModel>({
    state,
    obj: 'abook',
  })

  return {
    state,
    errors,
    async readAbook() {
      const abook = await abookService.fetchCurrent()
      if (abook) {
        state.abook = abook
      } else {
        state.abook = abookService.newAbook()
      }
    },
    async saveAbook() {
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
    },
  }
}
