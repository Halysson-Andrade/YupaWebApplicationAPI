'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   up: async (queryInterface, Sequelize)=> {
    return queryInterface.addColumn('tb_ufs','uf_days', { 
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  },

  down: async (queryInterface, Sequelize)=> {
    return queryInterface.removeColumn('tb_ufs','uf_days');
  }
};
