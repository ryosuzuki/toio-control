const socket = io()
let cubes = []
let num = 3

/*
for (let i = 0; i < num; i++) {
  let x = 0
  let y = 0
  x = (x - 250) / 200
  y = (y - 250) / 200
  let cube = cubes[i]
  cube.setAttribute('position', `${x} 0 ${y}`)
}
*/

AFRAME.registerComponent('cube-generate', {
  init: function () {
    for (let i = 0; i < num; i++) {
      let cube = document.createElement('a-box')
      cube.setAttribute('color', '#777')
      cube.setAttribute('rotation', '0 0 0')
      cube.setAttribute('scale', '0.1 0.1 0.1')
      cube.setAttribute('position', `0 0 0`)
      this.el.sceneEl.appendChild(cube)
      cubes.push(cube)
    }
  },
  /*
  tick: function() {
    for (let i = 0; i < num; i++) {
      let cube = cubes[i]
      cube.setAttribute('position', `0 0 0`)
    }
  }
  */
})

let target = { x: 250, y: 250 }
let prev = { x: 250, y: 250 }

AFRAME.registerComponent('clickable', {
  init: function () {
    this.el.addEventListener('click', (event) => {
      console.log(event)

      let plane = document.querySelector('a-plane')
      let intersection = this.el.sceneEl.components.raycaster.getIntersection(plane)
      console.log(intersection)
      let position = intersection.point
      let sphere = document.createElement('a-sphere')
      sphere.setAttribute('position', position)
      let size = 0.04
      sphere.setAttribute('color', 'red')
      sphere.setAttribute('scale', `${size} ${size} ${size}`)
      this.el.sceneEl.appendChild(sphere)

      let x = position.x * 200 + 250
      let y = position.z * 200 + 250
      target = { x: x, y: y }

      let y0 = 100
      let y1 = 400
      let x0 = 100
      let targetPos0 = { x: x, y: y0 }
      let targetPos1 = { x: x, y: y1 }
      let targetPos2 = { x: x0, y: y }

      let cube0 = cubes[0]
      let cube1 = cubes[1]
      let cube2 = cubes[2]

      let time = 2
      let speedX = (target.x - prev.x) / time
      let speedY = (target.y - prev.y) / time
      prev = target
      let command = {
        targetPos0: targetPos0,
        targetPos1: targetPos1,
        targetPos2: targetPos2,
        speedX: speedX,
        speedY: speedY
      }

      socket.emit('move2', command)

      socket.emit('move', { x: x, y: y })
    })
  }
})
