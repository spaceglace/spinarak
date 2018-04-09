'use strict'

const axios = require('axios')
const slack = require('../utilities/slack')

module.exports.running = function(message) {
  axios({
    method: 'get',
    url: 'http://localhost:8085/api/active',
    responseType: 'json',
    timeout: 5000
  })
  .then(result => {
    if (result.data.length === 0) {
      slack.sendReply(
        message,
        'No currently running foundations.'
      )
    }
    else {
      let data = result.data.data
      let outtext = 'Current foundations: ```\n'

      for (let cluster in data) {
        outtext += cluster + ': ' 
                 + data[cluster].percent + '% '
                 + 'on ' + data[cluster].server + '\n'
      }
      outtext += '\n```'

      slack.sendReply(message, outtext)
    }
  })
  .catch(error => {
    console.log('foundation.running error: %s', error.message)
    slack.sendReply(
      message,
      "Couldn't reach my foundation monitor. Try again later?"
    )
  })
}

// look for any new foundation errors since the last check
let failThreshold = Date.now()

setInterval(() => {
  axios({
    method: 'get',
    url: 'http://localhost:8085/api/failed/' + failThreshold,
    responseType: 'json',
    timeout: 5000
  })
  .then(result => {
    if (result.data.length > 0) {
      let outtext = ""
      result.data.data.forEach(failure => {
        outtext += failure.cluster.name 
                 + ' failed foundation on ' + failure.cluster.server
                 + ' ```' + failure.cluster.status + '``` '
                 + 'Node statuses: ```'

        failure.cluster.nodes.forEach(node => {
          outtext += node.hypervisorIP + ': ' + node.status + '\n'

          node.messages.forEach(message => {
            outtext += '    ' + message + '\n'
          })
        })

        outtext += '```\n'
      })

      slack.broadcast('G9A1QB4G0', outtext)
    }
  })
  .catch(error => {
    console.error('foundation.failed error: %s', error.message)
  })

  failThreshold = Date.now()
}, 60000)
