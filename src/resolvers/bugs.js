import listFields from 'graphql-list-fields';
import { fieldsToIncludeFields, searchToQuery } from '../mappings';

const apiKey = process.env.BUGZILLA_API_KEY;

export default {
  Query: {
    bug(parent, { id }, { loaders }, info) {
      const query = {
        include_fields: fieldsToIncludeFields(listFields(info)),
        ...searchToQuery({ apiKey }),
      };

      return loaders.bug.load({ id, query });
    },
    bugs(parent, { search, paging = {} }, { loaders }, info) {
      console.log(searchToQuery({ ...search, apiKey }));
      const query = {
        ...searchToQuery({
          ...search,
          apiKey,
        }),
        include_fields: fieldsToIncludeFields(listFields(info)),
      };

      return loaders.bugs.load({
        query,
        paging: { pageSize: 100, page: 0, ...paging },
      });
    },
    comments(parent, { id }, { loaders }, info) {
      const query = {
        include_fields: fieldsToIncludeFields(listFields(info)),
      };

      return loaders.comments.load({ id, query });
    },
  },
};
