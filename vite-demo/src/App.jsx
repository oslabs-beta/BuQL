import {useState} from 'react';
import './App.css';
import QueryForm from './components/QueryForm';

function App() {
  return (
    <>
      <div id='header'>
        <img className='logo' src='/BuQL.png'></img>
        <h1>BuQL Demo</h1>
      </div>
      <div id='demo'>
        <QueryForm></QueryForm>
      </div>
      <div id='footer'>
        <h2>By Jake Diamond, Julien Kerekes, Joe McGarry and Dylan Compton</h2>
      </div>
    </>
  );
}

export default App;
