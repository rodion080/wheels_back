'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('filesHub', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      fileTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'filesTypes',
          },
          key: 'id'
        },
        allowNull: false
      },
    });
  },
  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('filesHub');
  }
};
