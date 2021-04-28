var config = require('./../../dbConfig');
const sql = require('mssql');

async function saveProduct(form) {
    try {
        // enctype="multipart/form-data"
        let pool = await sql.connect(config);
        let saveProduct = await pool.request()
            .input('ProductId', sql.Int, form.ProductId)
            .input('CategoryId', sql.Int, form.CategoryId)
            .input('ProductName', sql.VarChar, form.ProductName)
            .input('Description', sql.VarChar, form.Description)
            .input('UnitPrice', sql.Decimal, form.UnitPrice)
            .input('QuantityOnHand', sql.Int, form.QuantityOnHand)
            .input('Height', sql.Int, form.Height)
            .input('Width', sql.Int, form.Width)
            .input('Weight', sql.Int, form.Weight)
            .input('CreatedBy', sql.Int, form.CreatedBy)
            .input('ModifiedBy', sql.Int, form.ModifiedBy)
            .execute('saveProduct');
        return {status: true, data: saveProduct.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log(error);
        return {status: false,errorMessage: error}
    }
}

async function getAllProducts() {
    try {
        let pool = await sql.connect(config);
        // let clients = await pool.request().query("select * from ClientMaster");
        let products = await pool.request().execute('GetAllProducts')
        return {status: true, data: products.recordsets[0], errorMessage: ""};
    } catch (error) {
        // console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error}
    }
}

async function getProductByProductId(id) {
    try {
        let pool = await sql.connect(config);
        let product = await pool.request()
                    .input('ProductId', sql.Int, id)
                    .execute('GetProductByProductId');
        return await {status: true, data: product.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error}
    }
}

async function getProductsByCategoryId(id) {
    try {
        let pool = await sql.connect(config);
        let product = await pool.request()
                    .input('CategoryId', sql.Int, id)
                    .execute('GetProductsByCategoryId');
        return await {status: true, data: product.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error}
    }
}

async function deleteProductById(id) {
    try {
        let pool = await sql.connect(config);
        let product = await pool.request()
                    .input('ProductId', sql.Int, id)
                    .execute('DeleteProductById');
        return await {status: true, data: product.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error}
    }
}

module.exports = {
    saveProduct: saveProduct,
    getAllProducts: getAllProducts,
    getProductByProductId: getProductByProductId,
    getProductsByCategoryId: getProductsByCategoryId,
    deleteProductById: deleteProductById
}