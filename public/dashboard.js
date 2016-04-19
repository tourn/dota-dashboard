//(function(){
  "use strict";
  var content = document.getElementById("content");
  content.innerText = "Sup";

  var ws = new WebSocket("ws://localhost:8080/updates", "dota-dashboard");
  ws.onopen = function(){
    //socket.send("hi from the browser!");
    content.innerText = "Connected";
  };

  ws.onmessage = function(e){
    content.innerText = e.data;
  };

  ws.onerror = function(e){
    console.log(e);
    content.innerText = e.data;
  };

  ws.onclose = function(){
    content.innerText = "Closed.";
  };
//})();
