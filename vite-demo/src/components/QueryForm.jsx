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
    query.query = event.target.value;

    setQueryResponse();
    console.log('Query Selected!');
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

  //functionality for clearing the Response Time Chart
  const clearChartClick = async () => {
    try {
      console.log('Chart has been cleared.');
      setResponseCount([]);
      setResponseTimes([]);
      setResponseSources([]);
    } catch (err) {
      console.log('Error clearing chart:', err);
    }
  };

  //functionality for clearing the Query Table
  const clearTableClick = async () => {
    try {
      console.log('Table has been cleared.');
      setTableData([]);
    } catch (err) {
      console.log('Error clearing table:', err);
    }
  };

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
        body: JSON.stringify({query: selectedQuery.query}),
      });
      const responseObj = await buqlResponse.json();

      // grab timestamp of when the function finished
      const timeEnd = Date.now();
      // then calculate the time the function ran for in ms
      const newTime = timeEnd - timeStart;
      // console.log(`Execution time: ${newTime} ms`);

      // deconstruct the source string
      let {source, response} = responseObj;

      // update state variables
      setResponseSources((prevState) => [...prevState, source]);

      setResponseTimes((prevState) => [...prevState, newTime]);

      console.log(responseObj);
      // check if response object is an error object and extract its errors if so
      if (Object.hasOwn(response, 'errors')) {
        setQueryResponse(response.errors);
        source = 'error';
      } // otherwise extract its response data
      else {
        setQueryResponse(response.data);
      }

      // generate next id for graph & table
      let newId = 1;
      if (tableData.length !== 0) {
        newId = tableData[tableData.length - 1].id + 1;
      }

      // update tableData with the new query information
      setTableData((prevTableData) => [
        ...prevTableData,
        {
          id: newId, // might need refactoring
          query: selectedQuery.label,
          source: source,
          time: newTime,
        },
      ]);

      setResponseCount((prevState) => [...prevState, newId]);
    } catch (error) {
      console.log('Error in sendQueryClick!');
      console.error('Error:', error);
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
            {/* this makes sure that "Select a query" is showing by default, but not selectable */}
            <option value='' selected='true' hidden='true'>
              Select a query
            </option>
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
            chartData={{
              labels: responseCount,
              datasets: [
                {
                  data: responseTimes,
                  // assign each row of data a color based on its source from the backend
                  backgroundColor: responseSources.map((source) => {
                    switch (source) {
                      case 'database':
                        return '#f077bc';
                      case 'cache':
                        return '#faefdf'; // bun color
                      case 'mutation':
                        return 'purple';
                      case 'partial':
                        return 'pink'; // buql pink
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
