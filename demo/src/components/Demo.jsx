import './Demo.css';

function Demo(){
    return (
      <div id='demo'>
        <h1>Demo</h1>
        <h2>Field-level caching for your GraphQL queries:</h2>
        <img className='demovid' src='https://i.imgur.com/WJ2t1we.gif' alt='Video showing field level caching'></img>
        <h2>Handling invalid and illegal queries:</h2>
        <img className='demovid' src='https://i.imgur.com/85r30Ol.gif' alt='Video showing security features'></img>
        <h2>BuQL supports mutations, too:</h2>
        <img className='demovid' src='https://i.imgur.com/4hvl022.gif' alt='Video showing successful mutation queries'></img>
      </div>
    );
}

export default Demo;