var Sequelize = require('sequelize'),
    moment    = require('moment'),
    models    = require('../models');

module.exports = function(app) {
  app.get("/api/v1/locations/:location_id/resources", function(req, res) {
    // Stub
    var resource_type = req.query.resource_type;
    var start_time = req.query.start_time;
    var end_time = req.query.end_time;
    var location_id = req.params.location_id;
    var floor = req.query.floor;
    var section_id = req.query.section_id;
    console.log(location_id);
    res.send(location_id);
    // TODO: Replace this with real code
  });

  app.get("/api/v1/users/:staff_id/reservations/", function(req, res) {
    // Stub
    var staff_id = req.params.staff_id;
    console.log(staff_id);
    res.send(staff_id);
    // TODO: Replace this with real code
  });

  app.post("/api/v1/reservations", function(req, res) {
    console.log(req.body);
    const {
      resource_id,
      staff_id,
      staff_name,
      staff_department,
      staff_email,
      start_date,
      end_date
    } = req.body;

    var reservation = {
      resource_id,
      staff_id,
      staff_name,
      staff_department,
      staff_email,
      start_date: moment(start_date).toDate(),
      end_date: moment(end_date).toDate()
    };

    models.Reservation.create(reservation).then(function(reservation) {
      res.location(`/api/v1/reservations/${reservation.reservation_id}`);
      res.status(201).send(null);
    }).catch(Sequelize.ValidationError, function(err) {
      res.status(400).send({ errors: err.errors });
    });
  });

  app.delete("/api/v1/reservations/:reservation_id", function(req, res) {
    // Stub
    var reservation_id =req.params.reservation_id;
    console.log(reservation_id);
    res.send(reservation_id);
    // TODO: Replace this with real code
  });
}
