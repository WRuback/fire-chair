const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    password: String
    playCount: Int
    deck: [Prompt]
  }

  type Prompt {
    _id: ID
    promptText: String
    masterDeck: Boolean
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]!
    user(userId: ID!): User
    prompts: [Prompt]!
    prompt(promptId: ID!): Prompt
    # Because we have the context functionality in place to check a JWT and decode its data, we can use a query that will always find and return the logged in user's data
    me: User
  }

  type Mutation {
    addUser(username: String!, password: String!): Auth
    login(username: String!, password: String!): Auth
    addToDeck(promptId: ID!): User
    removeFromDeck(promptId: ID!): User

    addPrompt(promptText: String!, masterDeck: Boolean!): Prompt 
    removePrompt(promptId: ID!): Prompt
  }
`;

module.exports = typeDefs;
