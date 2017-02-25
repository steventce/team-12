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
      validate: {
            maxDuration: function(){
              var start_date_ = moment(this.start_date);
              var end_date_ = moment(this.end_date);
              
              var time_diff = moment.duration(end_date_.diff(start_date_));
              
              var diff_hour = time_diff.asHours();
              if (diff_hour > MAX_RANGE_RESERVE_HR){
                  throw new Error(
                  `Reservation cannot be made for more than ${MAX_RANGE_RESERVE_HR} hours (5 days)`
                );
            }
          }
      }
    },
    end_date: {
      type: DataTypes.DATE,
      validate: {
        maxEndDate: function() {
          var end_date = moment(this.end_date);
          var max_end_date = moment().add(MAX_DAYS_IN_ADVANCE, 'd');

          if (end_date.isAfter(max_end_date, 'hour')) {
            throw new Error(
              `Reservation cannot be made for more than ${MAX_DAYS_IN_ADVANCE} days in advance`
            );
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
