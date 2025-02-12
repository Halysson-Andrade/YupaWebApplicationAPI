module.exports = (app) => {
  const router = require("express").Router();
  const c = require("../controllers/profiles");
  const verifyToken = require("../services/validaterequest.service");
  const env = require("../config/env");
  const baseUrlApi = env.variable("baseApiUrl");

  router.post("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 9); // criar profile
  }, verifyToken.verifyToken, c.create);

  router.get("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 12); // ler profiles 
  }, verifyToken.verifyToken, c.read);

  router.delete("/:usr_id", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 10); // deletar profile 
  }, verifyToken.verifyToken, c.destroy);

  router.put("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 11); // atualizar profile 
  }, verifyToken.verifyToken, c.update);

  app.use(baseUrlApi + "/profiles", router);
};
