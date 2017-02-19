module.exports = function(app) {
	app.get("/api/v1/locations/:location_id/reservations", function(req, res) {
		// Stub
		var staff_id = req.query.staff_id;
		var location_id = req.params.location_id;
		var floor = req.query.floor_id;
		console.log(location_id);
		res.send(location_id);
		// TODO: Replace this with real code
	});

	app.put("/api/v1/reservations/:reservation_id", function(req, res) {
		// Stub
		var staff_id = req.body.staff_id;
		var start_time = req.body.start_time;
		var end_time = req.body.end_time;
		var resource_type = req.body.resource_type;
		var reservation_id = req.params.reservation_id;
		console.log(reservation_id);
		res.send(reservation_id);
		// TODO: Replace this with real code
	});

	app.delete("/api/v1/admin/:reservation_id", function(req, res) {
		// Stub
		var reservation_id =req.params.reservation_id;
		var staff_id = req.query.staff_id;
		console.log(reservation_id);
		res.send(reservation_id);
		// TODO: Replace this with real code
	});


	app.get("/api/v1/reservations/export_csv", function(req, res) {
		// Stub
		var staff_id = req.query.staff_id;
		console.log(staff_id);
		res.send(staff_id);
		// TODO: Replace this with real code
	});

}