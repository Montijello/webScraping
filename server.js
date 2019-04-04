var express = require('express')
var fs = require('fs')
var request = require('request')
var cheerio = require('cheerio')
var app = express()

app.get('/scrape', function (req, res) {

    // apocalypse now
    url = 'https://www.imdb.com/title/tt0078788/'

    request(url, function (error, response, html) {

        if (!error) {
            //  cheerio is like a subset of jQuery, hence the $, using it allows us to access data directly instead of parsing

            var $ = cheerio.load(html)
            var title, release, rating
            var json = { title: "", release: "", rating: "" }

            // the header class is our starting point

            $('.header').filter(function () {
                var data = $(this)
                
                // meat and potatoes here, grabbing film title and release date
                title = data.children().first().text()
                release = data.children().last().children().text()

                json.title = title

                json.release = release
            })

            // Since the rating is in a different section of the DOM, we'll have to write a new jQuery filter to extract this information.

            $('.star-box-giga-star').filter(function () {
                var data = $(this)
                rating = data.text()
                json.rating = rating
            })
        }

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
            console.log('File successfully written!')
        })
        res.send('Check your console!')

    })
})

app.listen('8081')
exports = module.exports = app