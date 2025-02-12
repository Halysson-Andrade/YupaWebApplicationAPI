const {Sequelize} = require("sequelize");
const databaseConfig = require("../config/database");

const tb_menu_items = require('../models/tb_menu_items');
const tb_permissions = require('../models/tb_permissions');
const tb_profiles = require('../models/tb_profiles');
const tb_profiles_menus = require('../models/tb_profiles_menus');
const tb_users_permissions = require('../models/tb_users_permissions');
const tb_users = require('../models/tb_users');



const models = [tb_menu_items,tb_permissions,tb_profiles,tb_profiles_menus,tb_users_permissions,tb_users];

class Database{
  constructor(){
    this.init();
  }

  init(){
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

module.exports = new Database();
