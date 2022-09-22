import { days } from '../constants'

export function getDayFromDate(date: Date) {
    return days[date.getDay() - 1]
}
