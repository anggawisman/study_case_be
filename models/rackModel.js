const mongoose = require("mongoose");

const rackSchema = new mongoose.Schema({
  rackCode: {
    type: String,
    unique: true,
    required: [true, "A Rack must have a Code"],
  },
  coordinate: {
    x: {
      type: Number,
      required: [true, "A Rack must have a coordinate X"],
    },
    y: {
      type: Number,
      required: [true, "A Rack must have a coordinate Y"],
    },
  },
  index: { type: Number, unique: true },
  content: {
    type: mongoose.Schema.ObjectId,
    ref: "Box",
    unique: true,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// QUERY MIDDLEWARE
rackSchema.pre(/^find/, function (next) {
  // population is the process of replacing the specified path in the document of one collection with the actual document from the other collection.
  this.populate({
    path: "content",
    select: "-__v",
  });

  // to track long of query took our data in post /^find/
  this.start = Date.now();
  next();
});

rackSchema.post(/^find/, function (docs, next) {
  // to track long of query took our data
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// method for DEFINE RACK THAT EMPTY AND THE LOWEST INDEX
// rackSchema.methods.defineRack = function () {
//   this.find({ content: null }).sort({ index: 1 }).limit(1)
//   return true
// }

const Rack = mongoose.model("Rack", rackSchema);
module.exports = Rack;
