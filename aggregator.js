"use strict";

var notify_delay_ms = 20 * 1000;

var Aggregator = function(){
  var self = this;
  var matches = {};

  this.notifier = function() { console.log('NULL NOTIF')}; //null notifier
  this.matches = matches;
  this.process = function(data){
    if(data.map && data.map.matchid !== 0){
      store(data);
    }
    //return render(data.map.matchid);
  };

  this.get = function(id){
    return render(id);
  };

  this.tickNotify = function(){
    //todo: garbage collection
    Object.keys(matches).forEach(function(key){
      var match = matches[key];
      if(shouldNotify(match)){
        self.notifier(match);
        match.notified = true;
      }
    });
  };

  function shouldNotify(match){
      if(match.notified) { return false; }
      //if(new Date() - match.newPlayerTime < notify_delay_ms) { return false; }
      if(Object.keys(match.players).length < 2) { console.log("skip notify cause too few players"); return false; }
      if(match.game_state !== 'DOTA_GAMERULES_STATE_PRE_GAME' && match.game_state !== 'DOTA_GAMERULES_STATE_GAME_IN_PROGRESS') { console.log("skip notify cause gs:" + match.game_state); return false; }
      console.log("NOTIFIED!");
      return true;
  }

  function store(data){
    var match = getMatch(data.map.matchid);
    if(match.players[data.player.steamid] === undefined ){
      match.newPlayerTime = new Date();
    }
    match.players[data.player.steamid] = data;
    match.clock_time = data.map.clock_time;
    match.name = data.map.name;
    match.matchid = data.map.matchid;
    match.game_state = match.players[data.player.steamid].map.game_state || 'ifuckedup'
  }

  function render(matchid){
    return matches[matchid];
  }

  function getMatch(id){
    var match = matches[id];
    if(!match){
      match = { players: {} };
      matches[id] = match;
    }
    return match;
  }

};

module.exports = Aggregator;
