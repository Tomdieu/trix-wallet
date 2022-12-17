const express = require('express')
const User = require('../../models/User');

const router = express.Router()

router.post('/register',(req,res)=>{
    console.log(req.body);
    res.status(200).json({success:true,data:[]})
})

router.get('/:id',(req,res)=>{
    console.log(req.params);
    res.status(200).send({success:true,data:[]})
})

module.exports = router;