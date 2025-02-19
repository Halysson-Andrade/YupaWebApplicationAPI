module.exports = (app) => {
  const router = require("express").Router();
  const c = require("../controllers/users");
  const verifyToken = require("../services/validaterequest.service");
  const env = require("../config/env");
  const baseUrlApi = env.variable("baseApiUrl");

  router.post("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 1); // criar usuário
  }, verifyToken.verifyToken, c.create);

  router.get("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 4); // ler usuários 
  }, verifyToken.verifyToken, c.read);

  router.get("/read", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 4); // ler  1 usuário
  }, verifyToken.verifyToken, c.index);


  router.delete("/:usr_id", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 2); // deletar usuários 
  }, verifyToken.verifyToken, c.destroy);

  router.put("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 3); // atualizar usuários 
  }, verifyToken.verifyToken, c.update);

  app.use(baseUrlApi + "/users", router);
};
