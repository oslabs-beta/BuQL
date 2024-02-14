import {useState} from 'react';
import './QueryForm.css';
import queries from './Queries.js';
import ReactJson from 'react-json-pretty'; // Import ReactJson
import BarChart from './BarChart';
import QueryTable from './QueryTable.jsx';

function QueryForm() {
  // state variable that keeps track of the query that's currently selected in the demo
  const [selectedQuery, setSelectedQuery] = useState({});

  // state variable that contains the query response
  const [queryResponse, setQueryResponse] = useState();

  // state variable that updates the bar chart
  const [responseTimes, setResponseTimes] = useState([]);
  const [responseCount, setResponseCount] = useState([]);
  const [responseSources, setResponseSources] = useState([]);
  //const [responseTimes, setResponseTimes] = useState([{}]);

  // state variable for table data
  const [tableData, setTableData] = useState([]);

  // update state when a query is selected
  const handleQueryChange = (event) => {
    const query = {};
    const selectedIndex = event.target.selectedIndex;
    const selectedOption = event.target[selectedIndex];
    const selectedLabel = selectedOption.textContent;

    query.label = selectedLabel;
    query.code = event.target.value;
    console.log('QUERY OBJECT:', query);
    setSelectedQuery(query);
  };

  const clearCacheClick = async () => {
    // add logic to clear cache
    try {
      // run the selected through our backend logic
      const clearResponse = await fetch('http://localhost:8080/clearCache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // console.log('clear!');
    } catch (err) {
      console.log(err);
    }
  };

  const sendQueryClick = async () => {
    // run the selected query and save the response time
    try {
      // grab timestamp of when the function was invoked
      const timeStart = Date.now();
      // run the selected through our backend logic
      // object with 1. source 2. response properties
      // source = string (database/cache)
      // response = exact object as before

      const buqlResponse = await fetch('http://localhost:8080/buql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: selectedQuery.code}),
      });
      // grab timestamp of when the function finished
      const responseObj = await buqlResponse.json();
      const {source, response} = responseObj;

      // calculate the time the function ran for in ms
      const timeEnd = Date.now();
      const newTime = timeEnd - timeStart;
      // console.log(`Execution time: ${newTime} ms`);

      const updateCounter = () => {
        //const newTimes = Object.assign(responseTimes);
        const newCount = Object.assign(responseCount);
        console.log('NEW COUNT', newCount);
        newCount.push(newCount.length + 1);
        console.log(setResponseCount(newCount));
      };
      //updateCounter();
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
          <select value={selectedQuery.code} onChange={handleQueryChange}>
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
        <button onClick={sendQueryClick}>Send Query</button>
        <button onClick={clearCacheClick}>Clear Cache</button>
      </div>
      <div id='queryanalytics'>
        <QueryTable data={tableData} />
        <div id='barchart'>
          <label>Bar Chart</label>
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
            options={{
              scales: {
                y: {
                  title: {
                    display: true,
                    text: 'ms',
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
            style={{legend: {display: 'none'}}}
          />
        </div>
      </div>
    </div>
  );
}

export default QueryForm;
