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

  Handlebars.registerHelper('roshan', function(pickupTime, gameTime){
    if(pickupTime < 0 || gameTime - pickupTime > 11*60){
      return "Up";
    } else {
      return formatTime(pickupTime + 8*60) + " - " + formatTime(pickupTime + 11*60);
    }
  });

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
      console.log("OPEN");
      content.innerText = "Connected";
    };

    ws.onmessage = function(e){
      //console.log("MESSAGE" + e.data);
      console.log("MESSAGE");
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
//})();
