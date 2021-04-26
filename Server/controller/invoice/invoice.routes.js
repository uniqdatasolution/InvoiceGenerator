var express = require("express");
var router = express.Router();
var app = express();

var Db = require('./invoice.controller');

router.route('/SaveInvoice').post((req, res) => {
    // // destructuring req.body
    let add = {...req.body};
    Db.saveInvoice(add).then(result => {
        console.log('res for saveInvoice ', result);
        // res.status(200).json(result[0]);
        res.json(result);
    })
})

router.route('/SaveInvoiceDetail').post((req, res) => {
    console.log('=========================req for save invoice', req.body);
    if(req.body.length > 0) {
        req.body.forEach(element => {
            let add = {...element};
            Db.saveInvoiceDetail(add).then(result => {
                console.log('res for saveInvoiceDetail ', result);
                // res.status(200).json(result[0]);
                res.json(result);
            })
        });
    } else {
        let add = {...req.body};
        Db.saveInvoiceDetail(add).then(result => {
            console.log('res for saveInvoiceDetail ', result);
            // res.status(200).json(result[0]);
            res.json(result);
        })
    }
})

router.route('/GetInvoiceList').get((req, res) => {
    Db.getAllInvoices().then(result => {
        // console.log('res users ', result);
        res.json(result);
    })
})

router.route('/GetInvoiceDetailsList').get((req, res) => {
    Db.getAllInvoiceDetailsList().then(result => {
        // console.log('res users ', result);
        res.json(result);
    })
})

router.route('/GetInvoiceByInvoiceId/:id').get((req, res) => {
    Db.getInvoiceByInvoiceId(req.params.id).then(result => {
        console.log('res for getInvoiceByInvoiceId ', result);
        res.json(result);
    })
})

router.route('/GetInvoiceDetailsListByInvoiceId/:id').get((req, res) => {
    Db.getInvoiceDetailsByInvoiceId(req.params.id).then(result => {
        console.log('res for getInvoiceDetailsByInvoiceId ', result);
        res.json(result);
    })
})

router.route('/GetInvoiceDetailByInvoiceDetailId/:id').get((req, res) => {
    Db.getInvoiceDetailByInvoiceDetailId(req.params.id).then(result => {
        console.log('res for getInvoiceDetailByInvoiceDetailId ', result);
        res.json(result);
    })
})

router.route('/DeleteInvoiceById/:id').delete((req, res) => {
    console.log('===req', req.params.id)
    Db.deleteInvoiceById(req.params.id).then(result => {
        console.log('res for DeleteInvoiceById ', result);
        // res.status(200).json({data: result[0], errorMessage: ""});
        res.json(result);
    })
})

router.route('/DeleteInvoiceDetailById/:id').delete((req, res) => {
    console.log('===req', req.params.id)
    Db.deleteInvoiceDetailById(req.params.id).then(result => {
        console.log('res for DeleteInvoice detail ById ', result);
        // res.status(200).json({data: result[0], errorMessage: ""});
        res.json(result);
    })
})

module.exports = router;