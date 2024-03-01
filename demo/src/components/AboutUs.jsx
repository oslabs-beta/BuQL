import './AboutUs.css'

function AboutUs(){
    return(
    <div id='aboutUs'>
            <div className="team-container">
                <container className="team-member">
                    <h2 >Dylan Compton</h2>
                    <div id='linked-git'>
                        <a href='https://www.linkedin.com/in/dylanbriar/' style={{cursor: 'default'}}>
                            <img type='image/png' src='https://i.imgur.com/tKZBw1E.png' className='sociallogo' alt='Linkedin'/> 
                        </a>
                        <a href='https://github.com/dylanbriar' style={{cursor: 'default'}}>
                            <img src='https://i.imgur.com/3T0pAIC.png' className='sociallogo' alt='GitHub' type='image/png'/>
                        </a>
                    </div>
                </container>
                <div className="team-member">
                    <h2>Jake Diamond</h2>
                    <div id='linked-git'>
                        <a href='https://www.linkedin.com/in/jake-diamond5/' style={{cursor: 'default'}}>
                            <img type='image/png' src='https://i.imgur.com/tKZBw1E.png' className='sociallogo' alt='Linkedin'/> 
                        </a>
                        <a href='https://github.com/jldiamond' style={{cursor: 'default'}}>
                            <img src='https://i.imgur.com/3T0pAIC.png' className='sociallogo' alt='GitHub' type='image/png'/>
                        </a>
                    </div>
                </div>
                <div className="team-member">
                    <h2>Julien Kerekes</h2> 
                    <div id='linked-git'>
                        <a href='https://www.linkedin.com/in/julien-kerekes/' style={{cursor: 'default'}}>
                            <img type='image/png' src='https://i.imgur.com/tKZBw1E.png' className='sociallogo' alt='Linkedin'/> 
                        </a>
                        <a href='https://github.com/julien-kerekes' style={{cursor: 'default'}}>
                            <img src='https://i.imgur.com/3T0pAIC.png' className='sociallogo' alt='GitHub' type='image/png'/>
                        </a>
                    </div>
                </div>
                <div className="team-member">
                    <h2>Joseph McGarry</h2>
                    <div id='linked-git'>
                        <a href='https://www.linkedin.com/in/joseph-mcgarry/' style={{cursor: 'default'}}>
                            <img type='image/png' src='https://i.imgur.com/tKZBw1E.png' className='sociallogo' alt='Linkedin'/> 
                        </a>
                        <a href='https://github.com/Joseph-McGarry' style={{cursor: 'default'}}>
                            <img src='https://i.imgur.com/3T0pAIC.png' className='sociallogo' alt='GitHub' type='image/png'/>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}





export default AboutUs;