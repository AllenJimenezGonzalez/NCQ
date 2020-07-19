const express = require('express');
const router = express.Router();
const { getPoolConnection } = require('../databaseConnection');
const dbConn = require('../databaseConnection')
const sql = require('mssql');
var HttpStatus = require('http-status-codes');

router.get('/getEvent', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Event_getEvent');
    }).then(val => {
        console.log(val.recordset)
        res.render('common/event/eventView', { event: val.recordset })
    });

});

module.exports = router;