import { canvasBackgroundColor, foodColor, scale } from './constants.js'

const appleImage = document.getElementById('apple')
const bombImage = document.getElementById('bomb')

export const drawCanvasBackground = (ctx, canvas) => {
  ctx.fillStyle = canvasBackgroundColor
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
}

export const clearCanvas = (ctx, canvas) => ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

export const drawFood = (ctx, food) => {
  ctx.fillStyle = foodColor
  ctx.drawImage(appleImage, food.coordinates.x, food.coordinates.y, scale, scale)
}

export const drawBomb = (ctx, bomb) => {
  ctx.fillStyle = foodColor
  ctx.drawImage(bombImage, bomb.coordinates.x, bomb.coordinates.y, scale, scale)
}
