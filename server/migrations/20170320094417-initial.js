/**
 * Generate schema from existing database SQL files.
 *
 * Code adapted from:
 * Nestor Magalhaes, commentor on:
 * http://bulkan-evcimen.com/using_sequelize_migrations_with_an_existing_database.html
 */

'use strict';

var Promise = require('bluebird'),
    fs = require('fs');

var files = [
  'admins.sql',
  'locations.sql',
  'resource_types.sql',
  'resources.sql',
  'desks.sql',
  'reservations.sql'
];

function setReadFiles(files) {
  var queryQueue = [];

  for (var i = 0; i < files.length; i++) {
    queryQueue.push(function(i) {
      return function() {
        console.log('Reading ' + __dirname + '/sql/' + files[i]);
        return fs.readFileSync(__dirname + '/sql/' + files[i], 'utf-8');
      };
    }(i));
  }

  return queryQueue;
}

module.exports = {
  up: function (queryInterface, Sequelize) {
    var queryQueue = setReadFiles(files);
    return Promise
      .resolve()
      .then(function() {
        return Promise.each(queryQueue, function(item) {
          return queryInterface.sequelize.query(item());
        });
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('reservations')
      .then(function() {
        return queryInterface.dropTable('desks');
      })
      .then(function() {
        return queryInterface.dropTable('resources');
      })
      .then(function() {
        return queryInterface.dropTable('admins');
      })
      .then(function() {
        return queryInterface.dropTable('resource_types');
      })
      .then(function() {
        return queryInterface.dropTable('locations');
      });
  }
};
