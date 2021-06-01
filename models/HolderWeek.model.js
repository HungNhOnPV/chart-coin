const mongoose = require('mongoose')

const Schema = mongoose.Schema

const HolderWeekSchema = new Schema({
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

const HolderWeek = mongoose.model('HolderWeek', HolderWeekSchema)

module.exports = HolderWeek