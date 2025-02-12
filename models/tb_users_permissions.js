const { Sequelize, Model, DataTypes } = require("sequelize");

class tb_users_permissions extends Model {
  static init(sequelize) {
    super.init(
      {
        usrp_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        usr_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'tb_users', // Nome da tabela referenciada
            key: 'usr_id', // Nome da coluna referenciada
          },
        },
        pms_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'tb_permissions', // Nome da tabela referenciada
            key: 'pms_id', // Nome da coluna referenciada
          },
        },
        usrp_created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        usrp_updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
      },
      {
        sequelize,
        timestamps: true, // Habilitando os campos de data de criação e atualização
        underscored: true, // Use snake_case para nomes de tabelas e colunas
        createdAt: 'usrp_created_at', // Renomeando o campo createdAt para ctr_createdAt
        updatedAt: 'usrp_updated_at', // Renomeando o campo updatedAt para ctr_updatedAt
        tableName: 'tb_users_permissions',
        schema: 'public',
      }
    );
    return this;
  }
  static associate(models) {
    this.belongsTo(models.tb_users, {
      foreignKey: 'usr_id',
      onDelete: 'CASCADE', // Certifique-se de que está configurado aqui também
    });
    this.belongsTo(models.tb_permissions, { foreignKey: 'pms_id' });
  }
}

module.exports = tb_users_permissions;