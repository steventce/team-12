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
