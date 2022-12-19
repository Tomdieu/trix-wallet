const express = require("express");

const { TokenMiddleWare, AdminMiddleware ,AgentMiddleware} = require("../../middlewares");
const { validate } = require("../../models/validation");

const updateAccountSchema = require("../../models/schema/updateAccountSchema");
const transactionChargeShema = require("../../models/schema/transactionChargeShema");
const transferMoneySchema = require('../../models/schema/transferMoneySchema')
const depositMoneySchema = require('../../models/schema/depostiMoneySchema')




const {
  momoControllers: {
    getAccountInfo,
    updateAccount,
    transactionCharges,
    updateTransactionCharges,
    getTransactionCharges,
    transferMoney,
    depositMoney,
    withdrawMoney
  },
} = require("../../controllers");

const router = express.Router();

router.get("/account", TokenMiddleWare, getAccountInfo);

router.patch(
  "/account/:id",
  TokenMiddleWare,
  validate(updateAccountSchema),
  updateAccount
);

router.put(
  "/account/:id",
  TokenMiddleWare,
  validate(updateAccountSchema),
  updateAccount
);

router.get("/transaction-charges", TokenMiddleWare, transactionCharges);

router.get("/transaction-charges/:id", TokenMiddleWare, getTransactionCharges);

router.patch(
  "/transaction-charges/:id",
  TokenMiddleWare,
  AdminMiddleware,
  validate(transactionChargeShema),
  updateTransactionCharges
);


router.post('/transfer-money', TokenMiddleWare, validate(transferMoneySchema),transferMoney)

router.post('/deposit',TokenMiddleWare,AgentMiddleware,validate(depositMoneySchema),depositMoney)

module.exports = router;
