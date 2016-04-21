"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
require('express-ws')(app);
var Aggregator = require('./aggregator');
var request = require('request');

var config = require('./config');

var clients = {};
var aggregator = new Aggregator();

aggregator.notifier = function(match){
  var players = Object.keys(match.players).map(function(steamid){
    return match.players[steamid].player.name;
  });
  var gamename = match.customgamename || 'Dota';
  var msg = players.join(", ") + " just started a match of " + gamename + ". [Dashboard]("+config.webUrl+"#"+match.matchid+")";
  console.log(msg);
  sendToTelegram(msg);
};

function sendToTelegram(msg){
  request.post({
    url: 'https://api.telegram.org/bot'+config.telebotToken+'/sendMessage',
    formData: {
      chat_id: config.chatId,
      parse_mode: "markdown",
      text: msg
    }
  });
}

app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));

app.post('/', function(req, res){
  console.log("got update!");
  aggregator.process(req.body);
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

app.listen(config.appPort);
console.log('Webserver running on port '+config.appPort);

function sendUpdates(){
  aggregator.tickNotify();
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
        //TODO clean out closed sockets?
      }
    });
    console.log("sent to " + count + " clients");
  });
}

setInterval(sendUpdates, config.update_interval_ms);

