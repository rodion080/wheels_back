'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('files', {
      uuid: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
      },
      mime: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
      },
      ext: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
      },
      fileHubId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'filesHub',
          },
          key: 'id'
        },
        allowNull: false
      },
    });
  },
  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('files');
  }
};
