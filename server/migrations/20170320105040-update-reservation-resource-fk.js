'use strict';

var addFkQuery = `ALTER TABLE reservations ADD CONSTRAINT reservations_ibfk_1 \
FOREIGN KEY (resource_id) REFERENCES resources (resource_id) ON UPDATE CASCADE ON DELETE CASCADE;`;

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface
      .sequelize
      .query('ALTER TABLE reservations DROP FOREIGN KEY reservations_ibfk_1;')
      .then(function() {
        queryInterface
          .sequelize
          .query(addFkQuery);
      });
  },

  down: function(queryInterface, Sequelize) {
    return
      queryInterface.sequelize.query
        .query('ALTER TABLE reservations DROP FOREIGN KEY reservations_ibfk_1;')
  }
};
