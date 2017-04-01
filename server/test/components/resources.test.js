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
      var { Resource, Desk, Location, ResourceType } = models;
      var numData = 5;
      var id = 1;
      var newResources = [];

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

  describe('POST /api/v1/locations/:location_id/resources', function() {
    it('should add a desk resource with a number that does not exist at that location', function(done) {
      var Resource = models.Resource;
      var Desk = models.Desk;

      var locationId = 2;
      var resource_type = 'Desk';
      var resource = {
        floor: 1,
        section: 'A',
        desk_number: 101
      };
      var deskNumber = `${resource.floor}.${resource.section}.${resource.desk_number}`;

      request(app)
        .post(`/api/v1/locations/${locationId}/resources`)
        .set('Accept', 'application/json')
        .send({ resource_type, resource })
        .expect(201)
        .then(function() {
          Resource.count({
            include: [
              {
                model: Desk,
                where: {
                  floor: resource.floor,
                  section: resource.section,
                  desk_number: deskNumber
                }
              }
            ],
            where: {
              location_id: locationId
            }
          }).then((function(count) {
            assert.strictEqual(count, 1, 'Resource was not created');
            done();
          }));
        });
    });
  });

  describe('POST /api/v1/locations/:location_id/resources', function() {
    it('should fail to add a desk with a number that already exists at that location', function(done) {
      var locationId = 1;
      request(app)
        .post(`/api/v1/locations/${locationId}/resources`)
        .set('Accept', 'application/json')
        .send({
          resource_type: 'Desk',
          resource: {
            floor: 1,
            section: 'A',
            desk_number: 101
          }
        })
        .expect(function(res) {
          assert.equal(res.body.errors.length, 1, 'Wrong number of errors');
        })
        .expect(400, done);
    });
  });

  describe('PUT /api/v1/resources/:resource_id', function() {
    var resourceId = 1;
    it('should successfully edit a desk resource', function(done) {
      request(app)
        .put(`/api/v1/resources/${resourceId}`)
        .set('Accept', 'application/json')
        .send({
          resource_type: 'Desk',
          resource: {
            floor: 1,
            section: 'Z',
            desk_number: 102
          }
        })
        .expect(200, done);
    });
  });

  describe('PUT /api/v1/resources/:resource_id', function() {
    var resourceId = 1;
    it('should not edit a desk resource if the new desk number already exists at that location', function(done) {
      request(app)
        .put(`/api/v1/resources/${resourceId}`)
        .set('Accept', 'application/json')
        .send({
          resource_type: 'Desk',
          resource: {
            floor: 1,
            section: 'A',
            desk_number: 102
          }
        })
        .expect(function(res) {
          assert.equal(res.body.errors.length, 1, 'Wrong number of errors');
        })
        .expect(400, done);
    });
  });

  describe('DELETE /api/v1/resources/:resource_id', function() {
    it('should successfully delete a resource', function(done) {
      var Resource = models.Resource;
      var resourceId = 1;
      request(app)
        .delete(`/api/v1/resources/${resourceId}`)
        .set('Accept', 'application/json')
        .expect(200)
        .then(function(response) {
          Resource.count({ where: { resource_id: resourceId } }).then(function(count) {
            assert.strictEqual(count, 0, 'Resource still exists');
            done();
          });
        });
    });
  });
});
