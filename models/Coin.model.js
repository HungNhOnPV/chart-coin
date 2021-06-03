const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CoinSchema = new Schema({
  contractAddress: {
    type: String
  },
  holders: {
    type: Schema.Types.Array,
    ref: "Holder",
  },
  holderDay: {
    type: Schema.Types.Array,
    ref: "HolderDay",
  },
  holderHour: {
    type: Schema.Types.Array,
    ref: "HolderHour",
  },
  holderMinute: {
    type: Schema.Types.Array,
    ref: "HolderMinute",
  },
  holderWeek: {
    type: Schema.Types.Array,
    ref: "HolderWeek",
  },
  browser: {
    type: Schema.Types.Array,
    ref: "Browser",
  },
})

const Coin = mongoose.model('Coin', CoinSchema)

module.exports = Coin