var express = require("express");
var router = express.Router();
var app = express();

var Db = require('./product.controller');

router.route('/SaveProduct').post((req, res) => {
    // // destructuring req.body
    let add = {...req.body};
    Db.saveProduct(add).then(result => {
        console.log('res for saveProduct ', result);
        // res.status(200).json(result[0]);
        res.json(result);
    })
})

router.route('/GetAllProducts').get((req, res) => {
    Db.getAllProducts().then(result => {
        // console.log('res users ', result);
        res.json(result);
    })
})

router.route('/GetProductByProductId/:id').get((req, res) => {
    Db.getProductByProductId(req.params.id).then(result => {
        console.log('res for getProductByProductId ', result);
        res.json(result);
    })
})

router.route('/GetProductsByCategoryId/:id').get((req, res) => {
    Db.getProductsByCategoryId(req.params.id).then(result => {
        console.log('res for getProductsByCategoryId ', result);
        res.json(result);
    })
})

router.route('/DeleteProductById/:id').delete((req, res) => {
    console.log('===req', req.params.id)
    Db.deleteProductById(req.params.id).then(result => {
        console.log('res for deleteProductById ', result);
        res.json(result);
    })
})

module.exports = router;