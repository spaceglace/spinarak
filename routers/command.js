'use strict'

const hello = require('../commands/hello')

const linkings = [
  { filter: /^hello$/, action:hello.greeting }
]

module.exports.route = function(message) {
  linkings.forEach(link => {
    if (link.filter.test(message.text)) link.action(message)
  })
}
