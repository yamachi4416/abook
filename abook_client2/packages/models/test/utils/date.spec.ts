import { describe, expect, it } from 'vitest'
import { DateUtils } from '../../src'

const {
  formatDate,
  parseDate,
  plusDate,
  plusFormatedDate,
  toCalendarWeeks,
  toDatePart,
  toWeekEndDate,
  toWeekStartDate,
} = DateUtils

type WeekDay = Parameters<typeof toWeekEndDate>[0]['weekStartDay']

describe('DateUtils', () => {
  it('toDatePart', () => {
    expect(toDatePart(new Date(2006, 0, 2))).toEqual({
      year: 2006,
      month: 0,
      date: 2,
    })
  })

  it('parseDate', () => {
    expect(parseDate('2006-01-02', 'YYYY-MM-DD')).toEqual(new Date(2006, 0, 2))
    expect(parseDate('20060102', 'YYYYMMDD')).toEqual(new Date(2006, 0, 2))
    expect(parseDate('200601', 'YYYYMM')).toEqual(new Date(2006, 0, 1))
  })

  it('formatDate', () => {
    expect(formatDate(new Date(2009, 0, 2), 'YYYY-MM-DD')).toEqual('2009-01-02')
    expect(formatDate(new Date(2009, 0, 2), 'YYYYMMDD')).toEqual('20090102')
    expect(formatDate(new Date(2009, 0, 2), 'YYYYMM')).toEqual('200901')
  })

  it('plusDate', () => {
    expect(plusDate(new Date(2009, 0, 1), {})).toEqual(new Date(2009, 0, 1))

    expect(
      plusDate(new Date(2009, 0, 1), { year: 1, month: 2, days: 3 }),
    ).toEqual(new Date(2010, 2, 4))

    expect(
      plusDate(new Date(2009, 0, 1), { year: -1, month: -2, days: -3 }),
    ).toEqual(new Date(2007, 9, 29))
  })

  it('plusFormatedDate', () => {
    expect(
      plusFormatedDate(
        '2009-01-01',
        { year: 1, month: 2, days: 3 },
        'YYYY-MM-DD',
      ),
    ).toEqual('2010-03-04')

    expect(
      plusFormatedDate(
        '2009-01-01',
        { year: -1, month: -2, days: -3 },
        'YYYY-MM-DD',
      ),
    ).toEqual('2007-10-29')
  })

  it.each<{ date: string; expected: string; weekStartDay?: WeekDay }>([
    { date: '2006-01-01', expected: '2006-01-01' },
    { date: '2006-01-01', expected: '2005-12-26', weekStartDay: 'Mon' },
    { date: '2006-01-01', expected: '2005-12-27', weekStartDay: 'Tue' },
    { date: '2006-01-01', expected: '2005-12-31', weekStartDay: 'Sat' },
    { date: '2006-01-07', expected: '2006-01-01' },
    { date: '2006-01-07', expected: '2006-01-02', weekStartDay: 'Mon' },
    { date: '2006-01-07', expected: '2006-01-03', weekStartDay: 'Tue' },
    { date: '2006-01-07', expected: '2006-01-07', weekStartDay: 'Sat' },
  ])(
    'toWeekStartDate({ date: $date, weekStartDay: $weekStartDay })',
    ({ date, expected, weekStartDay }) => {
      const startDate = toWeekStartDate({
        date: parseDate(date, 'YYYY-MM-DD'),
        weekStartDay,
      })
      expect(formatDate(startDate, 'YYYY-MM-DD')).toEqual(expected)
    },
  )

  it.each<{ date: string; expected: string; weekStartDay?: WeekDay }>([
    { date: '2005-12-25', expected: '2005-12-31' },
    { date: '2005-12-25', expected: '2005-12-25', weekStartDay: 'Mon' },
    { date: '2005-12-25', expected: '2005-12-26', weekStartDay: 'Tue' },
    { date: '2005-12-25', expected: '2005-12-30', weekStartDay: 'Sat' },
    { date: '2006-01-01', expected: '2006-01-07' },
    { date: '2006-01-01', expected: '2006-01-01', weekStartDay: 'Mon' },
    { date: '2006-01-01', expected: '2006-01-02', weekStartDay: 'Tue' },
    { date: '2006-01-01', expected: '2006-01-06', weekStartDay: 'Sat' },
  ])(
    'toWeekEndDate({ date: $date, weekStartDay: $weekStartDay })',
    ({ date, expected, weekStartDay }) => {
      const startDate = toWeekEndDate({
        date: parseDate(date, 'YYYY-MM-DD'),
        weekStartDay,
      })
      expect(formatDate(startDate, 'YYYY-MM-DD')).toEqual(expected)
    },
  )

  it.each<{
    start: string
    end: string
    weekStartDay?: WeekDay
    expected: string[][]
  }>([
    {
      start: '2006-01-01',
      end: '2006-01-31',
      expected: [
        ['0101+', '0102+', '0103+', '0104+', '0105+', '0106+', '0107+'],
        ['0108+', '0109+', '0110+', '0111+', '0112+', '0113+', '0114+'],
        ['0115+', '0116+', '0117+', '0118+', '0119+', '0120+', '0121+'],
        ['0122+', '0123+', '0124+', '0125+', '0126+', '0127+', '0128+'],
        ['0129+', '0130+', '0131+', '0201-', '0202-', '0203-', '0204-'],
      ],
    },
    {
      start: '2006-01-01',
      end: '2006-01-31',
      weekStartDay: 'Mon',
      expected: [
        ['1226-', '1227-', '1228-', '1229-', '1230-', '1231-', '0101+'],
        ['0102+', '0103+', '0104+', '0105+', '0106+', '0107+', '0108+'],
        ['0109+', '0110+', '0111+', '0112+', '0113+', '0114+', '0115+'],
        ['0116+', '0117+', '0118+', '0119+', '0120+', '0121+', '0122+'],
        ['0123+', '0124+', '0125+', '0126+', '0127+', '0128+', '0129+'],
        ['0130+', '0131+', '0201-', '0202-', '0203-', '0204-', '0205-'],
      ],
    },
  ])(
    'toCalendarWeeks({ beginDate: $start, endDate: $end, weekStartDay: $weekStartDay})',
    ({ start, end, weekStartDay, expected }) => {
      const actual = toCalendarWeeks({
        beginDate: parseDate(start, 'YYYY-MM-DD'),
        endDate: parseDate(end, 'YYYY-MM-DD'),
        weekStartDay,
      })

      expect(
        actual.map((week) =>
          week.map(({ date, between }) =>
            [
              String(date.getMonth() + 1).padStart(2, '0'),
              String(date.getDate()).padStart(2, '0'),
              between ? '+' : '-',
            ].join(''),
          ),
        ),
      ).toEqual(expected)
    },
  )
})
