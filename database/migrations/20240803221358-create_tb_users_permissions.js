module.exports = {
  up(queryInterface, Sequelize) {

    return queryInterface.createTable('tb_users_permissions', {
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
    });
  },
  async down(queryInterface) {
    return queryInterface.dropTable('tb_users_permissions');
  }
};
