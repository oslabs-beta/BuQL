import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
} from 'graphql';

import mongoose from 'mongoose';

// Import data model for users
import { User } from '../models/models';

// Create user-defined data types for GraphQL
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});

// define the RootQuery, which is the entry point for querying data
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      args: { id: { type: GraphQLString } },
      async resolve(parent, args) {
        const userList = await User.find({});
        return userList;
      },
    },
    hello: {
      type: GraphQLString,
      resolve: () => {
        return 'world';
      },
    },
    goodbye: {
      type: GraphQLInt,
      args: { id: { type: GraphQLInt } },
      resolve: (parent, args) => {
        return args.id;
      },
    },
  },
});

// define any mutations for the data
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // User mutations
    createUser: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parents, args, req) {
        const result = await User.create({
          username: args.username,
          password: args.password,
        });
        return result;
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
      },
      async resolve(parents, args, req) {
        const userId = new mongoose.Types.ObjectId(args.id);
        const result = await User.findByIdAndDelete(userId);
        return result;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});