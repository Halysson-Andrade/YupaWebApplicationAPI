'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   up: async (queryInterface, Sequelize)=> {
    return queryInterface.addColumn('tb_imports_datas','impd_uf_transfer', { 
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize)=> {
    return queryInterface.removeColumn('tb_imports_datas','impd_uf_transfer');
  }
};
