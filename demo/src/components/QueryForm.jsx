import {useState} from 'react';
import './QueryForm.css';
import queries from './Queries.js';
import ReactJson from 'react-json-pretty'; // Import ReactJson
import BarChart from './BarChart';
import QueryTable from './QueryTable.jsx';

function QueryForm() {
  // defining state variables (might refactor to redux later on)

  // keeping track of the query that's currently selected for the demo
  const [selectedQuery, setSelectedQuery] = useState({});
  // contains the query response
  const [queryResponse, setQueryResponse] = useState();

  // bar chart information --- times: bar sizes, count: bar names, sources = db/cache/etc
  const [chartData, setChartData] = useState({
    responseTimes: [],
    responseCount: [],
    responseSources: [],
  });

  // keep track of the table data (array of table rows)
  const [tableData, setTableData] = useState([]);

  // logic that happens when a new query gets selected
  const handleQuerySelector = (event) => {
    // clearing the query response field
    setQueryResponse();

    // this accesses the selected query name and corresponding code
    const selectedIndex = event.target.selectedIndex;
    const selectedOption = event.target[selectedIndex];
    const selectedLabel = selectedOption.textContent;

    // declaring an object that will hold onto the query label and its code
    const query = {};
    query.label = selectedLabel;
    query.query = event.target.value;

    // assign that query object to its state variable
    setSelectedQuery(query);
  };

  // functionality for clicking "Send Query"
  const sendQueryClick = async () => {
    // try-block runs the selected query and calculates the response time
    try {
      // grab timestamp of when the function was invoked
      const timeStart = Date.now();

      // run the selected query through our backend logic
      const buqlResponse = await fetch('http://localhost:8080/buql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: selectedQuery.query}),
      });
      const responseObj = await buqlResponse.json();

      // grab timestamp of when the function finished
      const timeEnd = Date.now();
      // then calculate the time the function ran for in ms
      const runTime = timeEnd - timeStart;

      // deconstruct the response object
      let {source, cacheHits, nonCache, response} = responseObj;

      // check if response object is an error object and extract its errors if so
      // console.log(responseObj);
      // console.log(response);
      if (Object.hasOwn(response, 'errors')) {
        setQueryResponse(response.errors);
        // make sure it populates the graph/table as error data
        source = 'error';
      } // otherwise extract its response data, assign it to state and determine the source
      else {
        setQueryResponse(response);
        // figure out the source of the data
        if (!source) {
          if (cacheHits === 0) {
            source = 'database';
          } else if (nonCache === 0) {
            source = 'cache';
          } else {
            source = 'partial';
          }
        }
        // otherwise source is 'mutation'
      }

      // generate next id for graph & table
      let nextId = 1;
      if (tableData.length !== 0) {
        nextId = tableData[tableData.length - 1].id + 1;
      }

      // update the chart data
      setChartData((prevState) => ({
        // bar chart takes in arrays for data so we're utilizing 3 separate arrays
        responseTimes: [...prevState.responseTimes, runTime],
        responseCount: [...prevState.responseCount, nextId],
        responseSources: [...prevState.responseSources, source],
      }));

      // add a new row of data to the table
      setTableData((prevTableData) => [
        ...prevTableData,
        {
          id: nextId,
          query: selectedQuery.label,
          source: source,
          time: runTime,
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // functionality for clearing the cache
  const clearCacheClick = async () => {
    // send a request to the /clearCache route that will handle clearing the cache
    try {
      await fetch('http://localhost:8080/clearCache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('The cache has been cleared!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //functionality for clearing the Response Time Chart
  const clearChartClick = async () => {
    try {
      // set chart state to empty arrays
      setChartData({
        responseTimes: [],
        responseCount: [],
        responseSources: [],
      });
      console.log('Chart has been cleared.');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //functionality for clearing the Query Table
  const clearTableClick = async () => {
    try {
      // set table state to an empty array (0 rows)
      setTableData([]);
      console.log('Table has been cleared.');
    } catch (error) {
      console.error('Error clearing table:', error);
    }
  };

  // render this form back in App.jsx where it was called
  // form includes a select box + a code block for the query
  // buttons: send query, clear cache, clear table and clear graph
  // and a table and a graph to showcase the response times of queries
  return (
    <div id='queryform'>
      <div id='querylabels'>
        <div id='queryselector'>
          {/* select-box that shows "Select a query" by default and has demo queries to choose from */}
          <select value={selectedQuery.query} onChange={handleQuerySelector}>
            <option defaultValue={true} hidden>
              Select a query
            </option>
            {/* map the sample queries into the select box */}
            {queries.map((query) => (
              <option key={query.label} value={query.query}>
                {query.label}
              </option>
            ))}
          </select>
        </div>
        <label>Query Response:</label>
      </div>

      {/* text-boxes (read-only) that display the selected query and its query response and format them nicely */}
      <div id='queryboxes'>
        <ReactJson data={selectedQuery.query} />
        <ReactJson data={queryResponse} />
      </div>

      <div id='querybuttons'>
        <button onClick={clearTableClick} style={{cursor: 'default'}}>
          Clear Table
        </button>
        <button onClick={sendQueryClick} style={{cursor: 'default'}}>
          Send Query
        </button>
        <button onClick={clearCacheClick} style={{cursor: 'default'}}>
          Clear Cache
        </button>
        <button onClick={clearChartClick} style={{cursor: 'default'}}>
          Clear Chart
        </button>
      </div>

      <div id='queryanalytics'>
        <div id='querytable'>
          {/* feed the table data to the table component and render it */}
          <QueryTable data={tableData} />
        </div>
        <div id='barchart'>
          <label style={{color: 'white'}}>Response Time</label>
          {/* feed the chart data to the bar chart component and render it */}
          <BarChart rawData={chartData} />
        </div>
      </div>
    </div>
  );
}

export default QueryForm;
