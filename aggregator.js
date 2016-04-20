"use strict";

var Aggregator = function(){
  var matches = {};

  this.matches = matches;
  this.process = function(data){
    store(data);
    //return render(data.map.matchid);
  };

  this.get = function(id){
    return render(id);
  };

  function store(data){
    var match = getMatch(data.map.matchid);
    match.players[data.player.steamid] = data;
    match.clock_time = data.map.clock_time;
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
