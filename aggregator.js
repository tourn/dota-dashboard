"use strict";

var Aggregator = function(){
  var self = this;
  var matches = {};

  this.notifier = function() { console.log('NULL NOTIF'); }; //null notifier
  this.matches = matches;
  this.process = function(data){
    if(data.map && data.map.matchid !== 0 && !is_spectator(data)){
      store(data);
    }
    //return render(data.map.matchid);
  };

  function is_spectator(data){
    return !!data.map.roshan_state;
  }

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
      if(Object.keys(match.players).length < 2) { return false; }
      if(match.game_state !== 'DOTA_GAMERULES_STATE_PRE_GAME' && match.game_state !== 'DOTA_GAMERULES_STATE_GAME_IN_PROGRESS') { return false; }
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
    match.game_state = match.players[data.player.steamid].map.game_state || 'ifuckedup';
    if(aegisAvailable(match) && aegisPickedUp(match)){
      match.aegis_pickup = match.clock_time;
    }
  }

  function aegisAvailable(match){
    return match.clock_time - match.aegis_pickup >= 8*60;
  }

  function aegisPickedUp(match){
    for(var key in match.players){
      if(!match.players.hasOwnProperty(key)) { continue; }
      var player = match.players[key];
      for(var ikey in player.items){
        if(!player.items.hasOwnProperty(ikey)) { continue; }
        var item = player.items[ikey];
        if(item.name === 'item_aegis') { return true; }
      }
    }
    return false;
  }


  function render(matchid){
    return matches[matchid];
  }

  function getMatch(id){
    var match = matches[id];
    if(!match){
      match = { players: {} };
      match.aegis_pickup = -1000;
      matches[id] = match;
    }
    return match;
  }

};

module.exports = Aggregator;
