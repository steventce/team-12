var Sequelize = require('sequelize'),
  moment = require('moment'),
  models = require('../models'),
  nodemailer = require('nodemailer');

const RESERVATION_LOCK_MS = 60000

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

  var pendingReservations = {}; // reservationId : {timerId, staffId, request}

  //GET by staff_id
  app.get("/api/v1/users/:staff_id/reservations/", function (req, res) {
    var staff_id = req.params.staff_id;

    models.Reservation.findAll({
      where: { staff_id: staff_id,
               end_date: {$gt: moment(Date.now()).toDate()} }, //where end_date is greater than current date
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
      where: { resource_id: resource_id,
               end_date: {$gt: moment(Date.now()).toDate()} } //where end_date is great than current date
    }).then(function (reservations) {
      res.status(200).send(reservations);
    }).catch(Sequelize.ValidationError, function (err) {
      res.status(401).send({ errors: err.errors });
    });
  });

  //GET all
  app.get("/api/v1/reservations/", function(req, res) {
    models.Reservation.findAll({
      where: {
        end_date: {$gt: moment(Date.now()).toDate()}}, //where end_date is greater than current date
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
  app.post("/api/v1/reservations", async function (req, res) {

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
    
    console.log("Received reservation request " + JSON.stringify(reservation))
    var start_date_ = moment(start_date);
    var end_date_ = moment(end_date);
    var max_end_date = moment().add(30, 'd'); 
    var time_diff = moment.duration(end_date_.diff(start_date_));
    var diff_hour = time_diff.asHours();
    if (diff_hour > 120){
        res.status(409).json(`Reservation cannot be made for more than 120 hours (5 days).`);
    } else if (end_date_.isAfter(max_end_date, 'hour')){
        res.status(409).json(`Reservation cannot be made for more than 30 days in advance.`);
    } else {
      try {
        let transaction = await Sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED})

        // Check if the reservation conflicts with other reservations
        // Translates to:
        //      Where 
        //      start_date <= reservation.end_date AND start_date >= reservation.start_date
        //      OR
        //      end_date >= reservation.start_date AND end_date <= reservation.end_date
        let reservations = await models.Reservation.findAll({      
          where:{
            resource_id: resource_id,
            $and: [{'$end_date$': {$gt: start_date}},
                   {'$start_date$': {$lt: end_date}}]}}, {transaction})

        console.log("reservations are: " + reservations) 
        if (reservations.length > 0) { //findAll returns an empty array not null if nothing is found.
          // Reservation already exists
          res.status(409).send("You cannot book multiple desks for overlapping time period");
          transaction.rollback();
        }
        else {
          let resource = await models.Resource.findOne({ where: { resource_id: resource_id }})

          console.log("Resource is: " + resource)
          reservation.resource_type = resource.resource_type

          let dbReservation = await models.Reservation.create(reservation, {transaction})
          
          // Ask user to confirm, and set timeout
          const timerId = setTimeout(() => {
            console.log("Reservation expired: " + dbReservation.reservation_id)
            transaction.rollback()
          }, RESERVATION_LOCK_MS)

          pendingReservations[String(timerId)] = {transaction, reservation: dbReservation}
          console.log("Created reservation on transaction at id " + dbReservation.reservation_id)
          res.status(100).send({reservation_id: dbReservation.reservation_id, transaction_id: timerId})
        }
      }
      catch(err) {
        console.log("Error creating reservation: " + JSON.stringify(err))
        res.status(400).send({ errors: err });
        transaction.rollback();
      }
    }
  });

  // POST
  app.post("/api/v1/reservations/:transaction_id", async function (req, res) {
    var reservation_id = req.body.reservation_id,
        transaction_id = req.params.transaction_id,
        action = req.body.action

        let pendingRequest = pendingReservations[transaction_id]

        if (!pendingRequest || !pendingRequest.reservation || pendingRequest.reservation.reservation_id !== reservation_id) {
           res.status(404).send("Pending transaction or reservation not found.");
           return
        }

        reservation = pendingRequest.reservation
        transaction = pendingRequest.transaction

        try {
          if (action == "confirm") {
            await transaction.commit()
            console.log("Commited transaction " + transaction_id + " with reservation id " + reservation_id)
            res.status(201).json("Your reservation has been made successfully.")
            res.location(`/api/v1/reservations/${reservation.reservation_id}`);

            if (reservation.staff_email !== null) {
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
          }
          else {
            console.log("User aborted transaction " + transaction_id + " with reservation id " + reservation_id)
            await transaction.rollback()
          }
          cancelTimeout(transaction_id)
        }
        catch (err) {
          console.log("Error executing action: " + JSON.stringify(err))
          res.status(400).send({ errors: err });
        }
  });

  //DELETE
  app.delete("/api/v1/reservations/:reservation_id", function (req, res) {
    var reservation_id = req.params.reservation_id;

    models.Reservation.destroy({
      where: { reservation_id: reservation_id }
    }).then(function (reservation) {
      res.status(200).json('Reservation successfully deleted.');
    }).catch(Sequelize.ValidationError, function (err) {
      res.status(401).json({ errors: err.errors });
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
