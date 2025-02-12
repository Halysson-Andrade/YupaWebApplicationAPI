module.exports = (app) => {
  const router = require("express").Router();
  const c = require("../controllers/activation");
  const env = require("../config/env")
  const baseUrlApi = env.variable("baseApiUrl");
  const verifyToken = require("../services/validaterequest.service");
  router.patch("/:code", verifyToken.verifyToken, c.update);

  app.use(baseUrlApi + "/activation", router);
};
