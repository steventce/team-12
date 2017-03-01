var Sequelize = require('sequelize'),
    models    = require('../models');

module.exports = function(app) {
	app.get("/api/v1/users/:staff_id", function(req, res) {
		
		var staff_id = req.params.staff_id;
		console.log(staff_id);
		
		models.Admin.findAll({
                    where: { admin_id: staff_id}
                }).then(function(admin){
                    res.status(200).send(admin);
                }).catch(Sequelize.ValidationError, function(err) {
                    res.status(401).send({ errors: err.errors });
                });
	});
}