const mongoose = require('mongoose')

const Schema = mongoose.Schema

const HolderDaySchema = new Schema({
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

const HolderDay = mongoose.model('HolderDay', HolderDaySchema)

module.exports = HolderDay