'use strict';

module.exports = function(sequelize, DataTypes) {
  var Resource = sequelize.define('Resource', {
    resource_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    location_id: {
      type: DataTypes.INTEGER,
    },
    resource_type: {
      type: DataTypes.STRING(10),
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
        Resource.belongsTo(models.Location, {
          foreignKey: 'location_id'
        });
        Resource.belongsTo(models.ResourceType, {
          foreignKey: 'resource_type'
        });
        Resource.hasOne(models.Desk, {
          foreignKey: 'resource_id'
        });
        Resource.hasMany(models.Reservation, {
          foreignKey: 'resource_id'
        });
      }
    },
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return Resource;
}
