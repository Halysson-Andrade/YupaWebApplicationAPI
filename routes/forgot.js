module.exports = (app) => {
  const router = require("express").Router();
  const c = require("../controllers/forgot");
  const env = require("../config/env");
  const baseUrlApi = env.variable("baseApiUrl");

  router.patch("/", c.update);
  

  app.use(baseUrlApi + "/forgot", router);
};
