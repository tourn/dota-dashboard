"use strict";


function TelegramNotifier(config, mockRequest){
  var request = mockRequest || require('request');

  this.notify = function(match){
    var players = Object.keys(match.players).map(function(steamid){
      return match.players[steamid].player.name;
    });
    var msg = players.join(", ") + " just started a match of " + match.name.replace('_',' ') + ". [Dashboard]("+config.webUrl+"#"+match.matchid+")";
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
    }, function(err, resp, body){
    console.log(body);
    });
  }

}

module.exports = TelegramNotifier;
