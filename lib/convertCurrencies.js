'use strict'

var config = require('../config')
var fs = require('co-fs')
var updateExchangeRates = require('./updateRates.js')

module.exports = function* convertCurrencies(transactions, currency)
{
    // get latest exchange rates for base currency
    let exchangeRates = yield updateExchangeRates(currency)

    let totals = []
    let converted = []

    // get total converted currency for each day
    let days = Object.keys(exchangeRates)
    for (let i = 0, numDays = days.length; i < numDays; i++)
    {
        let date = days[i]
        let rates = exchangeRates[date]
        let total = 0

        for (let j = 0, numTrans = transactions.length; j < numTrans; j++)
        {
            let transaction = transactions[j]
            let transactionCurrency = transaction.currency
            let transactionAmount = transaction.amount

            if (transactionCurrency === currency)
                total += transactionAmount
            else
            {
                total += transactionAmount / rates[transactionCurrency.toUpperCase()]

                if (converted.indexOf(transactionCurrency) === -1)
                converted.push(transactionCurrency)
            }
        }

        totals.push({
            date: date,
            total: total.toFixed(2)
        })
    }

    let results = {
        totals: totals,
        base: currency,
        converted: converted
    }

    return results
}
