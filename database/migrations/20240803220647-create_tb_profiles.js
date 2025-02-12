module.exports = {
  up(queryInterface, Sequelize) {

    return queryInterface.createTable('tb_profiles', {
      prf_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      prf_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      prf_description: {
        type: Sequelize.STRING,
      },
      prf_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      prf_created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      prf_updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },
  async down(queryInterface) {
    return queryInterface.dropTable('tb_profiles');
  }
};
