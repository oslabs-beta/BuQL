import {useState} from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div id='header'>
        <h1>BuQL Demo</h1>
      </div>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <div id='footer'>
        <h2>By J, J, J & DC</h2>
      </div>
    </>
  );
}

export default App;
