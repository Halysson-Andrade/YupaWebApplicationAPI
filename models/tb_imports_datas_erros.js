const { Sequelize, Model, DataTypes } = require("sequelize");

class tb_imports_datas_erros extends Model {
  static init(sequelize) {
    super.init(
      {
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
      },
      {
        sequelize,
        timestamps: true, // Habilitando os campos de data de criação e atualização
        underscored: true, // Use snake_case para nomes de tabelas e colunas
        createdAt: 'impd_created_at', // Renomeando o campo createdAt para ctr_createdAt
        updatedAt: 'impd_updated_at', // Renomeando o campo updatedAt para ctr_updatedAt
        tableName: 'tb_imports_datas_erros',
        schema: 'public',
      }
    );
    return this;
  }
  static associate(models) {
  }
}

module.exports = tb_imports_datas_erros;