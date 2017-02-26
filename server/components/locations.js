module.exports = function(app) {

	app.get("/api/v1/locations", function(req, res) {
		// Stub
		//var location_id = req.query.location_id;
		res.send(['dummyLoc', 'dummyLoc2']);
		// TODO: Get all locations
	});

	app.delete("/api/v1/locations/:location_id", function(req, res) {
		var location_id = req.params.location_id;
		// TODO: Delete location with location_id

	});

	app.put("/api/v1/locations/:location_id", function(req, res) {
        const {
            resource_id,
            building_name,
            street_name,
            city,
            province_state,
            postal_code
        } = req.body;
		// TODO: Edit location with location_id

	});

	app.post("/api/v1/locations", function(req, res) {
        const {
            resource_id,
            building_name,
            street_name,
            city,
            province_state,
            postal_code
        } = req.body;
		// TODO: Add new location with req params

	});
}
