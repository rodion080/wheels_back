"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("filesTypes", [
      {
        id: 1,
        name: "Users"
      },
      {
        id: 2,
        name: "Journeys"
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("filesTypes", null, {});
  }
};
