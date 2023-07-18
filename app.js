const lane = document.querySelectorAll(".mobile-container__lane");
const laneContainer = document.querySelector(".mobile-container");
const leftSprite = document.querySelector("#left-sprite");
const rightSprite = document.querySelector("#right-sprite");
const startGameBtn = document.querySelector("#start-game-button");
const readyGoText = document.querySelector("#countdown");
const gameOverScreen = document.querySelector(".mobile-container__game-over");
const soundButton = document.querySelector("#sound-button");
const startGameOverlay = document.querySelector(
  ".mobile-container__start-game"
);
const scoreElement = document.querySelector("#score");
const restartGameBtn = document.querySelector("#restart-btn");
const mobileLeftBtn = document.querySelector(".mobile-left-btn");
const mobileRightBtn = document.querySelector(".mobile-right-btn");
let obstacleTimeout;
let score = 0;
let countdownTimer = 2;
let leftSpriteIsLeftLane = true;
let rightSpriteIsRightLane = true;
let isAudioMuted = true;
let gameTheme;
let pointSound;
let gameOverSound;
let initialCountdownTimer = 2;

// Handles logic to switch between sound images and initialize the game audio
const handleSoundButton = () => {
  gameTheme = new Audio("./assets/music.mp3");
  pointSound = new Audio("./assets/point.wav");
  gameOverSound = new Audio("./assets/gameover.wav");
  if (isAudioMuted) {
    isAudioMuted = !isAudioMuted;
    soundButton.src = "./assets/sound-on.png";
  } else {
    isAudioMuted = !isAudioMuted;
    soundButton.src = "./assets/Mute_Icon.png";
  }
};

soundButton.addEventListener("click", handleSoundButton);

// Logic for handling left sprite movement
const leftButtonLogic = () => {
  leftSpriteIsLeftLane = !leftSpriteIsLeftLane;
  if (!leftSpriteIsLeftLane) {
    leftSprite.style.transform = "translateX(150%)";
    leftSprite.style.transition = ".4s";
  } else {
    leftSprite.style.transform = "translateX(-50%)";
    leftSprite.style.transition = ".4s";
  }
};

// Logic for handling right sprite movement
const rightButtonLogic = () => {
  rightSpriteIsRightLane = !rightSpriteIsRightLane;
  if (!rightSpriteIsRightLane) {
    rightSprite.style.transform = "translateX(-250%)";
    rightSprite.style.transition = ".4s";
  } else {
    rightSprite.style.transform = "translateX(-50%)";
    rightSprite.style.transition = ".4s";
  }
};

// Event which fires key press logic
document.addEventListener("keydown", (event) => {
  event.key === "ArrowLeft" ? leftButtonLogic() : rightButtonLogic();
});

// Fires left button on mobile click
mobileLeftBtn.addEventListener("click", () => {
    leftButtonLogic();
});

// Fires right button on mobile click
mobileRightBtn.addEventListener("click", () => {
    rightButtonLogic();
});

// Generate obstacles randomly
const generateRandomObstacles = () => {
  obstacleTimeout = setInterval(() => {
    // Arrays storing each potential value that get subsequently randomized
    const obstacleLanes = ["5.5%", "30.5%", "55.5%", "80.5%"];
    const obstacleTypes = ["circle", "square", "square", "square", "circle"];
    const randomLaneNum = Math.floor(Math.random() * 4);
    const randomTypeNum = Math.floor(Math.random() * 5);

    // Creste new element and randomly generate its properties
    const newObstacle = document.createElement("div");
    laneContainer.appendChild(newObstacle);
    newObstacle.classList.add(obstacleTypes[randomTypeNum]);
    newObstacle.style.left = `${obstacleLanes[randomLaneNum]}`;
    // Removes obstacles
    removeObstacles();
  }, 520);
};

const handleStartAndResetGame = () => {
  countdownTimer = initialCountdownTimer;
  mobileLeftBtn.style.display = "block";
  mobileRightBtn.style.display = "block";
  startGameOverlay.style.display = "none";
  readyGoText.style.display = "block";
  readyGoText.innerText = "Ready?";
  if (!isAudioMuted) {
    gameTheme.play();
    gameTheme.loop = true;
  }
  setTimeout(() => {
    readyGoText.innerText = "Go!";
    setTimeout(() => {
      readyGoText.style.display = "none";
    }, 1000);
  }, 1000);

  setTimeout(() => {
    generateRandomObstacles();
  }, 1500);
};

// When you hit start game, remove game start overlay and start generating obstacles
startGameBtn.addEventListener("click", () => {
  countdownTimer -= 1;
  handleStartAndResetGame();
});

// Logic to handle if each obstacle touches game sprites
const doesObstacleTouchCharacter = () => {
  const circleObstacles = document.querySelectorAll(".circle");
  const squareObstacles = document.querySelectorAll(".square");
  const leftSpritePositioning = leftSprite.getBoundingClientRect();
  const rightSpritePositioning = rightSprite.getBoundingClientRect();

  /**
   * Logic setup for checking if a sprite touches an obstacle
   * @param {HTMLDivElement} obstacle
   * @param {HTMLDivElement} spritePositioning
   */
  const checkCollision = (obstacle, spritePositioning) => {
    const obstaclePosition = obstacle.getBoundingClientRect();
    return (
      obstaclePosition.left < spritePositioning.right &&
      obstaclePosition.right > spritePositioning.left &&
      obstaclePosition.top < spritePositioning.bottom &&
      obstaclePosition.bottom > spritePositioning.top
    );
  };

  /**
   * For each circle obstacle, check collision rapidly.
   * This increases the score and removes the collided element from the DOM
   */
  circleObstacles.forEach((circleObstacle) => {
    if (
      checkCollision(circleObstacle, leftSpritePositioning) ||
      checkCollision(circleObstacle, rightSpritePositioning)
    ) {
      circleObstacle.remove();
      score++;
      scoreElement.innerText = score.toString();
      if (!isAudioMuted) {
        pointSound.currentTime = 0;
        pointSound.play();
      }
    }
  });

  /**
   * For each square obstacle, check collision rapidly
   * This fires the 'game over' state
   */
  squareObstacles.forEach((squareObstacle) => {
    if (
      checkCollision(squareObstacle, leftSpritePositioning) ||
      checkCollision(squareObstacle, rightSpritePositioning)
    ) {
      handleGameOver();
    }
  });
};

// Function that fires when game over criteria is met
const handleGameOver = () => {
  const circleObstacles = document.querySelectorAll(".circle");
  const squareObstacles = document.querySelectorAll(".square");
  mobileLeftBtn.style.display = "none";
  mobileLeftBtn.style.display = "none";
  clearInterval(obstacleTimeout);
  gameOverScreen.style.display = "flex";
  gameOverSound.play();
  gameTheme.pause();
  gameTheme.currentTime = 0;
  scoreElement.innerText = 0;
  score = 0;
  circleObstacles.forEach((el) => {
    el.remove();
  });
  squareObstacles.forEach((el) => {
    el.remove();
  });
};

// Checks if you miss a circle. If you did, call game over
setInterval(() => {
  const circleObstacles = document.querySelectorAll(".circle");
  const containerHeight = laneContainer.offsetHeight;
  circleObstacles.forEach((circleObstacle) => {
    if (circleObstacle.getBoundingClientRect().y >= containerHeight) {
      handleGameOver();
    }
  });
}, 100);

// Every 22 milliseconds, check if two elements collide
setInterval(doesObstacleTouchCharacter, 22);

/** Handles removing obstacles from the DOM to reduce clutter
 * This happens when each obstacle iteration stops
 */
const removeObstacles = () => {
  const circleObstacles = document.querySelectorAll(".circle");
  const squareObstacles = document.querySelectorAll(".square");

  // Removes each obstacle when animation ends
  circleObstacles.forEach((el) => {
    el.addEventListener("animationend", () => {
      el.remove();
    });
  });
  squareObstacles.forEach((el) => {
    el.addEventListener("animationend", () => {
      el.remove();
    });
  });
};

restartGameBtn.addEventListener("click", () => {
  gameOverScreen.style.display = "none";

  handleStartAndResetGame();
});
