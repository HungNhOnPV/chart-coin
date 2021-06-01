const mongoose = require('mongoose')

const Schema = mongoose.Schema

const HolderHoursSchema = new Schema({
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

const HolderHour = mongoose.model('HolderHour', HolderHoursSchema)

module.exports = HolderHour