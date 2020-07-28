const express = require('express');
const router = express.Router();
const { getPoolConnection } = require('../databaseConnection');
const dbConn = require('../databaseConnection')
const sql = require('mssql');
var HttpStatus = require('http-status-codes');

router.get('/getEvent', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Event_getEvent');
    }).then(val => {
        console.log(val.recordset)
        res.render('common/event/eventView', { event: val.recordset })
    });

});

router.get('/addEvent', (req, res) => {

    let branchOffice;
    let reason;
    let costCenter;
    let work;
    let support;
    let employee;

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('BranchOffice_getBranchOffice');
    }).then(val => {
        branchOffice = val.recordset;
    });

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Reason_getReason');
    }).then(val => {
        reason = val.recordset;
    });

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('CostCenter_getCostCenter');
    }).then(val => {
        costCenter = val.recordset;
    });

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Work_getWork');
    }).then(val => {
        work = val.recordset;
    });

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Support_getSupport');
    }).then(val => {
        support = val.recordset;
    });

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Employee_getEmployee');
    }).then(val => {
        employee = val.recordset;
        res.render('common/event/addEvent', {
            branchOffice: branchOffice,
            reason: reason,
            costCenter: costCenter,
            work: work,
            support: support,
            employee: employee
        });
    });

});


router.post('/addEvent', (req, res) => {
    let ticketNumber = Math.random() * (2000000000000000000000 - 1000000000000000000000) + 1000000000000000000000;
    let ticket = 'TCK' + ticketNumber;
    var f = new Date();
    let date = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate();
    getPoolConnection().then(pool => {
        return pool.request()
            .input('realizedJob', sql.VarChar, req.body.realizedJob)
            .input('problemDescription', sql.VarChar(100), req.body.problemDescription)
            .input('dateEvent', sql.VarChar(25), date)
            .input('hours', sql.Int, req.body.hours)
            .input('minutes', sql.Int, req.body.minutes)
            .input('branchCode', sql.Int, req.body.branchCode)
            .input('reasonCode', sql.Int, req.body.reasonCode)
            .input('workCode', sql.Int, req.body.workCode)
            .input('costCenterCode', sql.Int, req.body.costCenterCode)
            .input('supportCode', sql.Int, req.body.supportCode)
            .input('employeeCode', sql.Int, req.body.employeeCode)
            .output('status', sql.Bit, 0)
            .execute('Event_addEvent');
    }).then(val => {
        res.redirect('/getEvent')
    }).catch(err => {
        if (err) {
            $('partials/alert').alert()
            res.redirect('/getEmployee')
        }
    });
});

router.get('/deleteEvent/:id', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('eventCode', sql.Int, req.params.id)
            .output('status', sql.Bit, 0)
            .execute('Event_deleteEvent');
    }).then(val => {
        res.redirect('/getEvent')
    }).catch(err => {
        if (err) {
            $('partials/alert').alert()
            res.redirect('/getEmployee')
        }
    });
});


module.exports = router;