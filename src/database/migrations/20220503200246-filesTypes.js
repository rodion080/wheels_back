'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('filesTypes', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
    });
  },
  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('filesTypes');
  }
};
