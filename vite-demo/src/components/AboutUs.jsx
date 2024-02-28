import './AboutUs.css'

function AboutUs(){
    return(
    <div id='aboutUs'>
            <h1>Meet the Team</h1>
            <h2></h2>
            <div className="team-container">
                <container className="team-member">
                    <h2 >Dylan Compton</h2>
                    <p>Demolitions Expert. </p>
                    <p>Crazy impersonations. </p>
                    <p>Good hair.</p>   
                </container>
                <div className="team-member">
                    <h2>Jake Diamond</h2>
                    <p>Mastermind.</p>
                    <p>Eagles fan...probably</p>
                    <p>Diamonds are forever.</p>
                </div>
                <div className="team-member">
                    <h2>Julien Kerekes</h2> 
                    <p>Gummybear Warlord.</p>  
                    <p>Git wizard.</p>  
                    <p>German.</p>  
                </div>
                <div className="team-member">
                    <h2>Joseph McGarry</h2> 
                    <p>Scavenger Mentality.</p>  
                    <p>Chicken Wing Aficionado</p>  
                    <p>Girthy.</p>    
                </div>
            </div>
        </div>
    );
}





export default AboutUs;