const express = require('express');
const router = express.Router();
const { getPoolConnection } = require('../databaseConnection');
const dbConn = require('../databaseConnection')
const sql = require('mssql');
var HttpStatus = require('http-status-codes');

router.get('/getWorkType', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('WorkType_getWorkType');
    }).then(val => {
        res.render('common/work_type/workTypeView', { work_type: val.recordset })
    });

});


router.get('/addWorkType', (req, res) => {
    res.render('common/work_type/addWorkType')
});

router.post('/addWorkType', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('descriptionWorkType', sql.VarChar(200), req.body.descriptionWorkType)
            .output('status', sql.Bit, 0)
            .execute('WorkType_addWorkType')
    }).then(val => {
        res.redirect('/getWorkType');
    }).catch(err => {
        if (err) {
            $('partials/alert').alert()
            res.redirect('/getWorkType')
        }
    });
});


router.get('/deleteWorkType/:id', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('workTypeCode', sql.Int, req.params.id)
            .output('status', sql.Bit, 0)
            .execute('WorkType_deleteWorkType');
    }).then(val => {
        res.redirect('/getWorkType')
    }).catch(err => {
        if (err) {
            $('partials/alert').alert()
            res.redirect('/getWorkType')
        }
    });
});


module.exports = router;