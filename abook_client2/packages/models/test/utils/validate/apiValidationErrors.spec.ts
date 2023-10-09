import { describe, expect, it } from 'vitest'
import { ApiValidationErrors, ValidateUtils } from '../../../src'

const { validateErrors } = ValidateUtils

describe('ValidateUtils.', () => {
  describe('validateErrors', () => {
    type Errors = ApiValidationErrors | undefined
    type Obj = { f1?: string; f2?: string }

    it.each<{
      expected: boolean
      key?: keyof Obj
      errors?: Errors
    }>([
      { expected: false },
      { expected: false, errors: {} },
      { expected: false, key: 'f1' },
      { expected: false, key: 'f1', errors: {} },
      {
        expected: true,
        errors: { 'obj.f1': [{ error: 'error' }] },
      },
      {
        expected: true,
        key: 'f1',
        errors: { 'obj.f1': [{ error: 'error' }] },
      },
      {
        expected: false,
        key: 'f2',
        errors: { 'obj.f1': [{ error: 'error' }] },
      },
      {
        expected: false,
        key: 'f1',
        errors: { 'obj.f2': [{ error: 'error' }] },
      },
      {
        expected: true,
        key: 'f2',
        errors: { 'obj.f2': [{ error: 'error' }] },
      },
    ])('hasErrors(string) %o', ({ errors, key, expected }) => {
      expect(
        validateErrors<Obj>({
          state: {
            errors,
          },
          obj: 'obj',
        }).hasErrors(key),
      ).toEqual(expected)
    })

    it.each<{
      expected: boolean
      key: RegExp
      errors?: Errors
    }>([
      { expected: false, key: /./, errors: {} },
      {
        expected: true,
        key: /./,
        errors: { 'obj.f2': [{ error: 'error' }] },
      },
    ])('hasErrors(regexp) %o', ({ errors, key, expected }) => {
      expect(
        validateErrors<Obj>({
          state: {
            errors,
          },
          obj: 'obj',
        }).hasErrors(key),
      ).toEqual(expected)
    })

    it.each<{
      expected: boolean
      errors?: Errors
    }>([
      { expected: false },
      { expected: false, errors: {} },
      {
        expected: false,
        errors: { 'obj.f1': [{ error: 'error' }] },
      },
      {
        expected: true,
        errors: { 'obj.*': [{ error: 'error' }] },
      },
    ])('hasErrors(*) %o', ({ errors, expected }) => {
      expect(
        validateErrors<Obj>({
          state: {
            errors,
          },
          obj: 'obj',
        }).hasErrors('*'),
      ).toEqual(expected)
    })

    it.each<{
      expected: string[]
      key: keyof Obj
      errors?: Errors
    }>([
      { expected: [], key: 'f1' },
      { expected: [], key: 'f1', errors: {} },
      {
        expected: ['error1'],
        key: 'f1',
        errors: {
          'obj.f1': [{ error: 'error1' }],
          'obj.f2': [{ error: 'error2' }],
        },
      },
      {
        expected: [],
        key: 'f1',
        errors: { 'obj.f2': [{ error: 'error' }] },
      },
      {
        expected: [],
        key: 'f2',
        errors: { 'obj.f1': [{ error: 'error' }] },
      },
      {
        expected: ['error2-1', 'error2-2'],
        key: 'f2',
        errors: {
          'obj.f1': [{ error: 'error1' }],
          'obj.f2': [{ error: 'error2-1' }, { error: 'error2-2' }],
        },
      },
    ])('getErrors(string) %o', ({ errors, key, expected }) => {
      expect(
        validateErrors<Obj>({
          state: {
            errors,
          },
          obj: 'obj',
        }).getErrors(key),
      ).toEqual(expected)
    })

    it.each<{
      expected: string[]
      key: RegExp
      errors?: Errors
    }>([
      { expected: [], key: /./, errors: {} },
      {
        expected: ['error', 'error1', 'error2'],
        key: /./,
        errors: {
          'obj.*': [{ error: 'error' }],
          'obj.f1': [{ error: 'error1' }],
          'obj.f2': [{ error: 'error2' }],
        },
      },
    ])('getErrors(regexp) %o', ({ errors, key, expected }) => {
      expect(
        validateErrors<Obj>({
          state: {
            errors,
          },
          obj: 'obj',
        }).getErrors(key),
      ).toEqual(expected)
    })

    it.each<{
      expected: string[]
      errors?: Errors
    }>([
      { expected: [] },
      { expected: [], errors: {} },
      {
        expected: [],
        errors: { 'obj.f1': [{ error: 'error' }] },
      },
      {
        expected: ['error1', 'error2'],
        errors: {
          'obj.*': [{ error: 'error1' }, { error: 'error2' }],
        },
      },
    ])('getErrors(*) %o', ({ errors, expected }) => {
      expect(
        validateErrors<Obj>({
          state: {
            errors,
          },
          obj: 'obj',
        }).getErrors('*'),
      ).toEqual(expected)
    })

    it('clearErrors', () => {
      const validate = validateErrors<Obj>({
        state: {
          errors: { 'obj.*': [{ error: 'error' }] },
        },
        obj: 'obj',
      })

      expect(validate.hasErrors()).toEqual(true)

      validate.clearErrors()

      expect(validate.hasErrors()).toEqual(false)
    })

    it('setErrors', () => {
      const validate = validateErrors<Obj>({
        state: {
          errors: undefined,
        },
        obj: 'obj',
      })

      expect(validate.hasErrors()).toEqual(false)

      validate.setErrors({
        'obj.*': [{ error: 'error' }],
      })

      expect(validate.hasErrors()).toEqual(true)
    })
  })
})
