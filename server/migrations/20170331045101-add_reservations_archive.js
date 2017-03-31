'use strict';

var Promise = require('bluebird'),
    fs = require('fs');

module.exports = {
  up: function (queryInterface, Sequelize) {
    var filePath = __dirname + '/sql/' + 'reservations_archive.sql'
    return Promise
      .resolve()
      .then(function() {
        return fs.readFileSync(filePath, 'utf-8');
      })
      .then(function(query) {
        queryInterface.sequelize.query(query);
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('reservations_archive');
  }
};
