const express = require('express')


const router = express.Router()

const {userRoutes} =require('./auth') 
const {account} = require('./momo')

router.use('/user',userRoutes)
router.use('/momo',account)


module.exports = router