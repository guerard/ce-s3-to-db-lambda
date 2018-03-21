import fetchPubMedJson from "./src/fetch-pub-med-json";
import batchLoadEs from "./src/batch-load-es";

interface S3ToDbRequest {
  db?: string;
  startId: number;
  endId: number;
}

export const handler = (
  event: any,
  context: any,
  callback: (err: Error, result?: any) => void,
) => {
  if (event.Records.length !== 1) {
    console.error("SNS event has more than one record!");
    callback(new Error("Illegal number of records; must be exactly 1"));
    return;
  }
  const payload: S3ToDbRequest = JSON.parse(event.Records[0].Sns.Message);
  const promises = [];
  for (let currentId = payload.startId; currentId <= payload.endId; currentId++) {
    const promise = fetchPubMedJson(currentId).then((articles: any[]) => {
      console.log("Bulk uploading PubMed article set ID: " + currentId);
      return batchLoadEs(articles);
    });
    promises.push(promise);
  }
  Promise.all(promises).then(values => {
    console.log("All PubMed objects processed");
    callback(null, {
      isOk: true,
    });
  }).catch(error => {
    callback(error);
  });
};
