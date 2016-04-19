"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
require('express-ws')(app);
var aggregator = require('./aggregator');

var clients = {};

app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));

app.post('/', function(req, res){
  console.log(req.body);
  sendAll(req.body.map.matchid, aggregator.process(req.body));
  res.send();
});
app.ws('/updates/:id', function(ws, req){
  var id = req.params.id;
  console.log('new guy! ' + id);
  if(!clients[id]) { clients[id] = [] };
  clients[id].push(ws);

  ws.on('message', function(msg){
    console.log('well hi, ' + msg);
  });
});

module.exports = app;

var appPort = 8080;
app.listen(appPort);
console.log('Webserver running on port '+appPort);

function sendAll(id, msg){
  clients[id].forEach(function(ws){
    ws.send(msg);
  });
}


//http://cdn.dota2.com/apps/dota2/images/heroes/bloodseeker_full.png
//http://cdn.dota2.com/apps/dota2/images/items/force_staff_lg.png



