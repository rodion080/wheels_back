'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('user_journey', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id'
        },
        allowNull: true
      },
      journeyId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'journeys',
          },
          key: 'id'
        },
        allowNull: true
      },
    });
  },
  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('user_journey');
  }
};
