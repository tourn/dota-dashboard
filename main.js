"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
require('express-ws')(app);
var Aggregator = require('./aggregator');
var TelegramNotifier = require('./telegram-notifier');

var config = require('./config');

var clients = {};
var aggregator = new Aggregator();
var notifier = new TelegramNotifier(config);

aggregator.notifier = notifier.notify;

app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));

app.post('/', function(req, res){
  //console.log("got update! ");
  aggregator.process(req.body);
  res.send();
});
app.ws('/updates/:id', function(ws, req){
  var id = req.params.id;
  //console.log('new guy! ' + id);
  if(!clients[id]) { clients[id] = []; }
  clients[id].push(ws);

  ws.on('message', function(msg){
    //console.log('well hi, ' + msg);
  });
});

app.listen(config.appPort);
console.log('Webserver running on port '+config.appPort);

function sendUpdates(){
  aggregator.tickNotify();
  //console.log("sendUpdates");
  Object.keys(clients).forEach(function(matchid){
    var matchClients = clients[matchid];
    var match = aggregator.get(matchid);
    //console.log("match " + matchid);
    var count = 0;
    //matchClients.forEach(function(ws){
    for(var i = matchClients.length -1; i >= 0; i--){
      var ws = matchClients[i];
      if(ws.readyState === 1){
        count++;
        ws.send(JSON.stringify(match));
      } else {
				matchClients.splice(i, 1); //clean out closed socket
				console.log("removed empty socket " + ws);
      }
    }
    //console.log("sent to " + count + " clients");
  });
}

setInterval(sendUpdates, config.update_interval_ms);

