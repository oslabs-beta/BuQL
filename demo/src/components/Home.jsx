import './Home.css'

function Home(){
    return (
        <div>
            <div id='home'>
                <h1>BuQL:</h1>
                <h2>Light-weight NPM package for intercepting and caching in GraphQL</h2>
                <p>BuQL is a tool designed to address the specific needs of developers working with GraphQL 
                    in the Bun runtime environment. Recognizing the importance of efficient data management, 
                    BuQL integrates with Redis to offer improved performance in data retrieval and caching. 
                    This solution aims to streamline the handling of server-side GraphQL queries, 
                    enhancing speed without compromising on reliability or security.
                </p>
                <p>The development and continuous improvement of BuQL are driven by community feedback and collaboration. 
                    We value the insights and contributions from developers who use BuQL in their projects, 
                    as these experiences are crucial for evolving the tool's capabilities. 
                    Looking ahead, BuQL's development includes plans to introduce features 
                    like client-side caching and expanded security options, 
                    with the goal of supporting a broader range of GraphQL applications.
                </p>
                <p>We encourage developers interested in optimizing their GraphQL implementations to explore BuQL's capabilities. 
                    Our GitHub repository provides detailed information and documentation to help you get started, 
                    and our LinkedIn community offers a platform for discussion, feedback, and sharing best practices. 
                    BuQL represents our commitment to enhancing GraphQL performance, driven by real-world applications and developer insights.                    
                </p>
            </div>
        </div>
    )
}


export default Home;