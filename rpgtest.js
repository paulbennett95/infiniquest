var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 512;
document.body.appendChild(canvas);
var used = false;
var longused = false;
var gridArray = new Array();
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
var curGrid;
var prevGrid;
var setX = 0;
var setY = 0;
// ------------------------------------
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/Map1.png";

var uReady = false;
var uImage = new Image();
uImage.onload = function () {
	uReady = true;
};
uImage.src = "images/Char1/Char1Front.png";

var mReady = false;
var mImage = new Image();
mImage.onload = function () {
	mReady = true;
};
mImage.src = "images/Fighter1.png";

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
var u = {
	x: 256,
	y: 256
};
var m = {
	x: 160,
	y: 160
};
var selected = cur;
var keysDown = {};
var event1 = {
	x: 256,
	y: 256
};

checkx = selected.x;
checky = selected.y;
var charArray = new Array(u,m);
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
		if (selected != cur) {
			if (gridArray[(curGrid - 1)].t != "w") {
				selected.x -= 32;
			}
		}else if (selected == cur) {
			selected.x -= 32;
		}
	}
	if (68 in keysDown && !used) { // Right D 
		if (selected != cur) {
			if (gridArray[(curGrid + 1)].t != "w") {
				selected.x += 32;
			}
		}else if (selected == cur) {
			selected.x += 32;
		}
	}
	if (87 in keysDown && !used) { // Up W 
		if (selected != cur) {	
			if (gridArray[(curGrid - 16)].t != "w") {
				selected.y -= 32;
			}
		}else if (selected == cur) {
			selected.y -= 32;
		}
	}
	if (83 in keysDown && !used) { // Down S 
		if (selected != cur) {
			if (gridArray[(curGrid + 16)].t != "w") {
				selected.y += 32;
			}
		}else if (selected == cur) {
			selected.y += 32;
		}
	}
	
	if (!longused) {
		for (var i=0; i<charArray.length;i++) {
			if (
				((charArray[i].x - selected.x == 32) && (charArray[i].y - selected.y == 0))
				||((charArray[i].y - selected.y == 32) && (charArray[i].x - selected.x == 0))
				||((charArray[i].x - selected.x == -32) && (charArray[i].y - selected.y == 0))
				||((charArray[i].y - selected.y == -32) && (charArray[i].x -  selected.x == 0))
				) {
					if (88 in keysDown && !longused) { // A
						selected.x = charArray[i].x;
						selected.y = charArray[i].y;
						longused = true;
					}
				}
		}
	}
	
	if (90 in keysDown && !used) { // Z
		if (selected != cur) {
			selected = cur;
			used = true;
		}
		for (var i=0; i<charArray.length;i++) {
			if (cur.y == charArray[i].y && cur.x == charArray[i].x && selected == cur) {
				selected = charArray[i];
				used = true;
			}
		}
	}
};
// ------------------------------------
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	
	if (uReady) {
		ctx.drawImage(uImage, u.x, u.y);
	}
	
	if (mReady) {
		ctx.drawImage(mImage, m.x, m.y);
	}
	
	if (curReady) {
		ctx.drawImage(curImage, cur.x,cur.y);
	}
	
	if (checkx != selected.x || checky != selected.y) {
		used = true;
	}
	
	for (var i = 0; i < gridArray.length; i++) {
		if (selected.x == gridArray[i].x && selected.y == gridArray[i].y) {
			curGrid = gridArray[i].g
		}
	}
	
	if (curGrid == gridArray[100].g) {
		alert("You've touched grid 100, congratulations! FUCK YOU");
		location.reload();
	}
	
	if (selected.x > 480) {
		selected.x -= 32;
	}else if (selected.x < 0) {
		selected.x += 32;
	}else if (selected.y > 480) {
		selected.y -= 32;
	}else if (selected.y < 0) {
		selected.y += 32;
	}
	
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "12px arial";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText(("Position: "+ selected.x)+(", "+ selected.y)+(", " + curGrid), 5, 5);
	checkx = selected.x;
	checky = selected.y;
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
setInterval(function(){used=false;}, 400);
setInterval(function(){longused=false;},2000);
setInterval(main,11);