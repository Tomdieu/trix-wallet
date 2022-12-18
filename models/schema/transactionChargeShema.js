const { checkSchema } = require("express-validator");
const { TransactionCharge } = require("..");

const transactionChargeShema = {
  id: {
    notEmpty: true,
    errorMessage: "user id require",
    custom: {
      options: async (value) => {
        if (value) {
          const trxchrg = await TransactionCharge.findByPk(value);
          if (!trxchrg) {
            return Promise.reject("transaction charge id doesn't exixts");
          }
        }
      },
    },
  },
  charge: {
    custom: {
      options: async (value, { req }) => {
        if (value) {
          let x = Number(value);
          if (x === "NaN") {
            return Promise.reject(
              "Charge value must be an integer between 1 and 100"
            );
          } else {
            if (value < 0 || value > 99) {
              return Promise.reject("Charge value must be between 1 and 100");
            }
          }
        }
      },
    },
  },
};

module.exports = checkSchema(transactionChargeShema);
