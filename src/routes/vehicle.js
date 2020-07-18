const express = require('express');
const router = express.Router();
const { getPoolConnection } = require('../databaseConnection');
const dbConn = require('../databaseConnection')
const sql = require('mssql');
var HttpStatus = require('http-status-codes');

router.get('/getVehicle', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Vehicle_getVehicle');
    }).then(val => {
        res.render('common/vehicle/vehicleView', { vehicle: val.recordset })
    });

});

module.exports = router;