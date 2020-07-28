const express = require('express');
const router = express.Router();
const { getPoolConnection } = require('../databaseConnection');
const dbConn = require('../databaseConnection')
const sql = require('mssql');
var HttpStatus = require('http-status-codes');

router.get('/getEmployee', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Employee_getEmployee');
    }).then(val => {
        res.render('common/employee/employeeView', { employee: val.recordset })
    });

});

router.get('/addEmployee', (req, res) => {
    res.render('common/employee/addEmployee');
});

router.post('/addEmployee', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .input('name', sql.VarChar(100), req.body.name)
            .output('status', sql.Bit, 0)
            .execute('Employee_addEmployee');
    }).then(val => {
        res.redirect('/getEmployee');
    }).catch(err => {
        if (err) {
            res.redirect('/getEmployee')
        }
    });

});

router.get('/deleteEmployee/:id', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('employeeCode', sql.Int, req.params.id)
            .output('status', sql.Bit, 0)
            .execute('Employee_deleteEmployee');
    }).then(val => {
        res.redirect('/getEmployee')
    }).catch(err => {
        if (err) {
            res.redirect('/getEmployee')
        }
    });
});


module.exports = router;