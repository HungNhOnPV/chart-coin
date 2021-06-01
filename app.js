require('dotenv').config();

const express = require('express')
var cors = require('cors')
const logger = require('morgan')
const mongoClient = require('mongoose')
const initAPIs = require("./routers/api.router");

mongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected database from mongodb.')
}).catch((error) => {
    console.error(`Connect database is failed with error which is ${error}`)
})

const app = express()

app.use(logger(process.env.NODE_ENV))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
app.use(cors())
app.set('view engine', 'pug')

app.get('/chart', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!' })
})

initAPIs(app);

app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Server is OK'
    })
})

app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next()
})

app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {}
    const status = err.status || 500

    return res.status(status).json({
        error: {
            message: error.message
        }
    })
})

const port = process.env.PORT || 3100
app.listen(port, () => console.log(`Server is listening on port ${port}`))
