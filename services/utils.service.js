const fs = require("fs");
const path = require("path");
const config = require("./config/env");
const account = config.variable("BLOB_STORAGE_ACCOUNT");
const accountKey =config.variable("BLOB_STORAGE_ACCOUNTKEY");
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
module.exports = {
  parseNumber,
  saveFile,
  saveFileBlobStore,
  downloadFile,
  saveFileBlobStoreBase64,
  GetFilesByName,
  GetAllFiles,
};
