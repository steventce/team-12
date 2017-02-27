var Sequelize = require('sequelize'),
    models    = require('../models');

module.exports = function(app) {

	app.post("/api/v1/resources", function(req, res) {
		var resource_type = req.body.resource_type;
		var location_id = req.body.location_id;
		var floor_id = req.body.floor_id;
		var section_id = req.body.section_id;
		console.log(location_id);
		
		var resource = {
		    location_id,
		    resource_type,
		    floor_id,
		    section_id
		};
		
		models.Resource.create(resource).then(function(resource) {
                    res.location(`/api/v1/resources/${resource.resource_id}`);
                    res.status(201).send(null);
                }).catch(Sequelize.ValidationError, function(err) {
                    res.status(400).send({ errors: err.errors });
                });
	});

	app.put("/api/v1/resources/:resource_id", function(req, res) {
		// Stub
		var resource_id = req.params.resource_id;
		console.log(resource_id);
		res.send(resource_id);
		// TODO: Replace this with real code
		
		models.Resource.edit({
                    where: {resource_id: resource_id}
                }).then(function(resource){
                    res.status(200).send(null);
                }).catch(Sequelize.ValidationError, function(err) {
                    res.status(401).send({ errors: err.errors });
                });
	});

}