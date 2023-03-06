const mongoose = require("mongoose");

const boxSchema = new mongoose.Schema({
  boxCode: {
    type: String,
    unique: true,
    required: [true, "A box must have a code"],
  },
  product: {
    productCode: String,
    modelName: String,
    nameComponent: String,
    material: String,
  },
  scan_dt: { type: Date, default: Date.now },
  in_station: String,
  release_dt: Date,
  out_station: String,
  status: {
    type: String,
    required: [true, "A box must have a status"],
    enum: {
      values: ["process", "in_storage", "out"],
      message: "Status is either: process, in_storage, or out",
    },
  },

  // CHECK IT ASAP
  lastCallBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "last call must belong to a user."],
  },
}, {
  // toJSON: { virtuals: true }
});

// I WANNA REF THE PARENTS SO BOX MODEL CAN KNOW WHO IS THEIR CHILDREN USING VIRTUAL POPULATE, SO WE DONT NEED TO FIND THE RACK AGAIN IN BOXCONTROLLER WHILE PATCH IT, BUT IT'S NOT WORKS YET
boxSchema.virtual('racks', {
  ref: 'Rack',
  foreignField: 'content',
  localField: '_id'
})

boxSchema.pre(/^find/, function (next) {
  this.populate({
    path: "lastCallBy",
    select: "name role",
  });
  next();
});

// define for model
// const name-of-model = mongoose.model("name-of-index(will automatically assign as multiple noun)", model-schema)
const Box = mongoose.model("Box", boxSchema);
module.exports = Box;
