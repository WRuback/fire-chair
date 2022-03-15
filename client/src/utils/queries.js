import { gql } from '@apollo/client';

export const QUERY_USERS = gql`
  query allUsers {
    users {
      _id
      username
      playCount
      deck
    }
  }
`;

export const QUERY_SINGLE_USER = gql`
  query singleUser($userId: ID!) {
    user(userId: $userId) {
      _id
      username
      playCount
      deck
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      deck
    }
  }
`;

export const QUERY_PROMPTS = gql`
  query allPrompts {
    prompts {
      _id
      promptText
      masterDeck
    }
  }
`;

export const QUERY_SINGLE_PROMPTS = gql`
  query singlePrompt($promptId: ID!) {
    prompt(promptId: $promptId) {
      _id
      promptText
      masterDeck
    }
  }
`;
