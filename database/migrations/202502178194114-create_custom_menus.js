'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const sqlInsertMenus = `    
    insert into tb_menu_items (mnu_id, mnu_label, mnu_icon, mnu_parent, mnu_routerlink, mnu_li_app_menuitem, mnu_class,mnu_created_at,mnu_updated_at,read)   
      values 
      (6,'Processos',NULL,NULL,'/','','',now(),now(),1),
      (7,'Carros','ph-bold ph-car-profile',6,'/cars','','',now(),now(),1),
      (8,'Upload','ph-bold ph-upload',6,'/uploads','','',now(),now(),1),
      (9,'DashBoards','ph-bold ph-chart-bar',6,'/charts','','',now(),now(),1),
      (10,'Listagem processos','ph-bold ph-list-magnifying-glass',6,'/processlist','','',now(),now(),1),
      (11,'Kanban','ph-bold ph-kanban',6,'/kanban','','',now(),now(),1);      
    `;

    const sqlInsertProfile = `    
    insert into tb_profiles_menus (prfm_id, prf_id, mnu_parent_id, prfm_created_at, prfm_updated_at) 
    values 
      (2, 1, 6, now(), now());
  `;
    const sqlInsertPermissions = `    
      insert into tb_permissions (pms_id, pms_action, pms_description, pms_status, pms_status_mnu, pms_created_at, pms_updated_at) 
      values 
        (18, 'Create', 'CRUD car', true, 7, now(), now()),
        (19, 'Read', 'CRUD car', true, 7, now(), now()),
        (20, 'Update', 'CRUD car', true, 7, now(), now()),
        (21, 'Delete', 'CRUD car', true, 7, now(), now()),

        (22, 'Create', 'CRUD upload', true, 8, now(), now()),
        (23, 'Read', 'CRUD upload', true, 8, now(), now()),
        (24, 'Update', 'CRUD upload', true, 8, now(), now()),
        (25, 'Delete', 'CRUD upload', true, 8, now(), now()),

        (26, 'Read', 'Leitura DashBoardsar', true, 9, now(), now()),
        
        (27, 'Create', 'CRUD Listagem', true, 10, now(), now()),
        (28, 'Read', 'CRUD Listagem', true, 10, now(), now()),
        (29, 'Update', 'CRUD Listagem', true, 10, now(), now()),
        (30, 'Delete', 'CRUD Listagem', true, 10, now(), now()),

        (31, 'Create', 'CRUD Kanban', true, 11, now(), now()),
        (32, 'Read', 'CRUD Kanban', true, 11, now(), now()),
        (33, 'Update', 'CRUD Kanban', true, 11, now(), now()),
        (34, 'Delete', 'CRUD Kanban', true, 11, now(), now());
    `;

    const sqlInsertUserPermissions = `
      insert into tb_users_permissions (usrp_id, usr_id, pms_id, usrp_created_at, usrp_updated_at)
      values 
        (18, 1, 18, now(), now()),
        (19, 1, 19, now(), now()),
        (20, 1, 20, now(), now()),
        (21, 1, 21, now(), now()),
        (22, 1, 22, now(), now()),
        (23, 1, 23, now(), now()),
        (24, 1, 24, now(), now()),
        (25, 1, 25, now(), now()),
        (26, 1, 26, now(), now()),
        (27, 1, 27, now(), now()),
        (28, 1, 28, now(), now()),
        (29, 1, 29, now(), now()),
        (30, 1, 30, now(), now()),
        (31, 1, 31, now(), now()),
        (32, 1, 32, now(), now()),
        (33, 1, 33, now(), now()),
        (34, 1, 34, now(), now());
    `;

    await queryInterface.sequelize.query(sqlInsertMenus);
    await queryInterface.sequelize.query("SELECT SETVAL('public.tb_menu_items_mnu_id_seq', 12, false);");
    
    await queryInterface.sequelize.query(sqlInsertProfile);
    await queryInterface.sequelize.query("SELECT SETVAL('public.tb_profiles_prf_id_seq', 3, false);");
    
    await queryInterface.sequelize.query(sqlInsertPermissions);
    await queryInterface.sequelize.query("SELECT SETVAL('public.tb_permissions_pms_id_seq', 35, false);");

    await queryInterface.sequelize.query(sqlInsertUserPermissions);
    await queryInterface.sequelize.query("SELECT SETVAL('public.tb_users_permissions_usrp_id_seq', 35, false);");
  },

  down: async (queryInterface, Sequelize) => {
    const sqlDeleteUserMenus = `
      DELETE FROM tb_menu_items WHERE mnu_id IN (6,7,8,9,10,11);
    `;
    const sqlDeleteUserProfiles = `
      DELETE FROM tb_profiles_menus WHERE prfm_id IN (2);
    `;

    const sqlDeletePermissions = `
      DELETE FROM tb_permissions WHERE pms_id IN (18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34);
    `;

    const sqlDeleteUserPermissions = `
      DELETE FROM tb_users_permissions WHERE usrp_id IN (18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34);
    `;

    
    await queryInterface.sequelize.query(sqlDeleteUserMenus);
    await queryInterface.sequelize.query(sqlDeleteUserProfiles);
    await queryInterface.sequelize.query(sqlDeleteUserPermissions);
    await queryInterface.sequelize.query(sqlDeletePermissions);
  }
};
