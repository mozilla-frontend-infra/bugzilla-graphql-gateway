import { GraphQLServer } from 'graphql-yoga';
import depthLimit from 'graphql-depth-limit';
import { createComplexityLimitRule } from 'graphql-validation-complexity';
import compression from 'compression';
import typeDefs from './graphql';
import resolvers from './resolvers';
import loaders from './loaders';

process.on('uncaughtException', err => {
  console.error(err); // eslint-disable-line no-console
  process.exit(1);
});

process.on('unhandledRejection', reason => {
  console.error(reason); // eslint-disable-line no-console
});

let graphQLServer;
const port = +process.env.PORT || 3090;
const load = async props => {
  if (!graphQLServer) {
    graphQLServer = new GraphQLServer(props);
  } else {
    await graphQLServer.reload(() => props);
  }

  graphQLServer.express.use(compression());
};

const props = () => ({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(10), createComplexityLimitRule(1000)],
  context({ request }) {
    return request ? { loaders: loaders() } : {};
  },
});

load(props()).then(async () => {
  await graphQLServer.start({
    port,
    apolloEngineKey: process.env.APOLLO_ENGINE_KEY,
    tracing: true,
    cacheControl: true,
  });

  /* eslint-disable no-console */
  console.log(`\n\nBugzilla GraphQL server running on port ${port}.`);
  console.log(
    `\nOpen the interactive GraphQL Playground and schema explorer in your browser at:
    http://localhost:${port}\n`
  );
  /* eslint-enable no-console */
});

if (module.hot) {
  module.hot.accept(['./graphql', './resolvers', './loaders'], () => {
    load(props());
  });
}
