'use strict';

module.exports = function(sequelize, DataTypes) {
  var ResourceType = sequelize.define('ResourceType', {
    resource_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
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
        ResourceType.hasMany(models.Resource, {
          foreignKey: 'resource_type'
        });
      }
    },
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return ResourceType;
}
