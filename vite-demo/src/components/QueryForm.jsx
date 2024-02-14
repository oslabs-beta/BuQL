import {useState} from 'react';
import './QueryForm.css';
import queries from './Queries.js';
import ReactJson from 'react-json-pretty'; // Import ReactJson
import BarChart from './BarChart';
import QueryTable from './QueryTable.jsx';

function QueryForm() {
  // defining state variables (might refactor to cleaner code later on)
  // keeping track of the query that's currently selected in the demo
  const [selectedQuery, setSelectedQuery] = useState({});

  // contains the query response
  const [queryResponse, setQueryResponse] = useState();

  // update the bar chart's information
  const [responseTimes, setResponseTimes] = useState([]);
  const [responseCount, setResponseCount] = useState([]);
  const [responseSources, setResponseSources] = useState([]);

  // keep track of the table data
  const [tableData, setTableData] = useState([]);

  // update state when a query is selected
  const handleQuerySelector = (event) => {
    const query = {};
    const selectedIndex = event.target.selectedIndex;
    const selectedOption = event.target[selectedIndex];
    const selectedLabel = selectedOption.textContent;

    query.label = selectedLabel;
    query.code = event.target.value;
    setQueryResponse();
    //console.log('QUERY OBJECT:', query);
    setSelectedQuery(query);
  };

  const clearCacheClick = async () => {
    // send a request to the /clearCache route that will handle clearing the cache
    try {
      await fetch('http://localhost:8080/clearCache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const clearChartClick = async () => {};

  const clearTableClick = async () => {};

  const sendQueryClick = async () => {
    // run the selected query and save the response time
    try {
      // grab timestamp of when the function was invoked
      const timeStart = Date.now();

      // run the selected through our backend logic
      const buqlResponse = await fetch('http://localhost:8080/buql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: selectedQuery.code}),
      });
      const responseObj = await buqlResponse.json();

      // grab timestamp of when the function finished
      const timeEnd = Date.now();
      // then calculate the time the function ran for in ms
      const newTime = timeEnd - timeStart;
      // console.log(`Execution time: ${newTime} ms`);

      // deconstruct the source string
      const {source, response} = responseObj;

      // update state variables
      setResponseSources((prevState) => [...prevState, source]);
      setResponseCount((prevState) => [...prevState, prevState.length + 1]);
      setResponseTimes((prevState) => [...prevState, newTime]);

      // check if response object is an error object and extract its errors if so
      if (Object.hasOwn(response, 'errors')) {
        setQueryResponse(response.errors);
      } // otherwise extract its response data
      else {
        setQueryResponse(response.data);
      }

      // Update tableData with the new query information
      setTableData((prevTableData) => [
        ...prevTableData,
        {
          id: prevTableData.length + 1, // DOES THIS NEED EDITING???
          query: selectedQuery.label,
          source: source, //'database', // set source to "database" by default for now
          time: newTime,
        },
      ]);

      // console.log(responseObj);
      // console.log(responseObj.data);

      console.log(
        'responseTimer:',
        responseTimes,
        'responseCount:',
        responseCount
      );
    } catch (error) {
      console.log('Error in sendQueryClick!');
      console.error('Error:', error);
    }
  };

  // render this form back in App.jsx where it was called
  // form includes a select box + a code block for the query
  // a button to send the query and a code block for the query response
  return (
    <div id='queryform'>
      <div id='querylabels'>
        <div id='queryselector'>
          <select value={selectedQuery.code} onChange={handleQuerySelector}>
            <option value=''>Select a query</option>
            {queries.map((query) => (
              <option key={query.label} value={query.code}>
                {query.label}
              </option>
            ))}
          </select>
        </div>
        <label>Query Response:</label>
      </div>
      <div id='queryboxes'>
        <ReactJson data={selectedQuery.code} />
        <ReactJson data={queryResponse} />
      </div>
      <div id='querybuttons'>
        <button onClick={clearTableClick}>Clear Table</button>
        {/* ^ add functionaliy */}
        <button onClick={sendQueryClick}>Send Query</button>
        <button onClick={clearCacheClick}>Clear Cache</button>
        <button onClick={clearChartClick}>Clear Chart</button>
        {/* ^ add functionaliy */}
      </div>
      <div id='queryanalytics'>
        <QueryTable data={tableData} />
        <div id='barchart'>
          <label>Response Time</label>
          <br />
          {/* renders the bar chart */}
          <BarChart
            chartData={{
              labels: responseCount,
              datasets: [
                {
                  label: 'Red = Database, Green = Cache', //responseSources, //'Source', //but variable
                  data: responseTimes,
                  backgroundColor: responseSources.map((source) =>
                    source === 'cache' ? 'green' : 'red'
                  ),
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default QueryForm;
