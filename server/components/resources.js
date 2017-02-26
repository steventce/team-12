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
            { '$Reservations.start_date$': { $lte: end_date } }
          ]
        }
      },
      {
        // TODO: Change the model dynamically from the resource type
        model: Desk,
        attributes: ['floor', 'section', 'desk_number'],
        where: {
          floor,
          section
        }
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
}
