//GameCreator.js
var map1;
var map2 = [];
var map3 = [];
var map4 = [];
var hitmap;
var exe;
var stage;
var gridsize = 32;
//var circle = new createjs.Shape();

/*var bitmap = new createjs.Bitmap("./images/0.png");
bitmap.x = 1100;
bitmap.y = 250;
//bitmap.setBounds(-32,-32,64,64);
var grnd = new createjs.Bitmap("./images/641.png");
grnd.x = 1100;
grnd.y = 300;*/
var objs = [];
var servObj;
var texobj;
var copying;
//0 = Occupied space
//1 = Tree
//2 = ground
//3 = medgrass
//4 = highgrass
//5 = building
//6 = fence
var stage;
var a;
window.onload = init;
var hmap;
var serialize;
var timer = 0;
var disp_counter = 0;
function loadf() {
		var fileInput = document.getElementById('fileInput');
		//var fileDisplayArea = document.getElementById('fileDisplayArea');

		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			var textType = /text.*/;

				var reader = new FileReader();

				reader.onload = function(e) {
					//Do stuff
					LoadMap(deserialize(reader.result.split("?")[0]));
					//console.log(reader.result);
				}

				reader.readAsText(file);
		});
}

function init(){
	loadf();
	serialize = serialijse.serialize;
	deserialize = serialijse.deserialize;
	stage = new createjs.Stage("GameCanvas");
	copying = false;
	InitDisp();
	/*bitmap.on("pressmove", function(evt) {
		if(copying == false){
		a = new createjs.Bitmap("./images/0.png");
		a.name = "./images/0.png";
		objs.splice(0, 0, a);
		InitClone(a);
		stage.addChild(a);
		copying = true;
		}
		a.x = evt.stageX;
		a.y = evt.stageY;
		stage.update();
	});
	bitmap.on("pressup", function(evt) { a.x = a.x - (a.x %gridsize); a.y = a.y - (a.y %gridsize); stage.update();console.log(a.x + "," + a.y); copying = false;})*/
	//circle.on("pressup", function(evt) { evt.target.x = evt.target.x - (evt.target.x %gridsize); evt.target.y = evt.target.y - (evt.target.y %gridsize); stage.update();console.log(evt.target.x + "," + evt.target.y);})
	FloodGround();
	ticker = createjs.Ticker.addEventListener("tick", handleTick);
	ticker.framerate = 30;

}

function InitDisp(){
	/*MakeNewDispenser(bitmap,"./images/0.png",2);
	MakeNewDispenser(grnd,"./images/641.png",0); */
	ScratchNewDispenser("./images/0.png;2");
	ScratchNewDispenser("./images/399.png;1");
	ScratchNewDispenser("./images/565.png;0");
	ScratchNewDispenser("./images/564.png;0");
	ScratchNewDispenser("./images/563.png;0");
	ScratchNewDispenser("./images/701.png;0");
	ScratchNewDispenser("./images/709.png;0");
	ScratchNewDispenser("./images/760.png;1");
	ScratchNewDispenser("./images/761.png;1");
	ScratchNewDispenser("./images/762.png;0");
	ScratchNewDispenser("./images/768.png;1");
	ScratchNewDispenser("./images/769.png;0");
	ScratchNewDispenser("./images/770.png;0");
	ScratchNewDispenser("./images/774.png;0");
	ScratchNewDispenser("./images/775.png;0");
	ScratchNewDispenser("./images/776.png;0");
	ScratchNewDispenser("./images/777.png;0");
	ScratchNewDispenser("./images/778.png;0");
	ScratchNewDispenser("./images/782.png;0");
	ScratchNewDispenser("./images/783.png;0");
	ScratchNewDispenser("./images/641.png;0");
	stage.update();

}

function ScratchNewDispenser(rID){
	var tmp = new createjs.Bitmap(rID.split(";")[0]);
	tmp.x = 1100 + (Math.floor(disp_counter/ 8) * 128);
	tmp.y = (disp_counter%8) * 128;
	MakeNewDispenser(tmp,rID.split(";")[0],parseInt(rID.split(";")[1]));
	stage.addChild(tmp);
	disp_counter++;
}

function MakeNewDispenser(ref,rpath, layer){
	ref.on("pressmove", function(evt) {
		if(copying == false){
		a = new createjs.Bitmap(rpath);
		a.name = rpath + ";" + String(layer);
		objs.splice(0, 0, a);
		InitClone(a);
		stage.addChild(a);
		copying = true;
		}
		a.x = evt.stageX;
		a.y = evt.stageY;
		stage.update();
	});
	ref.on("pressup", function(evt) { a.x = a.x - (a.x %gridsize); a.y = a.y - (a.y %gridsize); stage.update();console.log(a.x + "," + a.y); copying = false; a.name = rpath + ";" + String(layer);})

}


 function handleTick(event) {
     // Actions carried out each tick (aka frame)
     if (!event.paused) {
		 if(timer % 4 == 0){
			 	 exe = document.getElementById("on_load").value;
			 	 if(servObj != null){
					 servObj.name = document.getElementById("block").value;
				 }
         			 stage.sortChildren(sortByLayer);
				 stage.update();
		 }
		 timer++;

     }
 }


function FloodGround(){
	for(var i=0; i<32; i++) {
		for(var j=0; j<32; j++) {
			a = new createjs.Bitmap("./images/563.png");
			a.name = "./images/563.png;0";
			a.x = i * 32;
			a.y = j * 32;
			objs.splice(0, 0, a);
			InitClone(a);
			stage.addChild(a);
			stage.update();
		}

	}
}

function SaveMap(){
	var thmap = GenerateHitMap();
	var tmaps = [3];
	for(var l=0; l<3;l++){
		tmaps[l] = InitMap(stage.getBounds().width/32,stage.getBounds().height/32);
		for(var i=0; i<objs.length;i++){
			var o = objs[i];
			if(parseInt(o.name.split(";")[1]) != l){
				continue;
			}
			if(o.name != null && o.name != ""){
				tmaps[l][o.x/32][o.y/32] = o.name;
			}else{
				tmaps[l][o.x/32][o.y/32] = "";
			}
		}
	}
	var eexe = JSON.parse(exe);
	console.log(eexe, exe);
	var sexe = serialize(eexe);
	var blob = new Blob([serialize(tmaps) + "?" + serialize(thmap) + "?" + exe],{type: "text/plain;charset=utf-8"});
	saveAs(blob,"map.fmap");
}

function LoadMap(tm){
	objs = [];
	stage.removeAllChildren();
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
					InitClone(a);
					stage.addChild(a);
					stage.update();
				}
			}
		}
	}
	disp_counter = 0;
	InitDisp();
}



function SaveToMap1(){
	map1 = InitMap((stage.getBounds().width/32) + 1,(stage.getBounds().height/32) + 1);
	for(var i=0; i<objs.length;i++){
		o = objs[i];
		if(o.name != null && o.name != ""){
		map1[o.x/32][o.y/32] = o.name;
		}else{
			map1[o.x/32][o.y/32] = "";
		}
	}
	console.log(String(map1));
	var blob = new Blob([serialize(map1)],{type: "text/plain;charset=utf-8"});
	saveAs(blob,"omap.gmap");

}


function StringToIntLookUp(str){
	str = str.split(";")[0];
	switch(str){
		case "./images/0.png":
			return 1;
		case "./images/565.png":
		case "./images/563.png":
		case "./images/564.png":
		case "./images/399.png":
		case "./images/641.png":
			return 2;

		default:
			return 0;


	}


}

function sortByZ(a,b) {
    if (a.zIndex < b.zIndex) return -1;
    if (a.zIndex > b.zIndex) return 1;
    return 0;
}

function sortByY(a,b) {
    if (a.y < b.y) return -1;
    if (a.y > b.y) return 1;
    return 0;
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

function InitHitMap(x,y){
	var matrix = [];
	for(var i=0; i<x; i++) {
		matrix[i] = [];
		for(var j=0; j<y; j++) {
			matrix[i][j] = 1;
	}
	}
return matrix;
}

function GenerateHitMap(){
	hmap = InitHitMap(stage.getBounds().width/32,stage.getBounds().height/32);
	for(var l=0; l<3;l++){
		for(var i=0; i<objs.length;i++){
			var o = objs[i];
			if(parseInt(o.name.split(";")[1]) != l){
				continue;
			}
			if(o.name != null && o.name != ""){
				switch(StringToIntLookUp(o.name.split(";")[0])){
					case 1:
						try{
						hmap = FillRect(hmap,o.x/32,o.y/32,(o.x + o.getBounds().width)/32, (o.y+o.getBounds().height)/32, 1);//half the y size so you can walk behind
						}catch(e){console.log(e);}
						break;
					case 0:
					case 2:
						try{
							hmap = FillRect(hmap,o.x/32,o.y/32,(o.x + o.getBounds().width)/32, (o.y+o.getBounds().height)/32, 0);
						}catch(e){console.log(e);}
						break;
				}
			}
		}
	}
	console.log(String(hmap));
	hitmap = hmap;
	return hmap;
}

function FillRect(map,y1,x1,y2,x2, value){
	var dx = Math.abs(x1-x2);
	var dy = Math.abs(y1-y2);
	var lowx = Math.min(x1,x2);
	var lowy = Math.min(y1,y2);
	for(var x=0; x<dx;x++){
		for(var y=0; y<dy;y++){
			try{
			map[lowx + x][lowy + y] = value;
			}catch(e){console.log(e);}
		}
	}
	return map;
}


function InitMap(x,y){
	var matrix = [];
	for(var i=0; i<x; i++) {
		matrix[i] = [];
		for(var j=0; j<y; j++) {
			matrix[i][j] = undefined;
		}
	}
	return matrix;
}

function InitClone(obj){
	obj.on("pressmove", function(evt) {
		evt.target.x = evt.stageX;
		evt.target.y = evt.stageY;
		document.getElementById("block").value = evt.target.name;
		servObj = evt.target;
		stage.update();
	});
	obj.on("pressup", function(evt) { evt.target.x = evt.target.x - (evt.target.x %gridsize); evt.target.y = evt.target.y - (evt.target.y %gridsize); stage.update();console.log(evt.target.x + "," + evt.target.y);})
}


function ToIndex(obj,relative, offset){
	//numb must be lower than max
	relative.setChildIndex( obj, relative.NumChildren-offset);
}
