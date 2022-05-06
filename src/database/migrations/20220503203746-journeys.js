'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('journeys', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      heading: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true,
        unique: false,
      },
      beginPoint: {
        type: Sequelize.JSONB,
        allowNull: false,
        unique: false,
      },
      endPoint: {
        type: Sequelize.JSONB,
        allowNull: false,
        unique: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      fileHubId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'filesHub',
          },
          key: 'id'
        },
        allowNull: true
      },
      leadId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id'
        },
        allowNull: true
      },
    });
  },
  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('journeys');
  }
};
