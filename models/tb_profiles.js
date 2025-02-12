const { Sequelize, Model, DataTypes } = require("sequelize");

class tb_profiles extends Model {
  static init(sequelize) {
    super.init(
      {
        prf_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        prf_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        prf_description: {
          type: Sequelize.STRING,
        },
        prf_status: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        prf_created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        prf_updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
      },
      {
        sequelize,
        timestamps: true, // Habilitando os campos de data de criação e atualização
        underscored: true, // Use snake_case para nomes de tabelas e colunas
        createdAt: 'prf_created_at', // Renomeando o campo createdAt para ctr_createdAt
        updatedAt: 'prf_updated_at', // Renomeando o campo updatedAt para ctr_updatedAt
        tableName: 'tb_profiles',
        schema: 'public',
      }
    );
    return this;
  }
  static associate(models) {
  }
}

module.exports = tb_profiles;