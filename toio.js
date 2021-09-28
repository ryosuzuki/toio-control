const { NearScanner } = require('@toio/scanner')

let cube
let cubeX = 0
let cubeY = 0
let targetX = 100
let targetY = 0

class Toio {
  constructor() {
    // cube = null
    this.targetX = 200
    this.cubes = []
  }

  move(x, y, cubeX, cubY) {
    const diffX = x - cubeX
    const diffY = y - cubeY
    const distance = Math.sqrt(diffX**2 + diffY**2)
    if (distance < 10) {
      return [0, 0]
    } else {
      if (diffX < 0) {
        return [40, 40]
      } else {
        return [-40, -40]
      }
    }
  }

  async init() {
    this.io.on('connection', (socket) => {
      console.log('connected')

      socket.on('move', (data) => {
        console.log(data)
        this.targetX = data.x
      })
    })

    let num = 2
    const cubes = await new NearScanner(2).start()
    for (let i = 0; i < num; i++) {
      const cube = await cubes[i].connect()
      this.cubes.push(cube)
    }
    console.log('toio connected')

    for (let cube of this.cubes) {
      cube.on('id:position-id', data => {
        cube.x = data.x
        cube.y = data.y
        cube.angle = data.angle
        // this.io.sockets.emit('pos', 'test')
        let cubes = this.cubes.map((e) => {
          return { id: e.id, numId: e.numId, x: e.x, y: e.y, angle: e.angle}
        })
        this.io.sockets.emit('pos', { cubes: cubes } )
      })
    }


    setInterval(() => {
      console.log(this.targetX)
      for (let cube of this.cubes) {
        cube.move(...this.move(this.targetX, cube.y, cube.x, cube.y), 100)
      }
    }, 50)

  }


}

module.exports = Toio