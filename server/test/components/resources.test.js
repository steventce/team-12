var app           = require('../../').app,
    moment        = require('moment'),
    assert        = require('chai').assert,
    request       = require('supertest'),
    models        = require('../../models/'),
    desks         = require('../../data/desks.seed.json'),
    resources     = require('../../data/resources.seed.json'),
    locations     = require('../../data/locations.seed.json'),
    resourceTypes = require('../../data/resourceTypes.seed.json');

describe('Resources', function() {
  beforeEach(function() {
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
  });

  describe('GET /api/v1/locations/:location_id/resources', function() {
    it('should only get resources from the specified location', function(done) {
      const { Resource, Desk, Location, ResourceType } = models;
      const numData = 5;
      let newResources = [];

      for (var i = 0; i < numData; i++) {
        newResources.push({
          resource_type: 'Desk'
        });
      }

      Location.create({
        building_name: 'Seattle Garden',
        Resources: newResources
      }, {
        include: [ Resource ]
      })
      .then(function() {
        return request(app)
          .get('/api/v1/locations/1/resources')
          .query({
            resource_type: 'Desk'
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(function(res) {
            assert.equal(res.body.length, resources.length);
          })
          .expect(200)
      })
      .then(function() {
        done();
      });
    });
  });
});
