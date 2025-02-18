module.exports = {
  up(queryInterface, Sequelize) {

    return queryInterface.createTable('tb_imports', {
      imp_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      imp_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      imp_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imp_container_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imp_blob_path: {
        type: Sequelize.STRING,
      },
      imp_created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      imp_updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },
  async down(queryInterface) {
    return queryInterface.dropTable('tb_imports');
  }
};
