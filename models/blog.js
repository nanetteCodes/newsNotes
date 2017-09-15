// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var BlogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type:String,
    required: true
  },
  saved:{
    type: Boolean,
    required: true,
    default: false
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Create the Blog model with the ArticleSchema
var Blog = mongoose.model("Blog", BlogSchema);

// Export the model
module.exports = Blog;
