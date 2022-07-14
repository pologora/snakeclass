class Item {
  constructor(xPoint, yPoint, scale, image) {
    this.x = xPoint
    this.y = yPoint
    this.scale = scale
    this.image = image
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.scale, this.scale)
  }

  setNewPosition(xPoint, yPoint) {
    this.x = xPoint
    this.y = yPoint
  }
}

export default Item
