var app        = require('../../').app,
    assert     = require('chai').assert,
    request    = require('supertest'),
    models     = require('../../models/'),
    populateDb = require('../utils/dbUtils');
    generate = require('../utils/generateSeeds');
    var moment = require('moment');


describe('Reservations', function() {
  var admin_id = 9999999;

  before(function() {
    generate('test.csv');
  });

  beforeEach(function() {
    return populateDb(models).then(function() {
      var admin = {
        admin_id: admin_id,
        name: "stub",
      };
      return models.Admin.findAll({
        where: {admin_id:admin_id}
      }).then(function(admins){
        if (admins.length == 0) {
          models.Admin.create(admin).then(function(){
            // console.log("admin created");
            return;
          }).catch(function(err) {
            return;
          });
        }
      });
    });
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

            //assert.equal(res.body.length, 1);
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
  
  describe('POST /api/v1/reservations', function (){
      it('Should not be able to make reservation for date range > 120hrs', function(done) {
          const { Resource, Desk, Location, ResourceType, Reservation } = models;
          
      const numData = 5;
      const id = 2;
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
        var resource = {
          location_id: location.location_id,
          resource_type: 'Desk',
        };
        return Resource.create(resource);
      }).then(function(resource) {
        var reservations = {
          resouce_id: resource.resource_id,
          staff_id:admin_id,
          staff_name:"John",
          staff_department:"dept2",
          staff_email:"testing@hsbc.ca",
          start_date: moment().toDate(),
          end_date: moment().add(6, 'd').toDate()
        };
        request(app)
            .post(`/api/v1/reservations`)
            .set('Accept', 'application/json')
            .send(reservations)
            .end(function (err, res){
                assert.equal(res.status, 409);
                assert.equal(res.body, 'Reservation cannot be made for more than 120 hours (5 days).');
                done();
            });
        });
      });
   });
   
   describe('POST /api/v1/reservations', function (){
      it('Should not be able to make reservation 30 days in advance', function(done) {
          const { Resource, Desk, Location, ResourceType, Reservation } = models;
      const numData = 5;
      const id = 2;
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
        var resource = {
          location_id: location.location_id,
          resource_type: 'Desk',
        };
        return Resource.create(resource);
      }).then(function(resource) {
        var reservations = {
          resouce_id: resource.resource_id,
          staff_id:admin_id,
          staff_name:"Kevin",
          staff_department:"dept3",
          staff_email:"testing@hsbc.ca",
          start_date: moment().add(31, 'd').toDate(),
          end_date: moment().add(31, 'd').toDate()
        };
        request(app)
            .post(`/api/v1/reservations`)
            .set('Accept', 'application/json')
            .send(reservations)
            .end(function (err, res){
                assert.equal(res.status, 409);
                assert.equal(res.body, 'Reservation cannot be made for more than 30 days in advance.');
                done();
            });
        });
      });
   });
   
   describe('POST /api/v1/reservations', function (){
      it('Should be able to successfully create a reservation', function(done) {
          const { Resource, Desk, Location, ResourceType, Reservation } = models;
      const numData = 5;
      const id = 2;
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
        var resource = {
          location_id: location.location_id,
          resource_type: 'Desk',
        };
        return Resource.create(resource);
      }).then(function(resource) {
        var reservations = {
          resource_id: id,
          staff_id:admin_id,
          staff_name:"Sunny",
          staff_department:"dept4",
          staff_email:"testing@hsbc.ca",
          start_date: moment().toDate(),
          end_date: moment().toDate()
        };
        request(app)
            .post(`/api/v1/reservations`)
            .set('Accept', 'application/json')
            .send(reservations)
            .end(function (err, res){
                assert.equal(res.status, 200);
                var json = JSON.parse(res.text);
                assert.strictEqual(typeof json.transaction_id, 'string');
                done();
            });
        });
      });
   });
   
   describe('POST /api/v1/reservations', function (){
      it('Should not be able to book same resource with different staff_id', function(done) {
          const { Resource, Desk, Location, ResourceType, Reservation } = models;
      const numData = 5;
      const id = 2;
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
        var resource = {
          location_id: location.location_id,
          resource_type: 'Desk',
        };
        return Resource.create(resource);
      }).then(function(resource) {
        var reservations1 = {
          resource_id: id,
          staff_id:"3333333333",
          staff_name:"Lyon",
          staff_department:"dept4",
          staff_email:"lyon@hsbc.ca",
          start_date: moment().toDate(),
          end_date: moment().add(2, 'h').toDate()
        };
        return Reservation.create(reservations1);
      }).then(function(reservations1){
        var reservations2 = {
             resource_id: id,
             staff_id:admin_id,
             staff_name:"Bruce",
             staff_department:"dept4",
             staff_email:"bruce@hsbc.ca",
             start_date: moment().toDate(),
             end_date: moment().add(2, 'h').toDate()
         };
         
        request(app)
            .post(`/api/v1/reservations`)
            .set('Accept', 'application/json')
            .send(reservations2)
            .end(function (err, res){
                assert.equal(res.status, 409);
                assert.equal(res.text, 'Reservation times cannot overlap for the same resource');
                done();
            })
        });
      });
   });
   
   
   describe('DELETE /api/v1/reservations/:reservation_id', function (){
       it('Should be able to successfully delete a made reservation', function(done) {
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
                    staff_id:admin_id,
                    staff_name:"James",
                    staff_department:"dept123",
                    staff_email:"testing@hsbc.ca",
                    start_date: moment().toDate(),
                    end_date: moment().toDate()
                };
                return Reservation.create(reservations);
            }).then(function(reservations) {
                request(app)
                    .delete(`/api/v1/reservations/${reservations.reservation_id}`)
                    .send({staff_id:admin_id})
                    .end(function (err, res){
                        assert.equal(res.status, 200);
                        assert.equal(res.body, 'Reservation successfully deleted.');
                        done();
                });
            });
       });
   });
   
});
