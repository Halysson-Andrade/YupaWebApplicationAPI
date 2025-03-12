'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const sqlInsertMenus = `    
    insert into tb_menu_items (mnu_id, mnu_label, mnu_icon, mnu_parent, mnu_routerlink, mnu_li_app_menuitem, mnu_class,mnu_created_at,mnu_updated_at,read)   
      values 
      (12,'Cadastros',NULL,NULL,'/','','',now(),now(),1),
      (13,'UF','ph-bold ph-city',12,'/ufs','','',now(),now(),1),
      (14,'Documents','ph-bold ph-file',12,'/documents','','',now(),now(),1);
    `;

    const sqlInsertProfile = `    
    insert into tb_profiles_menus (prfm_id, prf_id, mnu_parent_id, prfm_created_at, prfm_updated_at) 
    values 
      (4, 1, 12, now(), now());
  `;
    const sqlInsertPermissions = `    
      insert into tb_permissions (pms_id, pms_action, pms_description, pms_status, pms_status_mnu, pms_created_at, pms_updated_at) 
      values 
        (35, 'Create UF', 'CRUD UF', true, 13, now(), now()),
        (36, 'Read UF', 'CRUD UF', true, 13, now(), now()),
        (37, 'Update UF', 'CRUD UF', true, 13, now(), now()),
        (38, 'Delete UF', 'CRUD UF', true, 13, now(), now()),

        (39, 'Create Documents', 'CRUD Documents', true, 14, now(), now()),
        (40, 'Read Documents', 'CRUD Documents', true, 14, now(), now()),
        (41, 'Update Documents', 'CRUD Documents', true, 14, now(), now()),
        (42, 'Delete Documents', 'CRUD Documents', true, 14, now(), now());
    `;

    const sqlInsertUserPermissions = `
      insert into tb_users_permissions (usrp_id, usr_id, pms_id, usrp_created_at, usrp_updated_at)
      values 
        (271, 1, 35, now(), now()),
        (272, 1, 36, now(), now()),
        (273, 1, 37, now(), now()),
        (274, 1, 38, now(), now()),
        (275, 1, 39, now(), now()),
        (276, 1, 40, now(), now()),
        (277, 1, 41, now(), now()),
        (278, 1, 42, now(), now());
    `;

    await queryInterface.sequelize.query(sqlInsertMenus);
    await queryInterface.sequelize.query("SELECT SETVAL('public.tb_menu_items_mnu_id_seq', 15, false);");
    
    await queryInterface.sequelize.query(sqlInsertProfile);
    await queryInterface.sequelize.query("SELECT SETVAL('public.tb_profiles_prf_id_seq', 4, false);");
    
    await queryInterface.sequelize.query(sqlInsertPermissions);
    await queryInterface.sequelize.query("SELECT SETVAL('public.tb_permissions_pms_id_seq', 43, false);");

    await queryInterface.sequelize.query(sqlInsertUserPermissions);
    await queryInterface.sequelize.query("SELECT SETVAL('public.tb_users_permissions_usrp_id_seq', 279, false);");
  },

  down: async (queryInterface, Sequelize) => {
    const sqlDeleteUserMenus = `
      DELETE FROM tb_menu_items WHERE mnu_id IN (12,13,14);
    `;
    const sqlDeleteUserProfiles = `
      DELETE FROM tb_profiles_menus WHERE prfm_id IN (3);
    `;

    const sqlDeletePermissions = `
      DELETE FROM tb_permissions WHERE pms_id IN (35,36,37,38,39,40,41,42);
    `;

    const sqlDeleteUserPermissions = `
      DELETE FROM tb_users_permissions WHERE usrp_id IN (271,273,274,275,276,277,278);
    `;

    
    await queryInterface.sequelize.query(sqlDeleteUserMenus);
    await queryInterface.sequelize.query(sqlDeleteUserProfiles);
    await queryInterface.sequelize.query(sqlDeleteUserPermissions);
    await queryInterface.sequelize.query(sqlDeletePermissions);
  }
};
