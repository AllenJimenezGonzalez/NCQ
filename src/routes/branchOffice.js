const express = require('express');
const router = express.Router();
const dbConn = require('../databaseConnection')
const sql = require('mssql');
var HttpStatus = require('http-status-codes');
const { getPoolConnection } = require('../databaseConnection');


router.get('/addBranchOffice', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Client_getClient');
    }).then(val => {
        res.render('common/branch_office/addBranchOffice', {
            clients: val.recordset
        })
    });

});

router.post('/addBranchOffice', (req, res) => {
    console.log(req.body)
    dbConn.getPoolConnection().then(pool => {
            return pool.request()
                .input('name', sql.VarChar(40), req.body.name)
                .input('direction', sql.VarChar(40), req.body.direction)
                .input('clientCode', sql.Int, req.body.clientCode)
                .output('status', sql.Bit, 0)
                .execute('BranchOffice_addBranchOffice');
        })
        .then(val => {
            if (val.output.status) {
                res.redirect('/getBranchOffice');
            } else {
                res.status(HttpStatus.BAD_REQUEST).json({ data: 'Elemento ya agregado.' }).redirect('/');
            }
        }).catch(err => {
            if (err) {
                res.redirect('/getBranchOffice')
            }
        });
});

router.get('/getBranchOffice', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('BranchOffice_getBranchOffice');
    }).then(val => {
        res.render('common/branch_office/branchOfficeView', { branchOffices: val.recordset })
    });
});

router.get('/deleteBranchOffice/:id', (req, res) => {
    getPoolConnection().then(pool => {
            return pool.request()
                .input('branchCode', sql.Int, req.params.id)
                .output('status', sql.Bit, 0)
                .execute('BranchOffice_deleteBranchOffice');
        })
        .then(val => {
            res.redirect('/getBranchOffice');
        }).catch(err => {
            if (err) {
                res.redirect('/getBranchOffice')
            }
        });
});

router.post('/editBranchOffice', (req, res) => {
    console.log(req.body);
    getPoolConnection().then(pool => {
        return pool.request()
            .input('branchCode', sql.Int, req.body.branchCode)
            .input('name', sql.VarChar(40), req.body.name)
            .input('direction', sql.VarChar(100), req.body.direction)
            .input('clientCode', sql.Int, req.body.clientCode)
            .output('status', sql.Bit, 0)
            .execute('BranchOffice_updateBranchOffice')
    }).then(val => {
        res.redirect('/getBranchOffice');
    });
});


router.get('/editBranchOffice/:branchCode', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('BranchOffice_getBranchOffice');
    }).then(val => {
        const data = val.recordset;
        data.forEach(element => {
            console.log(element.branchCode);
            if (element.branchCode == req.params.branchCode) {
                res.render('common/branch_office/editBranchOffice', { data: element });
            }
        });
    }).catch(err => {
        if (err) {
            res.redirect('/getBranchOffice')
        }
    });
});


module.exports = router;