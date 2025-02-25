const { Sequelize, Model, DataTypes } = require("sequelize");

class tb_cars extends Model {
  static init(sequelize) {
    super.init(
      {
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
      },
      {
        sequelize,
        timestamps: true, // Habilitando os campos de data de criação e atualização
        underscored: true, // Use snake_case para nomes de tabelas e colunas
        createdAt: 'car_created_at', // Renomeando o campo createdAt para ctr_createdAt
        updatedAt: 'car_updated_at', // Renomeando o campo updatedAt para ctr_updatedAt
        tableName: 'tb_cars',
        schema: 'public',
      }
    );
    return this;
  }
  static associate(models) {
    this.hasMany(models.tb_users_permissions, {
      foreignKey: 'usr_id',
      onDelete: 'CASCADE', // Define o comportamento de exclusão em cascata
    });
  }
}

module.exports = tb_cars;