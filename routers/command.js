'use strict'

const hello = require('../commands/hello')
const foundation = require('../commands/foundation')

const linkings = [
  { filter: /^hello$/, action:hello.greeting },
  { filter: /^running foundations$/, action:foundation.running }
]

module.exports.route = function(message) {
  linkings.forEach(link => {
    if (link.filter.test(message.text)) link.action(message)
  })
}
