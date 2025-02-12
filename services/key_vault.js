require("dotenv").config();
const { ClientSecretCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

async function GetSecretAsync(secretName) {
  let ret = "";
  try {
    const credential = new ClientSecretCredential(
      process.env.AZURE_TENANT_ID,
      process.env.AZURE_CLIENT_ID,
      process.env.AZURE_CLIENT_SECRET
    );

    const client = new SecretClient(process.env.AZURE_KEYVAULT_URL, credential);
    ret = await client.getSecret(secretName).then((res) => {
      return res;
    });
  } catch (error) {
    console.log(error.message);
  }
  return ret;
}
function GetSecret(secretName) {
  
  return  GetSecretAsync(secretName).then((res) => {
    console.log("kv => ", res.value, secretName)
      return res.value
    })
  
  
    
}
module.exports = {
  GetSecret,
};
