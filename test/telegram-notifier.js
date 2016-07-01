"use strict";

var assert = require('assert');
var sinon = require('sinon');
var TelegramNotifier = require('../telegram-notifier');

describe('TelegramNotifier', function(){
  it('Sends a notification', function(){
    var spy = sinon.spy();
    var notifier = new TelegramNotifier({webUrl: 'http://foo.bar', telebotToken: 'xxx'}, {post: spy});
    notifier.notify({ players:
      {
      '1': { player: { name: 'blub' }},
      '2': { player: { name: 'zirp' }}
      },
      name: 'dota',
      matchid: '111'
    });
    //TODO assert things
    console.log(spy.args[0][0]);
  });
});
