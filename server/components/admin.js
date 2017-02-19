module.exports = function(app) {
	app.get("/api/v1/users/:staff_id", function(req, res) {
		// Stub
		var staff_id = req.params.staff_id;
		console.log(staff_id);
		res.send(staff_id);
		// TODO: Replace this with real code
	});
}