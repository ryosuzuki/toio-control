const { NearScanner } = require('@toio/scanner')
const ids = require('./ids.json')
const gcode = require('./gcode.json')

let num = 3


class Toio {
  constructor() {
    this.simulation = true

    // cube = null
    this.targetX = 250
    this.targetY = 250

    this.targets = []
    this.cubes = []
    for (let i = 0; i < num; i++) {
      this.cubes.push({})
      this.targets.push({})
    }
    this.speed = {}
    this.ids = ids
    this.gcode = gcode
  }

  move(id) {
    let target = this.targets[id]
    let cube = this.cubes[id]
    let speed = 0
    if (id === 2) {
      speed = this.speed.y
    } else {
      speed = this.speed.x
    }

    const diffX = target.x - cube.x
    const diffY = target.y - cube.y
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2)

    if (id === 2) {
      if (diffY ** 2 < 200) {
        return [0, 0] // stop
      }
    } else {
      if (diffX ** 2 < 200) {
        return [0, 0] // stop
      }
    }

    if (distance < 0) {
      return [speed, speed]
    } else {
      return [-speed, -speed]
    }

    /*
    let relAngle = (Math.atan2(diffY, diffX) * 180) / Math.PI - cube.angle
    relAngle = relAngle % 360
    if (relAngle < -180) {
      relAngle += 360
    } else if (relAngle > 180) {
      relAngle -= 360
    }

    const ratio = 1 - Math.abs(relAngle) / 90
    // let speed = 40
    if (relAngle > 0) {
      return [speed, speed * ratio]
    } else {
      return [speed * ratio, speed]
    }
    */
  }

  async init() {
    this.io.on('connection', (socket) => {
      console.log('connected')

      this.io.sockets.emit('gcode', this.gcode)

      socket.on('move', (data) => {
        console.log(data)
        this.targetX = data.x
        this.targetY = data.y
      })

      socket.on('move2', (data) => {
        console.log(data)
        this.targets[0] = data.targetPos0
        this.targets[1] = data.targetPos1
        this.targets[2] = data.targetPos2
        this.speed = { x: data.speedX, y: data.speedY }
      })

    })

    if (!this.simulation) {
      const cubes = await new NearScanner(num).start()

      for (let i = 0; i < num; i++) {
        const cube = await cubes[i].connect()
        console.log(cube.id)
        let id = cube.id
        let index = this.ids.findIndex(el => el === cube.id)
        this.cubes[index] = cube
      }
      console.log('toio connected')

      for (let cube of this.cubes) {
        cube.on('id:position-id', data => {
          cube.x = data.x
          cube.y = data.y
          cube.angle = data.angle
          // console.log(data)
          // this.io.sockets.emit('pos', 'test')
          let cubes = this.cubes.map((e) => {
            return { id: e.id, numId: e.numId, x: e.x, y: e.y, angle: e.angle }
          })
          this.io.sockets.emit('pos', { cubes: cubes })
        })
      }

    } else {
      for (let i = 0; i < num; i++) {
        const cube = { id: ids[i], numId: i, x: 0, y: 0, angle: 0 }
        if (i === 0) cube.y = 50
        if (i === 1) cube.y = 400
        if (i === 2) cube.x = 0
        this.cubes[i] = cube
      }
      console.log('simulator connected')
    }

    setInterval(() => {
      // console.log(this.targetX)
      // for (let cube of this.cubes) {
      //   cube.move(...this.move(this.targetX, this.targetY, cube), 100)
      // }
      for (let id = 0; id < num; id++) {
        let cube = this.cubes[id]
        if (!this.simulation) {
          cube.move(...this.move(id), 100)
        } else {
          let speed = this.move(id)[0]
          if (isNaN(speed)) return
          // console.log(delta, cube)
          if (id === 2) {
            cube.x = this.cubes[0].x
            cube.y -= speed / 4
          } else {
            cube.x -= speed / 4
          }
          cube.angle = 0
          let cubes = this.cubes.map((e) => {
            return { id: e.id, numId: e.numId, x: e.x, y: e.y, angle: e.angle }
          })
          this.io.sockets.emit('pos', { cubes: cubes })
        }
      }
    }, 50)

  }


}

module.exports = Toio