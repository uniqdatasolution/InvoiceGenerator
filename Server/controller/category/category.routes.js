var express = require("express");
var router = express.Router();
var app = express();

var Db = require('./category.controller');

router.route('/SaveCategory').post((req, res) => {
    // // destructuring req.body
    let add = {...req.body};
    Db.saveCategory(add).then(result => {
        console.log('res for saveCategory ', result);
        // res.status(200).json(result[0]);
        res.json(result);
    })
})

router.route('/GetAllCategories').get((req, res) => {
    Db.getAllCategories().then(result => {
        // console.log('res users ', result);
        res.json(result);
    })
})

router.route('/GetCategoryById/:id').get((req, res) => {
    Db.getCategoryById(req.params.id).then(result => {
        console.log('res for getCategoryById ', result);
        res.json(result);
    })
})

router.route('/DeleteCategoryById/:id').delete((req, res) => {
    console.log('===req', req.params.id)
    Db.deleteCategoryById(req.params.id).then(result => {
        console.log('res for deleteCategoryById ', result);
        res.json(result);
    })
})

module.exports = router;