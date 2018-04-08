'use strict'

const slack = require('../utilities/slack')

module.exports.greeting = function(message) {
  slack.sendReply(message, 'hi there')
}
