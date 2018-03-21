var express = require('express');

const app = require('./app');

const port = process.env.PORT || 5500;

app.listen(port, function() {
  console.log('Server Started on port ' + port);
});
