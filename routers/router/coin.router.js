const router = require('express-promise-router')()

const CoinController = require('../../controllers/coin.controller')

router.route('/holders')
    .get(CoinController.createHolders)

router.route('/getHolders')
    .get(CoinController.getHolders)

module.exports = router