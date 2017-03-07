//Game.js

var position = 0;
var hitmap;
var current_map;
var objs = [];
var stage;
var timer = 0;
var grid = 32;

var World_Container;
window.onload = Init;

var Ease = createjs.Ease;
document.addEventListener('keydown', function(event) {
    var tx = World_Container.x * -1;
    var ty = World_Container.y * -1;
    if(event.keyCode == 37) {
	if(hitmap[(tx/64)+1][ty/64] != 1){
	createjs.Tween.get(World_Container).to({
		x:(World_Container.x+64).clamp(-10000,0)
		}, 500, Ease.linear);
	}
    }else if(event.keyCode == 39) {
	if(hitmap[(tx/64)-1][(ty/64)] != 1){
        createjs.Tween.get(World_Container).to({x:(World_Container.x-64).clamp(-10000,0)}, 500, Ease.linear);
	}
    }else if(event.keyCode == 38){
	 if(hitmap[(tx/64)][(ty/64)+1] != 1){
	 createjs.Tween.get(World_Container).to({y:(World_Container.y+64).clamp(-10000,0)}, 500, Ease.linear);   
	 }
    }else if(event.keyCode == 40){
	 if(hitmap[(tx/64)][(ty/64)-1] != 1){
	 createjs.Tween.get(World_Container).to({y:(World_Container.y-64).clamp(-10000,0)}, 500, Ease.linear);
	 }
    }
});


var toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
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
	stage.addChild(World_Container);
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
	World_Container.setTransform(-64*x,-64*y);
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
