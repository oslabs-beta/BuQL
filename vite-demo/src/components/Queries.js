// define queries that will be available to choose from in the demo. might put in a different file?
const queries = [
  /*{
    label: 'Grab all users with the initial J',
    code: 'insert query 1 code here',
  },
  {
    label: 'Grab all posts created after Feb 9th 2024',
    code: 'insert more code here',
  }, */
  {
    label: 'Grab all users with the userId 1',
    code: 'query { user(userId: 1) { name } }',
  },
  {
    label: 'Hello World Query!',
    code: 'query { hello }',
  },
  {
    label: 'Grab all users and hello world',
    code: 'query { getAllUsers { id username password } hello }',
  },
  {
    label: 'Grab just the username of all users',
    code: 'query { getAllUsers { username } }',
  },
];

export default queries;
