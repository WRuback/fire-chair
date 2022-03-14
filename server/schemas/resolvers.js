const { AuthenticationError } = require('apollo-server-express');
const { User, Prompt } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },

    user: async (parent, { userId }) => {
      return User.findOne({ _id: userId });
    },

    me: async (parent, args, context) => {
      if (context.user) {
        console.log(await User.findOne({ _id: context.user._id }));
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    prompts: async () => {
      return Prompt.find();
    },

    prompt: async (parent, { promptId }) => {
      return Prompt.findOne({ _id: promptId });
    }
  },

  Mutation: {
    addUser: async (parent, { username, password }) => {
      const user = await User.create({ username, password });
      const token = signToken(user);

      return { token, user };
    },

    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError('No profile with this username found!');
      }

      const correctPw = await user.checkPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(user);
      return { token, user };
    },

    addToDeck: async (parent, { promptId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id},
          {
            $addToSet: { deck: promptId },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    addPrompt: async (parent, {promptText, masterDeck}, context) => {
      if (context.user) {
        return Prompt.create({promptText, masterDeck});
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    removePrompt: async(parent, {promptId}, context) => {
      if (context.user) {
        return Prompt.findOneAndDelete({_id: promptId});
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    
    removeFromDeck: async (parent, { promptId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { deck: promptId } },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
