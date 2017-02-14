import moment from 'moment';

export const DATE_TIME_FORMAT = 'h:mm a MM/DD/YY';

export function dateFormatter(date) {
  return moment(date).format(DATE_TIME_FORMAT);
}
