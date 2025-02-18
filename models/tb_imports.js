const { Sequelize, Model, DataTypes } = require("sequelize");

class tb_imports extends Model {
  static init(sequelize) {
    super.init(
      {
        imp_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        imp_status: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        imp_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        imp_container_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        imp_blob_path: {
          type: Sequelize.STRING,
        },
        imp_created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        imp_updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
      },
      {
        sequelize,
        timestamps: true, // Habilitando os campos de data de criação e atualização
        underscored: true, // Use snake_case para nomes de tabelas e colunas
        createdAt: 'imp_created_at', // Renomeando o campo createdAt para ctr_createdAt
        updatedAt: 'imp_updated_at', // Renomeando o campo updatedAt para ctr_updatedAt
        tableName: 'tb_imports',
        schema: 'public',
      }
    );
    return this;
  }
  static associate(models) {
  }
}

module.exports = tb_imports;