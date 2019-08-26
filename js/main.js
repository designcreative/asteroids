const FPS = 30; // frames per second
const FRICTION = 0.7; // friction coefficient of space (0 = no friction, 1 = lots of friction)
const SHIP_SIZE = 30; // ship height in pixels
const SHIP_THRUST = 5; // acceleration of the ship in pixels per second
const TURN_SPEED = 360; // turn speed in degrees per second

/** @type {HTMLCanvasElement} */
var canvas = document.getElementById('game'),
		ctx = canvas.getContext('2d'),
		ship = {
			x: canvas.width / 2,
			y: canvas.height / 2,
			radius: SHIP_SIZE / 2,
			angle: 90 / 180 * Math.PI, // convert to radians
			rotation: 0,
			thrusting: false,
			thrust: {
				x: 0,
				y: 0
			}
		};

// Set up event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Set up the game loop
setInterval(update, 1000 / FPS);

function keyDown (/** @type {KeyboardEvent} */ event) {
	switch (event.keyCode) {
		case 37: // left arrow (rotate ship left)
			ship.rotation = TURN_SPEED / 180 * Math.PI / FPS;
		break;
		case 38: // up arrow (thrust the ship forward)
			ship.thrusting = true;

		break;
		case 39: // right arrow (rotate ship right)
			ship.rotation = -TURN_SPEED / 180 * Math.PI / FPS;
		break;
	}
}

function keyUp (/** @type {KeyboardEvent} */ event) {
	switch (event.keyCode) {
		case 37: // left arrow (stop rotate ship left)
			ship.rotation = 0;
		break;
		case 38: // up arrow (stop thrust the ship forward)
			ship.thrusting = false;
		break;
		case 39: // right arrow (stop rotate ship right)
			ship.rotation = 0;
		break;
	}
}

function update () {
	// draw space
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// thrust the ship
	if (ship.thrusting) {
		ship.thrust.x += SHIP_THRUST * Math.cos(ship.angle) / FPS;
		ship.thrust.y -= SHIP_THRUST * Math.sin(ship.angle) / FPS;

		// draw the thruster
		ctx.fillStyle = 'red';
		ctx.strokeStyle = 'yellow';
		ctx.lineWidth = SHIP_SIZE / 10;
		ctx.beginPath();
		ctx.moveTo(
			// rear left
			ship.x - ship.radius * (2 / 3 * Math.cos(ship.angle) +  0.5 * Math.sin(ship.angle)),
			ship.y + ship.radius * (2 / 3 * Math.sin(ship.angle) - 0.5 * Math.cos(ship.angle))
		);
		ctx.lineTo(
			// rear center behind the ship
			ship.x - ship.radius * 6 / 3 * Math.cos(ship.angle),
			ship.y + ship.radius * 6 / 3 * Math.sin(ship.angle)
		);
		ctx.lineTo(
			// rear right
			ship.x - ship.radius * (2 / 3 * Math.cos(ship.angle) - 0.5 * Math.sin(ship.angle)),
			ship.y + ship.radius * (2 / 3 * Math.sin(ship.angle) + 0.5 * Math.cos(ship.angle))
		);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

	} else {
		ship.thrust.x -= FRICTION * ship.thrust.x / FPS;
		ship.thrust.y -= FRICTION * ship.thrust.y / FPS;
	}

	// draw triangular ship
	ctx.strokeStyle = 'white';
	ctx.lineWidth = SHIP_SIZE / 20;
	ctx.beginPath();
	ctx.moveTo(
		// nose of the ship
		ship.x + 4 / 3 * ship.radius * Math.cos(ship.angle),
		ship.y - 4 / 3 * ship.radius * Math.sin(ship.angle)
	);
	ctx.lineTo(
		// rear left
		ship.x - ship.radius * (2 / 3 * Math.cos(ship.angle) + Math.sin(ship.angle)),
		ship.y + ship.radius * (2 / 3 * Math.sin(ship.angle) - Math.cos(ship.angle))
	);
	ctx.lineTo(
		// rear right
		ship.x - ship.radius * (2 / 3 * Math.cos(ship.angle) - Math.sin(ship.angle)),
		ship.y + ship.radius * (2 / 3 * Math.sin(ship.angle) + Math.cos(ship.angle))
	);
	ctx.closePath();
	ctx.stroke();
	
	// move ship
	ship.x += ship.thrust.x;
	ship.y += ship.thrust.y;

	// rotate ship
	ship.angle += ship.rotation;

	// handle adge of screen
	if (ship.x < 0 - ship.radius) {
		ship.x = canvas.width + ship.radius;
	} else if (ship.x > canvas.width + ship.radius) {
		ship.x = 0 - ship.radius;
	}

	if (ship.y < 0 - ship.radius) {
		ship.y = canvas.height + ship.radius;
	} else if (ship.y > canvas.height + ship.radius) {
		ship.y = 0 - ship.radius;
	}
}