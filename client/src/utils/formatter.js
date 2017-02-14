import moment from 'moment';

export function dateFormatter(cell, row) {
  return moment(cell).format('h:mm a MM/DD/YY');
}
