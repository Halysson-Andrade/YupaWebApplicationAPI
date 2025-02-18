module.exports = {
  up(queryInterface, Sequelize) {

    return queryInterface.createTable('tb_imports_datas', {
      impd_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      imp_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_imports', // Nome da tabela referenciada
          key: 'imp_id', // Nome da coluna referenciada
        },
      },
      car_plate:{
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'tb_cars', // Nome da tabela referenciada
          key: 'car_plate', // Nome da coluna referenciada
        },
      },
      impd_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      impd_start_date: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      impd_target_date: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      impd_complete_kit: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      impd_restrition: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      impd_debit: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      impd_sale_com: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      impd_vistory_complete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      impd_saler_pending: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      impd_crlv_avaible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      impd_plate_change: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      impd_created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      impd_updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },
  async down(queryInterface) {
    return queryInterface.dropTable('tb_imports_datas');
  }
};
