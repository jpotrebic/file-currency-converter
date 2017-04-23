'use strict'

const routePrefix = '/'

var convertCurrencies = require('../lib/convertCurrencies.js')
var multer = require('koa-router-multer')
var router = require('koa-router')(
{
    prefix: routePrefix
})
var utils = require('../lib/utils.js')
var prepareResults = require('../lib/prepareResults.js')

// multer setup
var storage = multer.memoryStorage()
var upload = multer({storage: storage})

module.exports = function(db, models, logger)
{
    let model = models['transaction']

    // upload transactions from a file
    router.post('/', upload.single('file'), function*()
    {
        logger.debug(`Started ${this.request.method} ${this.request.url}`)

        try
        {
            let file = this.req.file

            if (!file)
                this.throw('Must select a file.')

            // only accept json files
            if (file.mimetype !== 'application/json')
                this.throw('Must upload a json file.')

            // store transactions from file to database
            let transactions = JSON.parse(file.buffer.toString())
            let data = yield model.bulkCreate(transactions)

            // get currency and find best conversions dates
            let currency = this.req.body.currency
            let converted = yield convertCurrencies(transactions, currency)

            // create result table
            yield prepareResults(converted)
            this.redirect('/result.html')

            logger.debug(`Finished ${this.request.method} ${this.request.url} SUCCESS ...`)
        }
        catch (error)
        {
            logger.debug(`Finished ${this.request.method} ${this.request.url} WITH AN ERROR ...`)
            logger.error(`${routePrefix}:`, error)

            utils.sendError(this, error.message, error.status || 400)
        }
    })

    return router
}
