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

  // hold on to the bar chart's information
  // times: bar sizes, count: bar names, sources = db/cache/etc
  const [chartData, setChartData] = useState({
    responseTimes: [],
    responseCount: [],
    responseSources: [],
  });

  // keep track of the table data (array of table rows)
  const [tableData, setTableData] = useState([]);

  // update state whenever a different query is selected
  const handleQuerySelector = (event) => {
    // clearing the query response field
    setQueryResponse();

    // accessing the selected query name and corresponding code
    const selectedIndex = event.target.selectedIndex;
    const selectedOption = event.target[selectedIndex];
    const selectedLabel = selectedOption.textContent;

    // declaring an object that will hold onto the query and its cod
    const query = {};
    query.label = selectedLabel;
    query.query = event.target.value;

    // assign the query object
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
      let {source, response} = responseObj;

      // check if response object is an error object and extract its errors if so
      if (Object.hasOwn(response, 'errors')) {
        setQueryResponse(response.errors);
        // make sure it populates the graph/table as error data
        source = 'error';
      } // otherwise extract its response data
      else {
        setQueryResponse(response.data);
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
      console.log('Error clearing table:', error);
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
          <select value={selectedQuery.query} onChange={handleQuerySelector}>
            {/* show "Select a query" by default, but make it not selectable */}
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
      <div id='queryboxes'>
        <ReactJson data={selectedQuery.query} />
        <ReactJson data={queryResponse} />
      </div>
      <div id='querybuttons'>
        <button onClick={clearTableClick}>Clear Table</button>
        <button onClick={sendQueryClick}>Send Query</button>
        <button onClick={clearCacheClick}>Clear Cache</button>
        <button onClick={clearChartClick}>Clear Chart</button>
      </div>
      <div id='queryanalytics'>
        <QueryTable data={tableData} />
        <div id='barchart'>
          <label style={{color: 'white'}}>Response Time</label>
          <br />
          {/* renders the bar chart */}
          <BarChart
            // feed chart data into the bar chart
            chartData={{
              labels: chartData.responseCount,
              datasets: [
                {
                  data: chartData.responseTimes,
                  // assign each row of data a color based on its source from the backend
                  backgroundColor: chartData.responseSources.map((source) => {
                    switch (source) {
                      case 'database':
                        return '#f077bc';
                      case 'cache':
                        return '#faefdf'; // bun color
                      case 'mutation':
                        return 'purple';
                      case 'partial':
                        return 'pink';
                      default:
                        return 'black';
                    }
                  }),
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
