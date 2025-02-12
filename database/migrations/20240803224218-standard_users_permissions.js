'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Aqui você pode escrever o script SQL que deseja executar
    const sqlScript = `
    insert into tb_users_permissions select 1,1,1,now(),now();
    insert into tb_users_permissions select 2,1,2,now(),now();
    insert into tb_users_permissions select 3,1,3,now(),now();
    insert into tb_users_permissions select 4,1,4,now(),now();
    insert into tb_users_permissions select 5,1,5,now(),now();
    insert into tb_users_permissions select 6,1,6,now(),now();
    insert into tb_users_permissions select 7,1,7,now(),now();
    insert into tb_users_permissions select 8,1,8,now(),now();
    insert into tb_users_permissions select 9,1,9,now(),now();
    insert into tb_users_permissions select 10,1,10,now(),now();
    insert into tb_users_permissions select 11,1,11,now(),now();
    insert into tb_users_permissions select 12,1,12,now(),now();
    insert into tb_users_permissions select 13,1,13,now(),now();
    insert into tb_users_permissions select 14,1,14,now(),now();
    insert into tb_users_permissions select 15,1,15,now(),now();
    insert into tb_users_permissions select 16,1,16,now(),now();
    insert into tb_users_permissions select 17,1,17,now(),now();
    SELECT SETVAL('public.tb_users_permissions_usrp_id_seq', 18, false);
    ALTER TABLE tb_users_permissions
    DROP CONSTRAINT IF EXISTS tb_users_permissions_usr_id_fkey;
    ALTER TABLE tb_users_permissions
    ADD CONSTRAINT tb_users_permissions_usr_id_fkey
    FOREIGN KEY (usr_id)
    REFERENCES tb_users (usr_id)
    ON DELETE CASCADE;
    `;

    // Execute o script usando queryInterface.sequelize.query()
    await queryInterface.sequelize.query(sqlScript);
  },

  down: async (queryInterface, Sequelize) => {
    const sqlScript = `
        delete from tb_users_permissions;
        delete from tb_profiles_menus;
        delete from tb_permissions;
        delete from tb_menu_items;
        delete from tb_users;
        delete from tb_users_permissions;
    `;

    // Execute o script usando queryInterface.sequelize.query()
    await queryInterface.sequelize.query(sqlScript);
  }
};