// define queries that will be available to choose from in the demo. might put in a different file?
const queries = [
  /* Working set of queries before schema change
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
  }, */
  {
    label: 'Grab all users',
    query: 'query { getAllUsers { id username email birthdate registeredAt } }',
  },
  {
    label: 'Grab the user with the userId 65cdf731aeda2e240baec9fc',
    query:
      'query { getUserById(id: "65cdf731aeda2e240baec9fc") { id username email birthdate registeredAt } }',
  },
  {
    label: 'Add a random new user',
    query:
      'mutation { addRandomUsers(num: 1) { id username email birthdate registeredAt } }',
  },
  {
    label: 'Delete the user with the userId 65cdf731aeda2e240baec9fc',
    query:
      'mutation { deleteById(id: "65cdf731aeda2e240baec9fc") { id username email birthdate registeredAt } }',
  },
  {
    label: 'Bad (not Michael Jackson bad) Query',
    query: 'query { getAccount { id username email } }',
  },
  {
    label: 'Query with illegal character',
    query:
      'query { getUserById(id: "65cdf731aeda2e240baec9fc" OR 1=1) { id username email } }',
  },
];

export default queries;
