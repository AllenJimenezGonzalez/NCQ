const express = require('express');
const router = express.Router();
const { getPoolConnection } = require('../databaseConnection');
const dbConn = require('../databaseConnection')
const sql = require('mssql');
var HttpStatus = require('http-status-codes');

router.get('/getWork', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Work_getWork');
    }).then(val => {
        res.render('common/work/workView', { works: val.recordset })
    });

});

router.get('/addWork', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('WorkType_getWorkType');
    }).then(val => {
        res.render('common/work/addWork', { workType: val.recordset })
    });

});

router.post('/addWork', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('descriptionWork', sql.VarChar(40), req.body.descriptionWork)
            .input('workTypeCode', sql.Int, req.body.workTypeCode)
            .output('status', sql.Bit, 0)
            .execute('Work_addWork')
    }).then(val => {
        res.redirect('/getWork');
    }).catch(err => {
        if (err) {
            res.redirect('/getWork')
        }
    });
});


router.get('/deleteWork/:id', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('workCode', sql.Int, req.params.id)
            .output('status', sql.Bit, 0)
            .execute('Work_deletetWork');
    }).then(val => {
        res.redirect('/getWork')
    }).catch(err => {
        if (err) {
            res.redirect('/getWork')
        }
    });
});


module.exports = router;