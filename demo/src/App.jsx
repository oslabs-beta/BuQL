import {useState} from 'react';
import './App.css';
import Home from './components/Home.jsx';
import AboutUs from './components/AboutUs.jsx';
import Demo from './components/Demo.jsx';

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
          <a href='https://twitter.com/_BuQL_' style={{cursor: 'default'}}>
            <img src='/twitter2.svg' className='sociallogo' alt='Twitter' />
          </a>
          <a href='https://www.linkedin.com/company/buql/' style={{cursor: 'default'}}>
            <img src='https://i.imgur.com/tKZBw1E.png' className='sociallogo' alt='Linkedin' type='image/png'/>
          </a>
          <a
            href='https://medium.com/@dylan.e.briar/looking-for-a-graphql-caching-solution-in-bun-its-time-to-buql-up-b2742f07847f'
            style={{cursor: 'default'}}
          >
            <img src='https://i.imgur.com/Kjqw8Ry.png' className='sociallogo' alt='Medium' type='image/png'/>
          </a>
          <a href='https://github.com/oslabs-beta/BuQL' style={{cursor: 'default'}}>
            <img src='https://i.imgur.com/3T0pAIC.png' className='sociallogo' alt='GitHub' type='image/png'/>
          </a>
        </nav>
        <img className='logo' src='https://i.imgur.com/aAYWPCb.png'></img>
        <h1 className='buql' onClick={() => setCurrentPage('home')} style={{cursor: 'default'}}>BuQL</h1>
        <img className='logo' src='https://i.imgur.com/aAYWPCb.png'></img>
        <nav id='pages'>
          <button onClick={() => setCurrentPage('demo')} style={{cursor: 'default'}}>Demo</button>
          <button onClick={() => setCurrentPage('about')} style={{cursor: 'default'}}>About Us</button>
        </nav>
      </div>
      <div id='home'>
        {renderPage()}
        </div>
      <div id='footer'>
        <h2>Open Source & MIT Licensed</h2>
      </div>
    </>
  );
}

export default App;
