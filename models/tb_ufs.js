const { Sequelize, Model, DataTypes } = require("sequelize");

class tb_ufs extends Model {
  static init(sequelize) {
    super.init(
      {
        uf_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        uf_code: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        uf_state: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        uf_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        uf_ibge_code: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        uf_region: {
          type: Sequelize.STRING,
          allowNull: false
        },
        uf_created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        uf_updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
      },
      {
        sequelize,
        timestamps: true, // Habilitando os campos de data de criação e atualização
        underscored: true, // Use snake_case para nomes de tabelas e colunas
        createdAt: 'uf_created_at', // Renomeando o campo createdAt para ctr_createdAt
        updatedAt: 'uf_updated_at', // Renomeando o campo updatedAt para ctr_updatedAt
        tableName: 'tb_ufs',
        schema: 'public',
      }
    );
    return this;
  }
  static associate(models) {
  }
}

module.exports = tb_ufs;