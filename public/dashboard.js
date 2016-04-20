//(function(){
  "use strict";
  var matchid = location.hash.substring(1);
  var content = document.getElementById("content");

  if(matchid !== ""){
    connect(matchid);
  } else {
    document.getElementById("track").addEventListener('click', function(){
      var id = document.getElementById("id").value;
      window.location.href='#'+id;
      connect(id);
    });
  }

  function formatTime(seconds){
    var minus = '';
    if(seconds < 0){
      seconds *= -1;
      minus = '-';
    }
    var m = Math.floor(seconds/60);
    var s = String("00" + seconds % 60).slice(-2);
    return minus + m + ":" + s;
  }

  Handlebars.registerHelper('clock', formatTime);

  //FIXME this appears to be lying, extract and make testable
  Handlebars.registerHelper('buyback', function(hero, player){
    if(hero.buyback_cooldown) { return "No ("+formatTime(hero.buyback_cooldown)+")"; }
    var unreliable_gold_after_death = Math.max(0, player.gold_unreliable - 30 * hero.level);
    var delta = player.gold_reliable + unreliable_gold_after_death - hero.buyback_cost;
    if(delta <= 0){
      return "No ("+delta+")";
    } else {
      return "Yes";
    }
  });

  Handlebars.registerHelper('heroImage', function(name, alive){
    var deadClass = alive? "" : "dead";
    name = name.replace('npc_dota_hero_','');
    return new Handlebars.SafeString(
        //or _vert.jpg for vertical
        "<img src='http://cdn.dota2.com/apps/dota2/images/heroes/"+name+"_full.png' class='u-full-width "+deadClass+"'/>"
    );
  });
  Handlebars.registerHelper('itemImage', function(name, key){
    if(key.indexOf('slot') === -1) {return "";}

    name = name.replace('item_','');
    if(name === 'empty'){
      return new Handlebars.SafeString("<span class='itemimg'></span>");
    } else {
      return new Handlebars.SafeString(
          "<img src='http://cdn.dota2.com/apps/dota2/images/items/"+name+"_lg.png' class='itemimg'/>"
      );
    }
  });
  Handlebars.registerHelper('stashImage', function(name, key){
    if(key.indexOf('stash') === -1) {return "";}

    name = name.replace('item_','');
    if(name === 'empty'){
      return new Handlebars.SafeString("<span class='stashimg'></span>");
    } else {
      return new Handlebars.SafeString(
          "<img src='http://cdn.dota2.com/apps/dota2/images/items/"+name+"_lg.png' class='stashimg'/>"
      );
    }
  });
  var template = Handlebars.compile(document.getElementById("match-template").innerText);

  function connect(id){
    var ws = new WebSocket("ws://"+location.host+"/updates/" + id, "dota-dashboard");
    ws.onopen = function(){
      //socket.send("hi from the browser!");
      console.log("OPEN");
      //content.innerText = "Connected";
    };

    ws.onmessage = function(e){
      console.log("MESSAGE" + e.data);
      content.innerHTML = template(JSON.parse(e.data));
    };

    ws.onerror = function(e){
      console.log("ERROR" + e);
      content.innerText = e.data;
    };

    ws.onclose = function(){
      console.log("CLOSE");
      content.innerText = "Closed.";
    };
  }
  var sample = {"players":{
    "zz":{
    "provider": {
        "name": "Dota 2",
        "appid": 570,
        "version": 44,
        "timestamp": 1461085219
      },
    "map": {
        "name": "dota",
        "matchid": 0,
        "game_time": 259,
        "clock_time": 116,
        "daytime": true,
        "nightstalker_night": false,
        "game_state": "DOTA_GAMERULES_STATE_GAME_IN_PROGRESS",
        "win_team": "none",
        "customgamename": "",
        "ward_purchase_cooldown": 0
      },
    "player": {
        "steamid": "76561198007555251",
        "name": "blub_is_zirp",
        "activity": "playing",
        "kills": 3,
        "deaths": 2,
        "assists": 7,
        "last_hits": 124,
        "denies": 7,
        "kill_streak": 2,
        "team_name": "radiant",
        "gold": 322,
        "gold_reliable": 0,
        "gold_unreliable": 80,
        "gpm": 420,
        "xpm": 999
      },
    "hero": {
        "id": 36,
        "name": "npc_dota_hero_windrunner",
        "level": 24,
        "alive": true,
        "respawn_seconds": 0,
        "buyback_cost": 130,
        "buyback_cooldown": 122,
        "health": 420,
        "max_health": 503,
        "health_percent": 85,
        "mana": 100,
        "max_mana": 338,
        "mana_percent": 35,
        "silenced": false,
        "stunned": false,
        "disarmed": false,
        "magicimmune": false,
        "hexed": false,
        "muted": false,
        "break": false,
        "has_debuff": false
      },
    "abilities": {
        "ability0": {
              "name": "necrolyte_death_pulse",
              "level": 1,
              "can_cast": true,
              "passive": false,
              "ability_active": true,
              "cooldown": 0,
              "ultimate": false
            },
        "ability1": {
              "name": "necrolyte_heartstopper_aura",
              "level": 0,
              "can_cast": false,
              "passive": true,
              "ability_active": true,
              "cooldown": 0,
              "ultimate": false
            },
        "ability2": {
              "name": "necrolyte_sadist",
              "level": 0,
              "can_cast": false,
              "passive": true,
              "ability_active": true,
              "cooldown": 0,
              "ultimate": false
            },
        "ability3": {
              "name": "necrolyte_reapers_scythe",
              "level": 0,
              "can_cast": false,
              "passive": false,
              "ability_active": true,
              "cooldown": 0,
              "ultimate": true
            },
        "attributes": {
              "level": 0
            }
      },
    "items": {
        "slot0": {
              "name": "item_branches",
              "can_cast": true,
              "cooldown": 0,
              "passive": false
            },
        "slot1": {
              "name": "item_mantle",
              "passive": true
            },
        "slot2": {
              "name": "item_clarity",
              "can_cast": true,
              "cooldown": 0,
              "passive": false,
              "charges": 1
            },
        "slot3": {
              "name": "item_tpscroll",
              "can_cast": true,
              "cooldown": 0,
              "passive": false,
              "charges": 1
            },
        "slot4": {
              "name": "empty",
            },
        "slot5": {
              "name": "item_tango",
              "can_cast": true,
              "cooldown": 0,
              "passive": false,
              "charges": 3
            },
        "stash0": {
              "name": "item_circlet",
              "passive": true
            },
        "stash1": {
              "name": "item_branches",
              "can_cast": true,
              "cooldown": 0,
              "passive": false
            },
        "stash2": {
              "name": "empty"
            },
        "stash3": {
              "name": "empty"
            },
        "stash4": {
              "name": "empty"
            },
        "stash5": {
              "name": "empty"
            }
      }
  }, 
    "yy": {
    "provider": {
        "name": "Dota 2",
        "appid": 570,
        "version": 44,
        "timestamp": 1461085219
      },
    "map": {
        "name": "dota",
        "matchid": 0,
        "game_time": 259,
        "clock_time": 116,
        "daytime": true,
        "nightstalker_night": false,
        "game_state": "DOTA_GAMERULES_STATE_GAME_IN_PROGRESS",
        "win_team": "none",
        "customgamename": "",
        "ward_purchase_cooldown": 0
      },
    "player": {
        "steamid": "76561198007555251",
        "name": "tourn",
        "activity": "playing",
        "kills": 3,
        "deaths": 2,
        "assists": 7,
        "last_hits": 124,
        "denies": 7,
        "kill_streak": 0,
        "team_name": "radiant",
        "gold": 80,
        "gold_reliable": 0,
        "gold_unreliable": 80,
        "gpm": 420,
        "xpm": 999
      },
    "hero": {
        "id": 36,
        "name": "npc_dota_hero_lina",
        "level": 22,
        "alive": false,
        "respawn_seconds": 120,
        "buyback_cost": 130,
        "buyback_cooldown": 0,
        "health": 420,
        "max_health": 503,
        "health_percent": 85,
        "mana": 100,
        "max_mana": 338,
        "mana_percent": 35,
        "silenced": false,
        "stunned": false,
        "disarmed": false,
        "magicimmune": false,
        "hexed": false,
        "muted": false,
        "break": false,
        "has_debuff": false
      },
    "abilities": {
        "ability0": {
              "name": "necrolyte_death_pulse",
              "level": 1,
              "can_cast": true,
              "passive": false,
              "ability_active": true,
              "cooldown": 0,
              "ultimate": false
            },
        "ability1": {
              "name": "necrolyte_heartstopper_aura",
              "level": 0,
              "can_cast": false,
              "passive": true,
              "ability_active": true,
              "cooldown": 0,
              "ultimate": false
            },
        "ability2": {
              "name": "necrolyte_sadist",
              "level": 0,
              "can_cast": false,
              "passive": true,
              "ability_active": true,
              "cooldown": 0,
              "ultimate": false
            },
        "ability3": {
              "name": "necrolyte_reapers_scythe",
              "level": 0,
              "can_cast": false,
              "passive": false,
              "ability_active": true,
              "cooldown": 0,
              "ultimate": true
            },
        "attributes": {
              "level": 0
            }
      },
    "items": {
        "slot0": {
              "name": "item_branches",
              "can_cast": true,
              "cooldown": 0,
              "passive": false
            },
        "slot1": {
              "name": "item_mantle",
              "passive": true
            },
        "slot2": {
              "name": "item_clarity",
              "can_cast": true,
              "cooldown": 0,
              "passive": false,
              "charges": 1
            },
        "slot3": {
              "name": "item_tpscroll",
              "can_cast": true,
              "cooldown": 0,
              "passive": false,
              "charges": 1
            },
        "slot4": {
              "name": "empty",
            },
        "slot5": {
              "name": "item_tango",
              "can_cast": true,
              "cooldown": 0,
              "passive": false,
              "charges": 3
            },
        "stash0": {
              "name": "item_circlet",
              "passive": true
            },
        "stash1": {
              "name": "item_branches",
              "can_cast": true,
              "cooldown": 0,
              "passive": false
            },
        "stash2": {
              "name": "empty"
            },
        "stash3": {
              "name": "empty"
            },
        "stash4": {
              "name": "empty"
            },
        "stash5": {
              "name": "empty"
            }
      }
  }
  }
  ,"clock_time":-39};
  content.innerHTML = template(sample);
//})();
