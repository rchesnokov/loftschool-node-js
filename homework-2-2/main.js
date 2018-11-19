const fs = require('fs')
const path = require('path')
const util = require('util')
const yargs = require('yargs')
const directory = require('./directory')

const argv = yargs
  .usage('Usage: $0 [options]')
  .option('source', {
    alias: 'src',
    describe: 'source directory',
    type: 'string',
    default: path.join(__dirname, 'pics', 'src')
  })
  .option('destination', {
    alias: 'dest',
    describe: 'destination directory',
    type: 'string',
    default: path.join(__dirname, 'pics', 'dest')
  }).argv

const srcPath = argv.src
const destPath = argv.dest

const copyFile = util.promisify(fs.copyFile)

async function sortCollection() {
  try {
    await directory.create(destPath)
    let files = await directory.read(srcPath)

    files = files.filter(file => {
      return !/^\./.test(file.name)
    })

    let counter = 0

    files.forEach(async file => {
      const firstLetter = file.name[0]
      const dirPath = path.join(destPath, firstLetter)

      await directory.create(dirPath)
      await copyFile(file.path, path.join(dirPath, file.name))

      if (++counter === files.length) {
        console.log('Your collection was successfully sorted!')
      }
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

sortCollection()
