const lane = document.querySelectorAll(".mobile-container__lane");
const laneContainer = document.querySelector(".mobile-container");
const leftSprite = document.querySelector("#left-sprite");
const rightSprite = document.querySelector("#right-sprite");
let score = 0;
let leftSpriteIsLeftLane = true;
let rightSpriteIsRightLane = true;

// Logic for handling switching lanes on each game sprite
const handleSwitchLane = (event) => {
  // Arrow left logic controlling left sprite
  if (event.key === "ArrowLeft") {
    leftSpriteIsLeftLane = !leftSpriteIsLeftLane;
    if (!leftSpriteIsLeftLane) {
      leftSprite.style.transform = "translateX(150%)";
      leftSprite.style.transition = ".4s";
    } else {
      leftSprite.style.transform = "translateX(-50%)";
      leftSprite.style.transition = ".4s";
    }
  }
  // Arrow right logic controlling right sprite
  if (event.key === "ArrowRight") {
    rightSpriteIsRightLane = !rightSpriteIsRightLane;
    if (!rightSpriteIsRightLane) {
      rightSprite.style.transform = "translateX(-250%)";
      rightSprite.style.transition = ".4s";
    } else {
      rightSprite.style.transform = "translateX(-50%)";
      rightSprite.style.transition = ".4s";
    }
  }
};
// Event which fires key press logic
document.addEventListener("keydown", handleSwitchLane);

// Generate obstacles randomly
setInterval(() => {
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
      console.log(score);
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
      console.log("Game Over!");
    }
  });
};

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
