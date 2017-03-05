var x = [
"Stanley stepped into the broom closet, but there was nothing here, so he turned around and got back on track.",
"There was nothing here. No choice to make. No path to follow. Just an empty broom closet. No reason to still be here.",
"It was baffling that Stanley was still just sitting in the broom closet. He wasn't even doing anything. At least if there was something to interact with, he'd be justified in some way. As it is, he's literally just standing there, doing sweet FA.",
"Are you... Are you really still in the broom closet? Standing around doing nothing? Why? Please offer me some explanation here; I'm- I'm genuinely confused.",
"You do realize there's no choice or anything in here right? If I said 'Stanley walked past the broom closet' at least you would've had a reason for exploring it to find out. But it didn't even occur to me, because literally, this closet, is of absolutely, no significance to the story, whatsoever. I never would've thought to mention it.",
"Maybe to you, this is somehow it's own branching path. Maybe, when you go talk about this with your friends, you'll say: 'OH! DID U GET THE BROOM CLOSET ENDING? THEB ROOM CLOSET ENDING WAS MY FAVRITE!1 XD' I hope your friends find this concerning.",
"Stanley was fat and ugly, and really, really stupid. He probably only got the job because of a family connection; that's how stupid he is. That, or with drug money. Also, Stanley is addicted to drugs and hookers.",
"Well, I've come to a very definite conclusion about what's going on right now. You're dead. You got to this broom closet, explored it a bit, and were just about to leave because there's nothing here, when a physical melody of some sort shut down your central nervous system and you collapsed on the keyboard. Well, in a situation like this, the responsible thing is to alert someone nearby so as to ensure that your body is taken care of, before it begins to decompose.",
"HELLO!? ANYONE WHO HAPPENS TO BE NEARBY!! THE PERSON AT THIS COMPUTER IS DEAD!! HE OR SHE HAS FALLEN PREY TO ANY NUMBER OF YOUR COUNTLESS HUMAN PHYSIOLOGICAL VULNERABILITIES. IT'S INDICATIVE OF THE LONG-TERM SUSTAINABILITY OF YOUR SPECIES. PLEASE REMOVE THEIR CORPSE FROM THE AREA AND INSTRUCT ANOTHER HUMAN TO TAKE THEIR PLACE AT THE COMPUTER, MAKING SURE THEY UNDERSTAND BASIC FIRST-PERSON VIDEO GAME MECHANICS, AND FILLING THEM IN ON THE HISTORY OF NARRATIVE TROPES IN VIDEO GAMING, SO THAT THE IRONY AND INSIGHTFUL COMMENTARY OF THIS GAME IS NOT LOST ON THEM.",
"Alright, when you've done that, just step out into the hallway.",
"[Player steps out into the hallway]",
"Ah, second player! It's good to have you on board. I guarantee you can't do any worse than the person who came before you.",
"[Player steps back into the broom closet]",
"You too? Unbelievable. I'm at the mercy of an entire species, of invalids. Perhaps there's a monkey nearby you can hand the controls too. A fish, fungus. Look, you can hammer out the details, I'm not particularly picky. I'll just be waiting for when you're ready to pick up the story again.",
"[Later on in the game, when the Player goes back into the broom closet]",
"Oh, no! Oh, no no no no no no no no no no no no, not again- I won't be part of this- I'm not going to encourage you- I'm not going to say anything at all. I'm just going to be patient and wait for you to finish whatever it is you enjoy doing so much in this room. Please, take your time."]

var timer = 0;
var username = "Stanley";
window.onload = startStory;

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function startStory(){
setCookie("username",username,356);
if(getCookie("State") != ""){
timer = int.parse(getCookie("State"));}
else{
timer = 0;
}
updateStory();
setInterval(updateStory,12000);

	
}

function updateButton(tex, act){
	document.getElementById("but").innerHTML = tex;
	document.getElementById("but").setAttribute("onclick", act);
}

function updateText(tex){
	document.getElementById("td1").innerHTML = tex.replace("Stanley", username);
}

if(document.cookie == ""){
	username = prompt("I don't know you yet, Please enter your name", "Stanley");
}else{
	username = getCookie(username);
}

function Leave(){
	if(timer == 10){
		timer = timer + 1;
	}
	updateStory();
	updateButton("Go in the broom closet", "Back()");
	//setCookie("State",timer,356);
}

function Back(){
	if(timer == 12 || timer == 14){
		timer = timer + 1;		
	}
	updateStory();
	updateButton("Leaver broom closet", "Leave()");
}

function updateStory(){
	
	if(timer == 10 || timer == 12 || timer == 14){
		return;
	}
	try{
	updateText(x[timer]);
	}catch(e){
		return;
	}
	timer = timer + 1;
}


