var path = require('path');
var express = require('express');
var app = express();

app.use(express.static('public'));

app.listen(8910, function () {
  console.log('Server is listening on 8910.');
});
