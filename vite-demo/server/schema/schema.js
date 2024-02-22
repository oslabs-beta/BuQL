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
import { addToDb } from '../models/fake';

// Create user-defined data types for GraphQL
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    birthdate: { type: GraphQLString },
    registeredAt: { type: GraphQLString },
  }),
});

// Define what data can be queried
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
    getUserById: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      async resolve(parent, args) {
        const userId = new mongoose.Types.ObjectId(args.id);
        const user = await User.findById(userId);
        return user;
      },
    },
  },
});

// Define mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addRandomUsers: {
      type: new GraphQLList(UserType),
      args: {
        num: { type: GraphQLInt },
      },
      async resolve(parents, args, req) {
        await addToDb(args.num);
        const userList = await User.find({});
        return userList;
      },
    },
    deleteById: {
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
