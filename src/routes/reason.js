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
        res.render('common/reason/reasonView', { reason: val.recordset })
    });

});

router.get('/addReason', (req, res) => {
    res.render('common/reason/addReason')
});

router.post('/addReason', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .input('descriptionReason', sql.VarChar(100), req.body.descriptionReason)
            .output('status', sql.Bit, 0)
            .execute('Reason_addReason');

    }).then(val => {
        res.redirect('/getReason');
    }).catch(err => {
        if (err) {
            $('partials/alert').alert()
            res.redirect('/getEmployee')
        }
    });

});

router.get('/deleteReason/:id', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('reasonCode', sql.Int, req.params.id)
            .output('status', sql.Bit, 0)
            .execute('Reason_deleteReason');
    }).then(val => {
        res.redirect('/getReason');
    }).catch(err => {
        if (err) {
            $('partials/alert').alert()
            res.redirect('/getEmployee')
        }
    });
});

module.exports = router;