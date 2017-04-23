var config = {}
module.exports = config

// Server
var httpServer = config.httpServer = {}
httpServer.host = '127.0.0.1'
httpServer.port = 38000

// Database
var db = config.db = {}
db.name = 'demo'
db.type = 'sqlite'
db.storage = './db/demo.db'
db.models = {
    dir: './db/models'
}

// Routes
var routes = config.routes = {}
routes.dir = './routes'

// Web
var web = config.web = {}
web.dir = './public'

// Log
var log = config.log = {}
log['appenders'] =
    [{
        type: 'console',
        layout:
        {
            type: 'colour'
        }
    }]
log.replaceConsole = true

// Exchange rate API
var exchangeRates = config.exchangeRates = {}
exchangeRates.url = 'http://api.fixer.io/'
exchangeRates.dir = './data/rates'
exchangeRates.currencies = 'EUR,USD,JPY,CAD,CHF,GBP'
