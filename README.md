# Move PubMed JSON from S3 to Elasticsearch
Simple Node.js application for importing gzipped JSON stored in S3 into
Elasticsearch.

## Prepare Elasticsearch
You should first PUT the following mapping into your cluster under the `pubmed` index before adding any documents:
```
{
  "mappings": {
    "article": {
      "properties": {
        "medlineCitation.article.authorList.author": {
          "type": "nested",
          "properties": {
          	"affiliationInfo": {
          		"type": "nested"
          	}
          }
        },
        "medlineCitation.article.dataBankList.dataBank": {
          "type": "nested" 
        },
        "medlineCitation.article.grantList.grant": {
          "type": "nested" 
        },
        "medlineCitation.article.publicationTypeList": {
          "type": "nested" 
        },
        "medlineCitation.chemicalList": {
          "type": "nested" 
        },
        "medlineCitation.commentsCorrectionsList": {
          "type": "nested" 
        },
        "medlineCitation.investigatorList": {
          "type": "nested",
          "properties": {
          	"affiliationInfo": {
          		"type": "nested"
          	}
          }
        },
        "medlineCitation.keywordList.keyword": {
          "type": "nested" 
        },
        "medlineCitation.meshHeadingList": {
          "type": "nested" 
        },
        "medlineCitation.personalNameSubjectList": {
          "type": "nested" 
        },
        "medlineCitation.supplMeshList": {
          "type": "nested" 
        },
        "pubmedData.articleIdList": {
          "type": "nested" 
        },
        "pubmedData.history.pubMedPubDate": {
          "type": "nested" 
        }
      }
    }
  }
}
```
You can use any REST client to issue an HTTP PUT to `http(s)://<hostname>:<port>/pubmed` with a request body containing the text above.

In production, configure your Elasticsearch cluster to be in a VPC and use Security Groups to control access.

It's also strongly suggested that you increase the interval between index refreshes by PUT'ing the following request body to `/pubmed/_settings`:
```
{
	"index": {
		"refresh_interval": "300s"
	}
}
```

## Prepare S3
This app looks for gzipped, JSON arrays of PubMed documents in a bucket called `pubmed-json`. See https://github.com/guerard/ce-pubmed-search-loader for more info.
Don't forget to authorize the client accessing the bucket as well (e.g. inject the credentials using the standard AWS environment variables).

## Running
First you'll need to update the Elasticsearch client configuration to match your setup (hostname, port, etc.). batch-load-es.ts is the file
you'll need to change (ideally this info should be configurable; pull-requests welcome).

To run the app, you first need to build it: `npm install && npm run lambda`

Then just use the included shell script: `./run.sh <startId> <endId>` where `startId` is the first PubMed ID in the range and `endId` is the
last (inclusive).
