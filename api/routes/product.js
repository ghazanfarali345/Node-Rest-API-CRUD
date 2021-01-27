const express = require('express')
const router = express.Router();
const Product = require('../models/product')
const mongoose = require('mongoose')
const multer = require('multer');
const product = require('../models/product');


// only for storing image in folder without calidaction 
// const upload = multer({ dest: 'uploads/' })



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/',)
    },
    //accepts bytes
    filename: function (req, file, cb) {
        // function Call after date toISOString() is not working in it
        cb(null, new Date().toISOString + file.originalname)
    }
})
const filterImage = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}
const upload = multer({
    storage: storage,
    limit: {
        // accepts bytes
        fileSize: 1024 * 1024 * 5 // 5 MB
    },
    filterImage

})




router.get('/', (req, res, next) => {
    Product.find()
        .select('price name _id, productImage')
        .then(result => {
            console.log(result)
            if (result.length > 0) {
                res.status('200').json({
                    message: 'success',
                    result
                    // for showing extra information we can use map
                    //  product : result.map(doc=>{
                    //       return {
                    //         name:doc.name,
                    //         price:doc.price,
                    //         method:'GET',
                    //         url:'locahost/3000/products'
                    //       }
                    // })
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
router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file)

    const newProduct = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
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
                res.status(404).json('No data found');
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
    const updateOps = {}
    //pass propName and value to update
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
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