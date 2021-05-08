var config = require('./../../dbConfig');
const sql = require('mssql');

async function getCountryList() {
    try {
        let pool = await sql.connect(config);
        let country = await pool.request()
                    .execute('GetCountryList')
        return {status: true, data: country.recordsets[0], errorMessage: ""};
    } catch (error) {
        // console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error }
    }
}

async function getStateListByCountryId(CountryId) {
    try {
        let pool = await sql.connect(config);
        let state = await pool.request()
                    .input('CountryId', sql.Int, CountryId)
                    .execute('GetStateListByCountryId');
        return await {status: true, data: state.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error}
    }
}

async function getCityListByStateId(StateId) {
    try {
        let pool = await sql.connect(config);
        let city = await pool.request()
                    .input('StateId', sql.Int, StateId)
                    .execute('GetCityListByStateId')
        return {status: true, data: city.recordsets[0], errorMessage: ""};
    } catch (error) {
        // console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error }
    }
}

async function getCountryByCountryId(CountryId) {
    try {
        let pool = await sql.connect(config);
        let country = await pool.request()
                    .input('CountryId', sql.Int, CountryId)
                    .execute('GetCountryByCountryId')
        return {status: true, data: country.recordsets[0], errorMessage: ""};
    } catch (error) {
        // console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error }
    }
}

async function getStateByStateId(StateId) {
    try {
        let pool = await sql.connect(config);
        let state = await pool.request()
                    .input('StateId', sql.Int, StateId)
                    .execute('GetStateByStateId')
        return {status: true, data: state.recordsets[0], errorMessage: ""};
    } catch (error) {
        // console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error }
    }
}

async function getCityByCityId(CityId) {
    try {
        let pool = await sql.connect(config);
        let city = await pool.request()
                    .input('CityId', sql.Int, CityId)
                    .execute('GetCityByCityId')
        return {status: true, data: city.recordsets[0], errorMessage: ""};
    } catch (error) {
        // console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error }
    }
}

async function getCurrencyList() {
    try {
        let pool = await sql.connect(config);
        let currency = await pool.request()
                    .execute('GetCurrencyList')
        return {status: true, data: currency.recordsets[0], errorMessage: ""};
    } catch (error) {
        // console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error }
    }
}

async function saveSettings(form) {
    try {
        // enctype="multipart/form-data"
        let pool = await sql.connect(config);
        let saveSettings = await pool.request()
            .input('SettingsId', sql.Int, form.SettingsId)
            .input('CgstPercent', sql.Decimal, form.CgstPercent)
            .input('IgstPercent', sql.Decimal, form.IgstPercent)
            .input('CreatedBy', sql.Int, form.CreatedBy)
            .input('ModifiedBy', sql.Int, form.ModifiedBy)
            .input('SgstPercent', sql.Decimal, form.SgstPercent)
            .input('HSNNumber', sql.Decimal, form.HSNNumber)
            .execute('SaveSettings');
        return {status: true, data: saveSettings.recordsets[0], errorMessage: ""};
    } catch (error) {
        console.log(error);
        return {status: false,errorMessage: error }
    }
}

async function getSettings() {
    try {
        let pool = await sql.connect(config);
        let settings = await pool.request()
                    .execute('GetSettings')
        return {status: true, data: settings.recordsets[0], errorMessage: ""};
    } catch (error) {
        // console.log('errrrrrrrrrrrrrrrrrrrrrrrr', error);
        return {status: false,errorMessage: error }
    }
}

module.exports = {
    getCityByCityId: getCityByCityId,
    getStateByStateId: getStateByStateId,
    getCountryByCountryId: getCountryByCountryId,
    getCountryList: getCountryList,
    getStateListByCountryId: getStateListByCountryId,
    getCityListByStateId: getCityListByStateId,
    getCurrencyList: getCurrencyList,
    saveSettings: saveSettings,
    getSettings: getSettings
}