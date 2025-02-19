const express = require("express");
const cors = require("cors");
const app = express();
const config = require("./config/env");
const port = config.variable("port");
const kv = require("./services/key_vault");
const { exec } = require('child_process');
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: "50mb" }));
if (process.env.env === "production") {
  console.log = function () { };
  console.info = function () { };
  console.warn = function () { };
  console.error = function () { };
}
function runMigrations() {
  return new Promise((resolve, reject) => {
    exec('yarn sequelize db:migrate', (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar migrações: ${error}`);
        reject(error);
        return;
      }
      console.log(`Migrações aplicadas com sucesso:\n${stdout}`);
      resolve();
    });
  });
}

const baseUrlApi = config.variable("baseApiUrl");
var corsOptions = {
  //origin: "http://localhost:4200",
  origin: "*"
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

async function startServer() {
  try {
    global.passwordSmtp = await kv.GetSecret(config.variable("kv_passwordSmtp"));
    global.userNameSmtp = await kv.GetSecret(config.variable("kv_userNameSmtp"));
    global.jwtSecret = await kv.GetSecret(config.variable("kv_jwtSecret"));
    global.bcryptSalt = await kv.GetSecret(config.variable("kv_bcryptSalt"));

    const index = require('./database');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });

  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
  }
}

startServer().then(() => {
  require("./routes/users")(app);
  require("./routes/login")(app);
  require("./routes/changepassword")(app);
  require("./routes/activation")(app);
  require("./routes/forgot")(app);
  require("./routes/permissions")(app);
  require("./routes/menus")(app);
  require("./routes/profiles")(app);
  require("./routes/register")(app);
  require("./routes/uploads")(app);
  require("./routes/charts")(app);
  require("./routes/chartsFilter")(app);
});
