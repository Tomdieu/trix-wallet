const express = require('express')

const router = express.Router()

const {userRoutes} =require('./auth') 
const {account} = require('./momo')

const notificationRoutes = require('./notification') 

router.use('/user',userRoutes)

router.use('/momo',account)

router.use('/notification',notificationRoutes)

module.exports = router