var config = require('./../../dbConfig');
const sql = require('mssql');

async function saveCategory(form) {
    try {
        // enctype="multipart/form-data"
        let pool = await sql.connect(config);
        let saveCategory = await pool.request()
            .input('CategoryId', sql.Int, form.CategoryId)
            .input('CategoryName', sql.VarChar, form.CategoryName)
            .input('ParentId', sql.Int, form.ParentId)
            .input('CreatedBy', sql.Int, form.CreatedBy)
            .input('ModifiedBy', sql.Int, form.ModifiedBy)
            .execute('SaveCategory');
        return {status: true, data: saveCategory.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log(error);
        return {status: false,errorMessage: error }
    }
}

async function getAllCategories() {
    try {
        let pool = await sql.connect(config);
        // let clients = await pool.request().query("select * from ClientMaster");
        let categories = await pool.request().execute('GetAllCategories')
        return {status: true, data: categories.recordsets[0], errorMessage: ""};
    } catch (error) {
        // console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error }
    }
}

async function getCategoryById(id) {
    try {
        let pool = await sql.connect(config);
        let category = await pool.request()
                    .input('CategoryId', sql.Int, id)
                    .execute('GetCategoryByCategoryId');
        return await {status: true, data: category.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error}
    }
}

async function deleteCategoryById(id) {
    try {
        let pool = await sql.connect(config);
        let category = await pool.request()
                    .input('CategoryId', sql.Int, id)
                    .execute('DeleteCategoryById');
        return await {status: true, data: category.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error}
    }
}

module.exports = {
    saveCategory: saveCategory,
    getAllCategories: getAllCategories,
    getCategoryById: getCategoryById,
    deleteCategoryById: deleteCategoryById
}