import { canvasBackgroundColor, scale } from '../utils/constants.js'

const appleImage = document.getElementById('apple')
const bombImage = document.getElementById('bomb')

export const drawCanvasBackground = (ctx, canvas) => {
  ctx.fillStyle = canvasBackgroundColor
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
}

export const clearCanvas = (ctx, canvas) => ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

