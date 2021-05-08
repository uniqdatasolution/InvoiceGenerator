var config = require('./../../dbConfig');
const sql = require('mssql');

async function saveCustomer(form) {
    try {
        // enctype="multipart/form-data"
        let pool = await sql.connect(config);
        let saveCustomer = await pool.request()
            .input('CustomerId', sql.Int, form.CustomerId)
            .input('FirstName', sql.VarChar, form.FirstName)
            .input('LastName', sql.VarChar, form.LastName)
            .input('Email', sql.VarChar, form.Email)
            .input('MobileNumber', sql.VarChar, form.MobileNumber)
            .input('PhoneNumber', sql.VarChar, form.PhoneNumber)
            .input('PostalCode', sql.VarChar, form.PostalCode)
            .input('City', sql.Int, form.City)
            .input('State', sql.Int, form.State)
            .input('Country', sql.Int, form.Country)
            .input('IsActive', sql.Bit, form.IsActive)
            .input('IsDeleted', sql.Bit, form.IsDeleted)
            .input('CreatedBy', sql.Int, form.CreatedBy)
            .input('ModifiedBy', sql.Int, form.ModifiedBy)
            .input('GstNumber', sql.VarChar, form.GstNumber)
            .input('CurrencyCode', sql.VarChar, form.CurrencyCode)
            .execute('SaveCustomer');
        return {status: true, data: saveCustomer.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log(error);
        return {status: false,errorMessage: error}
    }
}

async function getCustomers() {
    try {
        let pool = await sql.connect(config);
        // let clients = await pool.request().query("select * from ClientMaster");
        let customers = await pool.request().execute('GetAllCustomers')
        return {status: true, data: customers.recordsets[0], errorMessage: ""};
    } catch (error) {
        // console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error}
    }
}

// async function ValidateUser(form) {
//     try {
//         let pool = await sql.connect(config);
//         const payload = { user: form.Email };
//         const options = { expiresIn: '2d', issuer: 'https://scotch.io' };
//         const secret = jwtSecret.secret;
//         const token = jwt.sign(payload, secret, options);
//         let validateUser = await pool.request()
//             .input('Email', sql.VarChar, form.Email)
//             .input('Password', sql.VarChar, form.Password)
//             .execute('ValidateUser')
//         return await {status: true, data: validateUser.recordsets[0], errorMessage: "", token: token};
//     } catch (error) {
//         console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
//         // return {status: false,errorMessage: error}
//         return {status: false,errorMessage: error}
//     }
// }

async function GetCustomerById(id) {
    try {
        let pool = await sql.connect(config);
        let customer = await pool.request()
                    .input('CustomerId', sql.Int, id)
                    .execute('GetCustomerById');
        return await {status: true, data: customer.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error}
    }
}

async function deleteCustomerById(id) {
    try {
        let pool = await sql.connect(config);
        let customer = await pool.request()
                    .input('CustomerId', sql.Int, id)
                    .execute('DeleteCustomerById');
        return await {status: true, data: customer.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error}
    }
}

async function ActivateDeactivateCustomer(form) {
    try {
        console.log('====================== form.IsActive',  form.IsActive)
        let pool = await sql.connect(config);
        console.log('====================== form.IsActive',  form.IsActive)
        let customer = await pool.request()
                    .input('IsActive', sql.VarChar, form.IsActive)
                    .input('CustomerId', sql.Int, form.CustomerId)
                    .execute('ActivateDeactivateCustomer');
                    // console.log('========================ac', customer)
        return await {status: true, data: customer.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error}
    }
}

module.exports = {
    saveCustomer: saveCustomer,
    getCustomers: getCustomers,
    GetCustomerById: GetCustomerById,
    // ValidateUser: ValidateUser,
    deleteCustomerById: deleteCustomerById,
    ActivateDeactivateCustomer: ActivateDeactivateCustomer
}