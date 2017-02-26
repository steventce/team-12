import axios from 'axios';

//const SERVER_URL = "http://mylasagna.ca/";
const SERVER_URL = "http://localhost";

const API = {
  LOCATIONS: '/api/v1/locations',
  RESERVATIONS: '/api/v1/reservations'
};


/* Reservations Service */

export const makeReservation = async (reservation, staffId) => {
  console.log(reservation)
  const {
    resourceId,
    staffName,
    staffDepartment,
    staffEmail,
    startDate,
    endDate
  } = reservation;

  const response = await axios({
    method: 'post',
    url: API.RESERVATIONS,
    baseURL: '',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      resource_id: resourceId, // TODO: Populate from database
      staff_name: staffName,
      staff_department: staffDepartment,
      staff_email: staffEmail,
      start_date: startDate,
      end_date: endDate,
      staff_id: staffId
    }
  });

  return response.data;
}

/* Locations Service */

export const getLocations = async () => {
  console.log("Making service call at api " + API.LOCATIONS);
  const response = await axios({
    method: 'get',
      url: API.LOCATIONS,
      baseURL: SERVER_URL,
  });

  console.log('Received response ' + JSON.stringify(response));

  return response.data;
}

export const addLocation = async (location, staffId) => {
    const {
        resource_id,
        building_name,
        street_name,
        city,
        province_state,
        postal_code
    } = location;

    const response = await axios({
        method: 'post',
        url: API.LOCATIONS,
        baseURL: '',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
        // TODO: Fill in
        }
    });

// TODO: Update to DB

    return response.data;
}