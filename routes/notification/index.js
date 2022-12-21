const express = require('express')


const router = express.Router()

const { TokenMiddleWare } = require("../../middlewares");

const {notificationControllers:{getNotifications}} = require("../../controllers/")

router.get('/',TokenMiddleWare,getNotifications)

module.exports = router