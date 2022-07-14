import { canvasBackgroundColor } from '../utils/constants.js'


export const drawCanvasBackground = (ctx, canvas) => {
  ctx.fillStyle = canvasBackgroundColor
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
}

export const clearCanvas = (ctx, canvas) => ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

