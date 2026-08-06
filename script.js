const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

// Configurações do jogo
const gridSize = 20; // Tamanho de cada quadrado
const tileCount = canvas.width / gridSize; // Grade de 20x20
let speed = 7; // Velocidade do jogo

// Posições e movimento
let snake = [{ x: 10, y: 10 }];
let dx = 0;
let dy = 0;

let foodX = 5;
let foodY = 5;

let score = 0;

// Loop principal do jogo
function gameLoop() {
  moveSnake();
  
  if (checkGameOver()) {
    alert(`Fim de jogo! Sua pontuação foi: ${score}`);
    resetGame();
    return;
  }

  clearCanvas();
  checkFoodCollision();
  drawFood();
  drawSnake();
}

// Limpa a tela a cada quadro
function clearCanvas() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Desenha a cobra
function drawSnake() {
  snake.forEach((part, index) => {
    // Cabeça com cor ligeiramente diferente
    if (index === 0) ctx.fillStyle = "#81C784";
    else ctx.fillStyle = "#4CAF50";

    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
  });
}

// Atualiza a posição da cobra
function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  
  if (dx !== 0 || dy !== 0) {
    snake.unshift(head);
    snake.pop();
  }
}

// Desenha a comida
function drawFood() {
  ctx.fillStyle = "#FF5252";
  ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize - 2, gridSize - 2);
}

// Verifica se a cobra comeu a comida
function checkFoodCollision() {
  if (snake[0].x === foodX && snake[0].y === foodY) {
    score += 10;
    scoreElement.textContent = score;
    
    snake.push({});
    generateFood();
  }
}

// Gera posição aleatória para a comida
function generateFood() {
  foodX = Math.floor(Math.random() * tileCount);
  foodY = Math.floor(Math.random() * tileCount);

  // Impede que a comida surja em cima da cobra
  snake.forEach(part => {
    if (part.x === foodX && part.y === foodY) {
      generateFood();
    }
  });
}

// Regras de fim de jogo
function checkGameOver() {
  if (dx === 0 && dy === 0) return false;

  const head = snake[0];

  const hitLeftWall = head.x < 0;
  const hitRightWall = head.x >= tileCount;
  const hitTopWall = head.y < 0;
  const hitBottomWall = head.y >= tileCount;

  if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
    return true;
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

// Reinicia o jogo
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
  score = 0;
  scoreElement.textContent = score;
  generateFood();
}

// Controles pelo teclado
window.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp":
      if (dy !== 1) { dx = 0; dy = -1; }
      break;
    case "ArrowDown":
      if (dy !== -1) { dx = 0; dy = 1; }
      break;
    case "ArrowLeft":
      if (dx !== 1) { dx = -1; dy = 0; }
      break;
    case "ArrowRight":
      if (dx !== -1) { dx = 1; dy = 0; }
      break;
  }
});

// Inicia o loop
setInterval(gameLoop, 1000 / speed);
