export { apiValidationErrors as validateErrors } from './apiValidationErrors'

export function validateId(value: string) {
  return /^([0-9a-f]{8})-([0-9a-f]{4})-(4[0-9a-f]{3})-([0-9a-f]{4})-([0-9a-f]{12})$/.test(
    value,
  )
}

export function validateMonth(value: string) {
  return /^2[0-9]{3}(1[0-2]|0[1-9])$/.test(value)
}
