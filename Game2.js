var stage;
var ticker;

//Player
var s;
//Init on load
window.onload = Init;
//Useless variable
var Ease = createjs.Ease;
//Keymapping
document.addEventListener('keydown', pdown);
//Blocks
var b = [];
//Bullets
var bu = [];
//Kill amount/score
var kill = 0;
//Level
var lvl = 1;

//Function to start it all of
function Init(){
	if(!confirm("Wanna play")){
		window.location.href = "https://www.google.nl/search?q=big+ducks&source=lnms&tbm=isch&sa=X&ved=0ahUKEwji5uaH9KDTAhUMKMAKHfyiCmIQ_AUICCgB&biw=1440&bih=757";
	}
	stage = new createjs.Stage("GameCanvas");
	makePlayer();
	newGame();
	ticker = createjs.Ticker.addEventListener("tick", handleTick);
	ticker.framerate = 30;
  	
  
}

function TestBrowser(){
// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;	
	
if(!isFirefox){
	alert("use Firefox instead");
	window.location.href = "https://www.google.nl/search?q=big+ducks&source=lnms&tbm=isch&sa=X&ved=0ahUKEwji5uaH9KDTAhUMKMAKHfyiCmIQ_AUICCgB&biw=1440&bih=757";
	}
if(isIE){
	exploitIE11();
}
	
}

function exploitIE11(){
doc = new ActiveXObject("htmlFile");
 
 localStorage.setItem("UID", UID);
// Alert every 5 seconds
doc.Script.setInterval("alert('Dont use IE')", 5000)); //TODO: fix

// Save a self-reference
doc.Script.doc = doc;
 
// Use the open method. Nothing changes here, but now IE will not
// destroy the previous reference and the script will continue running.
window.open("","_self"); // "Does nothing", but this line is crucial.
}



//Keypress handling
function pdown(event){
    if(event.keyCode == 37) {
	//Move left
	createjs.Tween.get(s, {override:true}).to({x:(s.x - 50).clamp(0,640)}, 450, Ease.Linear);   
    }else if(event.keyCode == 39) {
	 //Move right  
	 createjs.Tween.get(s, {override:true}).to({x:(s.x + 50).clamp(0,640)}, 450, Ease.Linear);   
    }else if(event.keyCode == 32) {
	   FireBullet();
    }
}

//periodic update function
function handleTick(){
	//Clean Garbage collected arrays
	bu.clean(undefined);
	b.clean(undefined);
	stage.update();
	//Next level on finish level
	if(b.length == 0){
		newGame();
		lvl++;

	}
	//Hit test every block with every bullet
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
	//Update scores
	document.getElementById("scoreboard").innerHTML="Kills: " +String(kill) + "  ";
	document.getElementById("level").innerHTML="Level: " +String(lvl) + "  ";
}

//Generates new level
function newGame(){
	for (var i = 0; i < 10; i++) {
  	var block = new createjs.Shape().set({x:Math.floor(Math.random() * 58)*10 + 10, y:Math.floor(Math.random() * 4)*70, scaleX:1});
    	block.graphics.beginFill("green").drawRect(0,0,50,30);
	stage.addChild(block);
	b[i] = block;
	}
}

//Fires bullet
function FireBullet(){
	var block = new createjs.Shape().set({x:s.x, y:s.y - 10, scaleX:1});
    	block.graphics.beginFill("green").drawRect(0,0,5,10);
	createjs.Tween.get(block, {override:true}).to({y:(-1000).clamp(-1000,0)}, 3000, Ease.Linear); 
	stage.addChild(block);
	bu.splice(0,0,block);
}

//Makes Player
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

//For Cleaning array's with empty elements
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
