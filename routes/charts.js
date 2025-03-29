const c = require("../controllers/resultCharts");
const multer = require("multer");
const verifyToken = require("../services/validaterequest.service");

module.exports = (app) => {
  const router = require("express").Router();
  const env = require("../config/env");
  const baseUrlApi = env.variable("baseApiUrl");

  //router.get("/", c.index);  
  /*router.get("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 27); // Coleta Protheus
  }, verifyToken.verifyToken, c.index);*/

    //router.get("/", c.index);  
    router.get("/", (req, res, next) => {
      verifyToken.checkPermission(req, res, next, 26); // 
    }, verifyToken.verifyToken, c.index);

  app.use(baseUrlApi + "/charts", router);
};
