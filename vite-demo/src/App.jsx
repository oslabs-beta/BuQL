import {useState} from 'react';
import './App.css';
import QueryForm from './components/QueryForm';
import Home from './components/Home.jsx';
import AboutUs from './components/AboutUs.jsx';

function App() {
   // State to track the current page
   const [currentPage, setCurrentPage] = useState('home');

   // Render component based on current page
   const renderPage = () => {
     switch (currentPage) {
       case 'demo':
         return <QueryForm />;
       case 'about':
         return <AboutUs />;
       default:
         return <Home />;
     }
   };
  
  
  return (
    <>
      <div id='header'>
        <img className='logo' src='/BuQL.png'></img>
        <h1>BuQL</h1>
        <img className='logo' src='/BuQL.png'></img>
        <nav id='pages'>
          <button onClick={() => setCurrentPage('demo')}> Demo </button>
          <button onClick={() => setCurrentPage('about')}> About Us </button>
        </nav>
      </div>
      
      <div id='demo'>
        {/* <Home></Home> */}
        {/* <QueryForm></QueryForm> */}
        {renderPage()}
      </div>
      <div id='footer'>
        <h2>Creators: Jake Diamond, Julien Kerekes, Joe McGarry and Dylan Compton</h2>
      </div>
    </>
  );
}


export default App;
