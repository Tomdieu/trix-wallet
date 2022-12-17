const { Model, DataTypes } = require("sequelize");
const sequelize = require('../utils/database')

const TransactionType = require('./TransactionType') 

class TransactionCharge extends Model{}

TransactionCharge.init({
    charge:{
        type:DataTypes.INTEGER,
        validate:{
            min:0
        }
    },
    type:{
        type:DataTypes.INTEGER,
        references:{
            model:TransactionType,
            key:'id'
        }
    }
},{sequelize,modelName:'transaction_charge',timestamps:false})

module.exports = TransactionCharge