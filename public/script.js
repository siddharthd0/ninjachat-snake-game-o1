// public/script.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startButton = document.getElementById('startButton');
const closeWelcomeButton = document.getElementById('closeWelcome');
const restartButton = document.getElementById('restartButton');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const difficultySelect = document.getElementById('difficulty');

const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');

// Modal Elements
const welcomeModal = document.getElementById('welcomeModal');
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreElement = document.getElementById('finalScore');

const gridSize = 20; // Size of each grid cell
const canvasSize = canvas.width; // Assuming square canvas

let snake = [{ x: 9, y: 9 }]; // Initial position
let apple = { x: 5, y: 5 };
let direction = { x: 1, y: 0 }; // Initial direction set to right
let nextDirection = { x: 1, y: 0 };
let score = 0;
let highScore = 0;
let gameInterval;
let intervalSpeed = 200; // Default to Medium speed

// Load high score from localStorage
if (localStorage.getItem('highScore')) {
  highScore = parseInt(localStorage.getItem('highScore'));
  highScoreElement.textContent = highScore;
}

// Event listeners
document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', () => {
  hideModal(welcomeModal);
  startGame();
});
closeWelcomeButton.addEventListener('click', () => {
  hideModal(welcomeModal);
  startGame();
});
restartButton.addEventListener('click', () => {
  hideModal(gameOverModal);
  startGame();
});

// Show welcome modal on page load
window.onload = () => {
  showModal(welcomeModal);
};

// Set interval speed based on difficulty
function setDifficulty() {
  const difficulty = difficultySelect.value;
  switch(difficulty) {
    case 'easy':
      intervalSpeed = 300;
      break;
    case 'medium':
      intervalSpeed = 200;
      break;
    case 'hard':
      intervalSpeed = 100;
      break;
    default:
      intervalSpeed = 200;
  }
}

// Start Game Function
function startGame() {
  setDifficulty();
  
  // Reset game variables
  snake = [{ x: 9, y: 9 }];
  direction = { x: 1, y: 0 }; // Start moving to the right
  nextDirection = { x: 1, y: 0 };
  score = 0;
  scoreElement.textContent = score;
  placeApple();

  // Clear any existing intervals
  clearInterval(gameInterval);

  // Start the game loop
  gameInterval = setInterval(gameLoop, intervalSpeed);
}

// Game Loop
function gameLoop() {
  update();
  draw();
}

// Update Game State
function update() {
  // Update direction
  direction = nextDirection;

  // Move the snake
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check collision with walls
  if (
    head.x < 0 ||
    head.x >= canvasSize / gridSize ||
    head.y < 0 ||
    head.y >= canvasSize / gridSize
  ) {
    endGame();
    return;
  }

  // Check collision with self
  for (let segment of snake) {
    if (head.x === segment.x && head.y === segment.y) {
      endGame();
      return;
    }
  }

  // Add new head
  snake.unshift(head);

  // Check if apple is eaten
  if (head.x === apple.x && head.y === apple.y) {
    score += 10;
    scoreElement.textContent = score;
    eatSound.currentTime = 0;
    eatSound.play();

    // Update high score
    if (score > highScore) {
      highScore = score;
      highScoreElement.textContent = highScore;
      localStorage.setItem('highScore', highScore);
    }

    placeApple();
  } else {
    // Remove the tail
    snake.pop();
  }
}

// Draw Game
function draw() {
  // Clear the canvas
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the apple
  ctx.fillStyle = '#FF4136';
  ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);

  // Draw the snake
  ctx.fillStyle = '#4CAF50';
  for (let segment of snake) {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  }
}

// Change Direction based on key presses
function changeDirection(event) {
  const key = event.key;

  switch (key) {
    case 'ArrowUp':
      if (direction.y === 0) {
        nextDirection = { x: 0, y: -1 };
      }
      break;
    case 'ArrowDown':
      if (direction.y === 0) {
        nextDirection = { x: 0, y: 1 };
      }
      break;
    case 'ArrowLeft':
      if (direction.x === 0) {
        nextDirection = { x: -1, y: 0 };
      }
      break;
    case 'ArrowRight':
      if (direction.x === 0) {
        nextDirection = { x: 1, y: 0 };
      }
      break;
    default:
      break;
  }
}

// Place apple at a random position
function placeApple() {
  apple = {
    x: Math.floor(Math.random() * (canvasSize / gridSize)),
    y: Math.floor(Math.random() * (canvasSize / gridSize))
  };

  // Ensure apple is not placed on the snake
  for (let segment of snake) {
    if (apple.x === segment.x && apple.y === segment.y) {
      placeApple();
      break;
    }
  }
}

// End Game
function endGame() {
  clearInterval(gameInterval);
  gameOverSound.currentTime = 0;
  gameOverSound.play();
  finalScoreElement.textContent = score;
  showModal(gameOverModal);
}

// Modal Functions
function showModal(modal) {
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Disable background scroll
}

function hideModal(modal) {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto'; // Enable background scroll
}

// Close modals when clicking outside the modal content
window.onclick = function(event) {
  if (event.target == welcomeModal) {
    hideModal(welcomeModal);
    startGame();
  }
  if (event.target == gameOverModal) {
    hideModal(gameOverModal);
  }
}