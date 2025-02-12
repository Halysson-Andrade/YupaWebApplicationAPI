'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('tb_menu_items', 'read', { 
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1, // Define o valor padrão como 1
      references: {
        model: 'tb_permissions', // Nome da tabela referenciada
        key: 'pms_id', // Nome da coluna referenciada
      },
      onUpdate: 'CASCADE', // Adiciona comportamento em cascata opcional
      onDelete: 'SET NULL', // Adiciona comportamento em cascata opcional
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('tb_menu_items', 'read');
  }
};
