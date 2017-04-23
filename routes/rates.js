'use strict'

const routePrefix = '/rates'

var router = require('koa-router')(
{
    prefix: routePrefix
})
var updateExchangeRates = require('../lib/updateRates.js')
var utils = require('../lib/utils.js')

module.exports = function(db, models, logger)
{
    // update exchange rates for selected currency
    router.put('/:currency', function*()
    {
        logger.debug(`Started ${this.request.method} ${this.request.url}`)

        try
        {
            let currency = this.params.currency.toUpperCase()

            yield updateExchangeRates(currency)

            utils.sendResponse(this, `Updated currency ${currency}`)

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
