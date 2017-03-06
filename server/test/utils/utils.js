var fs = require('fs');
var csv = require('csvtojson');
var csvFileDir = './data/';
var jsonFileDir = './data/';

var converter = csv({ headers: ['floor', 'section', 'desk_number'] });
var numDesks = 0;

// Generate desks.json + resources.json
converter
  .fromFile(csvFileDir + 'desks.csv')
  .transf(function(jsonObj, csvRow, rowIndex) {
    jsonObj.desk_number = jsonObj.desk_number.substring(0, 10);
    jsonObj.resource_id = rowIndex + 1;
  })
  .on('end_parsed', function(jsonObj) {
    resources = [];
    for (var i = 0; i < jsonObj.length; i++) {
      resources.push({
        location_id: 1,
        resource_type: 'Desk'
      });
    }
    fs.writeFile(jsonFileDir + 'resources.seed.json', JSON.stringify(resources), 'utf8');
    fs.writeFile(jsonFileDir + 'desks.seed.json', JSON.stringify(jsonObj), 'utf8');
  });

// Generate locations.json
fs.writeFile(jsonFileDir + 'locations.seed.json', JSON.stringify([{
  building_name: 'Broadway Green Building',
  street_name: '2910 Virtual Way',
  city: 'Vancouver',
  province_state: 'BC',
  postal_code: 'V5M 0B2'
}]), 'utf8');

// Generate resourceTypes.json
fs.writeFile(jsonFileDir + 'resourceTypes.seed.json', JSON.stringify([{
  resource_type: 'Desk'
}]), 'utf8');
