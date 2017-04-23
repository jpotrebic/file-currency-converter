'use strict'

var config = require('../config')
var fs = require('co-fs')
var moment = require('moment')

module.exports = function* prepareResults(results)
{
    let totals = results.totals
    let converted = results.converted

    // sort totals by (amount, date)
    totals.sort(function(a,b)
    {
        let diff = a.total - b.total
        if (diff !== 0)
            return -diff
        else
        {
            let duration = moment(a.date, 'YYYY-MM-DD').diff(moment(b.date, 'YYYY-MM-DD'))
            return duration
        }
    })

    // add table header and style
    let text =
    `<!DOCTYPE html>
<html>
<head>
<style>
table, th, td {
border: 1px solid black;
    border-collapse: collapse;
}
td {
    padding: 5px;
    text-align: left;
}
tr:nth-child(odd) {
    background-color: #eee;
}
tr:nth-child(even) {
    background-color:#fff;
}
th {
    background-color: #2c5588;
    color: white;
    padding: 5px;
    text-align: center;
}
</style>
</head>
<body>\n`

    // add table values (best dates for conversion and total currency converted)
    text = text.concat(`<table>
  <tr>
    <th style="width:100px">DATE</th>
    <th style="width:400px">TOTAL [${results.base}]</th>
  </tr>\n`)

    let formatter = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: results.base
    })

    for (let i = 0; i < 5; i++)
    {
        text = text.concat(`  <tr>
    <td>${results.totals[i].date}</td>
    <td>${formatter.format(results.totals[i].total)}</td>
  </tr>\n`)
    }

    text = text.concat(`</table>\n<br>`)

    // add list of converted currencies
    text = text.concat(`<p>Converted currencies:</p>`)
    let currenciesString = ''

    for (let i = 0, len = results.converted.length; i < len; i++)
    {
        currenciesString = currenciesString.concat(results.converted[i])

        if (i < len-1)
            currenciesString = currenciesString.concat(', ')
    }

    text = text.concat(`<p>${currenciesString}</p>\n`)
    text = text.concat(`</body>\n</html>`)

    // write to results.html
    yield fs.writeFile(`${config.web.dir}/result.html`, text)
}
