var Sequelize = require('sequelize'),
    moment    = require('moment'),
    models    = require('../models');

module.exports = function(app) {

  // Get all the available resources in a location
  app.get('/api/v1/locations/:location_id/resources', function(req, res) {
    const { location_id } = req.params;

    const {
      resource_type,
      start_date,
      end_date,
      floor,
      section
    } = req.query;

    const {
      Resource,
      Reservation,
      Desk
    } = models;

    deskQuery = {};
    if (floor) deskQuery['floor'] = floor;
    if (section) deskQuery['section'] = section;

    // Gets resources where there doesn't exist any reservations
    // for that resource that falls in the desired request's interval
    Resource.findAll({
      attributes: ['resource_id', 'location_id', 'resource_type'],
      include: [
      {
        model: Reservation,
        required: false,
        attributes: [],
        where: {
          // 'Bad reservations':
          //                [----------------------------->
          //                       AND
          // <-----------------------------)
          // |--------------|--------------|--------------|
          //             Row Start      Row End
          $and: [
            // start before the row's end date and
            { '$Reservations.end_date$': { $gt: start_date } },
            // end after the row's start date
            { '$Reservations.start_date$': { $lt: end_date } }
          ]
        }
      },
      {
        // TODO: Change the model dynamically from the resource type
        model: Desk,
        attributes: ['floor', 'section', 'desk_number'],
        where: deskQuery
      }
      ],
      where: {
        resource_type,
        location_id,
        '$Reservations.resource_id$': null
      }
    }).then(function(resources) {
       res.status(200).send(resources);
    });
  });

  app.post("/api/v1/resources", function(req, res) {
    var resource_type = req.body.resource_type;
    var location_id = req.body.location_id;
    var floor_id = req.body.floor_id;
    var section_id = req.body.section_id;
    console.log(location_id);
    
    var resource = {
        location_id,
        resource_type,
        floor_id,
        section_id
    };
    
    models.Resource.create(resource).then(function(resource) {
                    res.location(`/api/v1/resources/${resource.resource_id}`);
                    res.status(201).send(null);
                }).catch(Sequelize.ValidationError, function(err) {
                    res.status(400).send({ errors: err.errors });
                });
  });

  app.put("/api/v1/resources/:resource_id", function(req, res) {
    var resource_id = req.params.resource_id;
    var location_id = req.body.location_id;
    var resource_type = req.body.resource_type;
    console.log(resource_id);
    
    var locator = { location_id: location_id };
    var res_type = { resource_type: resource_type };
    var selector = { where: { resource_id: resource_id }};
    
    models.Resource.update(selector).then(function(resource){
                    res.status(200).send(resource);
                }).catch(Sequelize.ValidationError, function(err) {
                    res.status(401).send({ errors: err.errors });
                });
  });

  //TODO 
  app.delete("/api/v1/resources/:resource_id", function(req, res){
    
  });
}
