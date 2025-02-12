module.exports = {
  up(queryInterface, Sequelize) {

    return queryInterface.createTable('tb_permissions', {
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
    });
  },
  async down(queryInterface) {
    return queryInterface.dropTable('tb_permissions');
  }
};
