import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import 'dayjs/locale/en'
import 'dayjs/locale/zh'
import weekday from 'dayjs/plugin/weekday'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(weekday)
dayjs.extend(isBetween)

export default function datetime(...args) {
  return dayjs.apply(dayjs, args)
}

Object.assign(datetime, dayjs)
