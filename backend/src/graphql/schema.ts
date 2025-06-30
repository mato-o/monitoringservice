import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Project {
    id: String!
    label: String!
    description: String
    tags: [String!]!
  }

  type Query {
    projects: [Project!]!
  }
`;

export const resolvers = {
  Query: {
    projects: async () => {
      return [
        { id: '1', label: 'Example', description: 'Sample', tags: ['test'] }
      ]; // TEMP: Replace with actual service call
    },
  },
};
