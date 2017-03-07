var app        = require('../../').app,
    assert     = require('chai').assert,
    request    = require('supertest'),
    models     = require('../../models/'),
    populateDb = require('../utils/dbUtils');
    generate = require('../utils/generateSeeds');
    var moment = require('moment');


describe('Reservations', function() {

  before(function() {
    generate('test.csv');
  });

  beforeEach(function() {
    return populateDb(models);
  });

  describe('GET /api/v1/users/:{staff_id}/reservations/', function() {
    it('Should be able to get reservations by specific staff with staff_id', function(done) {
      const { Resource, Desk, Location, ResourceType, Reservation } = models;

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
        var location_id = location.location_id;
        console.log(location);
        var resource = {
          location_id: location.location_id,
          resource_type: 'Desk',
          created_at: null,
          updated_at: null
        };
        return Resource.create(resource);
      }).then(function(resource) {
        var reservations = {
          resouce_id: resource.resource_id  ,
          staff_id:"1234567890",
          staff_name:"Bob",
          staff_department:"dept1",
          staff_email:"abc@hsbc.ca",
          start_date: moment().toDate(),
          end_date: moment().toDate()
        };
        return Reservation.create(reservations);
      }).then(function(reservations) {
        return request(app)
          .get('/api/v1/users/1234567890/reservations/')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(function(res) {

            // Uncomment to see result of request
            // console.log("Reservation result is: " + JSON.stringify(res.body, null, 2));

            assert.equal(res.body.length, 1);
            assert.equal(res.body.staff_id, resource.staff_id);
            assert.equal(res.body.resouce_id, resource.resouce_id);
            assert.equal(res.body.staff_name, resource.staff_name);
            assert.equal(res.body.staff_department, resource.staff_department);
            assert.equal(res.body.staff_email, resource.staff_email);
          })
          .expect(200)
      })
      .then(function() {
        done();
      });
    });
  });
});
