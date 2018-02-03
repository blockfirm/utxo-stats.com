const path = require('path');
const express = require('express');
const app = express();

const PORT = 8910;

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}.`);
});
