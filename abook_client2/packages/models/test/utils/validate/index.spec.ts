import { describe, expect, it } from 'vitest'
import { ValidateUtils } from '../../../src'

const { validateId, validateMonth } = ValidateUtils

describe('ValidateUtils', () => {
  describe('validateId', () => {
    it.each([
      { input: '00000000-0000-4000-0000-000000000000', expected: true },
      { input: '01234567-0124-4012-0123-012345678901', expected: true },
      { input: '89abcdef-89ab-489a-89ab-89abcdef0123', expected: true },
      { input: '00000000-0000-4000-0000-000000000000', expected: true },
      { input: '00000000-0000-0000-0000-000000000000', expected: false },
      { input: 'A0000000-0000-4000-0000-000000000000', expected: false },
      { input: 'G0000000-0000-4000-0000-000000000000', expected: false },
      { input: '00000000-0000-4000-0000-0000000000000', expected: false },
      { input: '00000000-0000-4000-0000-00000000000', expected: false },
      { input: '', expected: false },
    ])('$input => $expected', ({ input, expected }) => {
      expect(validateId(input)).toEqual(expected)
    })
  })

  describe('validateMonth', () => {
    it.each([
      { input: '200001', expected: true },
      { input: '200002', expected: true },
      { input: '200009', expected: true },
      { input: '200010', expected: true },
      { input: '200011', expected: true },
      { input: '200012', expected: true },
      { input: '234501', expected: true },
      { input: '2000001', expected: false },
      { input: '20000', expected: false },
      { input: '190001', expected: false },
      { input: '200000', expected: false },
      { input: '200013', expected: false },
      { input: '', expected: false },
    ])('$input => $expected', ({ input, expected }) => {
      expect(validateMonth(input)).toEqual(expected)
    })
  })
})
