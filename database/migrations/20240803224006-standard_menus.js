'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Aqui você pode escrever o script SQL que deseja executar
    const sqlScript = `
    insert into tb_menu_items select 1,'Seguranca',NULL,NULL,'/','','',now(),now();
    insert into tb_menu_items select 2,'Permissao','ph-bold ph-gear-six',1,'/permissions','','',now(),now();
    insert into tb_menu_items select 3,'Perfis','ph-bold ph-user-circle-check',1,'/profiles','','',now(),now();
    insert into tb_menu_items select 4,'Menus','ph-bold ph-list',1,'/menus','','',now(),now();
    insert into tb_menu_items select 5,'Usuarios','ph-bold ph-user',1,'/users','','',now(),now();
    SELECT SETVAL('public.tb_menu_items_mnu_id_seq', 6, false);
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