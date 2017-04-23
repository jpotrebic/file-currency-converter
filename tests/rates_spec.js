'use strict'
var frisby = require('frisby')
var config = require('../config')

const serverHost = config.httpServer.host
const serverPort = config.httpServer.port

var path = `http://${serverHost}:${serverPort}/rates`

frisby.create('[TRANSACTIONS] manually update euro currency exchange rates')
    .put(path + '/EUR')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSON(
    {
        status: 'ok',
        data: 'Updated currency EUR'
    })
    .toss()
