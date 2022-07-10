import Snake from './snake.js'
import { scale, snakeColor, initialSnakeMoveSpeed, initialBombDuration, gameScoreTillBomb } from './constants.js'
import { clearCanvas, drawBomb, drawCanvasBackground, drawFood } from './draw.js'
import { decreaseBombDuration, increaseSnakeSpeed, playSound, randomCoordinates } from './utils.js'
import { bombExplosionSound, eatFoodSound, hitWallSound, hitTailSound } from './sound.js'

const scoreItem = document.getElementById('score')
const betstScoreItem = document.getElementById('best-score')

//---------------------------setup------------------------------------//
let speed = initialSnakeMoveSpeed
let lastDirection = ''
let snakeMoveInterval, bobmInterval
let bombDuration = initialBombDuration
let minBombDuration = 2000
let score = 0
let record = 0

const displayScore = () => {
  if (score > record) record = score
  scoreItem.textContent = score
  betstScoreItem.textContent = record
}

displayScore()

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const snake = new Snake()
snake.scale = scale

let food = {
  coordinates: randomCoordinates(),
  name: 'food',
}
let bomb = {
  coordinates: {},
  name: 'bomb',
}

//---------------------------------------------------------------------//
const startGame = () => {
  if (score >= gameScoreTillBomb) {
    locateBomb()
    bobmInterval = setInterval(locateBomb, bombDuration)
  }
  main()
}
const main = () => {
  snakeMoveInterval = setInterval(() => {
    draw()
  }, speed)
}

const locateFood = () => {
  food.coordinates = { ...randomCoordinates() }
}

const locateBomb = () => {
  bomb.coordinates = { ...randomCoordinates() }
}

const pauseGame = () => {}

const resetGame = () => {
  snake.reset()
  bombDuration = initialBombDuration
  score = 0
  speed = initialSnakeMoveSpeed
  lastDirection = ''
  clearInterval(snakeMoveInterval)
  clearInterval(bobmInterval)
}

const draw = async () => {
  clearCanvas(ctx, canvas)
  drawCanvasBackground(ctx, canvas)
  if (snake.touchItem(food)) {
    await playSound(eatFoodSound)
    locateFood()
    score++
    displayScore()
    if (score % 5 === 0) {
      speed = increaseSnakeSpeed(speed)
      if (bobmInterval >= minBombDuration) {
        bombDuration = decreaseBombDuration(bombDuration)
      }
      clearInterval(bobmInterval)
      clearInterval(snakeMoveInterval)
      startGame()
    }
  }

  checkSamePositions()
  if (score >= gameScoreTillBomb) {
    drawBomb(ctx, bomb)
  }

  drawFood(ctx, food)
  snake.update()
  snake.show(ctx, snakeColor)

  if (snake.touchItem(bomb)) {
    playSound(bombExplosionSound)
    gameOver()
  }

  if (snake.tailCollision()) {
    await playSound(hitTailSound)
    gameOver()
  }
  if (snake.wallCollision()) {
    await playSound(hitWallSound)
    gameOver()
  }
}

const move = () => {
  draw()
  main()
}

//-----------------------------------keyEvent-----------------------------------------//
//immediately change move direction
const changeMoveDirection = () => {
  clearInterval(snakeMoveInterval)
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
        clearInterval(snakeMoveInterval)
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
    //pause the game
    case 'Space':
      pauseGame()
      lastDirection = 'Space'
      break

    default:
      break
  }
}

const gameOver = () => {
  clearInterval(bobmInterval)
  clearInterval(snakeMoveInterval)
  resetGame()
  displayScore()
  draw()
}
//------------------------------------check items position------------------------------//
const isEqualPositions = (pos1, pos2) => {
  return pos1.coordinates.x === pos2.coordinates.x && pos1.coordinates.y === pos2.coordinates.y
}
const isEqualPositionsWithSnake = (item) =>
  snake.body.some((tale) => tale.x === item.coordinates.x && tale.y === item.coordinates.y)

const checkFoodPosition = () => {
  let samePosition = isEqualPositions(food, bomb) || isEqualPositionsWithSnake(food)
  while (samePosition) {
    locateFood()
    samePosition = isEqualPositions(food, bomb) || isEqualPositionsWithSnake(food)
  }
}
const checkBombPosition = () => {
  let samePosition = isEqualPositions(food, bomb) || isEqualPositionsWithSnake(bomb)
  while (samePosition) {
    locateBomb()
    samePosition = isEqualPositions(food, bomb) || isEqualPositionsWithSnake(bomb)
  }
}
const checkSamePositions = () => {
  checkFoodPosition()
  checkBombPosition()
}
//---------------------------------------------------------------------------------------------//
startGame()
document.addEventListener('keydown', keyPressed)
