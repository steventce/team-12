'use strict';

var moment = require('moment');

const MAX_DAYS_IN_ADVANCE = 30;
const MAX_RANGE_RESERVE_HR = 120;


module.exports = function(sequelize, DataTypes) {
  var Reservation = sequelize.define('Reservation', {
    reservation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    resource_id: {
      type: DataTypes.INTEGER,
    },
    staff_id: {
      type: DataTypes.STRING(10)
    },
    staff_name: {
      type: DataTypes.STRING(30)
    },
    staff_department: {
      type: DataTypes.STRING(30)
    },
    staff_email: {
      type: DataTypes.STRING(50)
    },
    start_date: {
      type: DataTypes.DATE,
    },
    
    end_date: {
      type: DataTypes.DATE,      
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
        Reservation.belongsTo(models.Resource, {
          foreignKey: 'resource_id'
        });
      }
    },
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return Reservation;
}
