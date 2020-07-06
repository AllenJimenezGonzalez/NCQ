const express = require('express');
const router = express.Router();



router.get('/',(req,res)=>{
    res.render('common/home.hbs')
});


module.exports = router;