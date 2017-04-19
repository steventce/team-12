var Sequelize = require('sequelize'),
  models = require('../models');

module.exports = function(app) {

  app.get("/api/v1/locations", function(req, res) {
    models.Location.findAll().then(function(reservations) {
      res.status(200).send(reservations);
    }).catch(Sequelize.ValidationError, function (err) {
      res.status(401).send({ errors: err.errors });
    });
  });

  app.delete("/api/v1/locations/:location_id", function(req, res) {
    var location_id = req.params.location_id;
    var staff_id = req.body.staff_id;
    models.Admin.findAll({
      where: { admin_id: staff_id}
    }).then(function(admins) {
      if (admins.length == 0) {
        res.status(401).json('User needs to be admin to delete locations');
        return;
      } else {
        return models.Resource.findAll({
          where: { location_id: location_id }
        });
      } 
    }).then(function (resources) {
      if (resources == null) return;
      if (resources.length > 0) {
        res.status(403).send("Location cannot be deleted unless all the resources in it have been deleted");
      } else {
        models.Location.destroy({
          where: { location_id: location_id }
      }).then(function (location) {
        res.status(200).send(null);
      }).catch(Sequelize.ValidationError, function(err) {
        res.status(401).send({ errors: err.errors });
        });
      }
    }).catch(Sequelize.ValidationError, function(err) {
      res.status(401).send({ errors: err.errors });
    });
  });

  app.post("/api/v1/locations", function(req, res, next) {
    var location = {
      building_name: req.body.location.building_name,
      street_name: req.body.location.street_name,
      city: req.body.location.city,
      province_state: req.body.location.province_state,
      postal_code: req.body.location.postal_code
    };
    var staff_id = req.body.staff_id;

    console.log("staff id is " + staff_id);
    models.Admin.findAll({
      where: { admin_id: staff_id}
    }).then(function(admins) {
      if (admins.length == 0) {
        res.status(401).send('User needs to be admin to add locations');
      } else {
        return models.Location.create(location);
      }
    }).then(function() {
      if (res.statusCode != 401) res.status(201).send(null);
    }).catch(Sequelize.ValidationError, function(err) {
      if (res.statusCode != 401) res.status(400).send({ errors: err.errors });
    });
  });

  app.put("/api/v1/locations/:location_id", function(req, res, next) {
    var location_id = req.params.location_id;
    var location = {
      location_id: location_id,
      building_name: req.body.location.building_name,
      street_name: req.body.location.street_name,
      city: req.body.location.city,
      province_state: req.body.location.province_state,
      postal_code: req.body.location.postal_code
    };
    var staff_id = req.body.staff_id;
    models.Admin.findAll({
      where: { admin_id: staff_id}
    }).then(function(admins) {
      if (admins.length == 0) {
        res.status(401).json('User needs to be admin to edit locations');
        return next();
      } else {
        return models.Location.update(location, {where: {location_id: location_id}});
      } 
    }).then(function(location) {
        if (res.statusCode != 401) res.status(200).send(null);
      }).catch(Sequelize.ValidationError, function(err) {
        if (res.statusCode != 401) res.status(401).send({ errors: err.errors });
      });
    });
}
