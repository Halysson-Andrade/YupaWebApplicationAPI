module.exports = (app) => {
  const router = require("express").Router();
  const c = require("../controllers/documents");
  const verifyToken = require("../services/validaterequest.service");
  const env = require("../config/env");
  const baseUrlApi = env.variable("baseApiUrl");

  router.post("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 1); // criar 
  }, verifyToken.verifyToken, c.store);

  router.get("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 4); // ler  
  }, verifyToken.verifyToken, c.index);

  router.get("/read", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 4); // ler 1
  }, verifyToken.verifyToken, c.read);


  router.delete("/:usr_id", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 2); // deletar  
  }, verifyToken.verifyToken, c.destroy);

  router.put("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 3); // atualizar  
  }, verifyToken.verifyToken, c.update);

  app.use(baseUrlApi + "/ufs", router);
};
