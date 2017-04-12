var stage;
var ticker;
var s;
window.onload = Init;
//Useless variable
var Ease = createjs.Ease;
document.addEventListener('keydown', pdown);
var b = [];
var bu = [];
var kill = 0;
var lvl = 1;

function Init(){
	if(!confirm("Wanna play")){
		window.location.href = "https://google.com";
	}
	stage = new createjs.Stage("GameCanvas");
	makePlayer();
	newGame();
	ticker = createjs.Ticker.addEventListener("tick", handleTick);
	ticker.framerate = 30;
  	
  
}

function pdown(event){
    if(event.keyCode == 37) {
	createjs.Tween.get(s, {override:true}).to({x:(s.x - 50).clamp(0,640)}, 450, Ease.Linear);   
    }else if(event.keyCode == 39) {
	   createjs.Tween.get(s, {override:true}).to({x:(s.x + 50).clamp(0,640)}, 450, Ease.Linear);   
    }else if(event.keyCode == 32) {
	   FireBullet();
    }
}

function handleTick(){
	bu.clean(undefined);
	b.clean(undefined);
	stage.update();
	if(b.length == 0){
		newGame();
		lvl++;

	}
	for (var i = 0; i < b.length; i++) {
		for (var j = 0; j < bu.length; j++) {
			if(bu[j].x + 2.5 >= b[i].x&& bu[j].x +2.5 <= b[i].x +50 && bu[j].y +5 <= b[i].y + 30 && bu[j].y+5 >= b[i].y){
				//alert("hit");
				stage.removeChild(bu[j]);
				stage.removeChild(b[i]);
				bu[j] = undefined;
				b[i] = undefined;
				kill++;
			}
			if(bu[j].y <= -100){
				if(confirm("You lose, retry?")){
					window.location.reload(); 
				}
				//bu.splice(j, 1);
			}
		}
	}
	document.getElementById("scoreboard").innerHTML="Kills: " +String(kill) + "  ";
	document.getElementById("level").innerHTML="Level: " +String(lvl) + "  ";
}

function newGame(){
	for (var i = 0; i < 10; i++) {
  	var block = new createjs.Shape().set({x:Math.floor(Math.random() * 58)*10 + 10, y:Math.floor(Math.random() * 4)*70, scaleX:1});
    	block.graphics.beginFill("green").drawRect(0,0,50,30);
	stage.addChild(block);
	b[i] = block;
	}
}

function FireBullet(){
	var block = new createjs.Shape().set({x:s.x, y:s.y - 10, scaleX:1});
    	block.graphics.beginFill("green").drawRect(0,0,5,10);
	createjs.Tween.get(block, {override:true}).to({y:(-1000).clamp(-1000,0)}, 3000, Ease.Linear); 
	stage.addChild(block);
	bu.splice(0,0,block);
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


/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

//For Cleaning MyPjokemon
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
