const express = require('express');
const router = express.Router();
const { getPoolConnection } = require('../databaseConnection');
const dbConn = require('../databaseConnection')
const sql = require('mssql');
var HttpStatus = require('http-status-codes');

router.get('/getTransportViatic', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('TransportViatic_getTransportViatic');
    }).then(val => {
        res.render('common/transport_viatic/transportViaticView', { transport_viatic: val.recordset })
    });

});

module.exports = router;