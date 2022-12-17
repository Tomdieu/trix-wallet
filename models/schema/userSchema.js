const { User } = require("../");
const { checkSchema} = require("express-validator");

const userSchema = {
    username: {
      notEmpty: true,
      custom: {
        options: async (value) => {
          const user = await User.findOne({ where: { username: value } });
          if (user != null) {
            return Promise.reject("username already exists");
          }
        },
      },
    },
    first_name: {
      notEmpty: true,
      errorMessage: "first_name required",
    },
    email: {
      notEmpty: true,
      normalizeEmail: true,
      errorMessage: "email require",
    },
    phone_number: {
      notEmpty: true,
      isMobilePhone: true,
      errorMessage: "phone number required",
    },
    password: {
      notEmpty: true,
      isStrongPassword: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
      },
      errorMessage:
        "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, one number and a special character",
    },
  };


module.exports = checkSchema(userSchema)