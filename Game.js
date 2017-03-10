//Game.js

var position = 0;
var hitmap;
var current_map;
var objs = [];
var stage;
var timer = 0;
var grid = 64;
var mt = 0;
var char;
var charx = 320;
var chary = 256;
var chararr;
var chartx = 0;
var charty = 0;
var allowedMove = true;

var World_Container;
window.onload = Init;

var Ease = createjs.Ease;
document.addEventListener('keydown', function(event) {
    //var tx = parseInt(World_Container.x * -1);
    //var ty = parseInt(World_Container.y * -1);
    pointChar(event.keyCode);
    if(World_Container.x % 32 !=0 || World_Container.y % 32 !=0 || !allowedMove){
	  return;
    }else{allowedMove = false;}
	
    
    //removeTweens(World_Container);
	
    if(event.keyCode == 37) {
	if(hitmap[charty][chartx-1] != 1){
	chartx--;
	}
    }else if(event.keyCode == 39) {
	if(hitmap[charty][chartx+1] != 1){
	chartx++;
	}else{console.log("blocked" + String(event.keyCode));}
    }else if(event.keyCode == 38){
	 if(hitmap[charty-1][chartx] != 1){
	 charty--; 
	 }else{console.log("blocked" + String(event.keyCode));}
    }else if(event.keyCode == 40){
	 if(hitmap[charty+1][chartx] != 1){
	 charty++;
	 }else{console.log("blocked" + String(event.keyCode));}
    }
	createjs.Tween.get(World_Container).to({x:(chartx* -1 * grid).clamp(-10000,0), y:(charty* -1 * grid).clamp(-10000,0)}, 500, Ease.qaudOut).call(handleComplete);
	stage.update();
});

function handleComplete(){
	allowedMove = true;	
}

var toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

function pointChar(dir){
	switch(dir){
		case 37:
			char.image = chararr[10].image;
			//char = new createjs.Bitmap("./images/char1/4.png");
			char.name = "./images/char1/4.png";

			break;
		case 38:
			char.image = chararr[0].image;
			//char = new createjs.Bitmap("./images/char1/12.png");
			char.name = "./images/char1/12.png";
			break;
		case 39:
			char.image = chararr[4].image;
			//char = new createjs.Bitmap("./images/char1/10.png");
			char.name = "./images/char1/10.png";
			break;
		case 40:
			char.image = chararr[12].image;
			//char = new createjs.Bitmap("./images/char1/0.png");
			char.name = "./images/char1/0.png";
			break;
		
			
		  }
	char.x = charx;
	char.y = chary;
	stage.update();
}

function loadf() { //Debug
		var fileInput = document.getElementById('fileInput');
		//var fileDisplayArea = document.getElementById('fileDisplayArea');
		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			var textType = /text.*/;

			if (file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					//Do stuff
					LoadHitMap(deserialize(reader.result.split("?")[1]));
					LoadMap(deserialize(reader.result.split("?")[0]), {"tp":"1,3"});
					//console.log(reader.result);
				}

				reader.readAsText(file);	
			} else {
				console.log("File not supported!");
			}
		});
}


function Init(){
	loadf();
	serialize = serialijse.serialize;
	deserialize = serialijse.deserialize;
	stage = new createjs.Stage("GameCanvas");

	World_Container = new createjs.Container();
	chararr = [];
	for(var l=0; l<16;l++){
	chararr.splice(0, 0, new createjs.Bitmap("./images/char1/"+ String(l) +".png"));
	}
	char = new createjs.Bitmap("./images/char1/0.png")
	char.image = chararr[0].image;
	char.x = charx;
	char.y = chary;
	stage.addChild(World_Container);
	
	stage.addChild(char);
	World_Container.scaleX = 2;
	World_Container.scaleY = 2;
	ticker = createjs.Ticker.addEventListener("tick", handleTick);
	ticker.framerate = 30;
}


 function handleTick(event) {
     // Actions carried out each tick (aka frame)
     if (!event.paused) {
	     	 if(timer % 4 ==0){
        		 World_Container.sortChildren(sortByLayer);
			 World_Container.scaleX = 2;
			 World_Container.scaleY = 2;
		 }
		 timer++;
	     	
		 stage.update();
     }
 }

function LoadHitMap(thm){
	hitmap = thm;
}

 //LoadMap(string[][][],{"tp":"1,3"}
function LoadMap(tm, data){
	objs = [];
	World_Container.removeAllChildren();
	stage.update();
	for(var l=0; l<tm.length;l++){
		for(var i=0; i<tm[l].length;i++){
			for (var j=0; j<tm[l][i].length;j++){
				var o = tm[l][i][j];
				if(o != null){
					a = new createjs.Bitmap(o.split(";")[0]);
					a.name = o;
					a.x = i * 32;
					a.y = j * 32;
					objs.splice(0, 0, a);
					//InitClone(a);
					World_Container.addChild(a);
					stage.update()
				}
			}
		}
	}
	
	for(var l=0; l<Object.keys(data).length;l++){
		var fname = Object.keys(data)[l];
		window[fname](data[fname]);
	}
}
function tp(x,y){
	if(toType(x) === toType("")){
		tp(parseInt(x.split(",")[0]), parseInt(x.split(",")[1]));
		return;
	}
	console.log("tp" + (x).toString() + " " + (y).toString());
	chartx = x;
	charty = y;
	World_Container.setTransform(-1 * grid *x,-1* grid *y);
	stage.update();
}
 
function sortByLayer(a,b){
	try{
	if (parseInt(a.name.split(";")[1]) < parseInt(b.name.split(";")[1])) return -1;
	if (parseInt(a.name.split(";")[1]) > parseInt(b.name.split(";")[1])) return 1;
	}catch(e){
	}
	if (a.y < b.y) return -1;
    if (a.y > b.y) return 1;
    return 0;
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
