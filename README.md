<div width="200px" style="text-align: center;">

# BuQL </div>

<br>
<div width="200px" style="text-align: center;">
  <a href="https://bun.sh/"> <img alt="bun" src="https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white"/></a>
  <a href="https://graphql.org/"> <img alt="graphql" src="  https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white"/> </a>
  <a href="https://redis.io/"> <img alt="redis" src="https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white" /> </a>
  <br>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"> <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" /> </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/HTML"> <img alt="html5" src="https://img.shields.io/badge/-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"/></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS"> <img alt="css3" src="https://img.shields.io/badge/-CSS3-1572B6?style=for-the-badge&logo=html5&logoColor=white"/></a>

  <a href="https://expressjs.com/"> <img alt="Express" src="https://img.shields.io/badge/-Express-000000?style=for-the-badge&logo=express&logoColor=white"/></a>
  <a href="https://react.dev/"> <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/></a>
  <a href="https://eslint.org/"><img alt="eslint" src="https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white"/></a>
  <br>
  <a href="https://www.mongodb.com/"> <img alt="mongodb" src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"/></a>
  <a href="https://git-scm.com/"> <img alt="git" src="https://img.shields.io/badge/-Git-F05032?style=for-the-badge&logo=git&logoColor=white"/></a>
</div>

<br>

<div width="200px" style="text-align: center;">
<img alt="npm" src="https://img.shields.io/npm/v/npm" />
<a target="_blank" href="https://github.com/oslabs-beta/BuQL//blob/main/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/oslabs-beta/BuQL"></a>
</div>
<br>

## Skip to It
- [The Power of BuQL](https://github.com/oslabs-beta/buql/#Power)
- [From Start to Finish](https://github.com/oslabs-beta/buql/#Execution)
- [BuQLing Up](https://github.com/oslabs-beta/buql/#Using])
- [Becoming a BuQLer](https://github.com/oslabs-beta/buql/#Contribute)
- [Further Info](https://github.com/oslabs-beta/buql/#Info)

<h2 href="#Power">The Power of BuQL</h2>
Bun is an groundbreaking new runtime. GraphQL is an incredibly efficient query language. Ioredis is an optimized client of Redis, the state-of-the-art caching solution. What could they do when combined?

Welcome to BuQL, the harmonizing of Bun and GraphQL, with ioredis included for the most optimal query response times. Any developer with a Bun-based codebase can now utilize BuQL as an Express middleware to intercept queries, returning the responses from a cache when possible and caching them otherwise. BuQL is able to bring all of this to the table in an easy-to-use npm package equipped with security features to mitigate risk. 

Optimized response times via enhanced runtime speeds. Lightweight and flexible. Straightforward in use, elegant in performance. Keep extremities in at all times, it's time to BuQL up!

<h2 href="#Execution">From Start to Finish</h2>

[thread of execution explanation]

<h2 href="#Using">BuQLing Up</h2>


### 1. Getting started with Bun

Windows is typically not recommended, but here's how to on other OS's:

- MacOS and WSL
```
$ curl -fsSL https://bun.sh/install | bash 
```
(or, to install a specific version)

```
$ curl -fsSL https://bun.sh/install | bash -s "bun-v1.0.0"
```
- Linux

  - The `unzip` package is required to install Bun. Use `sudo apt install unzip` to install `unzip` package. Kernel version 5.6 or higher is strongly recommended, but the minimum is 5.1. Use `uname -r` to check Kernel version.
  - Once `unzip` package is installed, see WSL directions

<br> 

- Using npm (for the last time!)

```
$ npm install -g bun 
```
<br>

- Using Homebrew (macOS and Linux)
 ``` 
 $ brew install oven-sh/bun/bun 
 ```

 <br>

- Using docker
```
$ docker pull oven/bun
$ docker run --rm --init --ulimit memlock=-1:-1 oven/bun
```

<br>

- Using Proto 
```
$ proto install bun
```

<br>

### 2. BuQLing Up

 - Install BuQL
 ```
 $ bun install @buql/buql
 ```

 - Import it into the file you'll be working in, usually referred to as 'index.js'
 ```javascript
 import buql from '@buql/buql';
 ```

### 3. Installing and Connecting to an ioredis server

###### (We recommend using ioredis, as that is where we discovered the best performace. However, due to the syntactic similarities between Redis and its client ioredis, either one should work.) 
- Install ioredis
 ```
 $ bun install ioredis
 ```
- Import ioredis at the top of your main file, the same one as BuQL.
```javascript
import { Redis } from 'ioredis';
```
- Start redis server 
```
$ redis-server
```

Once Redis is installed, your server should reflect the below:

- Note: The default port is `6379`

```javascript
const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});
```
<br>

### 4. Utilizing GraphQL

- Install GraphQL
```
$ bun install graphql
$ bun install express-graphql
```
- Import the http function from GraphQL in the same folder as BuQL and ioredis:
```javascript
import { graphqlHTTP } from 'express-graphql';
```
<br>

### 5. Set up GraphQL schemas

If you're using BuQL, it's likely you've done this already. But just in case, here's some example code to give you an idea. These will likely be in their own schema folder that you will need to import into the same one as BuQL:

- Import relevant pieces of GraphQL:
```javascript
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
} from 'graphql';
```
- Define Schemas
```javascript
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    age: { type: GraphQLInt}
  }),
});
```
<br>

### 6. Pass the redis client & security options into the BuQL constructor!

- [directions needed]


### 7. Get to Work!

- [example code for how the client would use BuQL]

<h2 href="#Contribute">Becoming a BuQLer</h2>


From its conception, BuQL was developed to be an open-source product with a never ending journey to perfection! We gladly welcome any and all contributions, whether through iterations, additions, or general feedback! Here are some features we would love to see: 
- More in depth security
- More comprehensive testing
- Rejected mutation queries that clear the cache
- Removing the bug of caching bad queries
- The ability to handle nested queries
- A more detailed chart, with items such as average time to query cache vs database
- A more agnostic, unopinionated approach, allowing for use beyond just the Express framework.
<br>

At the end of the day, we welcome any and all ideas. Get creative!

<h2 href="#Info">Further Info</h2>
Feel free to dive deeper into BuQL itself...
<div width="200px" style="text-align: center;">
  <a href="MEDIUM-ARTICLE-GOES-HERE.COM"> <img alt="medium" src="https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white"/></a>
  <a href="https://www.linkedin.com/in/buql-osp-a43b892b6/"> <img alt="linked" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/> </a>
</div>

<br>
...or reach out to the team:
<table style="text-align: center;">
  <tr>
      <td valign="bottom"><h3 style="text-align: center;">Dylan Briar</h3></td>
      <td valign="bottom"><h3 style="text-align: center;">Jacob Diamond</h3></td>
      <td valign="bottom"><h3 style="text-align: center;">Julien Kerekes</h3></td>
      <td valign="bottom"><h3 style="text-align: center;">Joseph McGarry</h3></td>
  </tr>
  <tr>
    <td style="text-align: center;"><a href="https://www.linkedin.com/in/dylanbriar/"><img alt="linked" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/></a></td>
    <td style="text-align: center;"><a href="https://www.linkedin.com/in/jake-diamond5/"><img alt="linked" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/></a></td>
    <td style="text-align: center;"><a href="https://www.linkedin.com/in/julien-kerekes/"><img alt="linked" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/></a></td>
    <td style="text-align: center;"><a href="https://www.linkedin.com/in/joseph-mcgarry/"><img alt="linked" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/></a></td>
  </tr>
  <tr>
    <td style="text-align: center;"><a href="https://github.com/dylanbriar"><img alt="GitHub" src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white"/></a></td>
    <td style="text-align: center;"><a href="https://github.com/jldiamond"><img alt="GitHub" src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white"/></a></td>
    <td style="text-align: center;"><a href="https://github.com/julien-kerekes"><img alt="GitHub" src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white/"></a></td>
    <td style="text-align: center;"><a href="https://github.com/Joseph-McGarry"><img alt="GitHub" src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white"/></a></td>
  </tr>
</table>

<div style="text-align: center;">
<br> Send something to the whole team here!

<br>
  <a href="mailto:BuQLosp@gmail.com"> <img alt="gmail" src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white"/></a>
</div>
<div style="text-align: center;">

##

### Let us know you liked the project by clicking the star in the top right!

### Thanks and **BuQL Up**!

##
</div>