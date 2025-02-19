const { Sequelize, Model, DataTypes } = require("sequelize");

class tb_filters extends Model {
  static init(sequelize) {
    super.init(
      {
        flt_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        flt_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        flt_created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        flt_updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
      },
      {
        sequelize,
        timestamps: true, // Habilitando os campos de data de criação e atualização
        underscored: true, // Use snake_case para nomes de tabelas e colunas
        createdAt: 'flt_created_at', // Renomeando o campo createdAt para ctr_createdAt
        updatedAt: 'flt_updated_at', // Renomeando o campo updatedAt para ctr_updatedAt
        tableName: 'tb_filters',
        schema: 'public',
      }
    );
    return this;
  }
  static associate(models) {
  }
}

module.exports = tb_filters;