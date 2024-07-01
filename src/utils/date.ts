import {parse as parseDate} from 'date-fns'

export function parse(date?: string, defaultValue?: Date, format: string = 'dd-MM-yyyy'): Date {
  let result: Date | undefined;
  let error: Error | undefined;

  if (date) {
    result = parseDate(date, format, new Date());
    if (result.toString() === 'Invalid Date') {
      error = new Error(result.toString());
      result = undefined;
    }
  } else {
    error = new Error('Date is not provided');
  }

  if (!result && defaultValue) {
    result = defaultValue;
  }

  if (!result) {
    throw error;
  }

  return result;
}
