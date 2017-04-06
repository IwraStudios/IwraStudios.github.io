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
var soundInstance;
var inBattle = false;


var World_Container;
window.onload = Init;

var Ease = createjs.Ease;
document.addEventListener('keydown', pdown);

function pdown(event) {
    //var tx = parseInt(World_Container.x * -1);
    //var ty = parseInt(World_Container.y * -1);
    var LastChartx = chartx;
    var LastCharty = charty;

    //pointChar(event.keyCode);
    if(World_Container.x % grid !=0 || World_Container.y % grid !=0 || !allowedMove || inBattle){
	  return;
    }
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
    if(LastCharty != charty || LastChartx != chartx){
      ChangedChart(LastChartx - chartx, LastCharty - charty);
    }
	createjs.Tween.get(World_Container).to({x:(rchartx* -1 * grid).clamp(-10000,288), y:(rcharty* -1 * grid).clamp(-10000,288)}, 450, Ease.Linear);
	stage.update();

}

function ChangedChart(dx,dy){
  allowedMove = false;
  ExecTile(chartx,charty);
  createjs.Tween.get(World_Container).call(function () { UpdateWalkAnim(0,dx,dy); } ).wait(100).call(function () { UpdateWalkAnim(1,dx,dy); } ).wait(100).call(function () { UpdateWalkAnim(2,dx,dy); } ).wait(100).call(function () { UpdateWalkAnim(3,dx,dy); } ).wait(100).call(function () { UpdateWalkAnim(0,dx,dy); } ).wait(100).call(handleComplete);
  //UpdateWalkAnim(0,dx,dy);
}

function UpdateWalkAnim(state, dx, dy){
  if(dx >= 1){ //left
    state += 4;
  }
  if(dx <= -1){ //right
    state += 8;
  }
  if(dy >= 1){ //up
    state += 12;
  }
  if(dy <= -1){ //down : OK
  }
  char.image = chararr[state].image;
  char.name = "./images/char1/" + String(state) + ".png;3";

}

function ExecTile(x,y){
	try{
	for(var l=0; l<current_map.length;l++){
		if(current_map[l][x][y] == null){
			//console.log("skipped" + String(l));
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
		case 37: //left
			char.image = chararr[4].image;
			//char = new createjs.Bitmap("./images/char1/4.png");
			char.name = "./images/char1/4.png;3";

			break;
		case 38://up
			char.image = chararr[12].image;
			//char = new createjs.Bitmap("./images/char1/12.png");
			char.name = "./images/char1/12.png;3";
			break;
		case 39: //right
			char.image = chararr[8].image;
			//char = new createjs.Bitmap("./images/char1/10.png");
			char.name = "./images/char1/10.png;3";
			break;
		case 40: //down
			char.image = chararr[0].image;
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

function LoadMapFURL(aurl){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', aurl, true);
	xhr.responseType = 'blob';
	xhr.onload = function(e) {
  	if (this.status == 200) {
   		 var myBlob = this.response;
		 LoadBlob(myBlob);
    // myBlob is now the blob that the object URL pointed to.
  	}
	};
	xhr.send();
}

function LoadBlob(blob){
	var reader = new FileReader();
	reader.onload = function(e) {
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
		}
	reader.readAsText(blob);
}

function Init(){
	//loadf();
	LoadMapFURL("https://iwrastudios.github.io/map%20(2).fmap");
	serialize = serialijse.serialize;
	deserialize = serialijse.deserialize;
	stage = new createjs.Stage("GameCanvas");

	World_Container = new createjs.Container();
	chararr = [16];
	for(var l=0; l<16;l++){
	chararr[l] = new createjs.Bitmap("./images/char1/"+ String(l) +".png");
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
	sinit();
}
var context;
var bufferLoader;

function sinit() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      '../Music/04 - Pokémon HeartGold & SoulSilver - New Bark Town.wav',
      '../Music/30 - Pokémon HeartGold & SoulSilver - Ruins of Alph.wav',
      '../Music/Pokemon HeartGold and SoulSilver - Saffron City-Pewter City-Viridian City.wav',
      '../Music/Pokemon HGSS Music - Vermillion City.wav',
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList) {
  // Create two sources and play them both together.
  var source1 = context.createBufferSource();
  var source2 = context.createBufferSource();
  source1.buffer = bufferList[0];
  source2.buffer = bufferList[1];

  source1.connect(context.destination);
  source2.connect(context.destination);
  source1.start(0);
  source1.loop = true;
  //source2.start(0);
}


 function handleTick(event) {
     // Actions carried out each tick (aka frame)
     if (!event.paused) {
	     	 if(timer % 4 ==0 && !inBattle){
        		 stage.sortChildren(sortByLayer);
			       World_Container.scaleX = 2;
			       World_Container.scaleY = 2;
		  }
	     	 if(timer %4 ==0 && inBattle){
			stage.sortChildren(sortByY);
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
	chartx = x;
	charty = y;

	//World_Container.setTransform(-1 * grid *x - 5,-1* grid *y - 5);
	//pdown(null);
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

function sortByY(a,b){
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

/////Pjokemon side

var MyPjokemon = [];
var EPjokemon = [];
EPjokemon.push({
    ID: 0,
    LVL: 0,
    MHP: 0,
    HP: 0,
    ATK: 0,
    DEF: 0,
    EATK: 0,
    EDEF: 0,
    SPD: 0,
    EFX: "None"
});

function StartBattle(cPID){
	inBattle = true;
	stage.removeAllChildren();
	stage.update();
	var battlearena = new createjs.Bitmap("./images/Battle/pokemon_x_y_battle_scene_by_jenske05-d5ynr9c.png");
	battlearena.scaleX = 1.5;
	battlearena.scaleY = 1.5;
	stage.addChild(battlearena);
	var graphics = new createjs.Graphics().beginFill("#000000").drawRect(0, 257, 600, 100);
	var shape = new createjs.Shape(graphics);
	shape.alpha = 0.5;
	stage.addChild(shape);
	var graphics1 = new createjs.Graphics().beginFill("#ffffff").drawRect(10, 267, 225, 40);
	var shape1 = new createjs.Shape(graphics);
	stage.addChild(shape1);
	var graphics2 = new createjs.Graphics().beginFill("#ffffff").drawRect(300, 267, 225, 50);
	var shape2 = new createjs.Shape(graphics);
	stage.update;
}



function GenerateRandomPjokemon(PID){
	var RPjokemon = [];
	var ID = Math.floor(Math.random() * 10) + 1;
	var LVL = (PID + 1) * Math.floor(Math.random() * 3) + 1;
	var MHP = LVL * Math.floor(Math.random() * 5) + 5;
	var HP = MHP;
	var ATK = LVL * Math.floor(Math.random() * 5) + 5;
	var DEF =  LVL * Math.floor(Math.random() * 5) + 5;
	var EATK = LVL * Math.floor(Math.random() * 5) + 5;
	var EDEF = LVL * Math.floor(Math.random() * 5) + 5;
	var SPD = LVL * Math.floor(Math.random() * 5) + 5;
	var EFX = "None"
	RPjokemon.push({
		ID: ID,
		LVL: LVL,
		MHP: MHP,
		HP: HP,
		ATK: ATK,
		DEF: DEF,
		EATK: EATK,
		EDEF: EDEF,
		SPD: SPD,
		EFX: EFX,
	});
	return RPjokemon;
}


//SOUND


function BufferLoader(context, urlList, callback) {
	this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
        loader.context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    alert('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length)
                    loader.onload(loader.bufferList);
            }    
        );
    }

    request.onerror = function() {
        alert('BufferLoader: XHR error');        
    }

    request.send();
}

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
}

