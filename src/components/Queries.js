// define queries that will be available to choose from in the demo. might put in a different file?
const queries = [
  {
    label: "Grab user's id, username and birthday",
    query: 'query { getUserById (id: "65ce84ef820192dc7a289554") { id username birthdate } }',
  },
  {
    label: "Grab user's id, username and email",
    query: 'query { getUserById (id: "65ce84ef820192dc7a289554") { id username email } }',
  },
  {
    label: 'Grab everything from user',
    query: 'query { getUserById (id: "65ce84ef820192dc7a289554") { id username email birthdate registeredAt } }',
  },
  {
    label: 'Add a random new user',
    query: 'mutation { addRandomUsers(num: 1) { id username email birthdate registeredAt } }',
  },
  {
    label: 'Bad Query',
    query: 'query { getAccount { id username email } }',
  },
  {
    label: 'Illegal query',
    query: 'query { getUserById(id: "65dfa2d4403abded4f2565cc" OR 1=1) { id username email } }',
  },
];

export default queries;
