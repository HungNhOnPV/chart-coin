const router = require('express-promise-router')()

const coinRouter = require('./router/coin.router')

let initAPIs = (app) => {
    app.use("/api/v1/coin", coinRouter);

    return app.use('/', router)
}
module.exports = initAPIs;