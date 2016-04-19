"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var expressWs = require('express-ws')(app);

var clients = [];

app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));

app.post('/update', function(req, res){
  console.log(req.body);
  //sendAll(req.body);
  sendAll(JSON.stringify(req.body));
  res.send();
});
app.ws('/updates', function(ws, req){
  console.log('new guy!');
  clients.push(ws);

  ws.on('message', function(msg){
    console.log('well hi, ' + msg);
  });
});

module.exports = app;

var appPort = 8080;
app.listen(appPort);
console.log('Webserver running on port '+appPort);

function sendAll(msg){
  clients.forEach(function(ws){
    ws.send(msg);
  });
}



