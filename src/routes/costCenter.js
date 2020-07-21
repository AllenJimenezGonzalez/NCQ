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
    res.render('common/cost_center/addCostCenter')
});

router.post('/addCostCenter', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .input('descriptionCostCenter', sql.VarChar(100), req.body.descriptionCostCenter)
            .output('status', sql.Bit, 0)
            .execute('CostCenter_addCostCenter');

    }).then(val => {
        res.redirect('/getCostCenter');
    });

});

router.get('/deleteCostCenter/:id', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('costCenterCode', sql.Int, req.params.id)
            .output('status', sql.Bit, 0)
            .execute('CostCenter_deleteCostCenter');

    }).then(val => {
        res.redirect('/getCostCenter');
    });
});

module.exports = router;