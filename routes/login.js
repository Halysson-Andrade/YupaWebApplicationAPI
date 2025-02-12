module.exports = (app) => {
  const router = require("express").Router();
  const c = require("../controllers/logins");
  const env = require("../config/env");
  const baseUrlApi = env.variable("baseApiUrl");

  router.post("/", c.auth);
  

  app.use(baseUrlApi + "/login", router);
};
