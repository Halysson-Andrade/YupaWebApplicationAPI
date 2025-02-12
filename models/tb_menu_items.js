const { Sequelize, Model, DataTypes } = require("sequelize");

class tb_menu_items extends Model {
  static init(sequelize) {
    super.init(
      {
        mnu_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        mnu_label: {
          type: Sequelize.STRING,
        },
        mnu_icon: {
          type: Sequelize.STRING,
        },
        mnu_parent: {
          type: Sequelize.INTEGER,
        },
        mnu_routerlink: {
          type: Sequelize.STRING,
        },
        mnu_li_app_menuitem: {
          type: Sequelize.STRING,
        },
        mnu_class: {
          type: Sequelize.STRING,
        },
        mnu_created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        mnu_updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        read: {
          type: Sequelize.INTEGER,
          allowNull: false,
        }
      },
      {
        sequelize,
        timestamps: true, // Habilitando os campos de data de criação e atualização
        underscored: true, // Use snake_case para nomes de tabelas e colunas
        createdAt: 'mnu_created_at', // Renomeando o campo createdAt para ctr_createdAt
        updatedAt: 'mnu_updated_at', // Renomeando o campo updatedAt para ctr_updatedAt
        tableName: 'tb_menu_items',
        schema: 'public',
      }
    );
    return this;
  }
  static associate(models) {
  }
}

module.exports = tb_menu_items;
