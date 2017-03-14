import axios from 'axios';

//const SERVER_URL = "http://mylasagna.ca/";
const SERVER_URL = "http://localhost:3000";

const API = {
  LOCATIONS: '/api/v1/locations',
  LOCATION_DELETE: (location_id) => `/api/v1/locations/${location_id}`,
  RESERVATIONS: '/api/v1/reservations',
  RESERVATIONS_GET: (staff_id) => `/api/v1/users/${staff_id}/reservations`,
  RESERVATIONS_DELETE: (reservation_id) => `/api/v1/reservations/${reservation_id}`,
  RESOURCES: (location_id) => `/api/v1/locations/${location_id}/resources`
};


/* Reservations Service */

export const getReservations = async (staffId) => {
  console.log("Making service call at api " + API.RESERVATIONS_GET);

  const response = await axios({
    method: 'get',
    url: API.RESERVATIONS_GET(staffId),
    params: {
      staff_id: staffId
    }
  });

  console.log(API.RESERVATIONS_GET(staffId));

  return response.data;
}


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

/* Resources Service */

export const getResources = async (locationId, filters) => {
  const {
    resourceType,
    startDate,
    endDate,
    floor,
    section
  } = filters;

  const response = await axios({
    method: 'get',
    url: API.RESOURCES(locationId),
    params: {
      resource_type: resourceType,
      start_date: startDate,
      end_date: endDate,
      floor,
      section
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
//  console.log('Received response ' + JSON.stringify(response));
  return response.data;
}

export const deleteLocation = async (locationId) => {
  const response = await axios({
    method: 'delete',
      url: API.LOCATION_DELETE(locationId),
      baseURL: SERVER_URL,
      params: {
        location_id: locationId
      }
  });
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
