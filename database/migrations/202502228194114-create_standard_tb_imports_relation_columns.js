'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Aqui você pode escrever o script SQL que deseja executar
    const sqlScript = `
    insert into tb_imports_relation_columns select 1,'impd_lote','Lote',now(),now();
    insert into tb_imports_relation_columns select 2,'car_plate','Placa',now(),now();
    insert into tb_imports_relation_columns select 3,'impd_start_date','Data Inicio',now(),now();
    insert into tb_imports_relation_columns select 4,'impd_target_date','Previsao de Conclusao',now(),now();
    insert into tb_imports_relation_columns select 5,'impd_uf_transfer','Tranferencia para UF ',now(),now();
    insert into tb_imports_relation_columns select 6,'impd_complete_kit','Kit doc Completo',now(),now();
    insert into tb_imports_relation_columns select 7,'impd_restrition','Restricoes',now(),now();
    insert into tb_imports_relation_columns select 8,'impd_debit','Debitos Veiculares',now(),now();
    insert into tb_imports_relation_columns select 9,'impd_sale_com','Comunicacao de Venda',now(),now();
    insert into tb_imports_relation_columns select 10,'impd_vistory_complete','Vistoria Veicular',now(),now();
    insert into tb_imports_relation_columns select 11,'impd_saler_pending','Pendencias Comprador',now(),now();
    insert into tb_imports_relation_columns select 12,'impd_crlv_avaible','Novo CRLV-e Disponível',now(),now();
    insert into tb_imports_relation_columns select 13,'impd_plate_change','Necessário Trocar Placa',now(),now();
    insert into tb_imports_relation_columns select 14,'impd_fineshed','Concluido',now(),now();
    
    SELECT SETVAL('public.tb_imports_relation_columns_impr_id_seq', 15, false);
    
    `;

    // Execute o script usando queryInterface.sequelize.query()
    await queryInterface.sequelize.query(sqlScript);
  },

  down: async (queryInterface, Sequelize) => {
    const sqlScript = `
        delete from tb_imports_relation_columns
    `;

    // Execute o script usando queryInterface.sequelize.query()
    await queryInterface.sequelize.query(sqlScript);
  }
};