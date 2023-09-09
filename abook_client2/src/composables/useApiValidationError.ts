import { ApiValidationErrors } from '~~/libs/models'

export function useApiValidationError<T = {}>(obj?: string) {
  type Keys = keyof T | '*'

  const errors = shallowRef<ApiValidationErrors>()

  function clearErrors() {
    errors.value = undefined
  }

  function toKey(key: Keys) {
    return `${obj}.${String(key)}`
  }

  function hasErrors(key: Keys | RegExp) {
    if (!errors.value) {
      return false
    }

    if (key instanceof RegExp) {
      return Object.keys(errors.value).some((k) => key.test(k))
    }

    return !!errors.value[toKey(key)]
  }

  function getErrorEntries(key: Keys | RegExp) {
    if (!errors.value) {
      return []
    }

    if (key instanceof RegExp) {
      return Object.entries(errors.value)
        .filter(([k]) => key.test(k))
        .flatMap(([_, v]) => v)
    }

    return errors.value[toKey(key)] ?? []
  }

  function getErrors(key: Keys | RegExp) {
    return getErrorEntries(key).map(({ error }) => error)
  }

  function setErrors(err: ApiValidationErrors) {
    errors.value = err
  }

  return {
    errors,
    clearErrors,
    hasErrors,
    getErrors,
    setErrors,
  }
}
