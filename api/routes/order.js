const express = require('express')
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status('200').json({
        message: 'get orders '
    })
})
router.post('/', (req, res, next) => {
    res.status('201').json({
        message: 'oreder is created '
    })
})
router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    if (id === 'special') {
        res.status('200').json({
            message: 'you discovered the special id',
            id
        })
    } else {
        res.status('200').json({
            message: 'you passes an id'
        })
    }
})


router.delete('/:orderId', (req, res, next) => {
    res.status('200').json({
        message: 'deleted order ',
    })
})
module.exports = router