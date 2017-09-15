var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

var bodyParser = require("body-parser");
var path = require("path");
var mongoose = require("mongoose");
var Blog = require("./models/blog.js");
var Note = require("./models/notes.js");
// Initialize Express
var app = express();
mongoose.Promise = Promise;
var PORT = process.env.PORT || 5000;

// Static file support with public folder
app.use(express.static("public"));

// Database configuration
var databaseUrl = "techCrunch";
var collections = ['blog'];

// db: techCrunch
mongoose.connect('mongodb://heroku_2x4xz5dh:j6pg3ihg218t5n50go39d5cp97@ds135594.mlab.com:35594/heroku_2x4xz5dh', { useMongoClient: true });
mongoose.connection.on("connection", function(){
  console.log("mongoose connection");
});
//SCRAPING
app.get("/blog", function(req, res) {
  request("https://techcrunch.com/popular/", function(error, response, html) {
    var $ = cheerio.load(html);


    $(".block-content").each(function(i, element) {
      // Save an empty result object
      var result = {};

      result.link = $(element).find("h2 a").attr("href");
      //console.log("link: " + link);
      result.title = $(element).find("h2 a").text();
      //console.log("this is the title: " + title);
      result.summary = $(element).find("p.excerpt").text();
      //console.log("summary: " + summary);
      console.log(result);

      // Using blog model, create a new entry
      // passes the result object to the entry (and the title,link & summ.)
      var entry = new Blog(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });
    });
  });

  res.send("Scraping TechCrunch!");
});




// Simple Index Route
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Saved.html Route
app.get('/saved', function(req, res) {
  res.sendFile(path.join(__dirname, "./public/saved.html"));

});

// get saved route
app.get("/getsaved", function(req, res) {
  // Grab every doc in the Articles array
  Blog.find({'saved': true}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.send(doc);
    }
  });
});

// This will get the blog scraped from the mongoDB
app.get("/blogs", function(req, res) {
  // Grab every doc in the Articles array
  Blog.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Grab blogs by the ObjectId
app.get("/blogs/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Blog.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

// Create a new note or replace an existing note
app.post("/blogs/:id", function(req, res) {

      Blog.findOneAndUpdate({ "_id": req.params.id }, {$set: {"saved": true}},{new: true}, function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          res.send(doc);
        }
      });
});

// LISTENER
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
