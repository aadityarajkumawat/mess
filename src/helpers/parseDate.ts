import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

export function parseDate(dateString: string) {
    const parsed = dayjs(dateString, 'DD-MM-YYYY').format('YYYY-MM-DD')
    return parsed
}
