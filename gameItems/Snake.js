import Food from './Food.js'

class Snake {
  constructor(scale) {
    this.body = [
      { x: 0, y: 0 },
      { x: scale, y: 0 },
    ]
    this.xDir = 0
    this.yDir = 0
    this.scale = scale
  }

  update() {
    if (this.xDir !== 0 || this.yDir !== 0) {
      let head = { ...this.body[this.body.length - 1] }
      head.x += this.xDir
      head.y += this.yDir
      this.body.shift()
      this.body.push(head)
    }
  }

  draw(ctx, color) {
    let tailRadius = this.scale / 4
    for (let i = 0; i < this.body.length; i++) {
      tailRadius = tailRadius + (this.scale / 2 - this.scale / 4) / this.body.length
      ctx.beginPath()
      ctx.fillStyle = color
      ctx.arc(this.body[i].x + this.scale / 2, this.body[i].y + this.scale / 2, tailRadius, 0, 2 * Math.PI)
      ctx.fill()
    }
    //eyes
    const scale = this.scale
    const snakeHeadX = this.body[this.body.length - 1].x
    const snakeHeadY = this.body[this.body.length - 1].y

    ctx.beginPath()
    if (this.xDir === 0 && this.yDir === -scale) {
      //up
      ctx.arc(snakeHeadX + scale / 5, snakeHeadY + scale / 5, scale / 8, 0, 2 * Math.PI)
      ctx.arc(snakeHeadX + scale - scale / 5, snakeHeadY + scale / 5, scale / 8, 0, 2 * Math.PI)
    } else if (this.xDir === 0 && this.yDir === scale) {
      //down
      ctx.arc(snakeHeadX + scale / 5, snakeHeadY + scale - scale / 5, scale / 8, 0, 2 * Math.PI)
      ctx.arc(snakeHeadX + scale - scale / 5, snakeHeadY + scale - scale / 5, scale / 8, 0, 2 * Math.PI)
    } else if (this.xDir === -scale && this.yDir === 0) {
      //left
      ctx.arc(snakeHeadX + scale / 5, snakeHeadY + scale / 5, scale / 8, 0, 2 * Math.PI)
      ctx.arc(snakeHeadX + scale / 5, snakeHeadY + scale - scale / 5, scale / 8, 0, 2 * Math.PI)
    } else {
      //right
      ctx.arc(snakeHeadX + scale - scale / 5, snakeHeadY + scale / 5, scale / 8, 0, 2 * Math.PI)
      ctx.arc(snakeHeadX + scale - scale / 5, snakeHeadY + scale - scale / 5, scale / 8, 0, 2 * Math.PI)
    }
    ctx.fillStyle = '#fff'
    ctx.fill()
  }

  setScale(scale) {
    this.scale = scale
  }

  setDir(x, y) {
    this.xDir = x * this.scale
    this.yDir = y * this.scale
  }

  grow() {
    this.body.push({ ...this.body[this.body.length - 1] })
  }

  touchItem(item) {
    const headX = this.body[this.body.length - 1].x
    const headY = this.body[this.body.length - 1].y
    if (headX === item.x && headY === item.y) {
      if (item instanceof Food) {
        this.grow()
      }
      return true
    }
    return false
  }

  reset() {
    this.body = [
      { x: 0, y: 0 },
      { x: this.scale, y: 0 },
    ]
    this.xDir = 0
    this.yDir = 0
  }

  wallCollision = () => {
    const headX = this.body[this.body.length - 1].x
    const headY = this.body[this.body.length - 1].y
    if (headX >= canvas.width || headX < 0 || headY >= canvas.height || headY < 0) {
      return true
    }
    return false
  }

  tailCollision = () => {
    const headX = this.body[this.body.length - 1].x
    const headY = this.body[this.body.length - 1].y
    for (let i = 0; i < this.body.length - 1; i++) {
      if (headX === this.body[i].x && headY === this.body[i].y) {
        return true
      }
    }
    return false
  }
}

export default Snake
