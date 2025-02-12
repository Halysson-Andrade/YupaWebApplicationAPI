module.exports = (app) => {
  const router = require("express").Router();
  const c = require("../controllers/menus");
  const verifyToken = require("../services/validaterequest.service");
  const env = require("../config/env");
  const baseUrlApi = env.variable("baseApiUrl");

  router.post("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 5); // criar menu
  }, verifyToken.verifyToken, c.store);

  router.delete("/:mnu_id", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 6); // deletar menu
  }, verifyToken.verifyToken, c.destroy);

  router.get("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 8); // ler  menu
  }, verifyToken.verifyToken, c.index);

  router.put("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next,7 ); // update  menu
  }, verifyToken.verifyToken, c.update);

  app.use(baseUrlApi + "/menus", router);
};
