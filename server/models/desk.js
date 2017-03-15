'use strict';

module.exports = function(sequelize, DataTypes) {
  var Desk = sequelize.define('Desk', {
    resource_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    floor: {
      type: DataTypes.STRING(10)
    },
    section: {
      type: DataTypes.STRING(10)
    },
    desk_number: {
      type: DataTypes.STRING(10),
      validate: {
        // Validate unique desk numbers per location
        isUnique: function(value, next) {
          var Resource = require('./').Resource;
          var resource_id = this.resource_id
          if (value) {
            Desk.findAll({
              where: {
                desk_number: value
              },
              include: [Resource]
            }).then(function(desks) {
              // Get the taken location ids
              return desks.map(function(desk) {
                return desk.Resource.location_id;
              });
            }).then(function(location_ids) {
              return Resource.find({
                where: {
                  $and: [
                    { resource_id },
                    { location_id: { $in: location_ids }}
                  ]
                }
              });
            }).then(function(resource) {
              if (resource) {
                next('Desk number already exists at this location');
              } else {
                next();
              }
            });
          }
        }
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    classMethods: {
      associate: function(models) {
        Desk.belongsTo(models.Resource, {
          foreignKey: 'resource_id'
        });
      }
    },
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return Desk;
}
