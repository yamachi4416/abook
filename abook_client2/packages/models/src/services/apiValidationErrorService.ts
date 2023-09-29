import { ApiValidationErrors } from '../share'
import { ApiValidationErrorService } from './interfaces'

export function apiValidationErrorService<T = {}>({
  state,
  obj,
}: {
  state: {
    errors: ApiValidationErrors | undefined
  }
  obj?: string
}): ApiValidationErrorService<T> {
  type Keys = keyof T | '*'

  function clearErrors() {
    state.errors = undefined
  }

  function toKey(key: Keys) {
    return `${obj}.${String(key)}`
  }

  function hasErrors(key?: Keys | RegExp) {
    if (!state.errors) {
      return false
    }

    if (key === undefined) {
      return !!state.errors
    }

    if (key instanceof RegExp) {
      return Object.keys(state.errors).some((k) => key.test(k))
    }

    return !!state.errors[toKey(key)]
  }

  function getErrorEntries(key: Keys | RegExp) {
    if (!state.errors) {
      return []
    }

    if (key instanceof RegExp) {
      return Object.entries(state.errors)
        .filter(([k]) => key.test(k))
        .flatMap(([_, v]) => v)
    }

    return state.errors[toKey(key)] ?? []
  }

  function getErrors(key: Keys | RegExp) {
    return getErrorEntries(key).map(({ error }) => error)
  }

  function setErrors(err: ApiValidationErrors) {
    state.errors = err
  }

  return {
    clearErrors,
    hasErrors,
    getErrors,
    setErrors,
  }
}
