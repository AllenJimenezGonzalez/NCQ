const express = require('express');
const router = express.Router();
const { getPoolConnection } = require('../databaseConnection');
const dbConn = require('../databaseConnection')
const sql = require('mssql');
var HttpStatus = require('http-status-codes');
const { get } = require('./branchOffice');
const { body } = require('express-validator');

router.get('/getClients', (req, res) => {

    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Client_getClient');
    }).then(val => {
        res.render('common/client/clientsView', { clients: val.recordset });
    });

});

router.get('/getClientsPhone', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Client_getPhones');
    }).then(val => {
        res.render('common/client/clientsPhoneView', { phones: val.recordset })
    });

});

router.get('/deleteClientPhone/:id/:clientCode', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('phone', sql.Int, req.params.id)
            .input('clientCode', sql.Int, req.params.clientCode)
            .output('status', sql.Bit, 0)
            .execute('ClientPhone_deletePhone');
    }).then(val => {
        res.redirect('/getClients');
    }).catch(err => {
        if (err) {
            res.redirect('/getClients')
        }
    });
});

router.get('/getClientsPhone/:id', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('clientCode', sql.Int, req.params.id)
            .output('status', sql.Bit, 0)
            .execute('Client_getPhones_byUser');
    }).then(val => {
        res.render('common/client/clientsPhoneView', { phones: val.recordset })
    });

});


router.get('/getClientsEmail', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Client_getEmail');
    }).then(val => {
        res.render('common/client/clientEmailView', { emails: val.recordset })
    });
});

router.get('/getClientsEmail/:id', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('clientCode', sql.Int, req.params.id)
            .output('status', sql.Bit, 0)
            .execute('Client_getEmail_byUser');
    }).then(val => {
        res.render('common/client/clientEmailView', { emails: val.recordset })
    });

});


router.get('/deleteClientEmail/:id/:clientCode', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('email', sql.Int, req.params.id)
            .input('clientCode', sql.Int, req.params.clientCode)
            .output('status', sql.Bit, 0)
            .execute('ClientEmail_deleteEmail');
    }).then(val => {
        res.redirect('/getClients');
    }).catch(err => {
        if (err) {
            res.redirect('/getClients')
        }
    });
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
        }).catch(err => {
            if (err) {
                res.redirect('/getClients')
            }
        });
});

router.get('/addClient', (req, res) => {
    res.render('common/client/addClient');
});

router.post('/addClient', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('name', sql.VarChar(40), req.body.name)
            .input('lastName', sql.VarChar(40), req.body.lastName)
            .output('status', sql.Bit, 0)
            .execute('Client_addClient');
    }).then(val => {
        res.redirect('/getClients');
    }).catch(err => {
        if (err) {
            res.redirect('/getClients')
        }
    });
});

router.get('/addClientPhone', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Client_getClient')
    }).then(val => {
        res.render('common/client/addClientPhone', { clients: val.recordset });
    })

});

router.post('/addClientPhone', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('phone', sql.VarChar(40), req.body.phone)
            .input('clientCode', sql.Int, req.body.clientCode)
            .output('status', sql.Bit, 0)
            .execute('ClientPhone_addPhone')
    }).then(val => {
        res.redirect('/getClientsPhone');
    }).catch(err => {
        if (err) {
            res.redirect('/getClients')
        }
    });
});

router.get('/addClientEmail', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .output('status', sql.Bit, 0)
            .execute('Client_getClient')
    }).then(val => {
        res.render('common/client/addClientEmail', { clients: val.recordset });
    })

});


router.post('/addClientEmail', (req, res) => {
    getPoolConnection().then(pool => {
        return pool.request()
            .input('email', sql.VarChar(40), req.body.email)
            .input('clientCode', sql.Int, req.body.clientCode)
            .output('status', sql.Bit, 0)
            .execute('ClientEmail_addEmail')
    }).then(val => {
        res.redirect('/getClientsEmail');
    }).catch(err => {
        if (err) {
            res.redirect('/getClients')
        }
    });
})

module.exports = router;