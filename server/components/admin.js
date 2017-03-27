var Sequelize = require('sequelize'),
    models    = require('../models');

module.exports = function(app) {

	//GET by HSBC staff_id
	app.get("/api/v1/admin/users/:staff_id", function(req, res) {
		
		var admin_id = req.params.staff_id;

		models.Admin.find({
            where: { admin_id: admin_id}
        }).then(function(admin){
            res.status(200).send(admin);
        }).catch(Sequelize.ValidationError, function(err) {
            res.status(401).send({ errors: err.errors });
        });
	});

	//GET all
	app.get("/api/v1/admin/users/", function(req, res) {
		
		models.Admin.findAll().then(function(admins){
            res.status(200).send(admins);
        }).catch(Sequelize.ValidationError, function(err) {
            res.status(401).send({ errors: err.errors });
        });
	});

	//POST
	app.post("/api/v1/admin/users/", function(req, res){
		var admin_id = req.body.staff_id;
		var admin = {
			admin_id: admin_id,
			name: req.body.name,
		};

		models.Admin.find({where: {admin_id: admin_id}}).then(function(query){
			if(query !== null){
				res.status(409).send(null);
			}
			else{
				models.Admin.create(admin).then(function(){
					res.status(200).send(null);
				}).catch(Sequelize.ValidationError, function(err) {
		            res.status(401).send({ errors: err.errors });
		        });
			}
		});
	});

	//PUT
	app.put("/api/v1/admin/users/:admin_id", function(req, res){
		var admin_id = req.params.admin_id;
		var admin = {
			admin_id: admin_id,
			name: req.body.name
		};

		models.Admin.update(admin, {where: {admin_id: admin_id}}).then(function(){
			res.status(200).send(null);
		}).catch(Sequelize.ValidationError, function(err) {
            res.status(401).send({ errors: err.errors });
        });
	});

	//DELETE
	app.delete("/api/v1/admin/users/:admin_id", function(req, res){
		var admin_id = req.params.admin_id;

		models.Admin.destroy({where: {admin_id: admin_id}}).then(function(){
			res.status(200).send(null);
		}).catch(Sequelize.ValidationError, function (err) {
	      res.status(401).send({ errors: err.errors });
	    });
	});
}