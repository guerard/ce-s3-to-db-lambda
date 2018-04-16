import { S3 } from "aws-sdk";
import { createGunzip } from "zlib";
import { padFn } from "./pad";
import pump = require("pump");

const s3 = new S3();
const pad4 = padFn(4);

export default function fetchPubMedJson(pubMedId: number): Promise<any[]> {
  return new Promise<string>((resolve, reject) => {
    const Key = "pubmed18n" + pad4(pubMedId) + ".json.gz";
    console.log("Fetching object '" + Key + "' from S3");
    let data = "";
    pump(s3.getObject({
      Bucket: "pubmed-json",
      Key,
    }).createReadStream(),
      createGunzip()
        .setEncoding("utf8")
        .on("data", chunk => {
          data += chunk;
        }),
      error => {
        if (error) {
          reject(error);
          return;
        }
        resolve(data);
      }
    );
  }).then(data => {
    return JSON.parse(data);
  });
}