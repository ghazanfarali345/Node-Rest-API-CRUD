const express = require('express')
const router = express.Router();
const Product = require('../models/product')
const mongoose = require('mongoose')


router.get('/', (req, res, next) => {
    Product.find()
        .then(result => {
            console.log(result)
            if (result.length > 0) {
                res.status('200').json({
                    message: 'success',
                    result
                })
            } else {
                res.status(404).json('No entries found')
            }

        })
        .catch(e => {
            console.log(e)
            res.status(500).json({ error: e })
        })

})
router.post('/', (req, res, next) => {
    // const newProduct = {
    //     name: req.body.name,
    //     price: req.body.price
    // }

    const newProduct = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    newProduct.save()
        .then(result => {
            res.status('200').json({
                message: 'prodcut is successfully added',
                result
            })
        })
        .catch(e => {
            console.log(e)
            res.status(500).json({
                error: e
            })
        })


})
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(result => {
            console.log("From Database", result)
            if (result) {

                res.status(200).json(result);
            } else {
                res.status(500).json('No data found');
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
    // if (id === 'special') {
    //     res.status('201').json({
    //         message: 'you discovered the special id',
    //         id
    //     })
    // } else {
    //     res.status('200').json({
    //         message: 'you passes an id'
    //     })
    // }
})
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId
    console.log('my id', id)
    const updateOps = {
        name: req.body.name,
        price: req.body.price
    }
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value
    // }
    console.log(updateOps)

    Product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log()
            res.status(200).json({
                message: 'successfully updated',
                result
            });
        })
        .catch(e => console.log(e, 'update err'))


})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(404).json({
                error: err
            })

        })
    // res.status('200').json({
    //     message: 'deleted product ',
    // })
})
module.exports = router