# Bugzilla GraphQL Gateway

An intermediary gateway between a GraphQL client and the Bugzilla REST API.
Currently only supports public `query` operations, not `mutation` or `subscription`.

## Environment variables

By default this gateway relies on the `PORT` and `BUGZILLA_ENDPOINT`. If not set, these
values default to `3090` and `https://bugzilla.mozilla.org/rest/bug` respectively. To
override these values, either set them on the command line or
place a `.env` file in the root of this repo with the following environment variables
inside of it, using your overrides instead of these defaults:

```sh
PORT=3090
BUGZILLA_ENDPOINT="https://bugzilla.mozilla.org/rest/bug"
```

## Launching locally

To start the service up locally, first install dependencies using `yarn`.
Use the command `yarn start` to start the
service, which launches on the `PORT` environment variable.

You should see the following message in the console, for example, using port 3090 by default:

```bash
Bugzilla GraphQL gateway running on port 3090.

Open the interactive GraphQL Playground, schema explorer and docs in your browser at:
    http://localhost:3090
```

## Sample Queries

Query a bug by ID, `996038`. Access the bug's summary, status, and resolution:

```graphql
query Bug {
  bug(id: 996038) {
    summary
    status
    resolution
  }
}
```

![bug query screenshot](https://cldup.com/MkhcpV8RaL.png)

---

Query all bugs in the `Taskcluster` product, in the `Tools` component, with the
assignee of `eperelman@mozilla.com` or `helfi92@gmail.com`, specified by query variables.
Access each of matched bugs' ID, summary, status, and resolution. Also limit pages to 10 bugs each,
and get paging information back from the query.

```graphql
query Bugs($search: BugSearch!, $paging: Paging) {
  bugs(search: $search, paging: $paging) {
    pageInfo {
      hasNextPage
      nextPage
    }
    
    edges {
      node {
        id
        summary
        status
        resolution
      }
    }
  }
}
```

Variables:

```json
{
  "search": {
    "components": ["Tools"],
    "products": ["Taskcluster"],
    "assignedTos": [
      "eperelman@mozilla.com",
      "helfi92@gmail.com"
    ]
  },
  "paging": {
    "page": 0,
    "pageSize": 10
  }
}
```

![bugs query screenshot](https://cldup.com/vtI1XG7oc2.png)

## Apollo Engine

You can enable tracing and caching to the Apollo Engine service by setting the
`APOLLO_ENGINE_KEY` environment variable.
