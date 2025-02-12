module.exports = (app) => {
  const router = require("express").Router();
  const c = require("../controllers/pemissions");
  const verifyToken = require("../services/validaterequest.service");
  const env = require("../config/env");
  const baseUrlApi = env.variable("baseApiUrl");

  router.post("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 13); // criar permissão
  }, verifyToken.verifyToken, c.store);

  router.delete("/:pms_id", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 14); // deletar permissão
  }, verifyToken.verifyToken, c.destroy);

  router.get("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 16); // ler  permissão
  }, verifyToken.verifyToken, c.index);

  router.put("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next,15 ); // update  permissão
  }, verifyToken.verifyToken, c.update);

  app.use(baseUrlApi + "/permissions", router);
};
