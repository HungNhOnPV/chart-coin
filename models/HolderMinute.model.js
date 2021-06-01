const mongoose = require('mongoose')

const Schema = mongoose.Schema

const HolderMinutesSchema = new Schema({
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

const HolderMinute = mongoose.model('HolderMinute', HolderMinutesSchema)

module.exports = HolderMinute