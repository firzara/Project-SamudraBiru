const express = require('express');
const app = express();
const router = require('./routes/routes');
const cors = require('cors');
const bodyParser = require('body-parser')

app.use(function (req, res, next) {
  res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(cors());

app.use(bodyParser.json());

app.use(router);
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(8001, () => {
  console.log('Server is running on port 8080');
});
