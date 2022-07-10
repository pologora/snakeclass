class Snake {
  constructor() {
    this.body = [
      { x: 0, y: 0 },
      { x: 20, y: 0 },
    ]
    this.xDir = 0
    this.yDir = 0
    this.scale = 1
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

  show(ctx, color) {
    for (let i = 0; i < this.body.length; i++) {
      ctx.fillStyle = color
      ctx.fillRect(this.body[i].x, this.body[i].y, this.scale, this.scale)
    }
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

  playSound(sound) {
    sound.play()
  }

  touchItem(item) {
    const headX = this.body[this.body.length - 1].x
    const headY = this.body[this.body.length - 1].y
    if (headX === item.coordinates.x && headY === item.coordinates.y) {
      if (item.name === 'food') {
        this.grow()
      }
      return true
    }
    return false
  }

  reset() {
    this.body = [
      { x: 0, y: 0 },
      { x: 20, y: 0 },
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
