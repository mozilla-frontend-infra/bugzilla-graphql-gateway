import DataLoader from 'dataloader';
import fetch from 'node-fetch';
import { stringify } from 'query-string';
import Bug from '../Bug';

const endpoint =
  process.env.BUGZILLA_ENDPOINT || 'https://bugzilla.mozilla.org/rest/bug';

export default () => {
  const bug = new DataLoader(queries =>
    Promise.all(
      queries.map(async ({ id, query }) => {
        const url = `${endpoint}/${id}?${stringify(query)}`;
        const response = await fetch(url);
        const { bugs: [bug] } = await response.json();

        return new Bug(bug);
      })
    )
  );
  const bugs = new DataLoader(queries =>
    Promise.all(
      queries.map(async ({ query, paging }) => {
        const { page, pageSize } = paging;
        const pagedQuery = {
          ...query,
          limit: pageSize,
          offset: pageSize * page,
        };
        const url = `${endpoint}?${stringify(pagedQuery)}`;
        const response = await fetch(url);
        const { bugs } = await response.json();
        const hasNextPage = bugs.length >= pageSize;
        const hasPreviousPage = page > 0;

        return {
          pageInfo: {
            hasNextPage,
            hasPreviousPage,
            nextPage: hasNextPage ? page + 1 : null,
            previousPage: hasPreviousPage ? page - 1 : null,
          },
          edges: bugs.map(bug => ({
            cursor: page,
            node: new Bug(bug),
          })),
        };
      })
    )
  );
  const comments = new DataLoader(queries =>
    Promise.all(
      queries.map(async ({ id }) => {
        const url = `${endpoint}/${id}/comment`;
        const response = await fetch(url);
        const { bugs } = await response.json();

        return bugs[id].comments;
      })
    )
  );

  return {
    bug,
    bugs,
    comments,
  };
};
