const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Account = require('./Account')
const TransactionCharge = require("./TransactionCharge");

class Transfer extends Model{}

Transfer.init({
    code: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: false,
      },
      amount: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      charge: {
        type: DataTypes.INTEGER,
        references: {
          model: TransactionCharge,
          key: "id",
        },
        allowNull:false

      },
    sender:{
        type:DataTypes.BIGINT,
        refrences:{
            model:Account,
            key:'id'
        },
        allowNull:false

    },
    reciever:{
        type:DataTypes.BIGINT,
        refrences:{
            model:Account,
            key:'id'
        },
        allowNull:false

    },
    type:{
        type:DataTypes.STRING,
        validate:{
            isIn:{
                args:[["TRANSFER","DEPOSIT","WITHDRAW"]],
                msg:"ivalid transaction type must be either `TRANSFER`,`DEPOSIT` or `WITHDRAW`"
            }
        },
        allowNull:false

    },
    status:{
        type:DataTypes.STRING,
        validate:{
            isIn:{
                args:[['PENDING','REJECTED','SUCCESSFULL','CANCEL']],
                msg:"invalid transaction status"
            }
        },
        allowNull:false
    }
},{
    sequelize,
    tableName:'transaction',
    createdAt: "created_at", updatedAt: "updated_at"
})

module.exports = Transfer