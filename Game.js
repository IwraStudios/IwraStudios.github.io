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
	
	ticker = createjs.Ticker.addEventListener("tick", handleTick);
	ticker.framerate = 30;
}


 function handleTick(event) {
     // Actions carried out each tick (aka frame)
     if (!event.paused) {
		 if(timer % 4 ==0){
         World_Container.sortChildren(sortByLayer);
		 }
		 timer++;
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
					stage.update();
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