import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    projects: [Project!]!
    status(
      monitorIdentifier: String!
      from: Int
      to: Int
    ): [Status!]
  }

  type Project {
    identifier: ID!
    label: String!
    description: String
    monitors: [Monitor!]
  }

  type Monitor {
    identifier: ID!
    periodicity: Int
    label: String!
    type: String!
    host: String
    url: String
    badgeUrl: String!
  }

  type Status {
    date: String!
    ok: Boolean!
    responseTime: Int
  }
`;
