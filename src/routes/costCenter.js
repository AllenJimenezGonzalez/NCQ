const express = require('express');
const router = express.Router();
const { getPoolConnection } = require('../databaseConnection');
const dbConn = require('../databaseConnection')
const sql = require('mssql');
var HttpStatus = require('http-status-codes');
const { get } = require('./branchOffice');

router.get('/getCostCenter', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('CostCenter_getCostCenter');
    }).then(val => {
        res.render('common/cost_center/costCenterView', { centers: val.recordset })
    });

});

router.get('/addCostCenter', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .input('costCenterCode')
            .output('status', sql.Bit, 0)
            .execute('CostCenter_getCostCenter');
    }).then(val => {
        res.render('common/cost_center/costCenterView', { centers: val.recordset })
    });

});

module.exports = router;