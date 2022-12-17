const { Model, DataTypes } = require("sequelize");
const sequelize = require('../utils/database')

class TransactionType extends Model {}

TransactionType.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isIn: {
        args: [["DEPOSIT", "TRANSFER", "WITHDRAW"]],
        msg: "Invalid transaction type must be in ['DEPOSIT','TRANSFER','WITHDRAW']",
      },
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  }
},{sequelize,modelName:"transaction_type",timestamps:false});


module.exports = TransactionType