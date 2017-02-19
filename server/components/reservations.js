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
		// Stub
		console.log(req.body);
		var resource_id = req.body.resource_id;
		var staff_id = req.body.description;
		var staff_name = req.body.staff_name;
		var staff_department = req.body.staff_department;
		var staff_email = req.body.staff_email;
		var start_date = req.body.start_date;
		var end_date = req.body.end_date;

		console.log(resource_id);
		res.send(resource_id);
		// TODO: Replace this with real code
	});

	app.delete("/api/v1/reservations/:reservation_id", function(req, res) {
		// Stub
		var reservation_id =req.params.reservation_id;
		console.log(reservation_id);
		res.send(reservation_id);
		// TODO: Replace this with real code
	});

}