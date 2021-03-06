const router = require('express-promise-router')()

const CoinController = require('../../controllers/coin.controller')

router.route('/createContractAddress')
    .get(CoinController.createContractAddress)

router.route('/getContractAddress')
    .get(CoinController.getContractAddress)

router.route('/holders')
    .get(CoinController.createHolders)

router.route('/getHolders')
    .get(CoinController.getHolders)

router.route('/holders/day')
    .get(CoinController.getHoldersDay)

router.route('/holders/hour')
    .get(CoinController.getHoldersHour)

router.route('/holders/minute')
    .get(CoinController.getHoldersMinute)

router.route('/holders/week')
    .get(CoinController.getHoldersWeek)

router.route('/getFavoriteCoin')
    .get(CoinController.getFavoriteCoin)

module.exports = router