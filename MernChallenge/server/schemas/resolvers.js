const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User } = require('../models/index');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const response = await User.findOne({ _id: context.user._id })
                return response
            }
            throw new AuthenticationError('Not logged in');
        },

    },

    Mutation: {
        login: async (parent, args, context) => {
            const email = args.email
            const password = args.password
            console.log(email, password);


            const response = await User.findOne({ email: email, })
            if (!response) {
                throw new AuthenticationError('Email not found')
            }
            console.log(response);

            const passwordResponse = await response.isCorrectPassword(password)

            if (!passwordResponse) {
                throw new AuthenticationError('incorrect password')
            }
            //const passwordResponse = await response.isCorrectPassword(password)

            const token = signToken(response)
            return { token: token, user: response }


        },
        signUp: async (parent, args, context) => {
            const user = await User.create(args)
            const token = signToken(user)
            return { token: token, user: user }
        },

        savedBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.update(
                    { _id: context.user._id },
                    { $push: { savedBooks: args } },
                );
                return updatedUser
            }


            throw new AuthenticationError('Not logged in');
        },

       removeBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.update(
                    { _id: context.user._id },
                    { $pull: { savedBooks: args } },
                );
                return updatedUser
            }


            throw new AuthenticationError('Not logged in');
        }





    }
}

module.exports = resolvers;