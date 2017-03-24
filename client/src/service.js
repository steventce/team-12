import axios from 'axios';

//const SERVER_URL = "http://mylasagna.ca/";
const SERVER_URL = "http://localhost:3000";

const API = {
  LOCATIONS: '/api/v1/locations',
  LOCATION_DELETE: (location_id) => `/api/v1/locations/${location_id}`,
  LOCATION_POST: '/api/v1/locations',
  LOCATION_PUT: (location_id) => `/api/v1/locations/${location_id}`,

  RESERVATIONS: '/api/v1/reservations',
  RESERVATIONS_GET: (staff_id) => `/api/v1/users/${staff_id}/reservations`,
  RESERVATIONS_DELETE: (reservation_id) => `/api/v1/reservations/${reservation_id}`,
  RESERVATIONS_PUT: (reservation_id) => `/api/v1/reservations/${reservation_id}`,

  ADMIN_RESOURCES_POST: (location_id) => `/api/v1/locations/${location_id}/resources`,
  ADMIN_RESOURCES_PUT: (resource_id) => `/api/v1/resources/${resource_id}`,
  ADMIN_RESOURCES_DELETE: (resource_id) => `/api/v1/resources/${resource_id}`,
  ADMIN_RESOURCES_GET: (location_id) => `/api/v1/locations/${location_id}/admin/resources`,
  RESOURCES_GET: (location_id) => `/api/v1/locations/${location_id}/resources`,

  ADMIN_GET: (staff_id) => `/api/v1/admin/users/${staff_id}`
};

/* Reservations Service */

export const getAllReservations = async () => {
  console.log("Making service call at api " + API.RESERVATIONS);

  const response = await axios({
    method: 'get',
    url: API.RESERVATIONS,
    params: {
    }
  });

  return response.data;
}

export const getReservations = async (staffId) => {
  console.log("Making service call at api " + API.RESERVATIONS_GET);

  const response = await axios({
    method: 'get',
    url: API.RESERVATIONS_GET(staffId),
    params: {
      staff_id: staffId
    }
  });

  return response.data;
}

export const editReservation = async (reservation) => {
  const {
    reservationId,
    resourceId,
    staffName,
    staffDepartment,
    staffEmail,
    staffId,
    startDate,
    endDate
  } = reservation;

  console.log(reservationId);

  console.log(staffName);

  const response = await axios({
    method: 'put',
    url: API.RESERVATIONS_PUT(reservationId),
    headers: {
    'Content-Type': 'application/json'
    },
    data: {
      reservation_id: reservationId,
      resource_id: resourceId,
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

export const makeReservation = async (reservation, staffId) => {
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

export const deleteReservation = async (reservationId) => {
  const response = await axios({
    method: 'delete',
    url: API.RESERVATIONS_DELETE(reservationId),
    baseURL: SERVER_URL,
    params: {
      reservation_id: reservationId
    }
  });
}

/* Resources Service */

export const getAvailableResources = async (locationId, filters) => {
  const {
    resourceType,
    startDate,
    endDate,
    floor,
    section
  } = filters;

  const response = await axios({
    method: 'get',
    url: API.RESOURCES_GET(locationId),
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

export const getAllResources = async (locationId) => {
  const response = await axios({
    method: 'get',
    url: API.ADMIN_RESOURCES_GET(locationId)
  });

  return response.data;
}

export const addResource = async (location_id, resource) => {
  const { resourceType, floor, section, deskNumber } = resource;
  const response = await axios({
    method: 'post',
    url: API.ADMIN_RESOURCES_POST(location_id),
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      resource_type: resourceType,
      resource: {
        floor,
        section,
        desk_number: deskNumber
      }
    })
  });

  return response.data;
}

export const editResource = async (resourceId, resource) => {
  const { resourceType, floor, section, deskNumber } = resource;

  const response = await axios({
    method: 'put',
    url: API.ADMIN_RESOURCES_PUT(resourceId),
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      resource_type: resourceType,
      resource: {
        floor,
        section,
        desk_number: deskNumber
      }
    })
  });

  return response.data;
}

export const deleteResource = async (resourceId) => {
  const response = await axios({
    method: 'delete',
    url: API.ADMIN_RESOURCES_DELETE(resourceId)
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

export const addLocation = async (location) => {
  const response = await axios({
    method: 'post',
    url: API.LOCATION_POST,
    baseURL: '',
    headers: {
    'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      location: {
      building_name: location.building_name,
      street_name: location.street_name,
      city: location.city,
      province_state: location.province_state,
      postal_code: location.postal_code
      }
    })
  });
  return response.data;
}

export const editLocation = async (locationId, location) => {
  const response = await axios({
    method: 'put',
    url: API.LOCATION_PUT(locationId),
    baseURL: '',
    headers: {
    'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      location: {
      building_name: location.building_name,
      street_name: location.street_name,
      city: location.city,
      province_state: location.province_state,
      postal_code: location.postal_code
      }
    })
  });
  return response.data;
}

/* Admin */

export const getAdmin = async (staffId) => {
  console.log('Making service call at api ' + API.ADMIN_GET);

  const response = await axios({
    method: 'get',
    url: API.ADMIN_GET(staffId),
    params: {
      staff_id: staffId
    }
  });

  return response.data;
}

