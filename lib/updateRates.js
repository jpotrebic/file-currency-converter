'use strict'

var config = require('../config')
var fs = require('co-fs')
var moment = require('moment')
var request = require('co-request')

module.exports = function* updateExchangeRates(currency)
{
    let ratesDir = config.exchangeRates.dir
    var oldRates

    try
    {
        let file = yield fs.readFile(`${ratesDir}/${currency}.json`, 'utf8')
        oldRates = JSON.parse(file)
    }
    catch (error)
    {
        // create file if missing
        if (error.code === 'ENOENT')
        {
            yield fs.writeFile(`${ratesDir}/${currency}.json`, '')
            oldRates = {}
        }
    }

    // find exchange rates for the last 30 days
    let availableRates = Object.keys(oldRates).length
    let updatedRates = {}
    let date = moment().subtract(30, 'days').hour(0).minute(0).second(0).millisecond(0)

    // Euro foreign exchange reference rates are updated every day at 16:00
    let latest
    if (moment().utc().hour() > 16)
    {
        date.add(1, 'day')
        latest = moment().hour(0).minute(0).second(0).millisecond(0)
    }
    else
        latest = moment().subtract(1, 'day').hour(0).minute(0).second(0).millisecond(0)

    // return if everything is up to date
    if (availableRates === 30 && oldRates[latest.format('YYYY-MM-DD')] !== undefined)
        return oldRates

    for (let i = 0; i < 30; i++)
    {
        // get exchange rate from file
        if (oldRates[date.format('YYYY-MM-DD')] !== undefined)
            updatedRates[date.format('YYYY-MM-DD')] = oldRates[date.format('YYYY-MM-DD')]
        // or get from api
        else
        {
            let response = yield request(
            {
                url: config.exchangeRates.url + date.format('YYYY-MM-DD'),
                qs: {
                    base: currency.toUpperCase(),
                    symbols: config.exchangeRates.currencies
                }
            })

            if (response)
            {
                let body = JSON.parse(response.body)
                updatedRates[date.format('YYYY-MM-DD')] = body.rates
            }
        }

        date = date.add(1, 'day')
    }

    // write updated exchange rates to file
    yield fs.writeFile(`${ratesDir}/${currency}.json`, JSON.stringify(updatedRates, null, 2))

    return updatedRates
}
