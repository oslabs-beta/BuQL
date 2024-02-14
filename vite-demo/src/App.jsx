import {useState} from 'react';
import './App.css';
import QueryForm from './components/QueryForm';

function App() {
  //const [count, setCount] = useState(0);

  return (
    <>
      <div id='header'>
        <img className='logo' src='/public/BuQL.png'></img>
        <h1>BuQL Demo</h1>
      </div>
      <div id='demo'>
        <QueryForm></QueryForm>
      </div>
      {/* <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div> */}
      <div id='footer'>
        <h2>By J, J, J & DC</h2>
      </div>
    </>
  );
}

export default App;
