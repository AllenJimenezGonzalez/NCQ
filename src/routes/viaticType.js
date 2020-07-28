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
        res.render('common/viatic_type/viaticTypeView', { viatic: val.recordset });
    });

});

router.get('/addViaticType', (req, res) => {
    res.render('common/viatic_type/addViaticType');
});

router.post('/addViaticType', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .input('DescriptionViaticType', sql.VarChar, req.body.DescriptionViaticType)
            .output('status', sql.Bit, 0)
            .execute('ViaticType_addViaticType');
    }).then(val => {
        res.redirect('/getViaticType');
    }).catch(err => {
        if (err) {
            $('partials/alert').alert()
            res.redirect('/getViaticType')
        }
    });

});

router.get('/deleteViaticType/:id', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('viaticTypeCode', sql.Int, req.params.id)
            .output('status', sql.Bit, 0)
            .execute('ViaticType_deleteViaticType');
    }).then(val => {
        res.redirect('/getViaticType')
    }).catch(err => {
        if (err) {
            $('partials/alert').alert()
            res.redirect('/getViaticType')
        }
    });
});

module.exports = router;