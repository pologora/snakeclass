import { canvasWidth } from './app.js'
import { scale } from './constants.js'

export const randomCoordinates = () => {
  const x = Math.floor(Math.random() * Math.floor(canvasWidth / scale)) * scale
  const y = Math.floor(Math.random() * Math.floor(canvasWidth / scale)) * scale
  return { x, y }
}

export const isEqualPositions = () => {}

export const playSound = (sound) => {
  sound.currentTime = 0
  sound.play()
}

export const increaseSnakeSpeed = (speed) => speed * 0.75

export const decreaseBombDuration = (duration) => duration - 1000
