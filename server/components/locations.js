module.exports = function(app) {
	app.get("/api/v1/locations", function(req, res) {
		// Stub
		var location_id = req.query.location_id;
		console.log(location_id);
		res.send(location_id);
		// TODO: Replace this with real code
	});
}