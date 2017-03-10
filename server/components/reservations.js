var Sequelize = require('sequelize'),
  moment = require('moment'),
  models = require('../models');

module.exports = function (app) {


  //GET by staff_id
  app.get("/api/v1/users/:staff_id/reservations/", function (req, res) {
    var staff_id = req.params.staff_id;

    models.Reservation.findAll({
      where: { staff_id: staff_id }
    }).then(function (reservations) {
      res.status(200).send(reservations);
    }).catch(Sequelize.ValidationError, function (err) {
      res.status(401).send({ errors: err.errors });
    });
  });

  //GET by resource_id
  app.get("/api/v1/resource/:resource_id/reservations/", function(req, res){
    var resource_id = req.params.resource_id;

    models.Reservation.findAll({
      where: { resource_id: resource_id }
    }).then(function (reservations) {
      res.status(200).send(reservations);
    }).catch(Sequelize.ValidationError, function (err) {
      res.status(401).send({ errors: err.errors });
    });
  });

  //GET all
  app.get("/api/v1/reservations/", function(req, res) {
    models.Reservation.findAll().then(function(reservations){
      res.status(200).send(reservations);
    }).catch(Sequelize.ValidationError, function (err) {
      res.status(401).send({ errors: err.errors });
    });
  }); 

  //POST
  app.post("/api/v1/reservations", function (req, res) {
    var resource_id = req.body.resource_id,
        start_date = req.body.start_date,
        end_date = req.body.end_date,
        staff_email = req.body.staff_email;

    var reservation = {
      resource_id: resource_id,
      staff_id: req.body.staff_id,
      staff_name: req.body.staff_name,
      staff_department: req.body.staff_department,
      staff_email: req.body.staff_email,
      start_date: moment(start_date).toDate(),
      end_date: moment(end_date).toDate()
    };

    // Check if the reservation conflicts with other reservations
    // Translates to:
    //      Where 
    //      start_date <= reservation.end_date AND start_date >= resource.start_date
    //      OR
    //      end_date >= resource.start_date AND end_date <= resource.end_date
    models.Reservation.findAll({      
    where:{
      resource_id: resource_id,
      $or: [
        {$and: [{'$reservation.end_date$': {$gte: start_date}},
                {'$reservation.start_date$': {$lte: start_date}}]},
        {$and: [{'$reservation.start_date$': {$lte: end_date}},
                {'$reservation.end_date$': {$gte: end_date}}]}
      ]}
    }).then(function (reservations) {    
      if (reservations.length > 0) { //findAll returns an empty array not null if nothing is found.
        // Reservation already exists
        res.status(409).send("This resource is already booked during the given time period.");
      }
      else{
        models.Reservation.create(reservation).then(function (reservation) {
          res.location(`/api/v1/reservations/${reservation.reservation_id}`);
          res.status(201).send(null);
        }).then(function(){
            
            //TODO
            //SMTP CALL

        });        
      }
    }).catch(Sequelize.ValidationError, function (err) {
      res.status(400).send({ errors: err.errors });
    });
  });

  //DELETE
  app.delete("/api/v1/reservations/:reservation_id", function (req, res) {
    var reservation_id = req.params.reservation_id;

    models.Reservation.destroy({
      where: { reservation_id: reservation_id }
    }).then(function (reservation) {
      res.status(200).send(null);
    }).catch(Sequelize.ValidationError, function (err) {
      res.status(401).send({ errors: err.errors });
    });
  });

  //PUT
  app.put("/api/v1/reservations/:reservation_id", function(req, res) {
    var reservation_id = req.params.reservation_id,
        resource_id = req.body.resource_id,
        start_date = req.body.start_date,
        end_date = req.body.end_date;
       
    var reservation = {
      reservation_id: reservation_id,
      resource_id: resource_id,
      staff_id: req.body.staff_id,
      staff_email: req.body.staff_email,
      staff_name: req.body.staff_name,
      staff_department: req.body.staff_department,
      start_date: moment(start_date).toDate(),
      end_date: moment(end_date).toDate()
    };

    // Check if the reservation conflicts with other reservations
    // Translates to:
    //      Where 
    //      start_date <= reservation.end_date AND start_date >= resource.start_date
    //      OR
    //      end_date >= resource.start_date AND end_date <= resource.end_date
    models.Reservation.findAll({      
      where:{
        resource_id: resource_id,
        reservation_id: {$ne: reservation_id},
        $or: [
          {$and: [{'$reservation.end_date$': {$gte: start_date}},
                  {'$reservation.start_date$': {$lte: start_date}}]},
          {$and: [{'$reservation.start_date$': {$lte: end_date}},
                  {'$reservation.end_date$': {$gte: end_date}}]}
        ]}
    }).then(function (reservations) {    
      if (reservations.length > 0) { //findAll returns an empty array not null if nothing is found.
        // Reservation already exists
        res.status(409).send("This resource is already booked during the given time period.");
      }
      else{
        models.Reservation.update(reservation, {where: {reservation_id: reservation_id}}).then(function (reservation) {
          res.location(`/api/v1/reservations/${reservation.reservation_id}`);
          res.status(201).send(null);
        });        
      }
    }).catch(Sequelize.ValidationError, function (err) {
      res.status(400).send({ errors: err.errors });
    });  
  });


}
