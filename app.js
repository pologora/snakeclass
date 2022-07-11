import Snake from './snake.js'
import { scale, snakeColor, initialSnakeMoveSpeed, initialBombDuration, gameScoreTillBomb } from './constants.js'
import { clearCanvas, drawBomb, drawCanvasBackground, drawFood } from './draw.js'
import { decreaseBombDuration, increaseSnakeSpeed, playSound, randomCoordinates } from './utils.js'
import { bombExplosionSound, eatFoodSound, hitWallSound, hitTailSound, moveSound } from './sound.js'

const scoreItem = document.getElementById('score')
const betstScoreItem = document.getElementById('best-score')
const speedItem = document.getElementById('speed')
const startBtn = document.getElementById('start-btn')
const modal = document.getElementById('myModal')
const scoreItemModal = document.getElementById('score-modal')
const betstScoreItemModal = document.getElementById('best-score-modal')
const speedItemModal = document.getElementById('speed-modal')
const statsModalElement = document.getElementById('stats-modal')

//---------------------------setup------------------------------------//
let speed = initialSnakeMoveSpeed
let lastDirection = ''
let snakeMoveInterval, bobmInterval
let bombDuration = initialBombDuration
let minBombDuration = 2000
let score = 0
let record = +window.sessionStorage.getItem('record')
let speedForStats = 1

const displayScore = () => {
  if (score > record) record = score
  scoreItem.textContent = score
  betstScoreItem.textContent = record
  speedItem.textContent = speedForStats
}

const setModalStats = () => {
  scoreItemModal.textContent = score
  betstScoreItemModal.textContent = record
  speedItemModal.textContent = speedForStats
}

displayScore()

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
export const canvasWidth = canvas.clientWidth
const snake = new Snake(scale)

let food = {
  coordinates: randomCoordinates(),
  name: 'food',
}
let bomb = {
  coordinates: {},
  name: 'bomb',
}

startBtn.onclick = function () {
  modal.style.display = 'none'
  resetGame()
  startGame()
}
//----------------------------------------------------------------------//

//---------------------------------------------------------------------//
const startGame = () => {
  window.addEventListener('keydown', keyPressed)
  if (score >= gameScoreTillBomb) {
    locateBomb()
    bobmInterval = setInterval(locateBomb, bombDuration)
  }
  main()
}
const main = () => {
  if (snakeMoveInterval) {
    clearInterval(snakeMoveInterval)
  }
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

const resetGame = () => {
  snake.reset()
  bombDuration = initialBombDuration
  score = 0
  speedForStats = 1
  bomb = {
    coordinates: {},
    name: 'bomb',
  }
  speed = initialSnakeMoveSpeed
  lastDirection = ''
  clearInterval(snakeMoveInterval)
  clearInterval(bobmInterval)
}

const draw = () => {
  clearCanvas(ctx, canvas)
  drawCanvasBackground(ctx, canvas)
  if (snake.touchItem(food)) {
    playSound(eatFoodSound)
    locateFood()
    score++
    displayScore()
    if (score % 5 === 0) {
      speed = increaseSnakeSpeed(speed)
      speedForStats++
      displayScore()
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
    playSound(hitTailSound)
    gameOver()
  }

  if (snake.wallCollision()) {
    playSound(hitWallSound)
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
  playSound(moveSound)
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
    default:
      break
  }
}

const gameOver = () => {
  window.removeEventListener('keydown', keyPressed)
  window.sessionStorage.setItem('record', record)
  setModalStats()
  statsModalElement.style.display = 'flex'
  resetGame()
  displayScore()
  draw()
  setTimeout(() => {
    modal.style.display = 'block'
  }, 1000)
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
