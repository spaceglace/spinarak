'use strict'

const express = require('express')
const http = require('http')

const app = express()
const server = http.createServer(app)

// set up the express server
app.set('view engine', 'ejs')
app.get('/', (req, res) => {
  res.render('pages/index')
})

module.exports.Server = server

module.exports.start = function(port) {
  server.listen(port, () => {
    console.log("Server listening on port %s.", port)
  })
}
