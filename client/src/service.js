import axios from 'axios';

//const SERVER_URL = "http://mylasagna.ca/";
const SERVER_URL = "http://localhost";

const API = {
	LOCATIONS: '/api/v1/locations'
};

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