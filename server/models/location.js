'use strict';

module.exports = function(sequelize, DataTypes) {
  var Location = sequelize.define('Location', {
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      field: 'location_id',
      primaryKey: true
    },
    building_name: {
      type: DataTypes.STRING(50),
      field: 'building_name'
    },
    street_name: {
      type: DataTypes.STRING(50),
      field: 'street_name'
    },
    city: {
      type: DataTypes.STRING(30)
    },
    province_state: {
      type: DataTypes.STRING(10),
      field: 'province_state'
    },
    postal_code: {
      type: DataTypes.STRING(10),
      field: 'postal_code'
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
        Location.hasMany(models.Resource, {
          foreignKey: 'location_id'
        });
      }
    },
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return Location;
}
