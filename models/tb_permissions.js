const { Sequelize, Model, DataTypes } = require("sequelize");

class tb_permissions extends Model {
  static init(sequelize) {
    super.init(
      {
        pms_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        pms_action: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        pms_description: {
          type: Sequelize.STRING,
        },
        pms_status: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        pms_status_mnu: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'tb_menu_items', // Nome da tabela referenciada
            key: 'mnu_id', // Nome da coluna referenciada
          },
        },
        pms_created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        pms_updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
      },
      {
        sequelize,
        timestamps: true, // Habilitando os campos de data de criação e atualização
        underscored: true, // Use snake_case para nomes de tabelas e colunas
        createdAt: 'pms_created_at', // Renomeando o campo createdAt para ctr_createdAt
        updatedAt: 'pms_updated_at', // Renomeando o campo updatedAt para ctr_updatedAt
        tableName: 'tb_permissions',
        schema: 'public',
      }
    );
    return this;
  }
  static associate(models) {
    this.hasMany(models.tb_users_permissions, {
      foreignKey: 'pms_id',
    });
  }
}

module.exports = tb_permissions;