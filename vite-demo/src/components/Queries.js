// define queries that will be available to choose from in the demo. might put in a different file?
const queries = [
  /*{
    label: 'Grab all users with the initial J',
    query: '',
  },
  {
    label: 'Grab all posts created after Feb 9th 2024',
    query: '',
  }, */
  {
    label: 'Query: Grab all users with the userId 1',
    query: 'query { user(userId: 1) { name } }',
  },
  {
    label: 'Query: Hello World Query!',
    query: 'query { hello }',
  },
  {
    label: 'Query: Grab all users and hello world',
    query: 'query { getAllUsers { id username password } hello }',
  },
  {
    label: 'Query: Grab just the username of all users',
    query: 'query { getAllUsers { username } }',
  },
  {
    label: 'Mutation: Create User with name and password',
    query:
      'mutation { createUser (username: "Filip", password: "aGx75C6hz2!_") { id username password } }',
  },
];

export default queries;
