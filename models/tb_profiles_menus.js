const { Sequelize, Model, DataTypes } = require("sequelize");

class tb_profiles_menus extends Model {
  static init(sequelize) {
    super.init(
      {
        prfm_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        prf_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'tb_profiles', // Nome da tabela referenciada
            key: 'usr_id', // Nome da coluna referenciada
          },
        },
        mnu_parent_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'tb_menu_items', // Nome da tabela referenciada
            key: 'mnu_id', // Nome da coluna referenciada
          },
        },
        prfm_created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        prfm_updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
      },
      {
        sequelize,
        timestamps: true, // Habilitando os campos de data de criação e atualização
        underscored: true, // Use snake_case para nomes de tabelas e colunas
        createdAt: 'prfm_created_at', // Renomeando o campo createdAt para ctr_createdAt
        updatedAt: 'prfm_updated_at', // Renomeando o campo updatedAt para ctr_updatedAt
        tableName: 'tb_profiles_menus',
        schema: 'public',
      }
    );
    return this;
  }
  static associate(models) {
    this.hasMany(models.tb_profiles, { foreignKey: 'usr_id' });
    this.hasMany(models.tb_menu_items, { foreignKey: 'mnu_id'});
  }
}

module.exports = tb_profiles_menus;