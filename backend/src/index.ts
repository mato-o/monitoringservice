import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';

// Your GraphQL schema and resolvers
import { typeDefs} from './graphql/schema';
import { resolvers} from './graphql/resolvers';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

(async () => {
  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server)
  );

  // REST endpoints
  app.use('/projects', (await import('./routes/projects')).default);
  app.use('/monitors', (await import('./routes/monitors')).default);
  app.use('/badge', (await import('./routes/badge')).default);
  app.use('/monitors', (await import('./routes/monitorStatuses')).default);

  app.get('/', (_req, res) => {
    res.send('Monitoring API is running');
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`GraphQL endpoint at http://localhost:${PORT}/graphql`);
  });
})();
