// define queries that will be available to choose from in the demo. might put in a different file?
const queries = [
  {
    label: "Grab user's id, username and birthday",
    query: 'query { getUserById (id: "65ce7765820192dc7a289543") { id username birthdate } }',
  },
  {
    label: "Grab user's id, username and email",
    query: 'query { getUserById (id: "65ce7765820192dc7a289543") { id username email } }',
  },
  {
    label: 'Grab everything from user',
    query: 'query { getUserById (id: "65ce7765820192dc7a289543") { id username email birthdate registeredAt } }',
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
    query: 'query { getUserById(id: "65dfa2ed403abded4f2565f0" OR 1=1) { id username email } }',
  },
  {
    label: 'Grab another user',
    query: 'query { getUserById(id: "65ce7765820192dc7a289543") { id username email birthdate registeredAt } }',
  },
  {
    label: 'Delete that user',
    query: 'mutation { deleteById(id: "65ce7765820192dc7a289543") { id username email birthdate registeredAt } }',
  },
];

export default queries;
