const express = require('express');
const router = express.Router();
const { getPoolConnection } = require('../databaseConnection');
const dbConn = require('../databaseConnection')
const sql = require('mssql');
var HttpStatus = require('http-status-codes');

router.get('/getViatic', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Viatic_getViatic');
    }).then(val => {
        res.render('common/viatic/viaticView', { viatic: val.recordset })
    });

});

router.get('/addViatic', (req, res) => {

    var viaticType;
    var employee;
    var event;

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('ViaticType_getViaticType');
    }).then(val => {
        viaticType = val.recordset;
    });

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Employee_getEmployee');
    }).then(val => {
        employee = val.recordset;
    });

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Event_getEvent');
    }).then(val => {
        event = val.recordset;
        res.render('common/viatic/addViatic', {
            viaticType: viaticType,
            employee: employee,
            event: event
        });
    });



});

router.post('/addViatic', (req, res) => {
    let ticketNumber = Math.random() * (2000000000000000000000 - 1000000000000000000000) + 1000000000000000000000;
    let ticket = 'TCK' + ticketNumber;
    var f = new Date();
    let date = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate();
    getPoolConnection().then(pool => {
        return pool.request()
            .input('employeeNumber', sql.Int, req.body.employeeNumber)
            .input('provider', sql.VarChar(100), req.body.provider)
            .input('dateViatic', sql.VarChar(25), date)
            .input('notes', sql.VarChar(100), req.body.notes)
            .input('ticket', sql.VarChar(25), ticket)
            .input('amount', sql.Int, req.body.amount)
            .input('invoiceNumber', sql.VarChar(25), req.body.invoiceNumber)
            .input('viaticTypeCode', sql.Int, req.body.viaticTypeCode)
            .input('employeeCode', sql.Int, req.body.employeeCode)
            .input('eventCode', sql.Int, req.body.eventCode)
            .output('status', sql.Bit, 0)
            .execute('Viatic_addViatic');
    }).then(val => {
        res.redirect('/getViatic')
    });
});

module.exports = router;