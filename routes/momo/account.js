const express = require("express");

const { TokenMiddleWare,AdminMiddleware } = require("../../middlewares");
const { validate } = require("../../models/validation");

const updateAccountSchema = require('../../models/schema/updateAccountSchema')
const transactionChargeShema = require('../../models/schema/transactionChargeShema')

const {momoControllers:{getAccountInfo,updateAccount,transactionCharges,updateTransactionCharges,getTransactionCharges}} = require('../../controllers')

const router = express.Router()

router.get('/account',TokenMiddleWare,getAccountInfo)

router.patch('/account/:id',TokenMiddleWare,validate(updateAccountSchema),updateAccount)

router.put('/account/:id',TokenMiddleWare,validate(updateAccountSchema),updateAccount)

router.get('/transaction-charges',TokenMiddleWare,transactionCharges)

router.get('/transaction-charges/:id',TokenMiddleWare,getTransactionCharges)

router.patch('/transaction-charges/:id',TokenMiddleWare,AdminMiddleware,validate(transactionChargeShema),updateTransactionCharges)


module.exports = router