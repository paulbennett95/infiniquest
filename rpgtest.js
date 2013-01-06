var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 512;
document.body.appendChild(canvas);
var used = false;
var longused = false;
var gridArray = new Array();
var charArray = new Array();
var tileArray = new Array(
	"w","w","w","w","w","w","w","w","w","w","w","w","w","w","w","w",
	"w","w","w","w","w","w","w","w","w","w","w","w","w","w","w","w",
	"w","w","p","w","w","w","w","w","p","w","w","w","w","w","w","w",
	"w","p","p","w","w","w","w","p","p","p","w","w","w","w","w","w",
	"w","p","p","p","w","w","w","p","p","p","w","w","w","w","w","w",
	"w","p","p","p","p","p","p","p","p","p","w","w","w","w","w","w",
	"p","p","p","p","p","p","p","p","p","p","w","w","w","p","p","w",
	"p","p","p","p","p","p","p","p","p","p","w","w","w","p","p","w",
	"p","p","p","p","p","p","p","p","p","p","w","p","p","p","p","w",
	"p","p","p","p","p","p","p","p","p","p","p","p","p","p","p","w",
	"p","p","p","p","p","p","p","p","p","p","p","p","p","p","p","w",
	"p","f","f","f","p","p","p","p","p","p","p","p","p","p","w","w",
	"f","f","f","f","f","p","p","p","p","p","p","p","p","w","w","w",
	"f","f","f","f","f","f","p","p","p","p","p","p","p","p","p","w",
	"f","f","f","f","f","f","f","p","p","p","p","p","p","p","p","p",
	"f","f","f","f","f","f","f","p","p","p","p","p","p","p","p","p"
);
var atLog = {
	hp: 0,
	max: 0
};
var curGrid;
var prevGrid;
var setX = 0;
var setY = 0;
alert("Use the WASD keys to move. Z selects a character, X attacks an adjacent character.");
// ------------------------------------
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/Map1.png";

var g1Ready = false;
var g1Image = new Image();
g1Image.onload = function () {
	g1Ready = true;
};
g1Image.src = "images/Char1/Char1Front.png";

var b1Ready = false;
var b1Image = new Image();
b1Image.onload = function () {
	b1Ready = true;
};
b1Image.src = "images/Enemy1/Enemy1Front.png";

var b2Ready = false;
var b2Image = new Image();
b2Image.onload = function () {
	b2Ready = true;
};
b2Image.src = "images/Enemy1/Enemy1Front.png";

var curReady = false;
var curImage = new Image();
curImage.onload = function () {
	curReady = true;
};
curImage.src = "images/Cursor1.png";

var cur = {
	x: 256,
	y: 256
};
var good1 = {
	x: 256,
	y: 256,
	max: 5,
	hp: 5,
	attack: 2,
	team: "good"
};
charArray.push(good1);
var bad1 = {
	x: 160,
	y: 160,
	max: 4,
	hp: 4,
	attack: 1,
	team: "bad"
};
charArray.push(bad1);
var bad2 = {
	x: 192,
	y: 192,
	max: 4,
	hp: 4,
	attack: 1,
	team: "bad"
};
charArray.push(bad2);
var selected = {
	dir: "Front",
	s: cur
};
selected.s = cur;
var keysDown = {};
checkx = selected.x;
checky = selected.y;
// ------------------------------------
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);
// ------------------------------------
var update = function (modifier) {
	if (65 in keysDown && !used) { // Left A
		if (selected.s != cur) {
			selected.dir = "Left";
			if (
				gridArray[(curGrid - 1)].t != "w" 
				&& !overlap(selected.s.x,selected.s.y,selected.dir)
				) {
				selected.s.x -= 32;
				cur.x -= 32;
			}
		}else if (selected.s == cur) {
			selected.s.x -= 32;
		}
	}
	if (68 in keysDown && !used) { // Right D 
		if (selected.s != cur) {
			selected.dir = "Right";
			if (
				gridArray[(curGrid + 1)].t != "w"
				&& !overlap(selected.s.x,selected.s.y,selected.dir)
				) {
				selected.s.x += 32;
				cur.x += 32;
			}
		}else if (selected.s == cur) {
			selected.s.x += 32;
		}
	}
	if (87 in keysDown && !used) { // Up W 
		if (selected.s != cur) {	
			selected.dir = "Back";
			if (
				gridArray[(curGrid - 16)].t != "w"
				&& !overlap(selected.s.x,selected.s.y,selected.dir)
				) {
				selected.s.y -= 32;
				cur.y -= 32;
			}
		}else if (selected.s == cur) {
			selected.s.y -= 32;
		}
	}
	if (83 in keysDown && !used) { // Down S 
		if (selected.s != cur) {
			selected.dir = "Front";
			if (
				gridArray[(curGrid + 16)].t != "w"
				&& !overlap(selected.s.x,selected.s.y,selected.dir)
				) {
				selected.s.y += 32;
				cur.y += 32;
			}
		}else if (selected.s == cur) {
			selected.s.y += 32;
		}
	}
	
	if (!longused && selected.s != cur) {
		for (var i=0; i<charArray.length;i++) {
			if (
				((charArray[i].x - selected.s.x == 32) && (charArray[i].y - selected.s.y == 0))
				||((charArray[i].y - selected.s.y == 32) && (charArray[i].x - selected.s.x == 0))
				||((charArray[i].x - selected.s.x == -32) && (charArray[i].y - selected.s.y == 0))
				||((charArray[i].y - selected.s.y == -32) && (charArray[i].x -  selected.s.x == 0))
				) {
					if (88 in keysDown && !longused) { // X
						charArray[i].hp -= selected.s.attack;
						atLog.hp = charArray[i].hp;
						atLog.max = charArray[i].max;
						longused = true;
						if (charArray[i].hp <= 0) {
							charArray[i].x = 699;
							charArray[i].y = 699;
						}
					}
				}
		}
	}
	
	if (90 in keysDown && !used) { // Z
		if (selected.s != cur) {
			selected.s = cur;
			used = true;
		}else if (selected.s == cur) {
			for (var i=0; i<charArray.length;i++) {
				if (cur.y == charArray[i].y && cur.x == charArray[i].x && selected.s == cur) {
					if (charArray[i].team != "bad") {
						selected.s = charArray[i];
						used = true;
					}
				}
			}
		}
	}
};
// ------------------------------------
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	
	if (g1Ready) {
		if (selected.s == good1) {
			g1Image.src = (("images/Char1/Char1" + selected.dir) + (".png"))
		}
		ctx.drawImage(g1Image, good1.x, good1.y);
	}
	
	if (b1Ready) {
		if (selected.s == bad1) {
			b1Image.src = (("images/Enemy1/Enemy1" + selected.dir) + (".png"))
		}
		ctx.drawImage(b1Image, bad1.x, bad1.y);
	}
	
	if (b2Ready) {
		if (selected.s == bad2) {
			b2Image.src = (("images/Enemy1/Enemy1" + selected.dir) + (".png"))
		}
		ctx.drawImage(b2Image, bad2.x, bad2.y);
	}
	
	if (curReady) {
		ctx.drawImage(curImage, cur.x,cur.y);
	}
	
	if (checkx != selected.s.x || checky != selected.s.y) {
		used = true;
	}
	
	for (var i = 0; i < gridArray.length; i++) {
		if (selected.s.x == gridArray[i].x && selected.s.y == gridArray[i].y) {
			curGrid = gridArray[i].g
		}
	}
	
	if (curGrid == gridArray[100].g) {
		
	}
	
	if (selected.s.x > 480) {
		selected.s.x -= 32;
	}else if (selected.s.x < 0) {
		selected.s.x += 32;
	}else if (selected.s.y > 480) {
		selected.s.y -= 32;
	}else if (selected.s.y < 0) {
		selected.s.y += 32;
	}
	
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "12px arial";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText(("X,Y,Grid: "+ selected.s.x)+(", "+ selected.s.y)+(", " + curGrid), 5, 5);
	
	ctx.fillstyle = "rgb(250, 250, 250)";
	ctx.font = "12px arial";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText(("HP: " + atLog.hp) + ("/ " + atLog.max) , 420, 5);
	checkx = selected.s.x;
	checky = selected.s.y;
};
// ------------------------------------
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};
var then = Date.now();

var overlap = function (x,y,z) {
	for (var i=0;i<charArray.length;i++) {
		if (z == "Left") {
			if((charArray[i].x - x == -32) && (charArray[i].y - y == 0)) {
				return true;
			}
		}else if (z == "Front") {
			if((charArray[i].y - y == 32) && (charArray[i].x - x == 0)) {
				return true;
			}
		}else if (z == "Right") {
			if ((charArray[i].x - x == 32) && (charArray[i].y - y == 0)) { 
				return true;
			}
		}else if (z == "Back") {
			if((charArray[i].y - y == -32) && (charArray[i].x -  x == 0)) {
				return true;
			}
		}
	}
};
// ------------------------------------
for (var i=0;i<256;i++) {
	gridArray[i] = {
		x: setX,
		y: setY,
		g: i,
		t: tileArray[i]
	}
	if (setX != 480) {
		setX += 32;
	}else if (setX >= 480) {
		setX = 0;
		setY += 32;
	}
};
setInterval(function(){used=false;}, 333);
setInterval(function(){longused=false;},2000);
setInterval(main,11);