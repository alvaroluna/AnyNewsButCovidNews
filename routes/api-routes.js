const cheerio = require("cheerio");
const request = require("request");
const db = require("../models")

module.exports = function (app) {
    /////////
    // GET //
    /////////
    app.get("/api/all", function (req, res) {
        db.Headline.find({ $query: { saved: false } }).sort({ date: -1 })
            .then(function (response) {
                res.json(response.length)
            })
    });

    app.get("/api/notes/all", function (req, res) {
        db.Note.find({})
            .then(function (response) {
                res.json(response)
            })
    });

    app.get("/api/notes/:id", function (req, res) {
        let articleId = req.params.id;
        db.Headline.findOne(
            { _id: articleId }
        )
            .populate("note")
            .then(function (result) {
                res.json(result)
            })
    });


    //////////
    // POST //
    //////////
    app.post("/api/scrape", function (req, res) {
        request("http://www.npr.org/sections/news/", function (error, response, html) {
            const $ = cheerio.load(html);
            console.log($("article.item").length)
            $("article.item").each(function (i, element) {
                let headline = $(element).find('.item-info').find('.title').find('a').text();
                let summary = $(element).find('.item-info').find('.teaser').find('a').text();
                let link = $(element).find('.item-info').find('.title').children().attr("href");
                let photo = $(element).find('.item-image').find('.imagewrap').find('a').find('img').attr("src");
                let date = $(element).find('.item-info').find('.teaser').find('a').find('time').attr("datetime");

                let headlineObject = {
                    headline: headline,
                    summary: summary,
                    link: link,
                    photo: photo,
                    date: date
                }

                db.Headline.create(headlineObject, function (error) {
                    if (error) console.log("Article already exists: " + headlineObject.headline)
                    else {
                        console.log("New article: " + headlineObject.headline);
                    }

                    if (i == ($("article.item").length - 1)) {
                        res.json("scrape complete")
                    }
                })
            });
        })
    });

    app.post("/api/create/notes/:id", function (req, res) {
        console.log(req.body);
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Headline.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                res.json(err);
            });

    });


    ////////////
    // DELETE //
    ////////////
    app.delete("/api/reduce", function (req, res) {
        db.Headline.find({ $query: { saved: false } }).sort({ date: -1 })
            .then(function (found) {
                console.log(found.length);
                let countLength = found.length;
                let overflow = countLength - 25;
                console.log(overflow)
                let overflowArray = [];

                for (var i = 0; i < (overflow); i++) {
                    overflowArray.push(found[25 + i]._id);
                    console.log(overflowArray)
                }

                db.Headline.remove({ _id: { $in: overflowArray } }, function (error, result) {
                    result["length"] = countLength;
                    console.log(result)
                    res.json(result)
                })

            });

    })

    // delete Headline documents - uses get(), though
    app.get("/api/clear", function (req, res) {
        db.Headline.remove()
            .then(function () {
                res.json("documents removed from headline collection")
            })
    });

    // delete Note
    app.delete("/api/delete/notes/:id", function (req, res) {
        db.Note.remove(
            { _id: req.params.id }
        )
            .then(function (result) {
                res.json(result)
            })
    });


    /////////
    // PUT //
    /////////
    app.put("/api/save/article/:id", function (req, res) {
        let articleId = req.params.id;
        db.Headline.findOneAndUpdate(
            { _id: articleId },
            {
                $set: { saved: true }
            }
        ).then(function (result) {
            res.json(result)
        })
    });

    app.put("/api/delete/article/:id", function (req, res) {
        let articleId = req.params.id;
        db.Headline.findOneAndUpdate(
            { _id: articleId },
            {
                $set: { saved: false }
            }
        ).then(function (result) {
            res.json(result)
        })
    });
}


