import Snake from './gameItems/Snake.js'
import {
  scale,
  snakeColor,
  initialSnakeMoveSpeed,
  gameScoreTillBomb,
  scoreTillIntervalOn,
  foodChangePositionInterval,
} from './utils/constants.js'
import { clearCanvas, drawCanvasBackground } from './actions/actions.js'
import { increaseSnakeSpeed, playSound, randomCoordinates } from './utils/utils.js'
import { bombExplosionSound, eatFoodSound, hitWallSound, hitTailSound, moveSound } from './utils/sound.js'
import Food from './gameItems/Food.js'
import Bomb from './gameItems/Bomb.js'

const appleImage = document.getElementById('apple')
const bombImage = document.getElementById('bomb')

const scoreItem = document.getElementById('score')
const betstScoreItem = document.getElementById('best-score')
const speedItem = document.getElementById('speed')
const startBtn = document.getElementById('start-btn')
const modal = document.getElementById('myModal')
const scoreItemModal = document.getElementById('score-modal')
const betstScoreItemModal = document.getElementById('best-score-modal')
const speedItemModal = document.getElementById('speed-modal')
const statsModalElement = document.getElementById('stats-modal')

//------------------------SETUP---------------------------------------//
//-----------------------create game board----------------------------//
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
export const canvasWidth = canvas.clientWidth
//---------------------------variables------------------------------------//
let speed = initialSnakeMoveSpeed
let lastDirection = ''
//----------------------variables for interval clearing----------------//
let snakeMoveIntervalId, foodIntervalId

let score = 0
let record = +window.localStorage.getItem('record')
let speedForStats = 1

let bombArray = []
let foodArray = []

const createBomb = () => {
  const { x, y } = randomCoordinates()
  const bomb = new Bomb(x, y, scale, bombImage)
  let samePosition = isEqualPositions(bomb) || isEqualPositionsWithSnake(bomb)
  while (samePosition) {
    changeBombPosition(bomb)
    samePosition = isEqualPositions(bomb) || isEqualPositionsWithSnake(bomb)
  }
  bombArray.push(bomb)
}

const createFood = () => {
  const { x, y } = randomCoordinates()
  const food = new Food(x, y, scale, appleImage)
  let samePosition = isEqualPositions(food) || isEqualPositionsWithSnake(food)
  while (samePosition) {
    changeFoodPosition(food)
    samePosition = isEqualPositions(food) || isEqualPositionsWithSnake(food)
  }
  foodArray.push(food)
}

const changeFoodPosition = (food) => {
  const { x, y } = randomCoordinates()
  food.setNewPosition(x, y)
}

const drawFood = () => {
  if (foodArray.length > 0) {
    for (const food of foodArray) {
      food.draw(ctx)
    }
  }
}

const drawBomb = () => {
  if (bombArray.length > 0) {
    for (const bomb of bombArray) {
      bomb.draw(ctx)
    }
  }
}

const changeBombPosition = (bomb) => {
  const { x, y } = randomCoordinates()
  bomb.setNewPosition(x, y)
}

const snake = new Snake(scale)

const displayScore = () => {
  if (score > record) record = score
  scoreItem.textContent = score
  betstScoreItem.textContent = record
  speedItem.textContent = speedForStats
}

//stats after game over
const setModalStats = () => {
  scoreItemModal.textContent = score
  betstScoreItemModal.textContent = record
  speedItemModal.textContent = speedForStats
}

displayScore()

//----------------------------------------------------------------------//

//----------------------------------------------------------------------//
startBtn.onclick = function () {
  modal.style.display = 'none'
  resetGame()
  startGame()
}

const startGame = () => {
  window.addEventListener('keydown', keyPressed)
  if (foodArray.length === 0) {
    createFood()
  }
  gameLoop()
}

const gameLoop = () => {
  if (snakeMoveIntervalId) {
    clearInterval(snakeMoveIntervalId)
  }
  snakeMoveIntervalId = setInterval(() => {
    draw()
  }, speed)
}

const resetGame = () => {
  snake.reset()
  score = 0
  speedForStats = 1
  bombArray = []
  speed = initialSnakeMoveSpeed
  lastDirection = ''
  clearInterval(snakeMoveIntervalId)
  clearInterval(foodIntervalId)
}

const snakeEatFood = () => {
  const food = foodArray[0]
  if (snake.touchItem(food)) {
    playSound(eatFoodSound)
    score++
    if (score >= scoreTillIntervalOn) {
      if (foodIntervalId) clearInterval(foodIntervalId)
      foodIntervalId = setInterval(() => {
        foodArray.pop()
        createFood()
      }, foodChangePositionInterval)
    }
    foodArray.pop()
    createFood()
    displayScore()
    if (score % 5 === 0) {
      speed = increaseSnakeSpeed(speed)
      speedForStats++
      displayScore()
      if (score >= gameScoreTillBomb) {
        createBomb()
      }
      startGame()
    }
  }
}

const draw = () => {
  clearCanvas(ctx, canvas)
  drawCanvasBackground(ctx, canvas)

  snakeEatFood()
  
  snake.update()
  drawFood()
  drawBomb()
  checkCollisions()
  
  snake.draw(ctx, snakeColor)
}

const move = () => {
  draw()
  gameLoop()
}

//-----------------------------------keyEvent-----------------------------------------//
//immediately change move direction
const changeMoveDirection = () => {
  playSound(moveSound)
  clearInterval(snakeMoveIntervalId)
  move()
}

const keyPressed = (event) => {
  const key = event.code.replace('Arrow', '')
  switch (key) {
    case 'Up':
      if (lastDirection !== 'Down' && lastDirection !== 'Up') {
        snake.setDir(0, -1)
        lastDirection = 'Up'
        changeMoveDirection()
      }
      break
    case 'Down':
      if (lastDirection !== 'Up' && lastDirection !== 'Down') {
        snake.setDir(0, 1)
        lastDirection = 'Down'
        changeMoveDirection()
      }
      break
    case 'Left':
      if (lastDirection !== 'Right' && lastDirection !== 'Left') {
        snake.setDir(-1, 0)
        lastDirection = 'Left'
        changeMoveDirection()
      }
      break
    case 'Right':
      if (lastDirection !== 'Left' && lastDirection !== 'Right') {
        snake.setDir(1, 0)
        lastDirection = 'Right'
        changeMoveDirection()
      }
      break
    default:
      break
  }
}

const gameOver = () => {
  window.removeEventListener('keydown', keyPressed)
  window.localStorage.setItem('record', record)
  setModalStats()
  statsModalElement.style.display = 'flex'
  resetGame()
  displayScore()
  setTimeout(() => {
    modal.style.display = 'block'
  }, 1000)
}

//------------------------------------check items position------------------------------//
const isEqualPositions = (item) => {
  const isFood = foodArray.some((i) => i.x === item.x && i.y === item.y)
  const isBomb = bombArray.some((i) => i.x === item.x && i.y === item.y)
  return isFood || isBomb
}

const isEqualPositionsWithSnake = (item) => snake.body.some((tale) => tale.x === item.x && tale.y === item.y)

//---------------------------------------------------------------------------------------------//
//check game over cases
const checkCollisions = () => {
  for (const bomb of bombArray) {
    if (snake.touchItem(bomb)) {
      playSound(bombExplosionSound)
      gameOver()
      return
    }
  }
  if (snake.tailCollision()) {
    playSound(hitTailSound)
    gameOver()
  } else if (snake.wallCollision()) {
    playSound(hitWallSound)
    gameOver()
  }
}
