const { Account,TransactionCharge } = require("../models");

const getAccountInfo = async (req, res) => {
  const authenticated_user = req.user;

  const account = await Account.findOne({
    where: { user_id: authenticated_user.id },
  });

  res
    .status(200)
    .send({ success: true, data: account.toJSON(), message: "account info" });
};

const updateAccount = async (req, res) => {
  const { id } = req.params;
  const { balance, is_agent } = req.body;

  const account = await Account.findByPk(id);

  if (balance) account.balance = balance;
  if (is_agent) account.is_agent = is_agent;

  await account.save();

  res
    .status(200)
    .send({
      success: true,
      message: "account updated successfully",
      data: account.toJSON(),
    });
};

const transactionCharges = async (req,res) =>{

  const charges = await TransactionCharge.findAll();

  res.status(200).send({success:true, data: charges})
}


const getTransactionCharges = async (req, res) => {
  const {id} = req.user
  const transaction_charge = await TransactionCharge.findOne({ where:{id:id}})

  if(transaction_charge){
    res.status(200).send({success:true, data: transaction_charge.toJSON()})
  }
  else{
    res.status(404).send({success:false,message:'Not found'})
  }
}

const updateTransactionCharges = async (req,res)=>{
  const {id} = req.params;
  const {charge} = req.body
  const transaction_charge = await TransactionCharge.findByPk(id)

  const requesting_user = req.user

  if(!requesting_user.is_superuser){
    res.status(400).send({success:false,message:'you don\'t have the authorization to continue'})
  }

  if(charge) transaction_charge.charge = charge;

  await transaction_charge.save()

  res.status(200).send({success:true, data: transaction_charge.toJSON(),message:'transaction charge updated successfully'})

}

const transferMoney = (req, res) => {
  const { sender, reciever, amount } = req.body;
  res.send('request recieve')
};

const withdrawMoney = (req, res) => {};

const depositMoney = (req, res) => {};

const validatedWithdraw = (req, res) => {};

module.exports = {
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
