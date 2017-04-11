//Game.js
//Self-Explainitory
var hitmap;
//Self-Explainitory
var current_map;
//All objects in map
var objs = [];
//createjs stage
var stage;
//just a timer 1/30 ratio
var timer = 0;
//grid size (don't change)
var grid = 64;
//Character
var char;
//Character offset
var charx = 288 + 32;
var chary = 288;
//Character images
var chararr;
//Character position
var chartx = 0;
var charty = 0;
//Self-Explainitory
var allowedMove = true;
//Self-Explainitory
var soundInstance;
//Self-Explainitory
var inBattle = false;
//Battle Arena
var Arena;
//Container for world it's not hard to get
var World_Container;
window.onload = Init;
//Useless variable
var Ease = createjs.Ease;
document.addEventListener('keydown', pdown);


//MAP, CONTROLS and ANIMATION
function pdown(event) {
    var LastChartx = chartx;
    var LastCharty = charty;

    if(World_Container.x % grid !=0 || World_Container.y % grid !=0 || !allowedMove || inBattle){
	  return;
    }

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

//Only when position of character changed in pdown
function ChangedChart(dx,dy){
  allowedMove = false;
  ExecTile(chartx,charty);
  createjs.Tween.get(World_Container).call(function () { UpdateWalkAnim(0,dx,dy); } ).wait(100).call(function () { UpdateWalkAnim(1,dx,dy); } ).wait(100).call(function () { UpdateWalkAnim(2,dx,dy); } ).wait(100).call(function () { UpdateWalkAnim(3,dx,dy); } ).wait(100).call(function () { UpdateWalkAnim(0,dx,dy); } ).wait(100).call(handleComplete);
  //UpdateWalkAnim(0,dx,dy);
}

//Update Animation State
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

//If you land on a tile with a special function this will trigger it
function ExecTile(x,y){
	try{
	for(var l=0; l<current_map.length;l++){
		if(current_map[l][x][y] == null){
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

//Enable controls again
function handleComplete(){
	allowedMove = true;
}

//Get object type
var toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
//(Obsolete) point character in a direction
function pointChar(dir){
	switch(dir){
		case 37: //left
			char.image = chararr[4].image;
			char.name = "./images/char1/4.png;3";

			break;
		case 38://up
			char.image = chararr[12].image;
			char.name = "./images/char1/12.png;3";
			break;
		case 39: //right
			char.image = chararr[8].image;
			char.name = "./images/char1/10.png;3";
			break;
		case 40: //down
			char.image = chararr[0].image;
			char.name = "./images/char1/0.png;3";
			break;


		  }
	char.x = charx;
	char.y = chary;
	stage.update();
}

//(Obsolete) Load map from html input
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
				}

				reader.readAsText(file);
		});
}
//Load map from url
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
//Load map from blob
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
//INIT
function Init(){
	//loadf();
	chararr = [16];
	for(var l=0; l<16;l++){
	   chararr[l] = new createjs.Bitmap("./images/char1/"+ String(l) +".png");
	}
	LoadMapFURL("https://iwrastudios.github.io/map%20(2).fmap");
	serialize = serialijse.serialize;
	deserialize = serialijse.deserialize;
	stage = new createjs.Stage("GameCanvas");



	ticker = createjs.Ticker.addEventListener("tick", handleTick);
	ticker.framerate = 30;
	sinit();
	MyPjokemon.push(GenerateRandomPjokemon(3));
}

//Create character in map
function charInit(){
	char = new createjs.Bitmap("./images/char1/0.png");
	char.image = chararr[0].image;
	char.x = charx;
	char.y = chary;
	char.name = "./images/char1/0.png;3";

	stage.addChild(char);
}

//Update function: sort map
 function handleTick(event) {
     // Actions carried out each tick (aka frame)
     if (!event.paused) {
	     	 if(timer % 4 ==0 && !inBattle){
        		 stage.sortChildren(sortByLayer);
			 try{
			       World_Container.scaleX = 2;
			       World_Container.scaleY = 2;
			 }catch(e){}
		  }
	     	 if(timer %4 ==0 && inBattle){
			stage.sortChildren(sortByY);
		 }
		 timer++;
		 stage.update();
     }
 }

//Load and Change hitmap
function LoadHitMap(thm){
	hitmap = thm;
}

//Load whole map
function LoadMap(tm, data){
	stage.removeAllChildren();
	World_Container = new createjs.Container();
	stage.addChild(World_Container);
	World_Container.scaleX = 2;
	World_Container.scaleY = 2;
	objs = [];
	World_Container.removeAllChildren();
	charInit();
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

//Teleport to (x,y)
function tp(x,y){
	if(toType(x) === toType("")){
		tp(parseInt(x.split(",")[0]), parseInt(x.split(",")[1]));
		return;
	}
	console.log("tp" + (x).toString() + " " + (y).toString());
	chartx = x;
	charty = y;

	var event = [];
	event['keyCode'] = 27;
	pdown(event);
	stage.update();
}

//Sort by layer and y value
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

//(Obsolete) sort by y value
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

/////Pjokemon side
//Self-explainitory
var MyPjokemon = [];


//Empty pjokemon array
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

//Start battle with certain difficulty(cPID)
function StartBattle(cPID){
	allowedMove = false;
	inBattle = true;
	stage.removeAllChildren();
	var battlearena = new createjs.Bitmap("./images/Battle/pokemon_x_y_battle_scene_by_jenske05-d5ynr9c.png");
	battlearena.scaleX = 1.5;
	battlearena.scaleY = 1.5;
	Arena = new createjs.Container();
	Arena.setBounds(0,0,600,357);
	Arena.addChild(battlearena);
	stage.addChild(Arena);
	window["bar1"] = new createjs.Shape().set({x:20, y:200, scaleX:0});
	window["bar2"] = new createjs.Shape().set({x:270, y:50, scaleX:0});
	window["bar1"].graphics.beginFill("green").drawRect(0,0,300,30);
	window["bar2"].graphics.beginFill("green").drawRect(0,0,300,30);
	Arena.addChild(window["bar1"], window["bar2"]);
	for (var i = 0; i < 4; ++i){
		window["B" + String(i)] = new createjs.Container();
		var button1 = new createjs.Bitmap("./images/live-button-blank.png");
		window["B" + String(i)].x = 20;
		if(i % 2 != 0){
		window["B" + String(i)].x += 310;
		}
		window["B" + String(i)].y = 360;
		if(i>= 2){
			window["B" + String(i)].y += 50;
		}
		window["B" + String(i)].name = "B" + String(i);

		button1.scaleX = 0.4;
		button1.scaleY = 0.5;
		window["B" + String(i)].addChild(button1);
		button1.name = "B" + String(i);
		var text;
		switch(i){
			case 0:
				text = new createjs.Text("Fight", "20px Arial", "#ffffff");
				window["B" + String(i)].addChild(text);
				break;
			case 1:
				text = new createjs.Text("Item", "20px Arial", "#ffffff");
				window["B" + String(i)].addChild(text);
				break;
			case 2:
				text = new createjs.Text("Pjokemon", "20px Arial", "#ffffff");
				window["B" + String(i)].addChild(text);
				break;
			case 3:
				text = new createjs.Text("Flee", "20px Arial", "#ffffff");
				window["B" + String(i)].addChild(text);
				break;
			}
		text.x = (246/2)/1.5;
		text.y = 15;
		window["B" + String(i)].txt = text;
    window["B" + String(i)].but = button1;
		button1.on("click", onButtonDown);
		stage.addChild(window["B" + String(i)]);
	}
	stage.update;
	PostStartBattle();
}
//Load Pjokemon after loading arena
function PostStartBattle(){
	window["oPjokemon"] = GenerateRandomPjokemon(1);
	window["cPjokemon"] = MyPjokemon[0];
	var mPjok = new createjs.Bitmap("./images/Pjokemons/" + String(window["cPjokemon"].ID) + "b.png");
	var oPjok = new createjs.Bitmap("./images/Pjokemons/" + String(window["oPjokemon"].ID) + "f.png");
  window["mPjok"] = mPjok;
  window["oPjok"] = oPjok;
	mPjok.y = Arena.localToGlobal(0,220).y;
	oPjok.x = Arena.localToGlobal(390,0).x;
	oPjok.y = Arena.localToGlobal(0,70).y;
	Arena.addChild(mPjok);
	Arena.addChild(oPjok);
	oPjok.scaleX = 2;
	oPjok.scaleY = 2;
	mPjok.scaleX = 2;
	mPjok.scaleY = 2;
	stage.update();
	createjs.Tween.get(window["bar1"]).to({scaleX:(window["cPjokemon"].HP / window["cPjokemon"].MHP)}, 2000, createjs.Ease.quadIn);
	createjs.Tween.get(window["bar2"]).to({scaleX:1}, 2000, createjs.Ease.quadIn).call(handleComplete);

}
//Button Controls
function onButtonDown(event){
	createjs.Tween.get(event.target).to({alpha: 0.5},250, createjs.Ease.getPowInOut(2)).wait(100).to({alpha: 1},150, createjs.Ease.getPowInOut(2));
	if(!allowedMove){
		return;
	}
	if(event.target.name == "B0"){ //Fight button
		//alert("fight");
		allowedMove = false;
		window["oPjokemon"].HP -= window["cPjokemon"].ATK;//Damage handling
		createjs.Tween.get(window["bar2"]).to({scaleX:(window["oPjokemon"].HP / window["oPjokemon"].MHP).clamp(0,1)}, 1000, createjs.Ease.quadIn);
		//Simple takle for now
		//Opponent's turn
		createjs.Tween.get(stage).wait(1250).call(opATK);
	}else if(event.target.name == "B1"){//Item Button
		//alert("item");
		for (var i = 0; i < 3; ++i){
			window["B" + String(i)].but.name += "i";//Remap function
		}
    window["B0"].txt.text = "Pjokeball";//Remap text
    window["B1"].txt.text = "Potion";//Remap text
    window["B2"].txt.text = "MaxPotion";//Remap text
    window["B3"].txt.text = "Back";//Remap text
    window["B3"].but.name = "Bb";//Remap function
		//target.getChildAt(1); change to item names
	}else if(event.target.name == "B2"){
		//alert("Pjokemon");
    var j = 0;
		for (var i = 0; i < 3; ++i){
      try{
        if(MyPjokemon[i].ID == window["cPjokemon"].ID){
          j++;
        }
      window["B" + String(i)].txt.text = aPjokemons[MyPjokemon[i+j].ID];
      window["B" + String(i)].but.name += "p";//Remap function
      }catch(e){
      window["B" + String(i)].txt.text = "None";
      window["B" + String(i)].but.name = "B";//Remap function
      //console.log("can't find pjok");
      }
		}
    window["B3"].txt.text = "Back";//Remap text
    window["B3"].but.name = "Bb";//Remap function
		//target.getChildAt(1); change to pjok names
	}else if(event.target.name == "B3"){ //Flee Button
		if(Math.floor(Math.random() * 3) + 1 == 1){
			alert("succesfully fleed");
			inBattle = false;
			allowedMove = true;
			LoadMap(current_map,{tp: String(chartx) + ',' + String(charty)});
		}else{
      opATK();
    }
	}else if(event.target.name == "Bb"){//Items:Pjokemons/Back
    BackToMain();
  }else if(event.target.name == "B0i"){//Items/Pjokeball
    TryCatch();
  }else if(event.target.name == "B1i"){//Items/Potion button
    if(window["potions"] > 0){
        window["potions"]--;
        window["cPjokemon"].HP = (window["cPjokemon"].HP + 20).clamp(0,window["cPjokemon"].MHP);
        createjs.Tween.get(window["bar1"]).to({scaleX:(window["cPjokemon"].HP / window["cPjokemon"].MHP)}, 1000, createjs.Ease.quadIn);
        opATK();
    }else{
      alert("You don't have enough potions");
    }
  }else if(event.target.name == "B2i"){//Items/MaxPotion Button
    if(window["Mpotions"] > 0){
        window["Mpotions"]--;
        window["cPjokemon"].HP = window["cPjokemon"].MHP;
        createjs.Tween.get(window["bar1"]).to({scaleX:(window["cPjokemon"].HP / window["cPjokemon"].MHP)}, 1000, createjs.Ease.quadIn);
        opATK();
    }else{
      alert("You don't have enough Max potions");
    }
  }else if(event.target.name.includes("p")){//Any Pjokemon Button
    ChangePjok(event.target.name);
  }
}

//Buttons for changing pjokemon
function ChangePjok(str){
    var pstr = Number(str.match(/\d/g).join(""));
    var pname = window["B" + pstr].txt.text;
    _ChangePjok(pname);
}

function _ChangePjok(pname){
  try{//Try Save
    for (var i = 0; i < 4; ++i){
        if(MyPjokemon[i] == undefined){
            continue;
        }
        if(MyPjokemon[i].ID == window["cPjokemon"].ID){
            MyPjokemon[i]= window["cPjokemon"];
      }
    }
    for (var i = 0; i < 4; ++i){
        if(MyPjokemon[i] == undefined){
            continue;
        }
        if(aPjokemons[MyPjokemon[i].ID] == pname){
          var a = new createjs.Bitmap("./images/Pjokemons/" + String(MyPjokemon[i].ID) + "b.png");
          window["mPjok"].image = a.image;
          window["cPjokemon"] = MyPjokemon[i];
          createjs.Tween.get(window["bar2"], {override:true}).to({scaleX:(window["oPjokemon"].HP / window["oPjokemon"].MHP).clamp(0,1)}, 200, createjs.Ease.quadIn);
          createjs.Tween.get(window["bar1"], {override:true}).to({scaleX:(window["cPjokemon"].HP / window["cPjokemon"].MHP)}, 200, createjs.Ease.quadIn);
        }
    }
  }catch(e){}
  BackToMain();
}
//Self-Explainitory
function TryCatch(){
    var catchrate = 40;//100
    var hpgain = 40;//100
    if(window["oPjokemon"].ID == window["cPjokemon"].ID){
      console.log("can't overlap");
      FailedCaught();
      return;
    }
    var totchance  = catchrate;
    if(window["oPjokemon"].HP < window["oPjokemon"].MHP/2){
      totchance += hpgain;
    }
    var chance = (Math.floor(Math.random() * 100) + 1);
    if(chance <= totchance){
      Caught();
    }else{
      FailedCaught();
    }
}
//Self-Explainitory
function FailedCaught(){
    alert("failed to catch pjokemon" + '\n' + "try again");
    opATK();
}
//Show's default battle buttons
function BackToMain(){
  for (var i = 0; i < 4; ++i){
    window["B" + String(i)].but.name = "B" + String(i);
  }
  window["B0"].txt.text = "Fight";
  window["B1"].txt.text = "Item";
  window["B2"].txt.text = "Pjokemon";
  window["B3"].txt.text = "Flee";
}
//Self-Explainitory
function Caught(){
    alert("you win.... sort of" + '\n' + "At least you caught a pjokemon");
    for (var i = 0; i < 4; ++i){
      try{
        var a = aPjokemons[MyPjokemon[i].ID];
      }catch(e){
        MyPjokemon[i]=window["oPjokemon"];
        inBattle = false;
        allowedMove = true;
        LoadMap(current_map,{tp: String(chartx) + ',' + String(charty)});
        return;
      }
    }
    alert("your backpack is full" + '\n'+ "to get new pjokemons restart the game");
    inBattle = false;
    allowedMove = true;
    LoadMap(current_map,{tp: String(chartx) + ',' + String(charty)});
}
//Opponent's attack routine
function opATK(){
	if(window["oPjokemon"].HP <= 0){
		inBattle = false;
		allowedMove = true;
		Win();
		return;
	}

	window["cPjokemon"].HP -= window["oPjokemon"].ATK;
	createjs.Tween.get(window["bar1"]).to({scaleX:(window["cPjokemon"].HP / window["cPjokemon"].MHP).clamp(0,1)}, 1000, createjs.Ease.quadIn).call(handleComplete);
	if(window["cPjokemon"].HP <= 0){
    alert(aPjokemons[window["cPjokemon"].ID] + " fainted");
		for (var i = 0; i < 4; ++i){
		    try{//Remove fainted pjokemon
          			if(MyPjokemon[i].ID == window["cPjokemon"].ID){
              				MyPjokemon.splice(i, 1);
        			}
    		}catch(e){}
		}
		MyPjokemon.clean(undefined);
		var j = 10;
		for (var i = 0; i < 4; ++i){
			try{
			if(MyPjokemon[i] != undefined){
			j = i;
      break;
      }
			}catch(e){}
		}
		if(j != 10){
      _ChangePjok(aPjokemons[MyPjokemon[j].ID]);
		}else{
		alert("you lose, git gud");
		window.location.reload(false);
		}
	}
  	BackToMain();

}


//Self-Explainitory
function Win(){
	alert("you win this battle");
	LoadMap(current_map,{tp: String(chartx) + ',' + String(charty)});
}
//PID = overal power/value
function GenerateRandomPjokemon(PID){
	var ID = Math.floor(Math.random() * 99) + 1;
	var LVL = (PID + 1) * Math.floor(Math.random() * 2) + 1;
	var MHP = LVL * Math.floor(Math.random() * 5) + 10;
	var HP = MHP;
	var ATK = LVL * Math.floor(Math.random() * 3) + 4;
	var DEF =  LVL * Math.floor(Math.random() * 3) + 4;
	var EATK = LVL * Math.floor(Math.random() * 3) + 4;
	var EDEF = LVL * Math.floor(Math.random() * 3) + 4;
	var SPD = LVL * Math.floor(Math.random() * 3) + 4;
	var EFX = "None"
	return {
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
	};
}


//SOUND
//Necessary for smooth operation
var context;
var bufferLoader;

//Finished loading soundbuffers
function finishedLoading(bufferList) {
  // Create two sources and play them both together.
  var gainNode = context.createGain();
  var source1 = context.createBufferSource();
  var source2 = context.createBufferSource();
  source1.buffer = bufferList[0];
  source2.buffer = bufferList[1];

  source1.connect(gainNode);
  gainNode.connect(context.destination);
  //source1.connect(context.destination);
  source2.connect(context.destination);
  source1.start(0);
  source1.loop = true;
  gainNode.gain.value = 0.5;
  //source2.start(0);
}

//Turn up the music
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


//Loads audio buffers
function BufferLoader(context, urlList, callback) {
	this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

//Audio buffer Loader type: fill's buffer
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
//Audio buffer Loader type: load's audio from buffer
BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
}
