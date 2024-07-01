import { differenceInYears, parse } from 'date-fns';

export function age(birthdate: string, now: Date) {
  return differenceInYears(now, parse(birthdate, 'dd/MM/yyyy', now));
}
