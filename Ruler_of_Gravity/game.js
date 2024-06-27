const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const GRAVITY = 0.2;
const GRAVITY_STEP = 0.1;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 40;
const PLAYER_SPEED = 5;
const JUMP_STRENGTH = 7; // ジャンプの高さを調整
let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    color: 'black',
    velocityX: 0,
    velocityY: 0,
    onGround: false
};

let rotationAngle = 0;

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function updatePlayer() {
    // Movement logic
    if (keys['a']) {
        player.velocityX = -PLAYER_SPEED;
    } else if (keys['d']) {
        player.velocityX = PLAYER_SPEED;
    } else {
        player.velocityX = 0;
    }

    // Jumping logic
    if (keys[' '] && player.onGround) {
        player.velocityY = -JUMP_STRENGTH;
    }

    player.velocityY += GRAVITY;

    player.x += player.velocityX;
    player.y += player.velocityY;

    // Prevent player from moving out of bounds
    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.onGround = true;
    } else {
        player.onGround = false;
    }
}

const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

function gameLoop() {
    // Update player and background
    updatePlayer();
    drawBackground();
    drawPlayer();
    requestAnimationFrame(gameLoop);
}

function drawBackground() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update background rotation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotationAngle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw background
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

gameLoop();
