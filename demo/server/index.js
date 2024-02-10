import express from 'express';
import path from 'path';
import cors from 'cors';

// import routers

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// configure routes
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});

// serve static files (index.html)
app.use(express.static(path.join(__dirname, '../client')));

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
