var stage;
var ticker;

window.onload = Init;
//Useless variable
var Ease = createjs.Ease;
//document.addEventListener('keydown', pdown);

function Init(){
	stage = new createjs.Stage("GameCanvas");

	ticker = createjs.Ticker.addEventListener("tick", handleTick);
	ticker.framerate = 30;
  
  
}

function handleTick(){
	
}

function newGame(){
  	var block = new createjs.Shape().set({x:Math.floor(Math.random() * 580) + 10, y:Math.floor(Math.random() * 3)*100, scaleX:1});
    block.graphics.beginFill("green").drawRect(0,0,50,30);
}
