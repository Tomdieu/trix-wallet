const { Account } = require("..");
const { checkSchema } = require("express-validator");

const transferMoneySchema = {
  reciever: {
    notEmpty: true,
    custom: {
      options: async (value, { req }) => {
        if (value) {
          let acc_num = Number(value);
          if (acc_num) {
            const user_account = await Account.findOne({
              where: { account_number: acc_num },
            });
            if (user_account) {
              const user = req.user;
              if (user_account.user_id === user.id) {
                return Promise.reject("You can't send money to your self");
              }
            } else {
              return Promise.reject("Account number don't exists");
            }
          } else {
            return Promise.reject("invalid account number");
          }
        }
      },
    },
  },
  amount: {
    notEmpty: true,
    custom: {
      options: async (value, { req }) => {
        if (value) {
          let x = Number(value);
          if (x) {
            if (x < 0) {
              return Promise.reject(
                "The amount value must be a positive value"
              );
            } else {
              const account = await Account.findOne({
                where: { user_id: req.user.id },
              });
              if (x > account.balance) {
                return Promise.reject(
                  "Your account balance in insufficient to make the transaction"
                );
              }
            }
          } else if (x === "NaN") {
            return Promise.reject("The type of amount must be and integer");
          }
        }
      },
    },
  },
  pin_code: {
    notEmpty: true,
    custom: {
      options: async (value, { req }) => {
        if (value) {
          let code = Number(value);
          const account = await Account.findOne({
            where: { user_id: req.user.id },
          });
          if (!account) return Promise.reject("pin code require");
          if (Number(account.pin_code) !== code) {
            return Promise.reject("pin code incorrect");
          }
        }
      },
    },
  },
};

module.exports = checkSchema(transferMoneySchema);
