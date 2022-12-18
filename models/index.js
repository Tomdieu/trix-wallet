const User = require("./User");
const Account = require("./Account");
const TransactionType = require("./TransactionType");
const TransactionCharge = require("./TransactionCharge");
const Token = require("./Token");
const Transaction = require("./Transaction");
const Notification = require("./Notification");



const sequelize = require("../utils/database");

sequelize
  .sync()
  .then(() => {
    const typ = ["DEPOSIT", "TRANSFER", "WITHDRAW"];

    typ.map(async (transaction_type, index) => {
      const t = await TransactionType.findOne({
        where: { name: transaction_type },
      });
      if (!t) {
        TransactionType.create({
          name: transaction_type,
          description: `${transaction_type} description`,
        }).then((transaction) => {
          console.log(transaction);
          console.log("Transaction type created successfully");
          TransactionCharge.create({ charge: 2, type: transaction.id }).then(
            (charge) => console.log(`Transaction charges created successfully`)
          );
        });
      }
    });
    console.log("Db is ready!");
  })
  .catch(() => {
    console.log("An Error Occur Could Not Created Tables");
  });

module.exports = {
  User,
  Account,
  TransactionType,
  TransactionCharge,
  Token,
  Transaction,
  Notification
};
