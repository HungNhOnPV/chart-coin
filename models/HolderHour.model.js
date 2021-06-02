const mongoose = require('mongoose')

const Schema = mongoose.Schema

const HolderHourSchema = new Schema({
  holderTotal: {
    type: Number
  },
  createDate: {
    type: Schema.Types.Date,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Coin",
  },
})

const HolderHour = mongoose.model('HolderHour', HolderHourSchema)

module.exports = HolderHour