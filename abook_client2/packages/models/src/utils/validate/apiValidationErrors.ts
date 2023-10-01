import { ApiValidationErrors, ValidationErrors } from '../deps'

export function apiValidationErrors<T = {}>({
  state,
  obj,
}: {
  state: {
    errors: ApiValidationErrors | undefined
  }
  obj?: string
}): ValidationErrors<T> {
  type Keys = keyof T | '*'

  function toKey(key: Keys) {
    return `${obj}.${String(key)}`
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

  return {
    clearErrors() {
      state.errors = undefined
    },
    hasErrors(key) {
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
    },
    getErrors(key) {
      return getErrorEntries(key).map(({ error }) => error)
    },
    setErrors(err) {
      state.errors = err
    },
  }
}
