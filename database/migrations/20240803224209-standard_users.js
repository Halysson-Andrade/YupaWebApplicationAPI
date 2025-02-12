'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Aqui você pode escrever o script SQL que deseja executar
    const sqlScript = `
    insert into tb_users
    select 1,'yupa@adm',1,'$2b$10$hVCxtoOpvK9T73UJIEpNEOeMu4Y.iNJBK1LCbUa81WN6MrZDUDPY.','administrador','Yupa@adm!',true,true,true, now(),now()
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