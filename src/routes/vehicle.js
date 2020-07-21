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


router.get('/addVehicle', (req, res) => {
    res.render('common/vehicle/addVehicle');
});

router.post('/addVehicle', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('carId', sql.Char(6), req.body.carId)
            .input('brand', sql.Char(6), req.body.brand)
            .input('model', sql.Char(6), req.body.model)
            .input('year', sql.Char(6), req.body.year)
            .output('status', sql.Bit, 0)
            .execute('Vehicle_addVehicle');
    }).then(val => {
        res.redirect('/getVehicle');
    })
});

router.get('/deleteVehicle/:id', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('carId', sql.Char(6), req.params.id)
            .output('status', sql.Bit, 0)
            .execute('Vehicle_deleteVehicle');
    }).then(val => {
        res.redirect('/getVehicle')
    })
});

module.exports = router;