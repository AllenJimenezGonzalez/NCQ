const express = require('express');
const router = express.Router();
const { getPoolConnection } = require('../databaseConnection');
const dbConn = require('../databaseConnection')
const sql = require('mssql');
var HttpStatus = require('http-status-codes');

router.get('/getViaticType', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('ViaticType_getViaticType');
    }).then(val => {
        res.render('common/viatic_type/viaticTypeView', { viatic: val.recordset })
    });

});

module.exports = router;