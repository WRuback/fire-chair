import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation addUser($username: String!, $password: String!) {
    addUser(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;


export const LOGIN_USER = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    token
    user {
      _id
      username
    }
  }
}
`;

export const ADD_TO_DECK = gql`
  mutation addToDeck($promptId: ID!) {
    addToDeck(promptId: $promptId) {
      _id
      username
      deck {
        _id
      }
    }
  }
`;

export const REMOVE_FROM_DECK = gql`
  mutation removeFromDeck($promptId: ID!) {
    removeFromDeck(promptId: $promptId) {
      _id
      username
      deck {
        _id
      }
    }
  }
`;

export const ADD_PROMPT = gql`
  mutation addPrompt($promptText: String!, $masterDeck: Boolean!) {
    addPrompt(promptText: $promptText, masterDeck: $masterDeck){
      _id
      promptText
      masterDeck
    }
  }
`;

export const REMOVE_PROMPT = gql`
  mutation removePrompt($promptId: ID!) {
    removePrompt(promptId: $promptId) {
      _id
      promptText
      masterDeck
    }
  }
`;