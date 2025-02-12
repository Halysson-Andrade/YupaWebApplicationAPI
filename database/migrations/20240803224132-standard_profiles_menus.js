'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Aqui você pode escrever o script SQL que deseja executar
    const sqlScript = `
    insert into tb_profiles_menus  select 1, 1, 1, now(),now();
    SELECT SETVAL('public.tb_profiles_menus_prfm_id_seq', 2, false);
    `;
    
    // Execute o script usando queryInterface.sequelize.query()
    await queryInterface.sequelize.query(sqlScript);
  },

  down: async (queryInterface, Sequelize) => {
    const sqlScript = `
    `;
    
    // Execute o script usando queryInterface.sequelize.query()
    await queryInterface.sequelize.query(sqlScript);
  }
};