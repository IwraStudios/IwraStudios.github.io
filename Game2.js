var stage;
var ticker;
var s;
window.onload = Init;
//Useless variable
var Ease = createjs.Ease;
document.addEventListener('keydown', pdown);

function Init(){
	stage = new createjs.Stage("GameCanvas");
	makePlayer();
	ticker = createjs.Ticker.addEventListener("tick", handleTick);
	ticker.framerate = 30;
  	
  
}

function pdown(){
    if(event.keyCode == 37) {
	createjs.Tween.get(s, {override:true}).to({x:(s.x + 50).clamp(0,500)}, 450, Ease.Linear);   
    }else if(event.keyCode == 39) {
	   createjs.Tween.get(s, {override:true}).to({x:(s.x + 50).clamp(0,500)}, 450, Ease.Linear);   
    }else if(event.keyCode == 32) {
	   FireBullet();
    }
}

function handleTick(){
	stage.update();
}

function newGame(){
  	var block = new createjs.Shape().set({x:Math.floor(Math.random() * 580) + 10, y:Math.floor(Math.random() * 3)*100, scaleX:1});
    	block.graphics.beginFill("green").drawRect(0,0,50,30);
	stage.addChild(block);
}

function FireBullet(){
		
}

function makePlayer(){
 var g = new createjs.Graphics();
    g.setStrokeStyle(1);
    g.beginStroke(createjs.Graphics.getRGB(0,0,0));
    g.beginFill(createjs.Graphics.getRGB(255,0,0));
    g.drawCircle(0,0,3);

    s = new createjs.Shape(g);
    s.x = 300;
    s.y = 450;

    stage.addChild(s);
    stage.update();	
}
