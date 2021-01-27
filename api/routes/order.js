const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/order')
const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Order.find()
        // populated is refrenced property  
        .populate('product', 'name')
        .select('_id quantity product')
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Success',
                orders: result
            })
        })
})
router.post('/', (req, res, next) => {

    // check product exist or not
    Product.findById(req.body.productId)
        .exec()
        .then(product => {
            if (!product) {
                res.status(404).json({
                    message: 'No recored found',
                })
            }
            //if exist then create new order
            const newOrder = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });

            return newOrder.save()
                .then(result => {
                    console.log(result),
                        res.status(200).json({
                            _id: result._id,
                            product: result.product,
                            quantity: result.quantity,
                        })
                })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

})
router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .populate('product')
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: 'success',
                    order: result
                })
            } else {
                res.status(404).json('No data found');
            }
        }).catch(e => {
            res.status(500).json({ error: e })
        })
    // if (id === 'special') {
    //     res.status('200').json({
    //         message: 'you discovered the special id',
    //         id
    //     })
    // } else {
    //     res.status('200').json({
    //         message: 'you passes an id'
    //     })
    // }
})


router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findByIdAndDelete(id)
        .then(result => {
            res.status('200').json({
                message: 'deleted order ',
            })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })

})
module.exports = router