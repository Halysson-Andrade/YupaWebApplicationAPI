module.exports = {
  up(queryInterface, Sequelize) {

    return queryInterface.createTable('tb_imports_relation_columns', {
      impr_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      impr_column_db: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      impr_column_plan: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      impr_created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      impr_updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },
  async down(queryInterface) {
    return queryInterface.dropTable('tb_imports_relation_columns');
  }
};
