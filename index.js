'use strict'

const dotenv = require('dotenv').config()
const slack = require('./utilities/slack')
const server = require('./utilities/server')
const websocket = require('./utilities/websocket')

slack.start()
websocket.start(server.Server)
server.start(3000)
