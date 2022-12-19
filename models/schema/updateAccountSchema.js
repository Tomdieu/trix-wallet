const { checkSchema } = require("express-validator");
const { Account } = require("../");

const updateAccountSchema = {
  id: {
    notEmpty: true,
    errorMessage: "user id require",
    custom: {
      options: async (value) => {
        if (value) {
          const account = await Account.findByPk(value);
          if (!account) {
            return Promise.reject("account id doesn't exixts");
          }
        }
      },
    },
  },
  balance: {
    custom: {
      options: async (value, { req }) => {
        if (value) {
          if (!(/^(\d)+$/.test(value))) {
            return Promise.reject("invalid value must be an integer");
          }
        }
      },
    },
  },
  is_agent: {
    custom: {
      options: async (value, { req }) => {
        if (value) {
          if (!(value in [0, 1])) {
            return Promise.reject("invalid value must be a boolean");
          }
        }
      },
    },
  },
};

module.exports = checkSchema(updateAccountSchema);
