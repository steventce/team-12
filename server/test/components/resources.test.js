var app        = require('../../').app,
    assert     = require('chai').assert,
    request    = require('supertest'),
    models     = require('../../models/'),
    populateDb = require('../utils/dbUtils'),
    moment     = require('moment');

describe('Resources', function() {
  beforeEach(function() {
    return populateDb(models);
  });

  describe('GET /api/v1/locations/:location_id/resources', function() {
    it('should only get available resources', function(done) {
      var { Resource, Reservation } = models;
      var id = 1;
      var numReservations = 5

      Resource.findAll({
        limit: numReservations
      })
      .then(function(resources) {
        var reservations = resources.map(function(resource) {
          return {
            resource_id: resource.resource_id,
            staff_id: '12345678',
            staff_name: 'John Smith',
            staff_department: 'Human Resources',
            staff_email: 'john_smith@hsbc.ca',
            start_date: moment().add(1, 'h').startOf('hour'),
            end_date: moment().startOf('hour').add(1, 'd')
          };
        });
        // Hook to add reservation_id
        return Reservation.bulkCreate(reservations, { individualHooks: true });
      })
      .then(function(reservations) {
        var reservedResourceIds = reservations.map(function(reservation) {
          return reservation.resource_id;
        });

        return Resource.count({
          where: { location_id: id }
        })
        .then(function(count) {
          return request(app)
            .get(`/api/v1/locations/${id}/resources`)
            .query({
              resource_type: 'Desk',
              start_date: moment().add(2, 'h').startOf('hour').toDate(),
              end_date: moment().startOf('hour').add(21, 'h').toDate()
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function(res) {
              var badResources = res.body.filter(function(resource) {
                return reservedResourceIds.includes(resource.resource_id);
              });
              assert.strictEqual(badResources.length, 0, 'Reserved resources returned as available');
              assert.strictEqual(res.body.length, count - numReservations, 'Number of resources incorrect');
            })
            .expect(200);
        })
      })
      .then(function() {
        done();
      });
    });

    it('should only get resources that match the filters', function(done) {
      var { Resource, Reservation, Desk } = models;
      var id = 1;
      var resourceType = 'Desk';
      var floor = 2;
      var section = 'B';

      Resource.count({
        include: [{
          model: Desk,
          where: {
            floor,
            section
          }
        }],
        where: {
          location_id: id
        }
      })
      .then(function(count) {
        return request(app)
          .get(`/api/v1/locations/${id}/resources`)
          .query({
            resource_type: resourceType,
            floor,
            section,
            start_date: moment().add(2, 'h').startOf('hour').toDate(),
            end_date: moment().startOf('hour').add(3, 'h').toDate()
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(function(res) {
            var badResources = res.body.filter(function(resource) {
              return id !== resource.location_id || resourceType !== resource.resource_type
                || String(floor) !== resource.Desk.floor || section !== resource.Desk.section;
            });
            assert.strictEqual(badResources.length, 0, 'Resources that do not match filters returned');
            assert.strictEqual(res.body.length, count, 'Wrong number of resources returned');
          })
          .expect(200);
      })
      .then(function() {
        done();
      });
    });
  });

  describe('GET /api/v1/locations/:location_id/admin/resources', function() {
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
          .get(`/api/v1/locations/${id}/admin/resources`)
          .query({
            resource_type: 'Desk'
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(function(res) {
            assert.strictEqual(res.body.length, count);
            var badReservations = res.body.filter(function(resource) {
              return resource.location_id !== id;
            });
            assert.strictEqual(badReservations.length, 0, 'Resources from wrong location');
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
