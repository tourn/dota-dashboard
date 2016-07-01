"use strict";
var Aggregator = require('../aggregator');
var assert = require('assert');
var sinon = require('sinon');

function makeData(){
  return JSON.parse(JSON.stringify(require('./data/pregame-blub'))); //make a fresh copy
}

describe('Aggregator', function(){

  var aggregator;
  var data;
  beforeEach(function(){
    data = makeData();
    aggregator = new Aggregator();
  });

  it('Stores an update for a match with non-0 ID', function(){
    aggregator.process(data);
    var result = aggregator.get('1337');

    assert.equal(1337, result.matchid);
  });

  it('Ignores updates for match id 0', function(){
    data.map.matchid = 0;
    aggregator.process(data);
    var result = aggregator.get('0');
    assert.strictEqual(undefined, result);
  });

  it('Ignores data of spectators', function(){
    var data = require('./data/inprogress-spectator');
    aggregator.process(data);
    var result = aggregator.get('2439597301');
    assert.strictEqual(undefined, result);
  });

  describe('tickNotify', function(){
    var notify, blub, zirp;

    beforeEach(function(){
      notify = sinon.spy();
      //aggregator = new Aggregator();
      aggregator.notifier = notify;
      blub = makeData();
      blub.player.name = 'blub';
      blub.player.steamid = '1';
      zirp = makeData();
      zirp.player.name = 'zirp';
      zirp.player.steamid = '2';
    });

    it('notifies when 2+ players hit the pregame', function(){
      aggregator.process(blub);
      aggregator.process(zirp);
      aggregator.tickNotify();

      var msg = notify.args[0][0];
      assert.ok(msg.players['1']);
      assert.ok(msg.players['2']);
    });

    it('does not notify before pregame', function(){
      blub.map.game_state = 'WHATEVER';
      zirp.map.game_state = 'WHATEVER';
      aggregator.process(blub);
      aggregator.process(zirp);
      aggregator.tickNotify();
      assert.strictEqual(false, notify.called);
    });

    it('does not notify for a single player', function(){
      aggregator.process(blub);
      aggregator.tickNotify();
      assert.strictEqual(false, notify.called);
    });
  });

  describe('aegis tracker', function(){
    beforeEach(function(){
      data.map.clock_time = 0;
      aggregator.process(data);

      assert(aggregator.get(1337).aegis_pickup < 0);

      data.map.clock_time = 60;
      data.items.slot0.name = 'item_aegis';
      aggregator.process(data);
    });

    it('sets the pickup timer correctly', function(){
      assert.equal(60, aggregator.get(1337).aegis_pickup);
    });

    it('keeps the timer when aegis gets lost', function(){
      data.map.clock_time = 120;
      data.items.slot0.name = '';
      aggregator.process(data);
      assert.equal(60, aggregator.get(1337).aegis_pickup);
    });

    it('does not check for aegis for 8 minutes after pickup', function(){
      data.map.clock_time = 120;
      aggregator.process(data);
      assert.equal(60, aggregator.get(1337).aegis_pickup);
    });

    it('detects new aegis when rosh can respawn', function(){
      data.map.clock_time = 120;
      data.items.slot0.name = '';
      aggregator.process(data); //lose aegis

      data.map.clock_time = 540;
      data.items.slot0.name = 'item_aegis';
      aggregator.process(data); //pick new aegis
      assert.equal(540, aggregator.get(1337).aegis_pickup);
    });

  });
});
