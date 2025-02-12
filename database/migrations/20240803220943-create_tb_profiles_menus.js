module.exports = {
  up(queryInterface, Sequelize) {

    return queryInterface.createTable('tb_profiles_menus', {
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
          key: 'prf_id', // Nome da coluna referenciada
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
    });
  },
  async down(queryInterface) {
    return queryInterface.dropTable('tb_profiles_menus');
  }
};
