module.exports = {
  up(queryInterface, Sequelize) {

    return queryInterface.createTable('tb_ufs', {
      uf_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      uf_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      uf_state: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      uf_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      uf_ibge_code: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      uf_region: {
        type: Sequelize.STRING,
        allowNull: false
      },
      uf_created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      uf_updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },
  async down(queryInterface) {
    return queryInterface.dropTable('tb_ufs');
  }
};
