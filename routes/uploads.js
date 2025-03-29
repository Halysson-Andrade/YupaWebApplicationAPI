module.exports = (app) => {
  const router = require("express").Router();
  const c = require("../controllers/uploads");
  const verifyToken = require("../services/validaterequest.service");
  const env = require("../config/env");
  const baseUrlApi = env.variable("baseApiUrl");

  router.post("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 22); // Create
  }, verifyToken.verifyToken, c.store);

  
  router.get("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 23); // Read
  }, verifyToken.verifyToken, c.index);

  router.get("/data", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 23); // Read
  }, verifyToken.verifyToken, c.read);
  
  router.put("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next,24 ); // Update
  }, verifyToken.verifyToken, c.update);

  /*router.get("/read", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 23); // ReadOne
  }, verifyToken.verifyToken, c.read);

  

  router.delete("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 25); // Delete
  }, verifyToken.verifyToken, c.destroy);*/

  app.use(baseUrlApi + "/uploads", router);
};
