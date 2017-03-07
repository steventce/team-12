var app        = require('../../').app,
    assert     = require('chai').assert,
    request    = require('supertest'),
    models     = require('../../models/'),
    populateDb = require('../utils/dbUtils');

describe('Resources', function() {
  beforeEach(function() {
    return populateDb(models);
  });

  describe('GET /api/v1/locations/:location_id/resources', function() {
    it('should only get resources from the specified location', function(done) {
      const { Resource, Desk, Location, ResourceType } = models;
      const numData = 5;
      const id = 1;
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
        return Resource.findAndCountAll({
          where: { location_id: id }
        })
        .then(function(result) {
          return result.count;
        })
      })
      .then(function(count) {
        return request(app)
          .get(`/api/v1/locations/${id}/resources`)
          .query({
            resource_type: 'Desk'
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(function(res) {
            assert.equal(res.body.length, count);
          })
          .expect(200)
      })
      .then(function() {
        done();
      });
    });
  });
});
