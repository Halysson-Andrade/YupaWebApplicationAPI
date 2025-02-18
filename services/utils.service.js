const path = require("path");
const axios = require('axios');
const fs = require('fs').promises; // Para salvar localmente, se necessário
const config = require('../config/env')
const account = "vexia";
const accountKey = config.variable(BLOB_KEY);
const {
  ContainerClient,
  StorageSharedKeyCredential,
  BlobServiceClient,
} = require("@azure/storage-blob");
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
function parseNumber(numberStr) {
  let ret = numberStr;
  try {
    ret = ret.replaceAll("R$ ", "");
    ret = ret.replaceAll(".", "");
    ret = ret.replaceAll(",", ".");
  } catch (error) {
    console.log(error);
  }

  return Number(ret);
}
async function saveFile(folder, fileName, base64Doc) {
  try {
    if (!fs.existsSync(path.resolve("files"))) {
      fs.mkdirSync(path.resolve("files"));
    }
    if (!fs.existsSync(path.resolve("files", folder))) {
      fs.mkdirSync(path.resolve("files", folder));
    }
    fs.writeFileSync(path.resolve("files", folder, fileName), base64Doc, {
      encoding: "base64",
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
async function saveFileBlobStore(
  containerName,
  folderName,
  fileName,
  newFilename,
  pathFile,
  count
) {
  let ret = "";
  try {
    const containerClient = new ContainerClient(
      `https://${account}.blob.core.windows.net/${containerName}`,
      sharedKeyCredential
    );

    await containerClient.createIfNotExists(containerName);
    let blobClient = containerClient.getBlockBlobClient(
      folderName + "/" + newFilename
    );

    if (count === 0) {
      let blobs = containerClient.listBlobsFlat({ prefix: folderName })
      if (blobs) {
        for await (const blob of blobs) {
          const blobClient = containerClient.getBlobClient(blob.name);
          console.log(`Excluindo blob: ${blob.name}`);
          await blobClient.delete();
        };
        await blobClient.uploadFile(path.resolve(pathFile, fileName));
      } else {
        await blobClient.uploadFile(path.resolve(pathFile, fileName));
      }
    }
    else {
      await blobClient.uploadFile(path.resolve(pathFile, fileName));
    }
    ret = newFilename;
  } catch (error) {
    console.log("error upload ", error.message);
  }

  return ret;
}
async function saveFileBlobStoreBase64(
  containerName,
  folderName,
  fileName,
  fileType,
  data
) {
  let ret = "";
  try {
    const containerClient = new ContainerClient(
      `https://${account}.blob.core.windows.net/${containerName}`,
      sharedKeyCredential
    );

    await containerClient.createIfNotExists(containerName);
    let blobClient = containerClient.getBlockBlobClient(
      folderName + "/" + fileName
    );
    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const buffer = new Buffer(matches[2], "base64");

    let fff = await blobClient.upload(buffer, buffer.byteLength, {
      blobHTTPHeaders: { blobContentType: fileType },
    });

    ret = blobClient.url;
  } catch (error) {
    console.log("error upload ", error.message);
  }

  return ret;
}
async function GetFilesByName(containerName, fileName) {
  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);

  let i = 1;
  let blobs = containerClient.listBlobsFlat();
  for await (const blob of blobs) {
    console.log(`Blob ${i++}: ${blob.name}`);
    // console.log(blob);
  }
}

async function uploadExcelToBlob(containerName, folderName, fileName, fileType, base64Data) {
  let ret = "";
  try {
    const containerClient = new ContainerClient(
      `https://${account}.blob.core.windows.net/${containerName}`,
      sharedKeyCredential
    );

    // Cria o container se não existir
    await containerClient.createIfNotExists();

    const blobClient = containerClient.getBlockBlobClient(`${folderName}/${fileName}`);

    // Se o Base64 incluir um cabeçalho, remova-o
    const base64ContentArray = base64Data.split(',');
    const base64String = base64ContentArray.length > 1 ? base64ContentArray[1] : base64ContentArray[0];

    // Converter Base64 para Buffer
    const buffer = Buffer.from(base64String, 'base64');

    // Fazer upload do Buffer com tipo de conteúdo definido para Excel
    await blobClient.upload(buffer, buffer.byteLength, {
      blobHTTPHeaders: { blobContentType: fileType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    });

    ret = blobClient.url;
  } catch (error) {
    console.log("Error uploading Excel file: ", error.message);
  }

  return ret;
}
async function GetAllFiles(containerName, folderName) {
  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);

  let i = 1;
  let blobs = containerClient.listBlobsFlat({ prefix: folderName });
  let files = [];
  for await (const blob of blobs) {
    console.log(`Blob ${i++}: ${blob.name}`);
    console.log(blob);
    files.push({ name: blob.name });
  }
  return files;
}
async function downloadFile(containerName, folderName, fileName) {
  let ret = "";
  try {
    const blobServiceClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net`,
      sharedKeyCredential
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(
      folderName + "/" + fileName
    );

    const downloadBlockBlobResponse = await blobClient.download();
    const rest = await downloadBlockBlobResponse._response.headers._headersMap[
      "content-type"
    ];
    console.log("reeeeeeeest ", rest.value);
    const downloaded = (
      await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
    ).toString("base64");
    console.log(
      "Downloaded blob content:",
      "data:" + rest.value + ";base64," + downloaded
    );
    ret = "data:" + rest.value + ";base64," + downloaded;
  } catch (error) {
    console.log("error upload ", error.stack);
  }

  return ret;
}
async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}

async function downloadFileFromUrl(fileUrl) {
  let ret = "";
  try {
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'];
    const base64Data = Buffer.from(response.data).toString("base64");
    ret = `data:${contentType};base64,${base64Data}`;
    console.log("Arquivo baixado com sucesso!");
  } catch (error) {
    console.log("Erro ao fazer download:", error.message);
  }

  return ret;
}
module.exports = {
  parseNumber,
  saveFile,
  saveFileBlobStore,
  downloadFile,
  saveFileBlobStoreBase64,
  GetFilesByName,
  GetAllFiles,
  uploadExcelToBlob,
  downloadFileFromUrl
};
