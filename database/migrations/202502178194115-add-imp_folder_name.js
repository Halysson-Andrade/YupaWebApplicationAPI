'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   up: async (queryInterface, Sequelize)=> {
    return queryInterface.addColumn('tb_imports','imp_folder_name', { 
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize)=> {
    return queryInterface.removeColumn('tb_imports','imp_folder_name');
  }
};
