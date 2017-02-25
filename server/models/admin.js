'use strict';

module.exports = function(sequelize, DataTypes) {
  var Admin = sequelize.define('Admin', {
    admin_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(30)
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
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return Admin;
}
