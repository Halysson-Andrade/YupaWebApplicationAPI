module.exports = {
  up(queryInterface, Sequelize) {

    return queryInterface.createTable('tb_documents', {
      doc_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      uf_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_ufs', // Nome da tabela referenciada
          key: 'uf_id', // Nome da coluna referenciada
        },
      },
      doc_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      doc_description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      doc_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      uf_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      doc_created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      doc_updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },
  async down(queryInterface) {
    return queryInterface.dropTable('tb_documents');
  }
};
