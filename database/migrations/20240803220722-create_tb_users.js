module.exports = {
  up(queryInterface, Sequelize) {

    return queryInterface.createTable('tb_users', {
      usr_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      usr_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      usr_profile:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tb_profiles', // Nome da tabela referenciada
          key: 'prf_id', // Nome da coluna referenciada
        },
      },
      usr_password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      usr_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      usr_activationcode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      usr_activated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      usr_changepassword: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      usr_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      usr_created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      usr_updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },
  async down(queryInterface) {
    return queryInterface.dropTable('tb_users');
  }
};
