const {
  Account,
  TransactionCharge,
  Transaction,
  User,
  Notification,
} = require("../models");

const getAccountInfo = async (req, res) => {
  const authenticated_user = req.user;

  const account = await Account.findOne({
    where: { user_id: authenticated_user.id },
  });

  res
    .status(200)
    .send({ success: true, data: account.toJSON(), message: "account info" });
};

const listAccounts = async (req, res) => {
  const accounts = await Account.findAll();

  res
    .status(200)
    .send({ success: true, message: "accounts list", data: accounts });
};

const updateAccount = async (req, res) => {
  const { id } = req.params;
  const { balance, is_agent } = req.body;

  const account = await Account.findByPk(id);

  if (balance) account.balance = Number(balance);
  if (is_agent) account.is_agent = is_agent;

  await account.save();

  res.status(200).send({
    success: true,
    message: "account updated successfully",
    data: account.toJSON(),
  });
};

const transactionCharges = async (req, res) => {
  const charges = await TransactionCharge.findAll();

  res.status(200).send({ success: true, data: charges });
};

const getTransactionCharges = async (req, res) => {
  const { id } = req.user;
  const transaction_charge = await TransactionCharge.findOne({
    where: { id: id },
  });

  if (transaction_charge) {
    res.status(200).send({ success: true, data: transaction_charge.toJSON() });
  } else {
    res.status(404).send({ success: false, message: "Not found" });
  }
};

const updateTransactionCharges = async (req, res) => {
  const { id } = req.params;
  const { charge, name } = req.body;
  const transaction_charge = await TransactionCharge.findByPk(id);

  const requesting_user = req.user;

  if (!requesting_user.is_superuser) {
    res.status(400).send({
      success: false,
      message: "you don't have the authorization to continue",
    });
  }

  if (charge) transaction_charge.charge = charge;
  if (name) transaction_charge.name = name;

  await transaction_charge.save();

  res.status(200).send({
    success: true,
    data: transaction_charge.toJSON(),
    message: "transaction charge updated successfully",
  });
};

const transferMoney = async (req, res) => {
  const { reciever, amount } = req.body;
  const user = req.user;
  const sender_account = await Account.findOne({
    where: { user_id: user.id },
  });

  const reciever_account = await Account.findOne({
    where: { account_number: reciever },
  });

  const charge = await TransactionCharge.findOne({
    where: { name: "TRANSFER" },
  });

  if (Number(amount) < 100) {
    const t = await Transaction.create({
      amount: Number(amount),
      code: [...Array(8)].map(() => (Math.random() * 10) | 0).join(""),
      charge: charge.id,
      sender: sender_account.id,
      reciever: reciever_account.id,
      type: "TRANSFER",
      status: "REJECTED",
    });
    if (user.lang == "FR") {
      await Notification.create({
        user_id: user.id,
        message:
          "Desoler vous ne pouvez pas transfer un montant inferieur a 100" +
          sender_account.currency,
        type: "TRANSFER_REJECTED",
      });
    } else {
      await Notification.create({
        user_id: user.id,
        message:
          "Sorry you can\'t transfer an amount lesser than 100" +
          sender_account.currency,
        type: "TRANSFER_REJECTED",
      });
    }
    res.send({
      success: false,
      data: t.toJSON(),
      message: "transaction successfully",
    });
  } else {
    sender_account.decrement(["balance"], { by: Number(amount) });

    reciever_account.increment(["balance"], { by: Number(amount) });

    await sender_account.save();
    await reciever_account.save();

    const t = await Transaction.create({
      amount: Number(amount),
      code: [...Array(8)].map(() => (Math.random() * 10) | 0).join(""),
      charge: charge.id,
      sender: sender_account.id,
      reciever: reciever_account.id,
      type: "TRANSFER",
      status: "SUCCESSFULL",
    });
    const reciever = await reciever_account.user()

    if (user.lang == "FR") {
      await Notification.create({
        user_id: user.id,
        message:
          `Vous avez envoyer ${Number(amount)} XAF a ${reciever.getFullName()} avec success. Code transaction ${t.code} nouveau solde : ${sender_account.balance} XAF` ,
        type: "TRANSFER_SUCCESSFULL",
      });
    }
    else{
      await Notification.create({
        user_id: user.id,
        message:`You have successfully send ${Number(amount)} XAF to ${reciever.getFullName()} successfully.Transaction code ${t.code} new balance : ${sender_account.balance} XAF`,
        type: "TRANSFER_SUCCESSFULL",
      });
    }
    res.send({
      success: true,
      data: {transaction:t.toJSON(),account:sender_account.toJSON()},
      message: "transaction successfully",
    });
  }

  
};

const withdrawMoney = (req, res) => {};

const depositMoney = (req, res) => {

};

const validatedWithdraw = (req, res) => {};

module.exports = {
  listAccounts,
  getAccountInfo,
  updateAccount,
  transferMoney,
  withdrawMoney,
  depositMoney,
  validatedWithdraw,
  transactionCharges,
  getTransactionCharges,
  updateTransactionCharges,
};
