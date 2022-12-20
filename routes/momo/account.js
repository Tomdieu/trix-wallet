const express = require("express");

const { TokenMiddleWare, AdminMiddleware ,AgentMiddleware} = require("../../middlewares");
const { validate } = require("../../models/validation");

const updateAccountSchema = require("../../models/schema/updateAccountSchema");
const transactionChargeShema = require("../../models/schema/transactionChargeShema");
const transferMoneySchema = require('../../models/schema/transferMoneySchema')
const depositMoneySchema = require('../../models/schema/depositMoneySchema')
const withdrawMoneySchema = require('../../models/schema/withdrawMoneySchema')

const pendingWithdrawalSchema = require('../../models/schema/pendingWithdrawalSchema')

const {
  momoControllers: {
    getAccountInfo,
    updateAccount,
    transactionCharges,
    updateTransactionCharges,
    getTransactionCharges,
    transferMoney,
    depositMoney,
    withdrawMoney,
    pendingWithdrawals,
    getPendingWithdrawal,
    listPendingWithdrawal,
    validatedWithdraw,
    cancelWithdraw
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

router.post('/withdraw',TokenMiddleWare,AgentMiddleware,validate(withdrawMoneySchema),withdrawMoney)

router.get('/pending-withdrawals',TokenMiddleWare,pendingWithdrawals)

router.get('/pending-withdrawals/:id',TokenMiddleWare,validate(pendingWithdrawalSchema),getPendingWithdrawal)

router.get('/pending-withdrawals-list',TokenMiddleWare,AdminMiddleware,listPendingWithdrawal)

router.post('/pending-withdrawals/:id/validate',TokenMiddleWare,validate(pendingWithdrawalSchema),validatedWithdraw)

router.post('/pending-withdrawals/:id/cancel',TokenMiddleWare,validate(pendingWithdrawalSchema),cancelWithdraw)


module.exports = router;
