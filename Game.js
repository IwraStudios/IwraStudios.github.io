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
var charx = 288 + 32;
var chary = 288;
var chararr;
var chartx = 0;
var charty = 0;
var allowedMove = true;

var World_Container;
window.onload = Init;

var Ease = createjs.Ease;
document.addEventListener('keydown', pdown);

function pdown(event) {
    //var tx = parseInt(World_Container.x * -1);
    //var ty = parseInt(World_Container.y * -1);
    pointChar(event.keyCode);
    if(World_Container.x % grid !=0 || World_Container.y % grid !=0 || !allowedMove){
	  return;
    }else{allowedMove = false;}
    //removeTweens(World_Container);

    if(event.keyCode == 37) {
	if(hitmap[charty][chartx-1] != 1){
	chartx--;
	}else{console.log("blocked" + String(event.keyCode));}
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
    var rchartx = chartx - 5;
    var rcharty = charty - 5;
	createjs.Tween.get(World_Container).to({x:(rchartx* -1 * grid).clamp(-10000,288), y:(rcharty* -1 * grid).clamp(-10000,288)}, 350, Ease.Linear).wait(50).call(handleComplete);
	stage.update();
	ExecTile(chartx,charty);
}

function ExecTile(x,y){
	try{
	for(var l=0; l<current_map.length;l++){
		if(current_map[l][x][y] == null){
			console.log("skipped" + String(l));
			continue;	
		}
		if(current_map[l][x][y].split(";")[2] != null){
			var data = JSON.parse(current_map[l][x][y].split(";")[2]);
			for(var l=0; l<Object.keys(data).length;l++){
				var fname = Object.keys(data)[l];
				window[fname](data[fname]);
			}
		}		
	}
	}catch(e){
	console.log(e);	
	}	
}
	
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
			char.name = "./images/char1/4.png;3";

			break;
		case 38:
			char.image = chararr[0].image;
			//char = new createjs.Bitmap("./images/char1/12.png");
			char.name = "./images/char1/12.png;3";
			break;
		case 39:
			char.image = chararr[4].image;
			//char = new createjs.Bitmap("./images/char1/10.png");
			char.name = "./images/char1/10.png;3";
			break;
		case 40:
			char.image = chararr[12].image;
			//char = new createjs.Bitmap("./images/char1/0.png");
			char.name = "./images/char1/0.png;3";
			break;


		  }
	char.x = charx;
	char.y = chary;
	stage.update();
}

function loadf() {
		var fileInput = document.getElementById('fileInput');
		//var fileDisplayArea = document.getElementById('fileDisplayArea');

		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			var textType = '*.*';

				var reader = new FileReader();

				reader.onload = function(e) {
					//Do stuff
					var x;
					try{
					LoadHitMap(deserialize(reader.result.split("?")[1])); 
						try{
						    x = JSON.parse(reader.result.split("?")[2]);
						}catch(ee){
							console.log(e);
						}
					if(x != null){
					LoadMap(deserialize(reader.result.split("?")[0]), x);
					}else{
					LoadMap(deserialize(reader.result.split("?")[0]), {});
					}
					}catch(e){
						console.log("could not parse file", e);	
					}
					//console.log(reader.result);
				}

				reader.readAsText(file);
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
	char = new createjs.Bitmap("./images/char1/0.png");
	char.image = chararr[0].image;
	char.x = charx;
	char.y = chary;
	char.name = "./images/char1/0.png;3";
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
        		 stage.sortChildren(sortByLayer);
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
	current_map = tm;
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
	chartx = x + 5;
	charty = y + 5;
	//World_Container.setTransform(-1 * grid *x,-1* grid *y);
	var rchartx = chartx - 5;
        var rcharty = charty - 5;
	createjs.Tween.get(World_Container).to({x:(rchartx* -1 * grid).clamp(-10000,288), y:(rcharty* -1 * grid).clamp(-10000,288)}, 350, Ease.Linear).wait(50).call(handleComplete).wait(200).call(pdown);
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
