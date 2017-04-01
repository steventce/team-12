var app        = require('../../').app,
    assert     = require('chai').assert,
    request    = require('supertest'),
    models     = require('../../models/'),
    populateDb = require('../utils/dbUtils');

describe('Locations', function() {
  beforeEach(function() {
    return populateDb(models);
  });

  describe('POST /api/v1/locations', function () {
    it('should be able to add a new location', function(done) {
      var Location = models.Location;
      var location = {
        building_name: "Wayne Manor",
        street_name: "1007 Mountain Drive",
        city: "Gotham City",
        province_state: "New York",
        postal_code: "60035"
      };

      request(app)
        .post(`/api/v1/locations`)
        .set('Accept', 'application/json')
        .send({ location })
        .expect(201)
        .then(function() {
          Location.count({
            where: {
              building_name: location.building_name,
              street_name: location.street_name,
              city: location.city,
              province_state: location.province_state,
              postal_code: location.postal_code
            }
          }).then((function(count) {
            assert.strictEqual(count, 1, 'Location was not added');
            done();
          }));
        });
      });
    });

  describe('DELETE /api/v1/locations/:location_id', function() {
    it('should delete a location', function(done) {
      var Location = models.Location;
      var locationId = null;

        Location.create({
          building_name: 'Seattle Garden',
        }).then(function(location) {
          locationId = location.location_id;
          request(app)
          .delete(`/api/v1/locations/${locationId}`)
          .set('Accept', 'application/json')
          .expect(200)
          .then(function(response) {
            Location.count({ where: { location_id: locationId } }).then(function(count) {
              assert.strictEqual(count, 0, 'Location was not deleted');
              done();
            });
          });
        });

    });
  });

  describe('DELETE /api/v1/locations/:location_id', function() {
    it('should not delete location with resources in it', function(done) {
      const { Resource, Desk, Location, ResourceType, Reservation } = models;
      var locationId = null;
      const numData = 5;
      let newResources = [];
      var resource = [];

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
      }).then(function(location) {
        locationId = location.location_id;
        request(app)
        .delete(`/api/v1/locations/${locationId}`)
        .set('Accept', 'application/json')
        .expect(403)
        .then(function(response) {
          Location.count({ where: { location_id: locationId } }).then(function(count) {
            assert.strictEqual(count, 1, 'Location with resources in it should not be deleted');
            done();
          });
        });
      });

    });
  });

    describe('PUT /api/v1/locations/:location_id', function() {
      it('should be able to edit a resource', function(done) {
        var Location = models.Location;
        var locationId = null;

        Location.create({
          building_name: 'Seattle Garden',
        }).then(function(location) {
          locationId = location.location_id;
          var newLocation = {
            location_id: locationId,
            building_name: "Wayne Manor",
            street_name: "1007 Mountain Drive",
            city: "Gotham City",
            province_state: "New York",
            postal_code: "60035"
           };
          request(app)
          .put(`/api/v1/locations/${locationId}`)
          .set('Accept', 'application/json')
          .send({ location })
          .expect(200, done);
        });
      });
    });

});
