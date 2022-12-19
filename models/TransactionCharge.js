const { Model, DataTypes } = require("sequelize");
const sequelize = require('../utils/database')


class TransactionCharge extends Model{}

TransactionCharge.init({
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
    charge:{
        type:DataTypes.INTEGER,
        validate:{
            min:0
        }
    },
    
},{sequelize,modelName:'transaction_charge',timestamps:false})

module.exports = TransactionCharge