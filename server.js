// const express = require("express");
// const bodyParser = require("body-parser");
// const logger = require("morgan");
// const mongoose = require("mongoose");
// const articleRoutes = require("./routes/api-routes.js");
// const noteRoutes = require("./routes/index.js");
// const expressApp = express();
// const exphbs = require("express-handlebars");
// const PORT = process.env.PORT || 3000;

// // Parse request body as JSON
// expressApp.use(express.urlencoded({ extended: true }))
// expressApp.use(express.json())

// // Accessing the Routes created
// expressApp.use("/", articleRoutes)
// expressApp.use("/", noteRoutes)

// // Make public a static folder
// expressApp.use(express.static("public"))

// // Setting Handlebars
// expressApp.engine("handlebars", exphbs({ defaultLayout: "main" }))
// expressApp.set("view engine", "handlebars")


// // Connect to the Mongo DB
// // If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// mongoose.connect(MONGODB_URI);

// require("./routes/index.js")(expressApp)

// // Start the server
// expressApp.listen(PORT, function () {
//     console.log("expressApp running on port " + PORT + "!");
// });

const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

var PORT = process.env.PORT || 3000;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

require("./routes/index.js")(app)

// additional libraries
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});