import { describe, expect, it } from 'vitest'
import { AbookUtils, DateUtils } from '../../src'

describe('AbookUtils', () => {
  it.each([
    { date: '2008-01-01', expected: '2008-01-01', day: 1 },
    { date: '2008-01-02', expected: '2008-01-01', day: 1 },
    { date: '2008-01-31', expected: '2008-01-01', day: 1 },
    { date: '2008-01-01', expected: '2007-12-15', day: 15 },
    { date: '2008-01-14', expected: '2007-12-15', day: 15 },
    { date: '2008-01-15', expected: '2008-01-15', day: 15 },
    { date: '2008-01-31', expected: '2008-01-15', day: 15 },
    { date: '2008-03-01', expected: '2008-02-28', day: 28 },
    { date: '2008-03-28', expected: '2008-03-28', day: 28 },
    { date: '2008-03-29', expected: '2008-03-28', day: 28 },
    { date: '2008-03-01', expected: '2008-02-29', day: 30 },
    { date: '2008-03-30', expected: '2008-02-29', day: 30 },
    { date: '2008-03-31', expected: '2008-03-31', day: 30 },
    { date: '2008-02-29', expected: '2008-02-29', day: 30 },
  ])(
    'toStartOfMonthDate({ date: $date, [$day, false] })',
    ({ date, day, expected }) => {
      const actual = AbookUtils.toStartOfMonthDate({
        date: DateUtils.parseDate(date, 'YYYY-MM-DD'),
        abook: {
          startOfMonthDate: day,
          startOfMonthIsPrev: false,
        },
      })
      expect(DateUtils.formatDate(actual, 'YYYY-MM-DD')).toEqual(expected)
    },
  )

  it.each([
    { date: '2008-01-01', expected: '2007-12-01', day: 1 },
    { date: '2008-01-02', expected: '2007-12-01', day: 1 },
    { date: '2008-01-31', expected: '2007-12-01', day: 1 },
    { date: '2008-01-01', expected: '2007-11-15', day: 15 },
    { date: '2008-01-14', expected: '2007-11-15', day: 15 },
    { date: '2008-01-15', expected: '2007-12-15', day: 15 },
    { date: '2008-01-31', expected: '2007-12-15', day: 15 },
    { date: '2008-03-01', expected: '2008-01-28', day: 28 },
    { date: '2008-03-28', expected: '2008-02-28', day: 28 },
    { date: '2008-03-29', expected: '2008-02-28', day: 28 },
    { date: '2008-03-01', expected: '2008-01-31', day: 30 },
    { date: '2008-03-30', expected: '2008-01-31', day: 30 },
    { date: '2008-03-31', expected: '2008-02-29', day: 30 },
    { date: '2008-02-29', expected: '2008-01-31', day: 30 },
  ])(
    'toStartOfMonthDate({ date: $date, [$day, true] })',
    ({ date, day, expected }) => {
      const actual = AbookUtils.toStartOfMonthDate({
        date: DateUtils.parseDate(date, 'YYYY-MM-DD'),
        abook: {
          startOfMonthDate: day,
          startOfMonthIsPrev: true,
        },
      })
      expect(DateUtils.formatDate(actual, 'YYYY-MM-DD')).toEqual(expected)
    },
  )

  it.each([
    { date: '2008-01-01', expected: '2008-01-31', day: 1 },
    { date: '2008-01-30', expected: '2008-01-31', day: 1 },
    { date: '2008-01-31', expected: '2008-01-31', day: 1 },
    { date: '2008-01-01', expected: '2008-01-14', day: 15 },
    { date: '2008-01-14', expected: '2008-01-14', day: 15 },
    { date: '2008-01-15', expected: '2008-02-14', day: 15 },
    { date: '2008-01-31', expected: '2008-02-14', day: 15 },
    { date: '2008-02-01', expected: '2008-02-27', day: 28 },
    { date: '2008-02-28', expected: '2008-03-27', day: 28 },
    { date: '2008-02-29', expected: '2008-03-27', day: 28 },
    { date: '2008-02-01', expected: '2008-02-28', day: 30 },
    { date: '2008-02-28', expected: '2008-02-28', day: 30 },
    { date: '2008-02-29', expected: '2008-03-30', day: 30 },
  ])(
    'toEndOfMonthDate({ date: $date, [$day, false] })',
    ({ date, day, expected }) => {
      const actual = AbookUtils.toEndOfMonthDate({
        date: DateUtils.parseDate(date, 'YYYY-MM-DD'),
        abook: {
          startOfMonthDate: day,
          startOfMonthIsPrev: false,
        },
      })
      expect(DateUtils.formatDate(actual, 'YYYY-MM-DD')).toEqual(expected)
    },
  )

  it.each([
    { date: '2008-01-01', expected: '2007-12-31', day: 1 },
    { date: '2008-01-30', expected: '2007-12-31', day: 1 },
    { date: '2008-01-31', expected: '2007-12-31', day: 1 },
    { date: '2008-01-01', expected: '2007-12-14', day: 15 },
    { date: '2008-01-14', expected: '2007-12-14', day: 15 },
    { date: '2008-01-15', expected: '2008-01-14', day: 15 },
    { date: '2008-01-31', expected: '2008-01-14', day: 15 },
    { date: '2008-02-01', expected: '2008-01-27', day: 28 },
    { date: '2008-02-28', expected: '2008-02-27', day: 28 },
    { date: '2008-02-29', expected: '2008-02-27', day: 28 },
    { date: '2008-02-01', expected: '2008-01-30', day: 30 },
    { date: '2008-02-28', expected: '2008-01-30', day: 30 },
    { date: '2008-02-29', expected: '2008-02-28', day: 30 },
  ])(
    'toEndOfMonthDate({ date: $date, [$day, true] })',
    ({ date, day, expected }) => {
      const actual = AbookUtils.toEndOfMonthDate({
        date: DateUtils.parseDate(date, 'YYYY-MM-DD'),
        abook: {
          startOfMonthDate: day,
          startOfMonthIsPrev: true,
        },
      })
      expect(DateUtils.formatDate(actual, 'YYYY-MM-DD')).toEqual(expected)
    },
  )

  it.each([
    {
      date: '2008-01-01',
      expected: { month: '200801', from: '2008-01-01', to: '2008-01-31' },
      day: 1,
    },
    {
      date: '2008-02-29',
      expected: { month: '200802', from: '2008-02-29', to: '2008-03-30' },
      day: 30,
    },
  ])(
    'toCurrentMonthPeriod({ date: $date, [$day, false] })',
    ({ date, day, expected }) => {
      expect(
        AbookUtils.toCurrentMonthPeriod({
          date: DateUtils.parseDate(date, 'YYYY-MM-DD'),
          abook: {
            startOfMonthDate: day,
            startOfMonthIsPrev: false,
          },
        }),
      ).toEqual({
        month: expected.month,
        fromDate: DateUtils.parseDate(expected.from, 'YYYY-MM-DD'),
        toDate: DateUtils.parseDate(expected.to, 'YYYY-MM-DD'),
      })
    },
  )

  it('toAbookMonthPeriods({ months: 3 })', () => {
    expect(
      AbookUtils.toAbookMonthPeriods({
        date: DateUtils.parseDate('2008-01-01', 'YYYY-MM-DD'),
        months: 3,
        abook: {
          startOfMonthDate: 1,
          startOfMonthIsPrev: false,
        },
      }),
    ).toEqual([
      {
        month: '200801',
        fromDate: DateUtils.parseDate('2008-01-01', 'YYYY-MM-DD'),
        toDate: DateUtils.parseDate('2008-01-31', 'YYYY-MM-DD'),
      },
      {
        month: '200802',
        fromDate: DateUtils.parseDate('2008-02-01', 'YYYY-MM-DD'),
        toDate: DateUtils.parseDate('2008-02-29', 'YYYY-MM-DD'),
      },
      {
        month: '200803',
        fromDate: DateUtils.parseDate('2008-03-01', 'YYYY-MM-DD'),
        toDate: DateUtils.parseDate('2008-03-31', 'YYYY-MM-DD'),
      },
    ])
  })

  it('toAbookMonthPeriods({ months: -3 })', () => {
    expect(
      AbookUtils.toAbookMonthPeriods({
        date: DateUtils.parseDate('2008-03-01', 'YYYY-MM-DD'),
        months: -3,
        abook: {
          startOfMonthDate: 1,
          startOfMonthIsPrev: false,
        },
      }),
    ).toEqual([
      {
        month: '200803',
        fromDate: DateUtils.parseDate('2008-03-01', 'YYYY-MM-DD'),
        toDate: DateUtils.parseDate('2008-03-31', 'YYYY-MM-DD'),
      },
      {
        month: '200802',
        fromDate: DateUtils.parseDate('2008-02-01', 'YYYY-MM-DD'),
        toDate: DateUtils.parseDate('2008-02-29', 'YYYY-MM-DD'),
      },
      {
        month: '200801',
        fromDate: DateUtils.parseDate('2008-01-01', 'YYYY-MM-DD'),
        toDate: DateUtils.parseDate('2008-01-31', 'YYYY-MM-DD'),
      },
    ])
  })

  it('toAbookMonthPeriods({ months: 0 })', () => {
    expect(
      AbookUtils.toAbookMonthPeriods({
        date: DateUtils.parseDate('2008-03-01', 'YYYY-MM-DD'),
        months: 0,
        abook: {
          startOfMonthDate: 1,
          startOfMonthIsPrev: false,
        },
      }),
    ).toEqual([])
  })
})
