'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable("contacts", { 
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,        
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull:false,
        
      },
      email: {
        type: Sequelize.STRING,
        allowNull:false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,

      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "customers",
          key: "id"
      },
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    }}); 
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable("contacts");
  }
};
