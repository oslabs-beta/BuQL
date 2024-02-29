import {useState} from 'react';
import './App.css';
import Home from './components/Home.jsx';
import AboutUs from './components/AboutUs.jsx';
import Demo from './components/Demo.jsx'

function App() {
   // State to track the current page
   const [currentPage, setCurrentPage] = useState('home');

   // Render component based on current page
   const renderPage = () => {
     switch (currentPage) {
       case 'demo':
         return <Demo />;
       case 'about':
         return <AboutUs />;
       default:
          case 'home':
         return <Home />;
     }
   };
  
  return (
    <>
      <div id='header'>
        <nav id='socials'>
          <a href='https://twitter.com/_BuQL_?t=ZGTgImK-03uYMEzvVCeuQg&s=09&fbclid=IwAR3QYlHvSHr7gE7haPDMOHG_UiXAZf1i-gFw25KKLJgDRncKCGnTAZ-1K5E' style={{cursor: 'default'}}>
            <img src='/twitter2.svg' className='sociallogo' alt='Twitter'/>
          </a>
          <a href='https://www.linkedin.com/in/buql-osp-a43b892b6/' style={{cursor: 'default'}}>
            <img src='/linkedin2.svg' className='sociallogo' alt='Linkedin'/> {/* change this link when the org is created */}
          </a>
          <a href='https://www.bobdylan.com/' style={{cursor: 'default'}}>
            <img src='/medium.svg' className='sociallogo' alt='Medium'/>
          </a>
          <a href='https://github.com/oslabs-beta/BuQL' style={{cursor: 'default'}}>
            <img src='/github-mark.svg' className='sociallogo' alt='GitHub'/>
          </a>
        </nav>
        <img className='logo' src='/BuQL.png'></img>
        <h1 className='buql' onClick={() => setCurrentPage('home')} style={{cursor: "default"}}>BuQL</h1>
        <img className='logo' src='/BuQL.png'></img>
        <nav id='pages'>
          <button onClick={() => setCurrentPage('demo')} style={{cursor: "default"}}> Demo </button>
          <button onClick={() => setCurrentPage('about')} style={{cursor: "default"}}> About Us </button>
        </nav>
      </div>
      
      <div id='demo'>
        {renderPage()}
      </div>
      <div id='footer'>
        <h2>Open Source & MIT Licensed</h2>
      </div>
    </>
  );
}


export default App;
