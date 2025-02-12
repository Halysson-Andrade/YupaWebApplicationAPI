module.exports = (app) => {
  const router = require("express").Router();
  const c = require("../controllers/register");
  const env = require("../config/env");
  const baseUrlApi = env.variable("baseApiUrl");

  router.get("/", c.show);

  app.use(
    baseUrlApi + "/register", router
  );
};
