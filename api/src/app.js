const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({ origin: '*' }));
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const port = 3001;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

module.exports = app;
