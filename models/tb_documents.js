const { Sequelize, Model, DataTypes } = require("sequelize");

class tb_documents extends Model {
  static init(sequelize) {
    super.init(
      {
        doc_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        uf_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'tb_ufs', // Nome da tabela referenciada
            key: 'uf_id', // Nome da coluna referenciada
          },
        },
        doc_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        doc_description: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        doc_type: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        uf_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        doc_created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        doc_updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
      },
      {
        sequelize,
        timestamps: true, // Habilitando os campos de data de criação e atualização
        underscored: true, // Use snake_case para nomes de tabelas e colunas
        createdAt: 'doc_created_at', // Renomeando o campo createdAt para ctr_createdAt
        updatedAt: 'doc_updated_at', // Renomeando o campo updatedAt para ctr_updatedAt
        tableName: 'tb_documents',
        schema: 'public',
      }
    );
    return this;
  }
  static associate(models) {
  }
}

module.exports = tb_documents;