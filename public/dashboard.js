//(function(){
  "use strict";
  var matchid = location.hash.substring(1);
  var content = document.getElementById("content");
  content.innerText = "Sup";

  if(matchid !== ""){
    var ws = new WebSocket("ws://"+location.host+"/updates/" + matchid, "dota-dashboard");
    ws.onopen = function(){
      //socket.send("hi from the browser!");
      console.log("OPEN");
      content.innerText = "Connected";
    };

    ws.onmessage = function(e){
      console.log("MESSAGE" + e.data);
      content.innerText = e.data;
    };

    ws.onerror = function(e){
      console.log("ERROR" + e);
      content.innerText = e.data;
    };

    ws.onclose = function(){
      console.log("CLOSE");
      content.innerText = "Closed.";
    };
  } else {
    content.innerText = "No match-id";
  }
//})();
