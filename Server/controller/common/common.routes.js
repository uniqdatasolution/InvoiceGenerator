var express = require("express");
var router = express.Router();
var app = express();

var Db = require('./common.controller');

router.route('/GetCountryList').get((req, res) => {
    Db.getCountryList().then(result => {
        // console.log('res users ', result);
        res.json(result);
    })
})

router.route('/GetStatesByCountryId/:id').get((req, res) => {
    Db.getStateListByCountryId(req.params.id).then(result => {
        console.log('res for GetStatesByCountryId ', result);
        res.json(result);
    })
})

router.route('/GetCitiesByStateId/:id').get((req, res) => {
    Db.getCityListByStateId(req.params.id).then(result => {
        console.log('res for GetCitiesByStateId ', result);
        res.json(result);
    })
})

router.route('/GetCountryByCountryId/:id').get((req, res) => {
    Db.getCountryByCountryId(req.params.id).then(result => {
        console.log('res for GetCountryByCountryId ', result);
        res.json(result);
    })
})

router.route('/GetStateByStateId/:id').get((req, res) => {
    Db.getStateByStateId(req.params.id).then(result => {
        console.log('res for GetStateByStateId ', result);
        res.json(result);
    })
})

router.route('/GetCityByCityId/:id').get((req, res) => {
    Db.getCityByCityId(req.params.id).then(result => {
        console.log('res for GetCityByCityId ', result);
        res.json(result);
    })
})

router.route('/GetCurrencyList').get((req, res) => {
    Db.getCurrencyList().then(result => {
        // console.log('res users ', result);
        res.json(result);
    })
})

module.exports = router;