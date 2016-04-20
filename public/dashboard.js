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

  Handlebars.registerHelper('heroImage', function(name){
    name = name.replace('npc_dota_hero_','');
    return new Handlebars.SafeString(
        "<img src='http://cdn.dota2.com/apps/dota2/images/heroes/"+name+"_full.png'/>"
    );
  });
  Handlebars.registerHelper('itemImage', function(name, key){
    if(key.indexOf('slot') === -1) {return "";}

    name = name.replace('item_','');
    return new Handlebars.SafeString(
        "<img src='http://cdn.dota2.com/apps/dota2/images/items/"+name+"_lg.png'/>"
    );
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
  var sample = {"players":{"zz":{
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
        "kills": 0,
        "deaths": 0,
        "assists": 0,
        "last_hits": 0,
        "denies": 0,
        "kill_streak": 0,
        "team_name": "radiant",
        "gold": 80,
        "gold_reliable": 0,
        "gold_unreliable": 80,
        "gpm": 100,
        "xpm": 0
      },
    "hero": {
        "id": 36,
        "name": "npc_dota_hero_necrolyte",
        "level": 1,
        "alive": true,
        "respawn_seconds": 0,
        "buyback_cost": 130,
        "buyback_cooldown": 0,
        "health": 503,
        "max_health": 503,
        "health_percent": 100,
        "mana": 338,
        "max_mana": 338,
        "mana_percent": 100,
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
              "name": "item_ward_dispenser",
              "can_cast": true,
              "cooldown": 0,
              "passive": false,
              "charges": 1
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
  },"clock_time":-39};
  content.innerHTML = template(sample);
//})();
