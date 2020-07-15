const express = require('express');
const router = express.Router();
const { getPoolConnection } = require('../databaseConnection');
const dbConn = require('../databaseConnection')
const sql = require('mssql');
var HttpStatus = require('http-status-codes');
const { get } = require('./branchOffice');

router.get('/getClients', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Client_getClient');
    }).then(val => {
        res.render('common/clientsView', { clients: val.recordset })
    });

});

router.get('/getClientsPhone', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Client_getPhones');
    }).then(val => {
        res.render('common/clientsPhoneView', { phones: val.recordset })
    });

});

router.get('/getClientsPhone/:id', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('clientCode', sql.Int, req.params.id)
            .output('status', sql.Bit, 0)
            .execute('Client_getPhones_byUser');
    }).then(val => {
        res.render('common/clientsPhoneView', { phones: val.recordset })
    });

});


router.get('/getClientsEmail', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Client_getEmail');
    }).then(val => {
        res.render('common/clientEmailView', { emails: val.recordset })
    });
});

router.get('/getClientsEmail/:id', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('clientCode', sql.Int, req.params.id)
            .output('status', sql.Bit, 0)
            .execute('Client_getEmail_byUser');
    }).then(val => {
        res.render('common/clientEmailView', { emails: val.recordset })
    });

});


router.get('/deleteClientEmail/:id', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('clientCode', sql.Int, req.params.id)
            .output('status', sql.Bit, 0)
            .execute('Client_deleteClient');
    })
});

router.get('/deleteClient/:id', (req, res) => {
    getPoolConnection().then(pool => {
            return pool.request()
                .input('clientCode', sql.Int, req.params.id)
                .output('status', sql.Bit, 0)
                .execute('Client_deleteClient');
        })
        .then(val => {
            res.redirect('/getClients');
        });
});



module.exports = router;