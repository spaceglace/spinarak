'use strict'

const router = require('../routers/command')
const websocket = require('../utilities/websocket')

const { RTMClient, WebClient } = require('@slack/client')

const rtm = new RTMClient(process.env.SLACK_TOKEN)

// send any received messages to our command router
rtm.on('message', message => {
  if (!message.subtype && message.user !== rtm.activeUserId) {
    console.log(`${message.user}: ${message.text}`)
    websocket.broadcast({
      user: message.user,
      text: message.text
    })
    router.route(message)
  }
})

module.exports.start = function() {
  rtm.start()
}

module.exports.sendReply = function (message, text) {
  rtm.addOutgoingEvent(true, 'message', {
    channel: message.channel,
    text: text,
    as_user: true,
    thread_ts: message.thread_ts || message.ts
  })
  .catch(error => {
    console.error('sendReply error: %s', error)
  })
}
