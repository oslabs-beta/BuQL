import {useState} from 'react';
import './QueryForm.css';

function QueryForm() {
  // state variable that keeps track of the query that's currently selected in the demo
  const [selectedQuery, setSelectedQuery] = useState('');
  // state variable that contains the query response
  const [queryResponse, setQueryResponse] = useState('');

  // define queries that will be available to choose from in the demo. might put in a different file?
  const queries = [
    {
      label: 'Grab all users with the initial J',
      code: 'insert query 1 code here',
    },
    {
      label: 'Grab all users with the userId 1',
      code: 'query { user(userId: 1) { name } }',
    },
    {
      label: 'Grab all posts created after Feb 9th 2024',
      code: 'insert more code here',
    },
  ];

  // update state when a query is selected
  const handleQueryChange = (event) => {
    setSelectedQuery(event.target.value);
  };

  const handleButtonClick = async () => {
    // send selected query to the backend

    // update query response state variable
    setQueryResponse(`${selectedQuery} response here here here`);
  };

  // render this form back in App.jsx where it was called
  // form includes a select box + a code block for the query
  // a button to send the query and a code block for the query response
  return (
    <div id='queryform'>
      <div id='querycontainer'>
        <div id='queryselector'>
          <select value={selectedQuery} onChange={handleQueryChange}>
            <option value=''>Select a query</option>
            {queries.map((query) => (
              <option key={query.label} value={query.code}>
                {query.label}
              </option>
            ))}
          </select>
          <code>{selectedQuery}</code>
        </div>
        <div id='queryresponse'>
          <label>Query Response:</label>
          <br />
          <code>{queryResponse}</code>
        </div>
      </div>
      <button onClick={handleButtonClick}>Send Query</button>
    </div>
  );
}

export default QueryForm;
