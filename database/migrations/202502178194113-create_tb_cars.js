module.exports = {
  up(queryInterface, Sequelize) {

    return queryInterface.createTable('tb_cars', {
      car_plate: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      car_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },      
      car_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      car_model: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      car_collor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      car_year: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      car_chacci: {
        type: Sequelize.STRING,
      },
      car_informations: {
        type: Sequelize.STRING,
      },
      car_created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      car_updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },
  async down(queryInterface) {
    return queryInterface.dropTable('tb_cars');
  }
};
