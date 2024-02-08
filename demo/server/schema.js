import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
} from 'graphql';
import { graphql } from 'graphql';

// Import data model for users
import { User } from './models';

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
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

const source = 'query { getAllUsers { id username password } hello }';
graphql({ schema, source }).then((result) => {
  console.log('result: ', result);
});

// TODO -> figure out mutations

// const source1 = 'mutation { createUser(username: "testuser", password: "12345") { UserType { id username password } } }';
// `mutation {
//   createUser(username: "testuser", password: "12345") {
//     id
//     username
//     password
//   }
// }`
// `mutation {
//   createUser(username: "testuser", password: "12345") {
//     UserType {
//       id
//       username
//       password
//     }
//   }
// }`


// graphql({ schema, source1 }).then((result) => {
//   console.log('result: ', result);
// });
// mutation: '{ createUser(username: "testuser", password: "12345") { id username password } }',
