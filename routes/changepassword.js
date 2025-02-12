module.exports = (app) => {
  const router = require("express").Router();
  const c = require("../controllers/changepassword");
  const verifyToken = require("../services/validaterequest.service");
  const env = require("../config/env");
  const baseUrlApi = env.variable("baseApiUrl");

  //router.post("/", verifyToken, c.update);
  router.patch("/",verifyToken.verifyToken, c.update);

  app.use(baseUrlApi + "/changepassword", router);
};
