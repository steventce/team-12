var desks         = require('../../data/desks.seed.json'),
    resources     = require('../../data/resources.seed.json'),
    locations     = require('../../data/locations.seed.json'),
    resourceTypes = require('../../data/resourceTypes.seed.json');

// Drop, recreate all tables, and populate database
var populateDb = function(models) {
  return models.sequelize.sync({ force: true }).then(function() {
    const { Resource, Desk, Location, ResourceType } = models;
    return Location.bulkCreate(locations)
    .then(function(response) {
      return ResourceType.bulkCreate(resourceTypes);
    })
    .then(function() {
      return Resource.bulkCreate(resources);
    })
    .then(function() {
      return Desk.bulkCreate(desks);
    });
  });
}

module.exports = populateDb;
