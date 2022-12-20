const User = require("./User");
const Account = require("./Account");
const TransactionCharge = require("./TransactionCharge");
const Token = require("./Token");
const Transaction = require("./Transaction");
const Notification = require("./Notification");



const sequelize = require("../utils/database");

sequelize
  .sync({logging:true})
  .then(() => {
    
    const typ = ["DEPOSIT", "TRANSFER", "WITHDRAW"];

    typ.map(async (transaction_type, index) => {
      const t = await TransactionCharge.findOne({
        where: { name: transaction_type },
      });
      if (!t) {
        await TransactionCharge.create({ charge: 2, name:transaction_type});
      }
    });
    console.log("db is ready!");
  })
  .catch((e) => {
    console.error(e)
  });

module.exports = {
  sequelize,
  User,
  Account,
  TransactionCharge,
  Token,
  Transaction,
  Notification
};
