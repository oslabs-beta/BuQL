import * as React from 'react';
import {createRoot} from 'react-dom/client';
import './style.module.css';
import styles from './style.module.css';

export default function App() {
  return (
    <div>
      <div className={styles.header}>
        <h1>Welcome to the BuQL demo!</h1>
      </div>
      <div id='main'></div>
      <div id='footer'>
        <h1>Footer!</h1>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
