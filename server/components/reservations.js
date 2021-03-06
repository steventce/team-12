var Sequelize = require('sequelize'),
  moment = require('moment'),
  models = require('../models'),
  nodemailer = require('nodemailer');
  sesConfig = require('../config/ses');

const RESERVATION_LOCK_MS = 600000

module.exports = function (app) {

  //SMTP Setup
  // var transporter = nodemailer.createTransport({
  //   transport: 'ses', // loads nodemailer-ses-transport
  //   accessKeyId: 'AWSACCESSKEY',
  //   secretAccessKey: 'AWS/Secret/key' //provided by HSBC?
  // });
  //temp for testing

  var enableSes = sesConfig.enable === "true"
  var transporter = enableSes ? nodemailer.createTransport(sesConfig.nodeMailerConf) : nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hsbc.resource.booker@gmail.com',  //Using gmail for testing
        pass: 'mylasagna'
    }
  });

 // var transporter = nodemailer.createTransport({
 //    service: '"SES-US-WEST-2"',
 //    auth: {
 //        user: 'AKIAIBDEKDOWLGPY54IQ',  //Using gmail for testing
 //        pass: 'ApsfD/fWjGLiOLceshisiTO7dS/GW8KGyLLMAAa+S4ZM'
 //    }
 //  });

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

  var pendingReservations = {}; // transactionId : {timer, reservation}
  
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
        // Check if the reservation conflicts with other reservations
        // Translates to:
        //      Where 
        //      start_date <= reservation.end_date AND start_date >= reservation.start_date
        //      OR
        //      end_date >= reservation.start_date AND end_date <= reservation.end_date

        // Look in pending transactions
        let overlap = false
        for (var prop in pendingReservations) {
          if (!pendingReservations.hasOwnProperty(prop) || pendingReservations[prop] === undefined)
            continue
          let pendingReservation = pendingReservations[prop].reservation
          if (pendingReservation.resource_id !== resource_id)
            continue

          if (pendingReservation.end_date > reservation.start_date && pendingReservation.start_date < reservation.end_date) {
            console.log("Reservation overlapped with: " + prop)
            overlap = true
            break
          } 
        }

        try {
          if (!overlap) {
            let reservations = await models.Reservation.findAll({
              where:{
                resource_id: resource_id,
                $and: [{'$end_date$': {$gt: start_date}},
                       {'$start_date$': {$lt: end_date}}]}})

            console.log("reservations are: " + JSON.stringify(reservations)) 
            overlap = reservations.length > 0
          }

          if (overlap) { //findAll returns an empty array not null if nothing is found.
            // Reservation already exists
            res.status(409).send("Reservation times cannot overlap for the same resource");
          }
          else {
            // Check if the same user booked another resource for an overlapping time period
            let overlappingReservationByUser = false;
            await models.Reservation.findAll({
              where: {
                staff_id: staff_id
              }
            }).then(function (reservationsMadeByEmployee) {
              reservationsMadeByEmployee.map(function (employeeReservation) {
                if (reservation.start_date < employeeReservation.end_date &&
                  reservation.end_date > employeeReservation.start_date) {
                    overlappingReservationByUser = true;
                }
              });
            });
            if (overlappingReservationByUser) {
              res.status(400).send("You cannot book multiple desks for an overlapping time period");
            } else {

                // Allow the user to book a resource as there are no reservations that
                // overlap with the requested time period

                let resource = await models.Resource.findOne({where: { resource_id: resource_id }});

                console.log("Resource is: " + resource);
                reservation.resource_type = resource.resource_type;

                let transaction_id = String(Date.now()) + "_" + staff_id;

                // Set timeout and ask user to confirm
                const timer = setTimeout(() => {
                  console.log("Reservation expired: " + transaction_id)
                  delete pendingReservations[transaction_id]
                }, RESERVATION_LOCK_MS)

                pendingReservations[transaction_id] = {timer, reservation}
                console.log("Created reservation on transaction at id " + transaction_id)
                res.status(200).send({transaction_id});

            }
          }
        }
        catch(err) {
          console.log("Error creating reservation: " + err)
          res.status(400).send({ errors: err });
        }
      }
  });

  // POST
  app.post("/api/v1/reservations/:transaction_id", async function (req, res) {
    var transaction_id = req.params.transaction_id,
        staff_id = req.body.staff_id,
        action = req.body.action

        let pendingRequest = pendingReservations[transaction_id]

        if (!pendingRequest) {
          if (action == "confirm")
            res.status(404).send("Pending transaction expired.");
          else
            res.status(200).send();
           return
        }
        else if (pendingRequest.reservation.staff_id != staff_id) {
          res.status(400).send("Bad request");
           return
        }

        if (action == "confirm") {
          try {
            let dbReservation = await models.Reservation.create(pendingRequest.reservation)

            console.log("Commited transaction " + transaction_id)
            res.location(`/api/v1/reservations/${dbReservation.reservation_id}`);
            res.status(201).send("Your reservation has been made successfully.")
          }
          catch (err) {
            console.log("Error confirming transaction " + transaction_id + ": " + err)
            res.status(400).send({ errors: err });
            return
          }
        }
        else {
          console.log("User aborted transaction " + transaction_id)
          res.status(200).send();
        }

        if (action == "confirm" && pendingRequest.reservation.staff_email && pendingRequest.reservation.staff_email !== "") {
          
          models.Resource.find({    //Need to get resource information to display in email
            where: { resource_id: pendingRequest.reservation.resource_id },
            include: [{
              model: models.Desk
            }],
            raw: true
          }).then(function (resource) {
            var mailData = {
              from: enableSes ? sesConfig.username : 'hsbc.resource.booker@gmail.com', // sender address TODO
              to: pendingRequest.reservation.staff_email, // receiver
              subject: 'HSBC Reservation Confirmation', // Subject line
              html: '<p>Your reservation has been made successfully for: '+ resource['Desk.desk_number'] + '</p>' +
                    '<p>Start time: ' + moment(pendingRequest.start_date).format("dddd, MMMM Do YYYY, h:mm:ss a") + '</p>' +
                    '<p>End time: ' + moment(pendingRequest.end_date).format("dddd, MMMM Do YYYY, h:mm:ss a") + '</p>' // html body
            };
            transporter.sendMail(mailData, function(err, info){
              if(err){
                console.log(err);
              }
              else{
                console.log('Message %s sent: %s', info.messageId, info.response);
              }
            });              
          });
          
        }
        clearTimeout(pendingRequest.timer)
        delete pendingReservations[transaction_id]
  });

  //DELETE
  app.delete("/api/v1/reservations/:reservation_id", function (req, res) {
    var reservation_id = req.params.reservation_id;
    var staff_id = req.body.staff_id;
    console.log("\r\n Deleting reservation " + reservation_id + " from user " + staff_id + ":\r\n");
    models.Reservation.findOne({
      where: { reservation_id: reservation_id }
    }).then(function(reservation) {
      if (reservation.staff_id == staff_id) {
        return models.Reservation.destroy({
          where: { reservation_id: reservation_id }
        });
      } else {
        models.Admin.findAll({
          where: { admin_id: staff_id}
        }).then(function(admins) {
          if (admins.length == 0) {
            res.status(401).json('User needs to be admin to delete reservations by others');
            return;
          } else {
            return models.Reservation.destroy({
              where: { reservation_id: reservation_id }
            });
          } 
        });
      }
    }).then(function (reservation) {
      if (reservation == null)
        res.status(401);
      else 
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
       
    var now = moment();
    var newReservation = {
      reservation_id: reservation_id,
      resource_id: resource_id,
      staff_id: req.body.staff_id,
      staff_email: req.body.staff_email,
      staff_name: req.body.staff_name,
      staff_department: req.body.staff_department,
      start_date: moment(start_date).toDate(),
      end_date: moment(end_date).toDate(),
      updated_at: now
    };

    var start_date = moment(start_date);
    var end_date = moment(end_date);

    models.Admin.findAll({
      where: { admin_id: req.body.staff_id}
    }).then(function(admins) {
      if (admins.length == 0) {
        res.status(401).json('User needs to be admin to delete reservations by others');
        return;
      } else {

        // Error checking 
        if (start_date.isAfter(end_date)) {
          console.log("start date > end date: " + start_date + " "+ end_date);
          res.status(401).send("Start date must be after end date");
          return;
        } 
        var duration = moment.duration(end_date.diff(start_date));
        var hours = duration.asHours();
        if (hours > 120) {
          console.log("duration > 120: " + start_date + " "+ end_date);
          res.status(401).send("End date must be 120 hours after start date");
          return;
        } 
        var duration2 = moment.duration(start_date.diff(now));
        var days = duration2.asDays();
        if (days > 30) {
          console.log("start_date > 30 days: " + start_date + " "+ end_date);
          res.status(401).send("Start date must be within 30 days of current date");
          return;
        }

        models.Reservation.findAll({
          where: {
            resource_id: resource_id
          }
        }).then(function (allReservationsWithResourceId) {
          let overlapWithAnotherTime = false;
          allReservationsWithResourceId.map(function (existingReservation) {
            // Check if reservation times overlap
            let hasOverlap = newReservation.start_date < existingReservation.end_date &&
              newReservation.end_date > existingReservation.start_date;
            let differentReservations = newReservation.reservation_id != existingReservation.reservation_id;
            if (hasOverlap && differentReservations) {
              overlapWithAnotherTime = true;
              return;
            }
          });
          if (overlapWithAnotherTime) {
            res.status(400).send("Reservation times cannot overlap for the same resource");
          } else {
            // Update reservation since there is no overlapping reservation times

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
                    res.status(401).send("No such reservation in the system");
                  }
                }).catch(Sequelize.ValidationError, function (err) {
                  res.status(400).send({ errors: err.errors });
                });

          }
        });
      } 
    });


  });


}
