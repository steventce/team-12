var Sequelize = require('sequelize'),
  models = require('../models');

module.exports = function(app) {

	app.get("/api/v1/locations", function(req, res) {
		models.Location.findAll().then(function(reservations){
			res.status(200).send(reservations);
		}).catch(Sequelize.ValidationError, function (err) {
      		res.status(401).send({ errors: err.errors });
    	});
	});

	app.delete("/api/v1/locations/:location_id", function(req, res) {
		var location_id = req.params.location_id;
		models.Location.destroy({
	      where: { location_id: location_id }
	    }).then(function (location) {
	      res.status(200).send(null);
	    }).catch(Sequelize.ValidationError, function (err) {
	      res.status(401).send({ errors: err.errors });
	    });
	});

	app.post("/api/v1/locations", function(req, res) {
		var location_id = req.body.location_id;
		var location = {
			location_id: location_id,
			building_name: req.body.building_name,
			street_name: req.body.street_name,
			city: req.body.city,
			province_state: req.body.province_state,
			postal_code: req.body.postal_code
		};

		models.Location.find({where: {location_id: location_id}
			}).then(function(loc){
				if(loc !== null){
					res.status(409).send(null);
				}
				else{
					models.Location.create(location).then(function(){
						res.status(201).send(null);
					});					
				}
			}).catch(Sequelize.ValidationError, function (err) {
	     		 res.status(400).send({ errors: err.errors });
	    	});
	});	

	app.put("/api/v1/locations/:location_id", function(req, res) {

		var location_id = req.params.location_id;
		var location = {
			location_id: location_id,
			building_name: req.body.building_name,
			street_name: req.body.street_name,
			city: req.body.city,
			province_state: req.body.province_state,
			postal_code: req.body.postal_code
		};
	    
	    models.Location.update(location, {where: {location_id: location_id}}).then(function(loc){
            res.status(200).send(null);
        }).catch(Sequelize.ValidationError, function(err) {
            res.status(401).send({ errors: err.errors });
        });
	});
}
