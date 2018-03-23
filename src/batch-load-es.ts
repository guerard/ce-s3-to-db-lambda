import { Client } from "elasticsearch";
import { chunk, flatMap } from "lodash";
import RequestPool from "./request-pool";

const client = new Client({
  host: 'localhost:9200',
  requestTimeout: 1000 * 60 * 5,  // 5 min.
});

const requestPool = new RequestPool(16);

export default function batchLoadEs(items: any[]): Promise<void> {
  const chunks = chunk(items, 500);
  return Promise.all(chunks.map(chunk => {
    return requestPool.submit(() => client.bulk({
      body: flatMap(chunk, item => [
        {
          index: {
            _index: 'pubmed',
            _type: 'article',
            _id: item.medlineCitation.pmid.value + "." + item.medlineCitation.pmid.version
          }
        },
        item,
      ]),
    }).then(result => {
      console.log("Elasticsearch 'took' time: "
        + result.took
        + "ms for "
        + result.items.length
        + " items");
      if (result.errors) {
        console.error("Error inserting items: " + result);
        throw new Error("Error while bulk inserting");
      }
    }));
  })).then(values => null);
}