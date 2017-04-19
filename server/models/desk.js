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
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Floor cannot be blank' }
      }
    },
    section: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Section cannot be blank' }
      }
    },
    desk_number: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Desk number cannot be blank' },
        // Validate unique desk numbers per location
        isUnique: function(value, next) {
          var Resource = require('./').Resource;
          var resource_id = this.resource_id

          if (!value && value !== 0) {
            next();
          }

          if (!this.isNewRecord) {
            this.getResource()
              .then(function(resource) {
                if (value) {
                  return Desk.findAll({
                    where: {
                      desk_number: value
                    },
                    include: [{
                      model: Resource,
                      where: {
                        location_id: resource.location_id
                      }
                    }]
                  });
                }
              }).then(function(desks) {
                if (desks.length > 0) {
                  next('Desk number already exists at this location');
                } else {
                  next();
                }
              });
          } else {
            next();
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
