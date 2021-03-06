const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BrowserSchema = new Schema({
  local: {
    type: String
  },
  coin: {
    type: Schema.Types.Array,
    ref: "Coin",
  },
})

const Browser = mongoose.model('Browser', BrowserSchema)

module.exports = Browser