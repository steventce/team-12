var Sequelize = require('sequelize'),
  moment = require('moment'),
  models = require('../models'),
  nodemailer = require('nodemailer');

module.exports = function (app) {

  //SMTP Setup
  // var transporter = nodemailer.createTransport({
  //   transport: 'ses', // loads nodemailer-ses-transport
  //   accessKeyId: 'AWSACCESSKEY',
  //   secretAccessKey: 'AWS/Secret/key' //provided by HSBC?
  // });
  //temp for testing
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hsbc.resource.booker@gmail.com',  //Using gmail for testing
        pass: 'mylasagna'
    }
  });


  //GET by staff_id
  app.get("/api/v1/users/:staff_id/reservations/", function (req, res) {
    var staff_id = req.params.staff_id;

    models.Reservation.findAll({
      include: [{
        model: models.Resource,
        include: [models.Desk]
      }],
      raw: true
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
    models.Reservation.findAll({
      include: [{
        model: models.Resource,
        include: [models.Desk]
      }],
      raw: true
    }).then(function(reservations){
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
        staff_email = req.body.staff_email,
        staff_id = req.body.staff_id;

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
    //      start_date <= reservation.end_date AND start_date >= reservation.start_date
    //      OR
    //      end_date >= reservation.start_date AND end_date <= reservation.end_date
    models.Reservation.findAll({      
    where:{
      resource_id: resource_id,
      //staff_id: staff_id,
      $or: [
        {$and: [{'$reservation.end_date$': {$gt: start_date}},
                {'$reservation.start_date$': {$lte: start_date}}]},
        {$and: [{'$reservation.start_date$': {$lt: end_date}},
                {'$reservation.end_date$': {$gte: end_date}}]}
      ]}
    }).then(function (reservations) {    
      console.log("reservations are: " + reservations);
      if (reservations.length > 0) { //findAll returns an empty array not null if nothing is found.
        // Reservation already exists
        res.status(409).send("You cannot book multiple desks for overlapping time period");
      }
      else{
        models.Resource.findOne({
          where: { resource_id: resource_id }
        }).then(function(resource) {
          console.log("Resource is: " + resource);
          reservation.resource_type = resource.resource_type;
          models.Reservation.create(reservation).then(function (reservation) {
            res.location(`/api/v1/reservations/${reservation.reservation_id}`);
            res.status(201).send(null);
          }).then(function(){
            if(staff_email !== null){
              var mailData = {
                from: 'hsbc.resource.booker@gmail.com', // sender address TODO
                to: staff_email, // receiver
                subject: 'HSBC Reservation Confirmation', // Subject line
                html: '<p>Your reservation has been made successfully.</p>'+
                      '<p>Start time: ' + moment(start_date).format("dddd, MMMM Do YYYY, h:mm:ss a") + '</p>' +
                      '<p>End time: ' + moment(end_date).format("dddd, MMMM Do YYYY, h:mm:ss a") + '</p>' // html body
              };
              transporter.sendMail(mailData, function(err, info){
                if(err){
                  console.log(err);
                }
                else{
                  console.log('Message %s sent: %s', info.messageId, info.response);
                }
              });            
            }
          }); 
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
       
    var newReservation = {
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
    //      start_date <= reservation.end_date AND start_date >= reservation.start_date
    //      OR
    //      end_date >= resource.start_date AND end_date <= resource.end_date
    models.Reservation.findOne({      
      where:{
        reservation_id: reservation_id,
      }
    }).then(function (reservation) {
      console.log("Reservation is: " + reservation);
      if (reservation) {
        reservation.updateAttributes(newReservation).then(function (result) {
          res.status(200).send(result);
        });
      } else {
        res.status(401).send(null);
      }
    }).catch(Sequelize.ValidationError, function (err) {
      res.status(400).send({ errors: err.errors });
    });  
  });


}
