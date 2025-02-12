const tb_user = require("../models/tb_users");
const tb_profiles = require("../models/tb_profiles")
const tb_profiles_menus = require("../models/tb_profiles_menus")
const tb_users_permissions = require("../models/tb_users_permissions");
const response = require("../models/customresponse");
const ret = new response();
const svcMail = require("./sendmail.service");
const moment = require("moment");
const bcryptSalt = global.bcryptSalt;
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const shortid = require("shortid");

async function newProfile(profile) {
  let ret
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  try {
    let profileToCreate = profile
    profileToCreate.prf_name = profileToCreate.prf_name
    profileToCreate.prf_description = profileToCreate.prf_description
    profileToCreate.prf_status = profileToCreate.prf_status
    ret = await tb_profiles.create(profileToCreate);

    let menus = []
    let profile_menus = []
    menus = profileToCreate.mnu_parent_id
    menus.forEach(menu => {
      let t = {}
      t.prf_id = ret.prf_id
      t.mnu_parent_id = menu
      profile_menus.push(t)
    });
    await tb_profiles_menus.bulkCreate(profile_menus);
  } catch (error) {
    this.ret.errorCount = 1;
    this.ret.data = {};
    this.ret.httpStatus = 401;
    this.ret.errors.push('E-mail do usuário existente');
    this.ret.timeSentFromBack = moment().valueOf();
  }
  return ret;
}

async function updateUser(profile) {
  let ret
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  try {
    let existProfile = await tb_profiles.findByPk(profile.prf_id);
    if (existProfile) {
      let profileToUpdate = profile;
      existProfile.prf_name = profileToUpdate.prf_name;
      existProfile.prf_description = profileToUpdate.prf_description;
      existProfile.prf_status = profileToUpdate.prf_status;
      existProfile.save();

      await tb_profiles_menus.destroy({
        where: {
          prf_id: profileToUpdate.prf_id
        }
      });

      let menus = []
      let profile_menus = []
      menus = profileToUpdate.mnu_parent_id
      menus.forEach(menu => {
        let t = {}
        t.prf_id = existProfile.prf_id
        t.mnu_parent_id = menu
        profile_menus.push(t)
      });
      await tb_profiles_menus.bulkCreate(profile_menus);
    } else {
      this.ret.errorCount = 1;
      this.ret.data = {};
      this.ret.httpStatus = 401;
      this.ret.errors.push('ID do perfil não localizado!');
      this.ret.timeSentFromBack = moment().valueOf();
      return this.ret;
    }
  } catch (error) {
    this.ret.errorCount = 1;
    this.ret.data = {};
    this.ret.httpStatus = 401;
    this.ret.errors.push('Usuário não localizado!');
    this.ret.timeSentFromBack = moment().valueOf();
  }
  return this.ret;
}

async function destroyUser(usr) {
  let ret
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  try {
    let destroyUser = await tb_user.destroy({
      where: {
        usr_id: usr,
      },
    });

    this.ret.data = { destroyUser };
    this.ret.timeSentFromBack = moment().valueOf();
    this.ret.httpStatus = 200;

  } catch (error) {
    this.ret.errorCount = 1;
    this.ret.data = {};
    this.ret.httpStatus = 401;
    this.ret.errors.push('E-mail do usuário existente');
    this.ret.timeSentFromBack = moment().valueOf();
  }
  return this.ret;
}
module.exports = {
  newProfile,
  destroyUser,
  updateUser
};
