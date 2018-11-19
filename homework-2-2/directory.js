const fs = require('fs')
const path = require('path')
const util = require('util')

const mkdir = util.promisify(fs.mkdir)
const readdir = util.promisify(fs.readdir)
const stat = util.promisify(fs.stat)

async function createDir(path) {
  try {
    await mkdir(path)
    return
  } catch (err) {
    if (err.code === 'EEXIST') {
      return
    }

    throw err
  }
}

async function readDir(dirpath) {
  let results = []
  try {
    const files = await readdir(dirpath)
    let counter = files.length

    if (counter === 0) {
      return results
    }

    for (const file of files) {
      const filepath = path.join(dirpath, file)
      const stats = await stat(filepath)

      if (stats.isDirectory()) {
        const res = await readDir(filepath)
        results = results.concat(res)
        if (--counter === 0) {
          return results
        }
      } else {
        results.push({ name: file, path: filepath })
        if (--counter === 0) {
          return results
        }
      }
    }
  } catch (err) {
    throw err
  }
}

module.exports = {
  create: createDir,
  read: readDir
}
