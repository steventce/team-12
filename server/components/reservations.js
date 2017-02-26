var Sequelize = require('sequelize'),
    moment    = require('moment'),
    models    = require('../models');

module.exports = function(app) {

  app.get("/api/v1/users/:staff_id/reservations/", function(req, res) {
    var staff_id = req.params.staff_id;

    models.Reservation.findAll({
      where: { staff_id: staff_id}
    }).then(function(reservations){
      res.status(201).send(reservations);
    }).catch(Sequelize.ValidationError, function(err) {
      res.status(400).send({ errors: err.errors });
    });
  });

  app.post("/api/v1/reservations", function(req, res) {
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
    var reservation_id =req.params.reservation_id;

    models.Reservation.destroy({
      where: {reservation_id: reservation_id}
    }).then(function(reservation){
      res.status(201).send(null);
    }).catch(Sequelize.ValidationError, function(err) {
      res.status(400).send({ errors: err.errors });
    });
  });
}
