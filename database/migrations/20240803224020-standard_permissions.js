'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Aqui você pode escrever o script SQL que deseja executar
    const sqlScript = `
    insert into tb_permissions select 1,'Criar usuário','CRUD Menu Usuário',true,5,now(),now();
    insert into tb_permissions select 2,'Deletar usuário','CRUD Menu Usuário',true,5,now(),now();
    insert into tb_permissions select 3,'Editar usuário','CRUD Menu Usuário',true,5,now(),now();
    insert into tb_permissions select 4,'Ler usuário','CRUD Menu Usuário',true,5,now(),now();
    insert into tb_permissions select 5,'Criar menu','CRUD Menu',true,4,now(),now();
    insert into tb_permissions select 6,'Deletar menu','CRUD Menu',true,4,now(),now();
    insert into tb_permissions select 7,'Editar menu','CRUD Menu',true,4,now(),now();
    insert into tb_permissions select 8,'Ler menu','CRUD Menu',true,4,now(),now();
    insert into tb_permissions select 9,'Criar perfil','CRUD perfil',true,3,now(),now();
    insert into tb_permissions select 10,'Deletar perfil','CRUD perfil',true,3,now(),now();
    insert into tb_permissions select 11,'Editar perfil','CRUD perfil',true,3,now(),now();
    insert into tb_permissions select 12,'Ler perfil','CRUD perfil',true,3,now(),now();
    insert into tb_permissions select 13,'Criar permissão','CRUD permissão',true,2,now(),now();
    insert into tb_permissions select 14,'Deletar permissão','CRUD permissão',true,2,now(),now();
    insert into tb_permissions select 15,'Editar permissão','CRUD permissão',true,2,now(),now();
    insert into tb_permissions select 16,'Ler permissão','CRUD Menu menu',true,2,now(),now();
    insert into tb_permissions select 17,'Home, Acesso ao portal','Configuração para acesso ao portal do cliente',true,2,now(),now();
    SELECT SETVAL('public.tb_permissions_pms_id_seq', 18, false);
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