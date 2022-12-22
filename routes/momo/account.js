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


/**
 * Account
 * @typedef {object} Account
 * @property {number} id
 * @property {number} account_number.required
 * @property {string} currency.required - the account currency default XAF
 * @property {number} balance
 * @property {boolean} is_agent - determines if the account can make deposit and withdraw
 * @property {number} pin_code.required - account pin code
 * @property {number} user_id.required - the user id
 * 
 */


/**
 * GET /api/momo/account
 * @tags Momo
 * @secutity BearerAuth
 * @summary Returns the accunt a the login user
 * @return {Account} 200
 */
router.get("/account", TokenMiddleWare, getAccountInfo);


/**
 * PATCH /api/momo/account/{id}
 * @tags Momo
 * @param {number} id.param
 * @param {Account} request.body
 * @secutity BearerAuth
 * @summary Patialy updated an account
 * @return {Account}
 */
router.patch(
  "/account/:id",
  TokenMiddleWare,
  validate(updateAccountSchema),
  updateAccount
);

/**
 * PUT /api/momo/account/{id}
 * @tags Momo
 * @secutity BearerAuth
 * @param {number} id.param
 * @param {Account} request.body
 * @summary Updated An Account
 * @return {Account}
 */
router.put(
  "/account/:id",
  TokenMiddleWare,
  validate(updateAccountSchema),
  updateAccount
);


/**
 * Transaction Charges
 * @typedef {object} TransactionCharges
 * @property {number} id
 * @property {string} name.required
 * @property {number} charge.required
*/


/**
 * GET /api/momo/transaction-charges
 * @security BearerAuth
 * @tags Momo
 * @return {array<TransactionCharges>}
 */
router.get("/transaction-charges", TokenMiddleWare, transactionCharges);

/**
 * GET /api/momo/transaction-charges/{id}
 * @security BearerAuth
 * @tags Momo
 * @param {number} id.param
 * @return {TransactionCharges}
 */
router.get("/transaction-charges/:id", TokenMiddleWare, getTransactionCharges);

/**
 * PATCH /api/momo/transaction-charges/{id}
 * @security BearerAuth
 * @tags Momo
 * @param {number} id.param
 * @param {TransactionCharges} request.body
 * @return {TransactionCharges} 200 - Transaction charges updated
 */
router.patch(
  "/transaction-charges/:id",
  TokenMiddleWare,
  AdminMiddleware,
  validate(transactionChargeShema),
  updateTransactionCharges
);

/**
 * Transfer
 * @typedef {object} Transfer
 * @property {number} reciever.required - The reciever account id
 * @property {number} amount.required - The amount to transfer transaction
 * @property {number} pin_code.required - The pin code of the sender account
 */


/**
 * Withdraw
 * @typedef {object} Withdraw
 * @property {number} from_account.required - The account id from which we want to withdraw
 * @property {number} amount.required - The amount to withdraw
 * @property {number} pin_code.required - The pin code of the account launching the withdrawal
 */

/**
 * POST /api/momo/transfer-money
 * @param {Transfer} request.body.required
 * @tags Momo
 * @summary Transfer money from an account to another
 * @security BearerAuth
 * @return {object} 200 - Transfer successfully - application/json
 */
router.post('/transfer-money', TokenMiddleWare, validate(transferMoneySchema),transferMoney)

/**
 * POST /api/momo/deposit
 * @param {Transfer} request.body.required
 * @tags Momo
 * @summary Transfer money from an account to another
 * @security BearerAuth
 * @return {object} 200 - Deposit successfully - application/json
 */
router.post('/deposit',TokenMiddleWare,AgentMiddleware,validate(depositMoneySchema),depositMoney)

/**
 * POST /api/momo/withdraw
 * @param {Withdraw} request.body.required
 * @tags Momo
 * @summary Transfer money from an account to another
 * @security BearerAuth
 * @return {object} 200 - success response - application/json
 */
router.post('/withdraw',TokenMiddleWare,AgentMiddleware,validate(withdrawMoneySchema),withdrawMoney)

/**
 * GET /api/momo/pending-withdrawals
 * @security BearerAuth
 * @tags Momo
 * @summary Gets all your pending withdrawals
 * @returns {object} 200 - success -response - application/json
 */
router.get('/pending-withdrawals',TokenMiddleWare,pendingWithdrawals)

/**
 * GET /api/momo/pending-withdrawals/{id}
 * @security BearerAuth
 * @tags Momo
 * @param {number} id.param
 * @summary Gets a pending withdrawal
 * @returns {object} 200 - success -response - application/json
 */
router.get('/pending-withdrawals/:id',TokenMiddleWare,validate(pendingWithdrawalSchema),getPendingWithdrawal)

/**
 * GET /api/momo/pending-withdrawals/{id}
 * @security BearerAuth
 * @param {number} id.param
 * @tags Momo
 * @summary Gets all the pending withdrawals only be access by admin
 * @returns {object} 200 - success -response - application/json
 */
router.get('/pending-withdrawals-list',TokenMiddleWare,AdminMiddleware,listPendingWithdrawal)

/**
 * GET /api/momo/pending-withdrawals/{id}/validate
 * @security BearerAuth
 * @param {number} id.param
 * @tags Momo
 * @summary Authorize | Confirm a withdrawal 
 * @returns {object} 200 - success -response - application/json
 */
router.post('/pending-withdrawals/:id/validate',TokenMiddleWare,validate(pendingWithdrawalSchema),validatedWithdraw)

/**
 * GET /api/momo/pending-withdrawals/{id}/cancel
 * @security BearerAuth
 * @tags Momo
 * @param {number} id.param
 * @summary Deny | Cancel a withdrawal 
 * @returns {object} 200 - success -response - application/json
 */
router.post('/pending-withdrawals/:id/cancel',TokenMiddleWare,validate(pendingWithdrawalSchema),cancelWithdraw)


module.exports = router;
