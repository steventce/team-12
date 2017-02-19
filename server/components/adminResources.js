module.exports = function(app) {

	app.post("/api/v1/resources", function(req, res) {
		// Stub
		var resource_type = req.body.resource_type;
		var location_id = req.body.location_id;
		var floor_id = req.body.floor_id;
		var section_id = req.body.section_id;
		console.log(location_id);
		res.send(location_id);
		// TODO: Replace this with real code
	});

	app.put("/api/v1/resources/:resource_id", function(req, res) {
		// Stub
		var resource_id = req.params.resource_id;
		console.log(resource_id);
		res.send(resource_id);
		// TODO: Replace this with real code
	});

}