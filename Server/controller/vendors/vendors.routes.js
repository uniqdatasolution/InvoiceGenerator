var express = require("express");
var router = express.Router();
var app = express();

var Db = require('./vendors.controller');

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

// router.route('/GetAllVendors').get((req, res) => {
//     Db.getVendors().then(result => {
//         // console.log('res vendors ', result);
//         res.json(result);
//     })
// })

router.route('/ValidateVendor').post((req, res) => {
    // destructuring req.body
    let body = {...req.body};
    Db.ValidateVendor(body).then(result => {
        console.log('res vendors ', result);
        res.json(result);
    })
})

router.route('/GetVendorById/:id').get((req, res) => {
    Db.GetVendorById(req.params.id).then(result => {
        console.log('res for GetVendorById ', result);
        res.json(result);
    })
})

// router.route('/deleteClientById/:id').delete((req, res) => {
//     console.log('===req', req.params.id)
//     Db.deleteClientById(req.params.id).then(result => {
//         console.log('res for deleteClientById ', result);
//         res.status(200).json({data: result[0], errorMessage: ""});
//     })
// })

module.exports = router;