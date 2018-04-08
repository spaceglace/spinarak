'use strict'

const websocket = require('ws')

let wss = undefined

module.exports.start = function(server) {
  wss = new websocket.Server({server})

  // set up the websocket server initialization
  wss.on('connection', ws => {
    console.log('client loaded webpage and connected to socket')

    ws.isAlive = true
    ws.on('pong', () => ws.isAlive = true)
    ws.on('close', (code) => console.log('ws closed: %s, %s', code))
  })

  // set up 10 second pings on websocket connections
  setInterval(() => {
    wss.clients.forEach(ws => {
      if (!ws.isAlive) return ws.terminate()

      ws.isAlive = false
      ws.ping(null, false, true)
    })
  }, 10000)
}

module.exports.broadcast = function(payload) {
  console.log('sending broadcast: %s', JSON.stringify(payload))
  wss.clients.forEach(ws => ws.send(JSON.stringify(payload)))
}
