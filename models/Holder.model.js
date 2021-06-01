const mongoose = require('mongoose')

const Schema = mongoose.Schema

const HolderSchema = new Schema({
  holderTotal: {
    type: Number
  },
  createDate: {
    type: Schema.Types.Date,
    default: Date.now,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Coin",
  },
})

const Holder = mongoose.model('Holder', HolderSchema)

module.exports = Holder