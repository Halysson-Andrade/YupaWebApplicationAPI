const { Sequelize, Model, DataTypes } = require("sequelize");

class tb_imports_relation_columns extends Model {
  static init(sequelize) {
    super.init(
      {
        impr_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        impr_column_db: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        impr_column_plan: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        impr_created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        impr_updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
      },
      {
        sequelize,
        timestamps: true, // Habilitando os campos de data de criação e atualização
        underscored: true, // Use snake_case para nomes de tabelas e colunas
        createdAt: 'impr_created_at', // Renomeando o campo createdAt para ctr_createdAt
        updatedAt: 'impr_updated_at', // Renomeando o campo updatedAt para ctr_updatedAt
        tableName: 'tb_imports_relation_columns',
        schema: 'public',
      }
    );
    return this;
  }
  static associate(models) {
  }
}

module.exports = tb_imports_relation_columns;