'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('messages', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      journeyId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'journeys',
          },
          key: 'id'
        },
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id'
        },
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
    });
  },
  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('messages');
  }
};
