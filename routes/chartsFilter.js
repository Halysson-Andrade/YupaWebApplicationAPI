module.exports = (app) => {
  const router = require("express").Router();
  const c = require("../controllers/chartsFilter");
  const verifyToken = require("../services/validaterequest.service");
  const env = require("../config/env");
  const baseUrlApi = env.variable("baseApiUrl");
  
  router.get("/", (req, res, next) => {
    verifyToken.checkPermission(req, res, next, 26); // ler  filtro
  }, verifyToken.verifyToken, c.index);


  /* router.post("/", (req, res, next) => {
     verifyToken.checkPermission(req, res, next, 28); // criar filtro
   }, verifyToken.verifyToken, c.store);
 
   router.delete("/", (req, res, next) => {
     verifyToken.checkPermission(req, res, next, 29); // deletar filtro
   }, verifyToken.verifyToken, c.destroy);

   router.put("/", (req, res, next) => {
     verifyToken.checkPermission(req, res, next,30 ); // update  filtro
   }, verifyToken.verifyToken, c.update);
 */
  app.use(baseUrlApi + "/filter", router);
};
