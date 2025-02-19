module.exports = {
  up(queryInterface, Sequelize) {

    return queryInterface.createTable('tb_filters', {
      flt_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      flt_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      flt_created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      flt_updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },
  async down(queryInterface) {
    return queryInterface.dropTable('tb_filters');
  }
};
