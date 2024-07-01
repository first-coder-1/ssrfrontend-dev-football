import { fromUnixTime } from 'date-fns'
import { format, utcToZonedTime } from 'date-fns-tz'

export function dateTz(date: number | Date, timeZone: string, dateFormat = 'dd/MM/yyyy', locale?: Locale) {
	if (typeof date === 'number') {
		date = fromUnixTime(date)
	}
	
	const zonedDate = utcToZonedTime(date, timeZone)
	
	return format(zonedDate, dateFormat, {timeZone, locale})
}


export { format, utcToZonedTime } from 'date-fns-tz'
