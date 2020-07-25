const express = require('express');
const router = express.Router();
const { getPoolConnection } = require('../databaseConnection');
const dbConn = require('../databaseConnection')
const sql = require('mssql');
var HttpStatus = require('http-status-codes');

router.get('/getSupport', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Support_getSupport');
    }).then(val => {
        res.render('common/support/supportView', { support: val.recordset })
    });

});

router.get('/addSupport', (req, res) => {
    res.render('common/support/addSupport')
});

router.post('/addSupport', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('descriptionSupport', sql.VarChar(100), req.body.descriptionSupport)
            .output('status', sql.Bit, 0)
            .execute('Support_addSupport');
    }).then(val => {
        res.redirect('/getSupport')
    });
});

router.get('/deleteSupport/:id', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('supportCode', sql.Int, req.params.id)
            .output('status', sql.Bit, 0)
            .execute('Support_deleteSupport');
    }).then(val => {
        res.redirect('/getSupport')
    })
});



module.exports = router;