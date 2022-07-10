import { scale } from './constants.js'

export const randomCoordinates = () => {
  const x = Math.floor(Math.random() * scale) * scale
  const y = Math.floor(Math.random() * scale) * scale
  return { x, y }
}

export const checkSamePositions = (snakePosition, foodPosition, bombPosition) => {}

export const isEqualPositions = () => {}

export const playSound = (sound) => sound.play()

export const increaseSnakeSpeed = (speed) => speed * 0.75

export const decreaseBombDuration = (duration) => duration - 1000
