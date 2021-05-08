var config = require('./../../dbConfig');
const sql = require('mssql');

async function saveInvoice(form) {
    try {
        let pool = await sql.connect(config);
        let saveInvoice = await pool.request()
            .input('InvoiceId', sql.Int, form.InvoiceId)
            .input('InvoiceDate', sql.DateTime, form.InvoiceDate)
            .input('CustomerId', sql.Int, form.CustomerId)
            .input('TotalAmount', sql.Decimal, form.TotalAmount)
            .input('CreatedBy', sql.Int, form.CreatedBy)
            .input('ModifiedBy', sql.Int, form.ModifiedBy)
            .input('GRRRNo', sql.VarChar, form.GRRRNo)
            .input('Transport', sql.VarChar, form.Transport)
            .input('VehicleNo', sql.VarChar, form.VehicleNo)
            .input('Station', sql.VarChar, form.Station)
            .execute('SaveInvoice');
        return {status: true, data: saveInvoice.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log(error);
        return {status: false,errorMessage: error }
    }
}

async function saveInvoiceDetail(form) {
    try {
        let pool = await sql.connect(config);
        let saveInvoiceDetail = await pool.request()
            .input('InvoiceDetailId', sql.Int, form.InvoiceDetailId)
            .input('InvoiceId', sql.Int, form.InvoiceId)
            .input('ProductId', sql.Int, form.ProductId)
            .input('Quantity', sql.Int, form.Quantity)
            .input('Rate', sql.Decimal, form.Rate)
            .input('Amount', sql.Decimal, form.Amount)
            .execute('SaveInvoiceDetail');
        return {status: true, data: saveInvoiceDetail.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log(error);
        return {status: false,errorMessage: error }
    }
}

async function getAllInvoices() {
    try {
        let pool = await sql.connect(config);
        // let clients = await pool.request().query("select * from ClientMaster");
        let invoices = await pool.request().execute('GetAllInvoices')
        return {status: true, data: invoices.recordsets[0], errorMessage: ""};
    } catch (error) {
        // console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error }
    }
}

async function getAllInvoiceDetailsList() {
    try {
        let pool = await sql.connect(config);
        // let clients = await pool.request().query("select * from ClientMaster");
        let invoiceDetailsList = await pool.request().execute('GetAllInvoicesDetailsList')
        return {status: true, data: invoiceDetailsList.recordsets[0], errorMessage: ""};
    } catch (error) {
        // console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error }
    }
}

async function getInvoiceByInvoiceId(id) {
    try {
        let pool = await sql.connect(config);
        let invoice = await pool.request()
                    .input('InvoiceId', sql.Int, id)
                    .execute('GetInvoiceByInvoiceId');
        return await {status: true, data: invoice.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error}
    }
}

async function getInvoiceDetailsByInvoiceId(id) {
    try {
        let pool = await sql.connect(config);
        let invoiceDetails = await pool.request()
                    .input('InvoiceId', sql.Int, id)
                    .execute('GetInvoiceDetailsByInvoiceId');
        return await {status: true, data: invoiceDetails.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error}
    }
}

async function getInvoiceDetailByInvoiceDetailId(id) {
    try {
        let pool = await sql.connect(config);
        let invoiceDetail = await pool.request()
                    .input('InvoiceDetailId', sql.Int, id)
                    .execute('GetInvoiceDetailByInvoiceDetailId');
        return await {status: true, data: invoiceDetail.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error}
    }
}

async function deleteInvoiceById(id) {
    try {
        let pool = await sql.connect(config);
        let invoice = await pool.request()
                    .input('InvoiceId', sql.Int, id)
                    .execute('DeleteInvoiceByInvoiceId');
        return await {status: true, data: invoice.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error}
    }
}

async function deleteInvoiceDetailById(id) {
    try {
        let pool = await sql.connect(config);
        let invoice = await pool.request()
                    .input('InvoiceDetailId', sql.Int, id)
                    .execute('DeleteInvoiceDetailByInvoiceDetailId');
        return await {status: true, data: invoice.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error}
    }
}

module.exports = {
    saveInvoice: saveInvoice,
    saveInvoiceDetail: saveInvoiceDetail,
    getAllInvoices: getAllInvoices,
    getAllInvoiceDetailsList:getAllInvoiceDetailsList,
    getInvoiceByInvoiceId: getInvoiceByInvoiceId,
    getInvoiceDetailsByInvoiceId: getInvoiceDetailsByInvoiceId,
    getInvoiceDetailByInvoiceDetailId: getInvoiceDetailByInvoiceDetailId,
    deleteInvoiceById: deleteInvoiceById,
    deleteInvoiceDetailById: deleteInvoiceDetailById
}