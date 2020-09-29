const path = require('path');
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('../build'))
app.use(require('prerender-node').set('prerenderToken', '0X9b7gyycgpGRFHQU0qJ'));

app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../build/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
