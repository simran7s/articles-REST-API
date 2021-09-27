const express = require("express")
const mongoose = require("mongoose")
const ejs = require("ejs")
require('dotenv').config()

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));

// INSERT YOUR MONGO URL HERE *********
mongoose.connect(process.env.MONGO_URL)

// SCHEMA
articleSchema = mongoose.Schema({
    title: String,
    content: String
})

// MODEL
const Article = mongoose.model('Article', articleSchema);

/******************   /articles   *********************/
app.route("/articles")

    .get((req, res) => {
        // Find all articles
        Article.find({}, (err, foundArticles) => {
            if (!err) {
                res.send(foundArticles)
            } else {
                res.send(err)
            }
        })
    })

    .post((req, res) => {
        // Add a new article
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        })
        article.save((err => {
            if (!err) {
                res.send("Successfully added article")
            } else {
                res.send(err)
            }
        }))
    })

    .delete((req, res) => {
        // Delete all articles
        Article.deleteMany({}, err => {
            if (err) {
                res.send(err)
            } else {
                res.send("Successfully delete all articles")
            }
        })
    })

/******************   /articles/:customRoute   *********************/

app.route("/articles/:customRoute")
    .get((req, res) => {
        // Get Article with title specified in custom route
        const customRoute = req.params.customRoute

        Article.findOne({
            title: customRoute
        }, (err, foundArticle) => {
            if (err) {
                res.send(err)
            } else {
                if (!foundArticle) {
                    res.send("No article found")
                } else {
                    res.send(foundArticle)
                }
            }
        })
    })

    .put((req, res) => {
        // Completely replace everything in the article with specfied value
        const customRoute = req.params.customRoute
        Article.updateOne({
            title: customRoute
        }, {
            title: req.body.title,
            content: req.body.content
        },
            (err, result) => {
                if (err) {
                    res.send(err)
                } else {
                    res.send("Successfully Updated Article")
                }
            })
    })

    .patch((req, res) => {
        // Replace only fields that have been defined
        const customRoute = req.params.customRoute
        Article.updateOne({
            title: customRoute
        },
            // Make it so that only defined fields get updated
            {
                $set: req.body
            },
            (err, result) => {
                if (err) {
                    res.send(err)
                } else {
                    res.send("Successfully Updated Article")
                }
            })
    })
    .delete((req, res) => {
        /* Deletes the article with a title that is the same as the custom route(/articles/customRoute) iff one exist. 
        Else, it will return "article delete" */
        const customRoute = req.params.customRoute
        Article.deleteOne({
            title: customRoute
        }, (err) => {
            if (err) {
                res.send(err)
            } else {
                res.send("Article Deleted")
            }
        })
    })

app.listen(3000, () => {
    console.log("Running on port 3000")
})