const { NearScanner } = require('@toio/scanner')

const main = async function() {
  let num = 1
  const cubes = await new NearScanner(1).start()
  for (let i = 0; i < num; i++) {
    const cube = await cubes[i].connect()
    console.log(cube.id)
  }
}

main()
