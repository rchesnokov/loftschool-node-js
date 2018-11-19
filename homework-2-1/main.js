const http = require('http')
const port = 3000

let clientCounter = 0

const requestHandler = (request, response) => {
  if (request.url !== '/') {
    return response.end('Bad request')
  }

  let client = clientCounter++

  const timer = setInterval(() => {
    console.log(`Client ${client}: ${new Date().toUTCString()}`)
    response.write(new Date().toUTCString() + '\r\n')
  }, process.env.INTERVAL || 1000)

  setTimeout(() => {
    clearInterval(timer)
    console.log(`Client ${client}: ${new Date().toUTCString()}`)
    response.end('Disconnect: ' + new Date().toUTCString())
  }, process.env.TIMEOUT || 10000)
}

const server = http.createServer(requestHandler)

server.listen(port, err => {
  if (err) {
    return console.error(err)
  }

  console.log(`Server is listening on port ${port}`)
})
