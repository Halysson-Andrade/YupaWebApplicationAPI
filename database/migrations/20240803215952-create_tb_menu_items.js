module.exports = {
  up(queryInterface, Sequelize) {

    return queryInterface.createTable('tb_menu_items', {
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
    });
  },
  async down(queryInterface) {
    return queryInterface.dropTable('tb_menu_items');
  }
};
