module.exports = (app) => {
  const router = require("express").Router();
  const c = require("../controllers/home");
  const verifyToken = require("../services/validaterequest.service");
  const env = require("../config/env");
  const baseUrlApi = env.variable("baseApiUrl");

  router.get("/read", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 17); // Acesso ao sistema
  }, verifyToken.verifyToken, c.read);

 
  app.use(baseUrlApi + "/home", router);
};
