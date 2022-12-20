const { DataTypes, Sequelize,Op } = require("sequelize");
const {
  Account,
  TransactionCharge,
  Transaction,
  User,
  Notification,
  sequelize,
} = require("../models");

const getAccountInfo = async (req, res) => {
  const authenticated_user = req.user;
  
  const account = await Account.findOne({
    where: { user_id: authenticated_user.id },
    include:User
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

/**
 *
 * This controlers help to update an account
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 */
const updateAccount = async (req, res) => {
  const { id } = req.params;
  const { balance, is_agent } = req.body;

  const account = await Account.findByPk(id);

  if (balance) account.balance = Number(balance);
  if (is_agent) account.is_agent = Number(is_agent);

  await account.save();

  res.status(200).send({
    success: true,
    message: "account updated successfully",
    data: account.toJSON(),
  });
};

/**
 *
 * This controlers help to get all transaction charges
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 */
const transactionCharges = async (req, res) => {
  const charges = await TransactionCharge.findAll();

  res.status(200).send({ success: true, data: charges });
};

/**
 *
 * This controlers help to get a transaction charges
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 */
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

/**
 *
 * This controlers help to update transaction charges
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 */
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

// -------------------Transactions--------------------------------------------------

// -------------------TRANSFER MONEY

const transferMoney = async (req, res) => {
  const { reciever, amount } = req.body;
  const user = req.user;
  var sender_account = await Account.findOne({
    where: { user_id: user.id },
  });

  var reciever_account = await Account.findOne({
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
          "Sorry you can't transfer an amount lesser than 100" +
          sender_account.currency,
        type: "TRANSFER_REJECTED",
      });
    }
    res.send({
      success: false,
      data: t.toJSON(),
      message: "transfer rejected",
    });
  } else {
    const trx = await sequelize.transaction({ autocommit: true });

    try {
      await sender_account.decrement(["balance"], { by: Number(amount) });

      await reciever_account.increment(["balance"], { by: Number(amount) });

      sender_account = await sender_account.reload();
      reciever_account = await reciever_account.reload();

      const t = await Transaction.create(
        {
          amount: Number(amount),
          code: [...Array(8)].map(() => (Math.random() * 10) | 0).join(""),
          charge: charge.id,
          sender: sender_account.id,
          reciever: reciever_account.id,
          type: "TRANSFER",
          status: "SUCCESSFULL",
        }
        // { transaction: trx }
      );

      const reciever = await reciever_account.user();

      if (user.lang == "FR") {
        await Notification.create(
          {
            user_id: user.id,
            message: `Vous avez envoyer ${Number(
              amount
            )} XAF a ${reciever.getFullName()} avec success. Code transaction ${
              t.code
            } nouveau solde : ${sender_account.balance} XAF`,
            type: "TRANSFER_SUCCESSFULL",
          },
          { transaction: trx }
        );
      } else {
        await Notification.create(
          {
            user_id: user.id,
            message: `You have successfully send ${Number(
              amount
            )} XAF to ${reciever.getFullName()} successfully.Transaction code ${
              t.code
            } new balance : ${sender_account.balance} XAF`,
            type: "TRANSFER_SUCCESSFULL",
          },
          { transaction: trx }
        );
      }

      trx.commit().then(() => {
        res.send({
          success: true,
          data: { account: sender_account.toJSON(), transaction: t.toJSON() },
          message: "transfer successfull",
        });
      });
    } catch (error) {
      await trx.rollback();
      res.send({
        success: false,
        data: [],
        message: "Something went wrong",
        errors: error,
      });
    }
  }
};

// -------------WITHDRAW MONEY-------------------------------

/**
 *
 * This controlers help to withdraw money from an account
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 */
const withdrawMoney = async (req, res) => {
  const { from_account, amount } = req.body;

  const user = req.user;
  const reciever_account = await Account.findOne({
    where: { user_id: user.id },
  });

  const sender_account = await Account.findOne({
    where: { account_number: from_account },
  });

  const charge = await TransactionCharge.findOne({
    where: { name: "WITHDRAW" },
  });

  if (Number(amount) < 100) {
    const t = await Transaction.create({
      amount: Number(amount),
      code: [...Array(8)].map(() => (Math.random() * 10) | 0).join(""),
      charge: charge.id,
      sender: sender_account.id,
      reciever: reciever_account.id,
      type: "WITHDRAW",
      status: "REJECTED",
    });
    if (user.lang == "FR") {
      await Notification.create({
        user_id: user.id,
        message:
          "Desoler vous ne pouvez pas faire le retrait d'un montant inferieur a 100" +
          sender_account.currency,
        type: "WITHDRAW_REJECTED",
      });
    } else {
      await Notification.create({
        user_id: user.id,
        message:
          "Sorry you can't make a withdrawal of an amount lesser than 100" +
          sender_account.currency,
        type: "WITHDRAW_REJECTED",
      });
    }
    res.send({
      success: false,
      data: t.toJSON(),
      message: "deposit rejected",
    });
  } else {
    const trx = await sequelize.transaction();

    try {
      // sender_account.decrement(["balance"], { by: Number(amount) });

      // reciever_account.increment(["balance"], { by: Number(amount) });

      const t = await Transaction.create({
        amount: Number(amount),
        code: [...Array(8)].map(() => (Math.random() * 10) | 0).join(""),
        charge: charge.id,
        sender: sender_account.id,
        reciever: reciever_account.id,
        type: "WITHDRAW",
        status: "PENDING",
      });
      const reciever = await reciever_account.user();

      if (user.lang == "FR") {
        await Notification.create(
          {
            user_id: user.id,
            message: `Vous avez initier un retrait de ${Number(
              amount
            )} XAF du compte de ${reciever.getFullName()} . Code transaction ${
              t.code
            }`,
            type: "WITHDRAW_PENDING",
          },
          { transaction: trx }
        );
      } else {
        await Notification.create(
          {
            user_id: user.id,
            message: `You have initaited a withdrawal of ${Number(
              amount
            )} XAF from the account of ${reciever.getFullName()}.Transaction code ${
              t.code
            }`,
            type: "WITHDRAW_PENDING",
          },
          { transaction: trx }
        );
      }
      await trx.commit();
      res.send({
        success: true,
        data: { transaction: t.toJSON(), account: sender_account.toJSON() },
        message: "withdraw initiated",
      });
    } catch (error) {
      res.send({
        success: false,
        data: [],
        errors: error,
        message: "Could not achieve the withdrawal",
      });
      await trx.rollback();
    }
  }
};

// --------------DEPOSIT MONEY-------------------------------
const depositMoney = async (req, res) => {
  const { reciever, amount } = req.body;

  const user = req.user;
  const sender_account = await Account.findOne({
    where: { user_id: user.id },
  });

  const reciever_account = await Account.findOne({
    where: { account_number: reciever },
  });

  const charge = await TransactionCharge.findOne({
    where: { name: "DEPOSIT" },
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
          "Desoler vous ne pouvez pas faire le depot d'un montant inferieur a 100" +
          sender_account.currency,
        type: "DEPOSIT_REJECTED",
      });
    } else {
      await Notification.create({
        user_id: user.id,
        message:
          "Sorry you can't make a deposit of an amount lesser than 100" +
          sender_account.currency,
        type: "DEPOSIT_REJECTED",
      });
    }
    res.send({
      success: false,
      data: t.toJSON(),
      message: "deposit rejected",
    });
  } else {
    const trx = await sequelize.transaction();
    try {
      await sender_account.decrement(["balance"], { by: Number(amount) });

      await reciever_account.increment(["balance"], { by: Number(amount) });

      await sender_account.reload()
      await reciever_account.reload()

      const t = await Transaction.create(
        {
          amount: Number(amount),
          code: [...Array(8)].map(() => (Math.random() * 10) | 0).join(""),
          charge: charge.id,
          sender: sender_account.id,
          reciever: reciever_account.id,
          type: "DEPOSIT",
          status: "SUCCESSFULL",
        }
      );
      const reciever = await reciever_account.user();

      if (user.lang == "FR") {
        await Notification.create(
          {
            user_id: user.id,
            message: `Vous avez fair un depot ${Number(
              amount
            )} XAF a ${reciever.getFullName()} avec success. Code transaction ${
              t.code
            } nouveau solde : ${sender_account.balance} XAF`,
            type: "DEPOSIT_SUCCESSFULL",
          },
          { transaction: trx }
        );
      } else {
        await Notification.create(
          {
            user_id: user.id,
            message: `You have successfully deposit ${Number(
              amount
            )} XAF to ${reciever.getFullName()} successfully.Transaction code ${
              t.code
            } new balance : ${sender_account.balance} XAF`,
            type: "DEPOSIT_SUCCESSFULL",
          },
          { transaction: trx }
        );
      }
      trx.commit();
      res.send({
        success: true,
        data: { transaction: t.toJSON(), account: sender_account.toJSON() },
        message: "deposit successfull",
      });
    } catch (error) {
      await trx.rollback();
      res.send({
        success: false,
        data: [],
        message: "Sorry Something went wrong!",
        errors: error,
      });
    }
  }
};

// -----------------VALIDATED WITHDRAW----------------------------

const pendingWithdrawals = async (req, res) => {
  const _user = req.user  
  const user = await User.findOne({where:{ id: _user.id},include:Account});
  
  const user_account = user.account;
  
  const minutes = 2;

  const pending_withdrawals = await Transaction.findAll({
    where:{
      status:'PENDING',
      type:'WITHDRAW',
      sender:user_account.id,
      created_at:{
        [Op.lte]:new Date(),
        [Op.gte]:new Date(new Date() - minutes * 60 * 1000)
      },
    },
    order:[['created_at','DESC']]
  })
  if(!pending_withdrawals){
    res.status(200).send({ success:true,data:[],message:'You don\'t have pending withdrawals'})
  }
  else{

    res.status(200).send({ success:true,data:pending_withdrawals,message:'all your pending withdrawal valid between 2 minutes'})
  }
};

const listPendingWithdrawal = async (req, res) => {
  const user = req.user
  if(user.is_superuser){

    const pending_withdrawals = await Transaction.findAll({
      where:{
        status:'PENDING',
        type:'WITHDRAW',
        created_at:{
          [Op.lte]:new Date(),
        },
      },
      order:[['created_at','DESC']]
    })
    if(pending_withdrawals){
      res.status(200).send({ success:true,data:pending_withdrawals,message:'all your pending withdrawal valid between 2 minutes'})
    }
    else{
      res.status(200).send({ success:true,data:[],message:'You don\'t have pending withdrawals'})
  
    }
  }
  else{
    res.status(400).send({success:false,errors:'You are not authorize'})
  }
}

const getPendingWithdrawal = async (req, res) => {
  const {id} = req.params;
  const user = req.user
  const account = await Account.findOne({include:{
    model:User,
    where:{
      id:user.id
    }
  }})

  const pending_withdrawals = await getWithdraw(id,account.id);

  if(pending_withdrawals){
    res.status(200).send({ success:true,data:pending_withdrawals,message:'all your pending withdrawal valid between 2 minutes'})
  }
  else{
    res.status(200).send({ success:true,data:[],message:'You don\'t have pending withdrawals'})

  }
}

/**
 * 
 * This function get a valid pending withdrawal which the id and account id was passed 
 * 
 * @param {int} id the transaction id
 * @param {int} sender_id  the sender account id
 */
const getWithdraw = async (id,sender_id) =>{
  const pending_withdrawals = await Transaction.findOne({
    where:{
      id:id,
      sender:sender_id,
      status:'PENDING',
      type:'WITHDRAW',
      created_at:{
        [Op.lte]:new Date(),
        [Op.gte]:new Date(new Date() - minutes * 60 * 1000)
      },
    },
    order:[['created_at','DESC']]
  })

  return pending_withdrawals
}

const validatedWithdraw = async (req, res) => {
  const {id} = req.params;
  const user = req.user
  const account = await Account.findOne({include:{
    model:User,
    where:{
      id:user.id
    }
  }})

  const pending_withdrawals = await getWithdraw(id,account.id);
  
  if(pending_withdrawals){
    pending_withdrawals.status = 'SUCCESSFULL'
    await pending_withdrawals.save()
    await pending_withdrawals.reload()
    res.status(200).send({ success:true,data:pending_withdrawals,message:'You have successfully approve the withdrawal'})
  }
  else{
    res.status(200).send({ success:true,data:[],message:'No pending withdrawal'})

  }
}

const cancelWithdraw = async (req,res) => {
  const {id} = req.params;
  const user = req.user
  const account = await Account.findOne({include:{
    model:User,
    where:{
      id:user.id
    }
  }})

  const pending_withdrawals = await getWithdraw(id,account.id);
  
  if(pending_withdrawals){
    pending_withdrawals.status = 'CANCEL'
    await pending_withdrawals.save()
    await pending_withdrawals.reload()
    res.status(200).send({ success:true,data:pending_withdrawals,message:'You have successfully cancel the withdrawal'})
  }
  else{
    res.status(200).send({ success:true,data:[],message:'No pending withdrawal'})

  }
}


module.exports = {
  listAccounts,
  getAccountInfo,
  updateAccount,
  transferMoney,
  withdrawMoney,
  depositMoney,
  pendingWithdrawals,
  getPendingWithdrawal,
  listPendingWithdrawal,
  validatedWithdraw,
  cancelWithdraw,
  transactionCharges,
  getTransactionCharges,
  updateTransactionCharges,
};
