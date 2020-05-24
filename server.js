const express = require("express");
const mongoose = require("mongoose")
const articleRoutes = require("./routes/article-routes.js")
const noteRoutes = require("./routes/note-routes.js")
const PORT = process.env.PORT || 3000
const expressApp = express()
const exphbs = require("express-handlebars")

// Parse request body as JSON
expressApp.use(express.urlencoded({ extended: true }))
expressApp.use(express.json())

// Accessing the Routes created
expressApp.use("/", articleRoutes)
expressApp.use("/", noteRoutes)

// Make public a static folder
expressApp.use(express.static("public"))

// Setting Handlebars
expressApp.engine("handlebars", exphbs({ defaultLayout: "main" }))
expressApp.set("view engine", "handlebars")


// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// var MONGODB_URI = process.env.MONGODB_URI || ("mongodb://localhost/scrapeOS", { useNewUrlParser: true });

// mongoose.connect(MONGODB_URI);


// Start the server
expressApp.listen(PORT, function () {
    console.log("expressApp running on port " + PORT + "!");
});