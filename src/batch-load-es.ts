import { Client } from "elasticsearch";
import { chunk, flatMap } from "lodash";

const client = new Client({
  host: 'HOSTNAME GOES HERE',  // TODO: hostname goes here
  requestTimeout: 1000 * 60 * 5 /* msec -> sec -> min -> 5min */,
});

export default function batchLoadEs(items: any[]): Promise<void> {
  const chunks = chunk(items, 500);
  return Promise.all(chunks.map(chunk => {
    return client.bulk({
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
        console.error(result);
        console.error("Error inserting items");
        throw new Error("Error while bulk inserting");
      }
    });
  })).then(values => null);
}