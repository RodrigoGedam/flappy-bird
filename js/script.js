//Board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//Bird
let birdWidth = 34; // Width / Height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth / 8; // Initial Position
let birdY = boardHeight / 2;
let birdImg;

let bird = {
	x: birdX,
	y: birdY,
	width: birdWidth,
	height: birdHeight,
};

//Pipes
let pipesArray = [];
let pipeWidth = 64; // Ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//Physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = () => {
	board = document.getElementById("board");
	board.height = boardHeight;
	board.width = boardWidth;
	context = board.getContext("2d");

	//Draw Bird
	birdImg = new Image();
	birdImg.src = "../images/bird.png";
	birdImg.onload = () => {
		context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
	};

	topPipeImg = new Image();
	topPipeImg.src = "../images/toppipe.png";

	bottomPipeImg = new Image();
	bottomPipeImg.src = "../images/bottompipe.png";

	requestAnimationFrame(update);
	setInterval(placePipes, 1500);

	document.addEventListener("keydown", moveBird);
};

function update() {
	if (gameOver) {
		return;
	}

	requestAnimationFrame(update);

	context.clearRect(0, 0, board.width, board.height);

	//Bird
	velocityY += gravity;
	bird.y = Math.max(bird.y + velocityY, 0); //Apply gravity to current bird.y, limit the bird.y to top of the canvas
	context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

	if (bird.y > board.height) {
		gameOver = true;
	}

	//Pipes
	for (let i = 0; i < pipesArray.length; i++) {
		let pipe = pipesArray[i];
		pipe.x += velocityX;
		velocityX -= 0.0001;
		context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

		if (!pipe.passed && bird.x > pipe.x + pipe.width) {
			score += 0.5; //Because theres 2 pipes, so it equals 1 for every set of pipe.
			pipe.passed = true;
		}

		if (detectCollision(bird, pipe)) {
			gameOver = true;
		}
	}

	//Clear pipes
	while (pipesArray.length > 0 && pipesArray[0].x < -pipeWidth) {
		pipesArray.shift();
	}

	//Score
	context.fillStyle = "white";
	context.font = "45px sans-serif";
	context.fillText(score, 5, 45);

	if (gameOver) {
		context.fillText("GAME OVER", 5, 90);
	}
}

function placePipes() {
	if (gameOver) {
		return;
	}

	let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);

	let openingSpace = boardHeight / 4;

	let topPipe = {
		img: topPipeImg,
		x: pipeX,
		y: randomPipeY,
		width: pipeWidth,
		height: pipeHeight,
		passed: false,
	};

	pipesArray.push(topPipe);

	let bottomPipe = {
		img: bottomPipeImg,
		x: pipeX,
		y: randomPipeY + pipeHeight + openingSpace,
		width: pipeWidth,
		height: pipeHeight,
		passed: false,
	};

	pipesArray.push(bottomPipe);
}

function moveBird(e) {
	if (e.code == "Space" || e.code == "ArrowUp") {
		velocityY = -6;

		//Reset Game
		if (gameOver) {
			bird.y = birdY;
			pipesArray = [];
			score = 0;
			gameOver = false;
		}
	}
}

function detectCollision(a, b) {
	return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
