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


router.get('/addTransportViatic', (req, res) => {

    var viaticType;
    var employee;
    var event;
    var vehicle;

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
            .execute('Vehicle_getVehicle');
    }).then(val => {
        vehicle = val.recordset;
    });

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Event_getEvent');
    }).then(val => {
        event = val.recordset;
        res.render('common/transport_viatic/addTransportViatic', {
            viaticType: viaticType,
            employee: employee,
            event: event,
            vehicle: vehicle
        });
    });
});

router.post('/addTransportViatic', (req, res) => {

    let ticketNumber = Math.random() * (2000000000000000000000 - 1000000000000000000000) + 1000000000000000000000;
    let ticket = 'TCK' + ticketNumber;
    var f = new Date();
    let date = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate();

    console.log(req.body.carId);

    getPoolConnection().then(pool => {
        return pool.request()
            .input('employeeNumber', sql.Int, req.body.employeeNumber)
            .input('provider', sql.VarChar(100), req.body.provider)
            .input('dateViatic', sql.VarChar(25), date)
            .input('notes', sql.VarChar(100), req.body.notes)
            .input('ticket', sql.VarChar(25), ticket)
            .input('amount', sql.Int, req.body.amount)
            .input('invoiceNumber', sql.VarChar(25), req.body.invoiceNumber)
            .input('viaticTypeCode', sql.Int, 5)
            .input('employeeCode', sql.Int, req.body.employeeCode)
            .input('eventCode', sql.Int, req.body.eventCode)
            .output('status', sql.Bit, 0)
            .execute('Viatic_addViatic');
    });

    getPoolConnection().then(pool => {
        return pool.request()
            .input('carId', sql.Char(6), req.body.carId)
            .input('kilometers', sql.Int, req.body.kilometers)
            .input('kilometersAmount', sql.Int, req.body.kilometersAmount)
            .output('status', sql.Bit, 0)
            .execute('TransportViatic_addTransportViatic');
    });

    res.redirect('/getTransportViatic');

});

router.get('/deleteTransportViatic/:id', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('viaticCode', sql.Int, req.params.id)
            .output('status', sql.Bit, 0)
            .execute('TransportViatic_deleteTransportViatic');
    }).then(val => {
        res.redirect('/getTransportViatic')
    })
});


module.exports = router;