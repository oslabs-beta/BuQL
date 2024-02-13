import {useState} from 'react';
import './QueryForm.css';
import queries from './Queries.js';
import ReactJson from 'react-json-pretty'; // Import ReactJson
import BarChart from './BarChart';
import {UserData} from './testData';
import QueryTable from './QueryTable.jsx';

function QueryForm() {
  // state variable that keeps track of the query that's currently selected in the demo
  const [selectedQuery, setSelectedQuery] = useState({});

  // state variable that contains the query response
  const [queryResponse, setQueryResponse] = useState();

  // state variable that updates the bar chart
  const [responseTimes, setResponseTimes] = useState([]);
  const [responseCount, setResponseCount] = useState([]);
  //const [responseTimes, setResponseTimes] = useState([{}]);

  // state variable for table data
  const [tableData, setTableData] = useState([]);

  // test state variable for populating barChart with userdata
  const [userData, setUserData] = useState([
    {
      label: UserData.map((data) => data.fName), //will need to be labeled correctly
      data: UserData.map((data) => data.age), //will need to be correct data
      backgroundColor: ['pink', 'beige'], //need to have a color or 'cached' vs 'database'
    },
  ]);
  console.log(userData);
  // grab pre-written example queries

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
    //setSelectedQuery(event.target.value);
    console.log('EVENT TARGET', event.target);
    setUserData(userData); // figure out logic for updating state of bar chart
  };

  const clearCacheClick = async () => {
    // add logic to clear cache
    console.log('clear!');
  };

  const sendQueryClick = async () => {
    // run the selected query and save the response time
    try {
      // grab timestamp of when the function was invoked
      const timeStart = Date.now();
      // run the selected through our backend logic
      const response = await fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: selectedQuery.code}),
      });
      // grab timestamp of when the function finished
      const responseObj = await response.json();
      // calculate the time the function ran for in ms
      const timeEnd = Date.now();
      const newTime = timeEnd - timeStart;
      console.log(`Execution time: ${newTime} ms`);

      const updateCounter = () => {
        //const newTimes = Object.assign(responseTimes);
        const newCount = Object.assign(responseCount);
        console.log('NEW COUNT', newCount);
        newCount.push(newCount.length + 1);
        console.log(setResponseCount(newCount));
      };
      updateCounter();

      await setResponseTimes((prevState) => [...prevState, newTime]);
      // check if response object is an error object and extract its errors if so
      if (Object.hasOwn(responseObj, 'errors')) {
        setQueryResponse(responseObj.errors);
      } // otherwise extract its response data
      else {
        setQueryResponse(responseObj.data);
      }

      // Update tableData with the new query information
      setTableData((prevTableData) => [
        ...prevTableData,
        {
          id: prevTableData.length + 1,
          query: selectedQuery.label,
          source: 'database', // set source to "database" by default for now
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
      <div id='querycontainer'>
        <div id='queryselector'>
          <select value={selectedQuery.code} onChange={handleQueryChange}>
            <option value=''>Select a query</option>
            {queries.map((query) => (
              <option key={query.label} value={query.code}>
                {query.label}
              </option>
            ))}
          </select>
          {/* <code>{selectedQuery}</code> */}
          <ReactJson data={selectedQuery.code} />
        </div>
        <div id='queryresponse'>
          <label>Query Response:</label>
          <br />
          <ReactJson data={queryResponse} />
          {/* <code>{JSON.stringify(queryResponse)}</code> */}
        </div>
      </div>
      <button onClick={sendQueryClick}>Send Query</button>
      <button onClick={clearCacheClick}>Clear Cache</button>
      <div id='queryanalytics'>
        <div id='querytable'>
          <QueryTable data={tableData} />
        </div>
        <div id='barchart'>
          <label> Bar Chart </label>
          <br />
          {/* renders the bar chart */}
          <BarChart
            chartData={{
              labels: responseCount,
              datasets: [
                {
                  data: responseTimes,
                  backgroundColor: responseTimes.map((time) =>
                    time < 15 ? 'green' : 'red'
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
