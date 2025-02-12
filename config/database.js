const { underscoredIf } = require("sequelize/lib/utils");
const env = require("./env")

module.exports = {
  dialect: 'postgres',
  host: env.variable("host"),
  port: 5432,
  username: env.variable("username"),
  password: env.variable("password"),
  database: env.variable("database"),
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};