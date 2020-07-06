const express = require('express');
const router = express.Router();
const dbConn = require('../databaseConnection')
const sql = require('mssql');
var HttpStatus = require('http-status-codes');
const { getPoolConnection } = require('../databaseConnection');


router.get('/addBranchOffice',(req,res)=>{

    let clients = [];
    getPoolConnection().then(pool=>{
        return pool.request()
                    .output('status',sql.Bit,0)
                    .execute('Client_getClient');
    }).then(val =>{
        val.recordset.forEach(element => {
            clients.push(element[0]+element[1]);
        });
    });

    res.render('common/addBranchOffice.hbs')
});

router.post('/addBranchOffice',(req,res)=>{
    console.log(req.body)
    dbConn.getPoolConnection().then(pool=>{
        return pool.request()
                    .input('branchCode',sql.Int,req.body.branchCode)
                    .input('name',sql.VarChar(40),req.body.name)
                    .input('direction',sql.VarChar(40),req.body.direction)
                    .input('clientCode',sql.Int,req.body.clientCode)
                    .output('status',sql.Bit,0)
                    .execute('BranchOffice_addBranchOffice');
    })
    .then(val =>{
        if(val.output.status){
            res.redirect('/getBranchOffice');
        }else{
            res.status(HttpStatus.BAD_REQUEST).json({data:'Elemento ya agregado.'}).redirect('/');
        }
    })
    .catch(err=>{
        if(err){
            res.json({data:err.message});
        }
    });
});

router.get('/getBranchOffice',(req,res)=>{
   
    getPoolConnection().then(pool=>{
        return pool.request()
        .output('status',sql.Bit,0)
        .execute('BranchOffice_getBranchOffice');
    }).then(val=>{
        console.log(val.recordset);
        res.render('common/branchOfficeView', {branchOffices:val.recordset})
    })
});

router.get('/deleteBranchOffice/:id',(req,res)=>{
    getPoolConnection().then(pool=>{
        return pool.request()
                    .input('branchCode',sql.Int,req.params.id)
                    .output('status',sql.Bit,0)
                    .execute('BranchOffice_deleteBranchOffice');
    })
    .then(val=>{
        res.redirect('/getBranchOffice');
    });
});

module.exports = router;