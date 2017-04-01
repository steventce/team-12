import moment from 'moment';

const baseStartDateTime = moment('2017-01-12 14:00');
const baseEndDateTime = moment('2017-01-12 17:00');

export let reservations =
    {"0" : {
      reservationId: '0',
      employeeId: '00000',
      resourceId: '1A101',
      resourceType: 'Desk',
      startDateTime: baseStartDateTime.toDate(),
      endDateTime: baseEndDateTime.toDate()
    },
    "1" : {
      reservationId: '1',
      employeeId: '00000',
      resourceId: '1B102',
      resourceType: 'Desk',
      startDateTime: baseStartDateTime.add(1, 'd').toDate(),
      endDateTime: baseEndDateTime.add(1, 'd').toDate()
    },
    "2" : {
      reservationId: '2',
      employeeId: '00000',
      resourceId: '1C104',
      resourceType: 'Desk',
      startDateTime: baseStartDateTime.add(2, 'd').toDate(),
      endDateTime: baseEndDateTime.add(2, 'd').toDate()
    },
    "3" : {
      reservationId: '3',
      employeeId: '00001',
      resourceId: '1D105',
      resourceType: 'Desk',
      startDateTime: baseStartDateTime.add(3, 'd').toDate(),
      endDateTime: baseEndDateTime.add(3, 'd').toDate()
    },
    "4" : {
      reservationId: '4',
      employeeId: '00001',
      resourceId: '2B111',
      resourceType: 'Desk',
      startDateTime: baseStartDateTime.add(4, 'd').toDate(),
      endDateTime: baseEndDateTime.add(4, 'd').toDate()
    },
    "5" : {
      reservationId: '5',
      employeeId: '00002',
      resourceId: '2C106',
      resourceType: 'Desk',
      startDateTime: baseStartDateTime.add(5, 'd').toDate(),
      endDateTime: baseEndDateTime.add(5, 'd').toDate()
    }};
