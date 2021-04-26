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
        return {status: false,errorMessage: error.originalError.info.message}
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
        return {status: false,errorMessage: error.originalError.info.message}
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
        return {status: false,errorMessage: error.originalError.info.message}
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
        return {status: false,errorMessage: error.originalError.info.message}
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
        return {status: false,errorMessage: error.originalError.info.message}
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
        return {status: false,errorMessage: error.originalError.info.message}
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
}