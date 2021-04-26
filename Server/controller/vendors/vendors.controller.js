var config = require('../../dbConfig');
const sql = require('mssql');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var jwtSecret = require('../../config.json');

// async function saveClient(form) {
//     try {
//         // enctype="multipart/form-data"
//         let pool = await sql.connect(config);
//         let insertClient = await pool.request()
//             .input('ClientId', sql.Int, form.ClientId)
//             .input('Name', sql.VarChar, form.Name)
//             .input('ProfileImage', sql.VarChar, form.ProfileImage)
//             .input('IsActive', sql.Bit, form.IsActive)
//             .input('IsDeleted', sql.Bit, form.IsDeleted)
//             .execute('SaveClient');
//         return insertClient.recordsets;
//     } catch (error) {
//         console.log(error);
//     }
// }

async function getVendors() {
    try {
        let pool = await sql.connect(config);
        // let clients = await pool.request().query("select * from ClientMaster");
        let users = await pool.request().execute('GetAllUsers')
        return {status: true, data: users.recordsets[0], errorMessage: ""};
    } catch (error) {
        // console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error.originalError.info.message}
    }
}

async function ValidateVendor(form) {
    try {
        let pool = await sql.connect(config);
        const payload = { user: form.Email };
        const options = { expiresIn: '2d', issuer: 'https://scotch.io' };
        const secret = jwtSecret.secret;
        const token = jwt.sign(payload, secret, options);
        let validateUser = await pool.request()
            .input('UserName', sql.VarChar, form.UserName)
            .input('Password', sql.VarChar, form.Password)
            .execute('ValidateVendor')
        return await {status: true, data: validateUser.recordsets[0], errorMessage: "", token: token};
    } catch (error) {
        console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        // return {status: false,errorMessage: error.originalError.info.message}
        return {status: false,errorMessage: error}
    }
}

async function GetVendorById(id) {
    try {
        let pool = await sql.connect(config);
        let vendor = await pool.request()
                    .input('VendorId', sql.Int, id)
                    .execute('GetVendorById');
        return await {status: true, data: vendor.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error}
    }
}

module.exports = {
    // saveClient: saveClient,
    getVendors: getVendors,
    ValidateVendor: ValidateVendor,
    GetVendorById: GetVendorById,
    // deleteClientById: deleteClientById,
}