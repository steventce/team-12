module.exports = function(app) {
	app.get("/api/v1/admin/locations", function(req, res) {
		// Stub
		var staff_id = req.query.staff_id;
		console.log(staff_id);
		res.send(staff_id);
		// TODO: Replace this with real code
	});

	app.post("/api/v1/locations", function(req, res) {
		// Stub
		var building_name = req.body.building_name;
		var street_address = req.body.street_address;
		var city_name = req.body.city_name;
		var province_state = req.body.province_state;
		var postal_code = req.body.postal_code;
		console.log(building_name);
		res.send(building_name);
		// TODO: Replace this with real code
	});

	app.put("/api/v1/locations/:location_id", function(req, res) {
		// Stub
		var location_id = req.params.location_id;
		var street_address = req.body.street_address;
		var city_name = req.body.city_name;
		var province_state = req.body.province_state;
		var postal_code = req.body.postal_code;
		console.log(location_id);
		res.send(location_id);
		// TODO: Replace this with real code
	});

	app.delete("/api/v1/locations/:location_id", function(req, res) {
		// Stub
		var location_id =req.params.location_id;
		console.log(location_id);
		res.send(location_id);
		// TODO: Replace this with real code
	});


}