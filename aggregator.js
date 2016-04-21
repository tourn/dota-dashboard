"use strict";

var notify_delay_ms = 20 * 1000;

var Aggregator = function(){
  var self = this;
  var matches = {};

  this.notifier = function() {}; //null notifier
  this.matches = matches;
  this.process = function(data){
    store(data);
    //return render(data.map.matchid);
  };

  this.get = function(id){
    return render(id);
  };

  this.tickNotify = function(){
    //todo: garbage collection
    Object.keys(matches).forEach(function(key){
      var match = matches[key];
      if(match.notified) { return; }
      if(new Date() - match.newPlayerTime < notify_delay_ms) { return; }
      if(Object.keys(match.players).length < 2) { return; }
      self.notifier(match);
      match.notified = true;
    });
  };

  function store(data){
    var match = getMatch(data.map.matchid);
    if(match.players[data.player.steamid] === undefined ){
      match.newPlayerTime = new Date();
    }
    match.players[data.player.steamid] = data;
    match.clock_time = data.map.clock_time;
    match.customgamename = data.map.customgamename;
    match.matchid = data.map.matchid;
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
