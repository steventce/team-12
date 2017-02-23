module.exports = function(app) {
	app.get("/api/v1/locations", function(req, res) {
		// Stub
		//var location_id = req.query.location_id;
		res.send(['dummyLoc', 'dummyLoc2']);
		// TODO: Replace this with real code
	});
}