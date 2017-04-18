var Sequelize = require('sequelize'),
    moment    = require('moment'),
    models    = require('../models');

var RESOURCE_TYPE = {
  DESK: 'Desk'
}

module.exports = function(app) {

  /**
   * Get all the resources in a location (reserved or unreserved). If reserved,
   * get the current reservation information.
   * @param {Number} location_id - The location id of the HSBC building
   */
  app.get('/api/v1/locations/:location_id/admin/resources', function(req, res) {
    var location_id = req.params.location_id;
    models.Resource.findAll({
      raw: true,
      where: {
        location_id
      },
      include: [
        {
          model: models.Desk,
          required: false,
          attributes: {
            exclude: ['created_at', 'updated_at', 'resource_id']
          }
        },
        {
          model: models.Reservation,
          required: false,
          attributes: {
            exclude: ['updated_at', 'reservation_id']
          },
          where: {
            start_date: {
              $lte: moment().toDate()
            },
            end_Date: {
              $gt: moment().toDate()
            }
          }
        }
      ]
    }).then(function(resources) {
      res.status(200).json(resources);
    });
  });

  /**
   * Get all the available resources in a location (not reserved at a particular time)
   * according to the filters
   * @param {Number} location_id - The location id of the HSBC building
   * @param {String} resource_type - The type of resource (i.e 'Desk')
   * @param {Number} floor - The floor the resource is located in
   * @param {String} section - The section the resource is located in
   * @param {Date} start_date - The starting date of the desired reservation
   * @param {Date} end_date - The ending date of the desired reservation
   */
  app.get('/api/v1/locations/:location_id/resources', function(req, res) {
    var location_id = req.params.location_id;
    var resource_type = req.query.resource_type;
    var floor = req.query.floor;
    var section = req.query.section;
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;

    deskQuery = {};
    if (floor) deskQuery['floor'] = floor;
    if (section) deskQuery['section'] = section;

    // Gets resources where there doesn't exist any reservations
    // for that resource that falls in the desired request's interval
    models.Resource.findAll({
      attributes: ['resource_id', 'location_id', 'resource_type'],
      include: [
      {
        model: models.Reservation,
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
        model: models.Desk,
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
       res.status(200).json(resources);
    }).catch(Sequelize.ValidationError, function(err) {
      res.status(400).json({ errors: err.errors });
    });
  });

  /**
   * Add a new resource to a location
   * @param {Number} location_id - Location id of the building
   * @param {String} resource_type - The type of the resource to be edited
   * @param {Object} resource - The resource object containing the below fields
   * - @param {Number} floor - The floor of the resource
   * - @param {String} section - The section of the resource
   * - @param {Number} desk_number - Only the new desk number
   */
  app.post('/api/v1/locations/:location_id/resources', function(req, res) {
    var location_id = req.params.location_id;
    var floor = req.body.resource.floor;
    var section = req.body.resource.section;
    var desk_number = req.body.resource.desk_number;
    var staff_id = req.body.staff_id;
    var desk = {
      floor,
      section,
      desk_number: `${floor}.${section}.${desk_number}`
    }
    var resource = {
      location_id,
      resource_type: req.body.resource_type,
      Desk: desk
    };
    models.Admin.findAll({
      where: { admin_id: staff_id}
    }).then(function(admins) {
      if (admins.length == 0) {
        res.status(401).json('User needs to be admin to add resources');
        return;
      } else {
        if (req.body.resource_type === RESOURCE_TYPE.DESK) {
          models.Resource.find({
            where: {
              location_id
            },
            include: [{
              model: models.Desk,
              where: {
                desk_number: desk.desk_number
              }
            }]
          }).then(function(db_resource) {
            if (db_resource) {
              throw new Sequelize.ValidationError('', [
                {
                  message: 'Desk number already exists at this location',
                  path: 'desk_number',
                  type: 'Validation error'
                }
              ]);
            }
            return models.Resource.create(resource, {
              include: [ models.Desk ]
            });
          }).then(function(resource) {
            res.location(`/api/v1/locations/${location_id}/resources/${resource.resource_id}`);
            res.status(201).json(null);
          }).catch(Sequelize.ValidationError, function(err) {
            res.status(400).json({ errors: err.errors });
          });
        } else {
          res.status(400).json(null);
        }
      }
    });
  });

  /**
   * Edit a particular resource
   * @param {Number} resource_id - The id of the resource to be edited
   * @param {String} resource_type - The type of the resource to be edited
   * @param {Object} resource - The resource object containing the below fields
   * - @param {Number} floor - The floor of the resource
   * - @param {String} section - The section of the resource
   * - @param {Number} desk_number - Only the new desk number
   */
  app.put('/api/v1/resources/:resource_id', function(req, res) {
    var resource_id = req.params.resource_id;
    var resource = req.body.resource || {};
    var staff_id = req.body.staff_id;

    var fieldsToUpdate = {
      resource_id: resource_id, // Used for model validation
      floor: resource.floor,
      section: resource.section,
      desk_number: `${resource.floor}.${resource.section}.${resource.desk_number}`
    }

    var selector = { where: { resource_id } };

    models.Admin.findAll({
      where: { admin_id: staff_id}
    }).then(function(admins) {
      if (admins.length == 0) {
        res.status(401).json('User needs to be admin to edit resources');
        return;
      } else {
        if (req.body.resource_type === RESOURCE_TYPE.DESK) {
          models.Desk
            .find(selector)
            .then(function(desk) {
              if (desk) {
                return desk.updateAttributes(fieldsToUpdate);
              } else {
                res.status(400).json(null);
              }
            })
            .then(function(desk) {
              res.status(200).json(null);
            }).catch(Sequelize.ValidationError, function(err) {
              res.status(400).json({ errors: err.errors });
            });
        } else {
          res.status(400).json(null);
        }
      } 
    });

  });

  /**
   * Delete a particular resource
   * @param {Number} resource_id - The resource id of the resource to be deleted
   */
  app.delete('/api/v1/resources/:resource_id', function(req, res) {
    var resource_id = req.params.resource_id;
    var staff_id = req.body.staff_id;
    models.Admin.findAll({
      where: { admin_id: staff_id}
    }).then(function(admins) {
      if (admins.length == 0) {
        res.status(401).json('User needs to be admin to delete resources');
        return;
      } else {
        models.Resource.destroy({
          where: {
            resource_id: resource_id
          }
        }).then(function(affectedRows) {
          res.status(200).json(null);
        }).catch(Sequelize.ValidationError, function(err) {
          res.status(400).json({ errors: err.errors });
        });
      }
    });

  });
}
