"use strict";
var Aggregator = require('../aggregator');
var pregame = require('./data/pregame');

describe('Aggregator', function(){

  var aggregator;
  before(function(){
    aggregator = new Aggregator();
  });

  it('Stores a result', function(){
    var result = aggregator.process(pregame);
    console.log(result);
  });

});
