const { Sequelize, Model, DataTypes } = require("sequelize");

class tb_users extends Model {
  static init(sequelize) {
    super.init(
      {
        usr_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        usr_email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        usr_profile:{
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'tb_profiles', // Nome da tabela referenciada
            key: 'prf_id', // Nome da coluna referenciada
          },
        },
        usr_password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        usr_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        usr_activationcode: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        usr_activated: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        usr_changepassword: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        usr_status: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        usr_created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        usr_updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
      },
      {
        sequelize,
        timestamps: true, // Habilitando os campos de data de criação e atualização
        underscored: true, // Use snake_case para nomes de tabelas e colunas
        createdAt: 'usr_created_at', // Renomeando o campo createdAt para ctr_createdAt
        updatedAt: 'usr_updated_at', // Renomeando o campo updatedAt para ctr_updatedAt
        tableName: 'tb_users',
        schema: 'public',
      }
    );
    return this;
  }
  static associate(models) {
    this.hasMany(models.tb_users_permissions, {
      foreignKey: 'usr_id',
      onDelete: 'CASCADE', // Define o comportamento de exclusão em cascata
    });
  }
}

module.exports = tb_users;