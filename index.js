/**
 * Copyright (c) 2019-present, Sony Interactive Entertainment Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const keypress = require('keypress')
const { NearestScanner } = require('@toio/scanner')

let cube
let cubeX = 0
let cubeY = 0
let targetX = 100
let targetY = 0

function move(x, y, cubeX, cubY) {
  const diffX = x - cubeX
  const diffY = y - cubeY
  const distance = Math.sqrt(diffX**2 + diffY**2)
  if (distance < 5) {
    return [0, 0]
  } else {
    return [40, 40]
  }
}


async function main() {
  const cube = await new NearestScanner().start()
  await cube.connect()
  console.log('toio connected')

  cube.on('id:position-id', data => {
    cubeX = data.x
    cubeY = data.y
    targetY = cubeY
    console.log(cubeX, cubeY)
  })


  setInterval(() => {
    console.log(targetX, targetY)
    cube.move(...move(targetX, targetY, cubeX, cubeY), 100)
  }, 50)

}

main()
