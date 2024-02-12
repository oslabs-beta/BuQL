import {useState} from 'react';
import './QueryForm.css';
import queries from './Queries.js';
import ReactJson from 'react-json-pretty'; // Import ReactJson
import BarChart from './BarChart';
import { UserData } from "./testData";


function QueryForm() {
  
  // state variable that keeps track of the query that's currently selected in the demo
  const [selectedQuery, setSelectedQuery] = useState('');
  
  // state variable that contains the query response
  const [queryResponse, setQueryResponse] = useState('');
  
  // state variable that updates the bar chart
  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.fName), //name for each bar...
    datasets: [{
      label: "Nothing", //will need to be labeled correctly
      data: UserData.map((data) => data.age), //will need to be correct data
      backgroundColor: ["pink", "beige"], //need to have a color or 'cached' vs 'database' 
    }] 
  });

  // grab pre-written example queries

  // update state when a query is selected
  const handleQueryChange = (event) => {
    setSelectedQuery(event.target.value);
    setUserData(userData); // figure out logic for updating state of bar chart
  };

  const handleButtonClick = async () => {
    // send selected query to the backend
    try {
      const response = await fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: selectedQuery}),
      });
      const responseObj = await response.json();
      if (Object.hasOwn(responseObj, 'errors')) {
        setQueryResponse(responseObj.errors);
      } else {
        setQueryResponse(responseObj.data);
      }
      // console.log(responseObj);
      // console.log(responseObj.data);
      // setQueryResponse(responseObj);
    } catch (error) {
      console.error('Error:', error);
    }

    /*
    const result = await fetch('http://localhost:8080/graphql').then(
      (data) => {
        console.log(data);
        console.log(data.json());
      }
    );
    console.log(result);
    setQueryResponse(result);
    /

    /
    fetch('localhost:8080/buql').then((data) => {
      console.log(data);
      console.log(data.json());
    });
    /

    // post request to /graphql
    /fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query: selectedQuery}),
    })
      .then((response) => response.json())
      .then((data) => setQueryResponse(data))
      .catch((error) => console.error('Error:', error));*/
    console.log(queryResponse);

    // update query response state variable
    //setQueryResponse(`${selectedQuery} response here here here`);
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
          {/* <code>{selectedQuery}</code> */}
          <ReactJson data={selectedQuery} />
        </div>
        <div id='queryresponse'>
          <label>Query Response:</label>
          <br />
          <ReactJson data={queryResponse} />
          {/* <code>{JSON.stringify(queryResponse)}</code> */}
        </div>
        <div id='barchart'>
          <label> Bar Chart </label>
          <br />
          {/* renders the bar chart */}
          <BarChart chartData={{ labels: UserData.map(data => data.fName), datasets: [{ data: UserData.map(data => data.age) }] }} />
        </div>
      </div>
      <button onClick={handleButtonClick}>Send Query</button>
    </div>
  );
}

export default QueryForm;
