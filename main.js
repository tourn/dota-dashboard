"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
require('express-ws')(app);
var Aggregator = require('./aggregator');
var Notifier = require('./notifier');

var appPort = 1234;
var update_interval_ms = 1000;
var clients = {};
var aggregator = new Aggregator();
var notifier = new Notifier();

app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));

app.post('/', function(req, res){
  console.log("got update!");
  var id = req.body.map.matchid;
  aggregator.process(req.body);
  notifier.process(id);
  res.send();
});
app.ws('/updates/:id', function(ws, req){
  var id = req.params.id;
  console.log('new guy! ' + id);
  if(!clients[id]) { clients[id] = []; }
  clients[id].push(ws);

  ws.on('message', function(msg){
    console.log('well hi, ' + msg);
  });
});

app.listen(appPort);
console.log('Webserver running on port '+appPort);

function sendUpdates(){
  console.log("sendUpdates");
  Object.keys(clients).forEach(function(matchid){
    var matchClients = clients[matchid];
    var match = aggregator.get(matchid);
    console.log("match " + matchid);
    var count = 0;
    matchClients.forEach(function(ws){
      if(ws.readyState === 1){
        count++;
        ws.send(JSON.stringify(match));
      } else {
        console.log("EEK");
      }
    });
    console.log("sent to " + count + " clients");
  });
}

setInterval(sendUpdates, update_interval_ms);

