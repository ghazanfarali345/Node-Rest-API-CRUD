const express = require('express');
const app = express();

const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const productRoutes = require('./api/routes/product')
const orderRoutes = require('./api/routes/order')
const mongodbURL = 'mongodb+srv://Ghazanfar:test@blog.e6jzl.mongodb.net/<shop-rest-api>?retryWrites=true&w=majority'
mongoose.connect(mongodbURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then((res) => console.log('connected', process.env.Mongo_Atlas_Pw))
    .catch((e) => console.log(e))

app.use(morgan('dev'))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next();
})

app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

app.use((res, req, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.messageapp.use((res, req, next) => {
                const error = new Error('Not found');
                error.status = 404;
                next(error)
            })
        }
    })
})

module.exports = app