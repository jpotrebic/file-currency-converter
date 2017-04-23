'use strict'

const routePrefix = '/transactions'

var router = require('koa-router')(
{
    prefix: routePrefix
})
var utils = require('../lib/utils.js')

module.exports = function(db, models, logger)
{
    let model = models['transaction']

    // get all or get one by id
    router.get('/:id?', function*()
    {
        logger.debug(`Started ${this.request.method} ${this.request.url}`)

        try
        {
            let id = this.params.id
            let data = null

            // get one by id/uid
            if (id)
            {
                if (isNaN(id))
                    this.throw('Transaction id must be a number')
                data = yield model.findOne(
                    {
                        where: {
                            id: id
                        }
                    })
            }
            // or get all
            else
            {
                // if HEAD request send only item count
                if (this.method == 'HEAD')
                {
                    this.response.set('x-total-count', yield model.count())
                }
                // if this is normal GET request return all data with item count
                else
                {
                    data = yield model.findAndCountAll()

                    this.response.set('x-total-count', data.count)
                    data = data.rows
                }
            }

            utils.sendResponse(this, data)

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
