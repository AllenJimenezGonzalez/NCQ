const express = require('express');
const router = express.Router();
const { getPoolConnection } = require('../databaseConnection');
const dbConn = require('../databaseConnection')
const sql = require('mssql');
var HttpStatus = require('http-status-codes');

router.get('/getReason', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Reason_getReason');
    }).then(val => {
        res.render('common/reasonView', { reason: val.recordset })
    });

});

module.exports = router;