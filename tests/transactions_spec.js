'use strict'
var frisby = require('frisby')
var config = require('../config')

const serverHost = config.httpServer.host
const serverPort = config.httpServer.port

var path = `http://${serverHost}:${serverPort}/transactions`

frisby.create('[TRANSACTIONS] get all uploaded transactions')
    .get(path)
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes(
    {
        status: String,
        data: function(data)
        {
            if (!data)
                return true
            for (let i = 0; i < data.length; ++i)
            {
                expect(data[i]).toContainJsonTypes(
                {
                    amount: Number,
                    currency: String
                })
            }
        }
    })
    .toss()
