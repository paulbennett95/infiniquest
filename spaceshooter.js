var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 256;
canvas.height = 256;
document.body.appendChild(canvas);
var start = true;
var shot = false;
var recall = false;
// ------------------------------------
var rockReady = false;
var rockImage = new Image();
rockImage.onload = function () {
	rockReady = true;
};
rockImage.src = "images/Rock.png";

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/GameBackdrop.png";

var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/Fighter1.png";

var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/Martian1.png";

var hero = {
	speed: 128
};
var rock = {};
var monster = {};
var mKilled = 0;
var keysDown = {};
// ------------------------------------
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);
// ------------------------------------
var reset = function () {
	if (start) {
		hero.x = canvas.width / 2;
		hero.y = 230;
		rock.x = -10;
		rock.y = -10;
		start = false;
	}	
	
	monster.x = 14 + (Math.random() * (canvas.width - 28));
	monster.y = (Math.random() * (canvas.height - 42));
};
// ------------------------------------
var update = function (modifier) {
	if (37 in keysDown) { // Left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Right
		hero.x += hero.speed * modifier;
	}
	if (38 in keysDown) { // Up
		if (!shot) {
			rock.x = hero.x + 9.4;
			shot = true;
		}
		if (recall) {
			rock.y = hero.y + 7;
			rock.x = hero.x + 9.4;
		}
	}
	
	if (
		rock.x <= (monster.x + 8)
		&& monster.x <= (rock.x + 8)
		&& rock.y <= (monster.y + 12)
		&& monster.y <= (rock.y + 12)
	) {
		++mKilled;
		reset();
	}
	
	if (hero.x <= 0) {
		hero.x += 1.122;
	}else if (hero.x >= 245) {
		hero.x -= 1.122;
	}
	
	if (mKilled >= 25) {
		recall = true;
	}
};
// ------------------------------------
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}
	
	if (rockReady) {
		ctx.drawImage(rockImage, rock.x, rock.y);
	}
	
	if (shot) {
		var intr = setInterval(move(),1);
		function move() {
			if (recall) {
				rock.x = hero.x + 9.4;
			}
			rock.y -= 2;
			if (rock.y < 0) {
				shot = false;
				rock.y = 240;
				rock.x = -20;
			}
		}
	}
	
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "12px arial";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Slimes killed: " + mKilled, 5, 5);
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
reset();
setInterval(main, 1);
setTimeout(function(){location.reload();},30000)