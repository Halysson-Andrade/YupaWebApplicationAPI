const {Sequelize} = require("sequelize");
const databaseConfig = require("../config/database");

const tb_menu_items = require('../models/tb_menu_items');
const tb_permissions = require('../models/tb_permissions');
const tb_profiles = require('../models/tb_profiles');
const tb_profiles_menus = require('../models/tb_profiles_menus');
const tb_users_permissions = require('../models/tb_users_permissions');
const tb_users = require('../models/tb_users');
const tb_imports = require('../models/tb_imports');
const tb_filters = require('../models/tb_filters');
const tb_imports_datas = require('../models/tb_imports_datas');
const tb_imports_datas_erros = require('../models/tb_imports_datas_erros');
const tb_imports_relation_columns = require('../models/tb_imports_relation_columns');
const tb_cars = require('../models/tb_cars');
const tb_ufs = require('../models/tb_ufs');
const tb_documents = require('../models/tb_documents');

const models = [tb_menu_items,tb_permissions,tb_profiles,tb_profiles_menus,tb_users_permissions,tb_users,tb_imports,tb_filters,tb_imports_datas,tb_imports_datas_erros,tb_imports_relation_columns,tb_cars,tb_documents,tb_ufs];

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
