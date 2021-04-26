var express = require("express");
var router = express.Router();
var app = express();

var Db = require('./customers.controller');

const multer = require("multer");
const path = require("path");

app.use("/Uploads", express.static(path.join(__dirname, 'Uploads')));

const storage = multer.diskStorage({
    destination: './Uploads',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {fileSize:1000000}
})

// router.route('/saveClient').post(upload.single('ProfileImage'),(req, res) => {
//     // destructuring req.body
//     console.log('==req,', req.file);
//     const profileImageUrl = req.protocol + '://' + req.get('host') + '/ProfileImage/' + req.file.filename;
//     let add = {...req.body};
//     add.ProfileImage = profileImageUrl;
//     // console.log('===body', add);
//     Db.saveClient(add).then(result => {
//         console.log('res for saveClient ', result[0]);
//         res.status(200).json(result[0]);
//     })
// })

router.route('/SaveCustomer').post((req, res) => {
    // // destructuring req.body
    // console.log('==req,', req.file);
    // const profileImageUrl = req.protocol + '://' + req.get('host') + '/ProfileImage/' + req.file.filename;
    let add = {...req.body};
    // add.ProfileImage = profileImageUrl;
    // // console.log('===body', add);
    Db.saveCustomer(add).then(result => {
        console.log('res for saveCustomer ', result);
        // res.status(200).json(result[0]);
        res.json(result);
    })
})

router.route('/GetAllCustomers').get((req, res) => {
    Db.getCustomers().then(result => {
        // console.log('res users ', result);
        res.json(result);
    })
})

// router.route('/ValidateUser').post((req, res) => {
//     // destructuring req.body
//     let body = {...req.body};
//     Db.ValidateUser(body).then(result => {
//         console.log('res users ', result);
//         res.json(result);
//     })
// })

router.route('/GetCustomerById/:id').get((req, res) => {
    Db.GetCustomerById(req.params.id).then(result => {
        console.log('res for GetCustomerById ', result);
        res.json(result);
    })
})

router.route('/DeleteCustomerById/:id').delete((req, res) => {
    console.log('===req', req.params.id)
    Db.deleteCustomerById(req.params.id).then(result => {
        console.log('res for deleteClientById ', result);
        // res.status(200).json({data: result[0], errorMessage: ""});
        res.json(result);
    })
})

router.route('/ActivateDeactivateCustomer').get((req, res) => {
    console.log('===req', req.query)
    Db.ActivateDeactivateCustomer(req.query).then(result => {
        console.log('res for ActivateDeactivateCustomer ', result);
        // res.status(200).json({data: result[0], errorMessage: ""});
        res.json(result);
    })
})

module.exports = router;