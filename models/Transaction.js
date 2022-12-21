const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Account = require("./Account");
const {User} = require("./User")
const TransactionCharge = require("./TransactionCharge");

class Transaction extends Model {
  async getSender(){
    const sender = await Account.findByPk(this.sender,{include:User})
    return sender
  }

  async getReciever(){
    const reciever = await Account.findByPk(this.reciever,{include:User})
    return reciever
  }

  async createNotifications(){
  }
}

Transaction.init(
  {
    code: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    charge: {
      type: DataTypes.INTEGER,
      references: {
        model: TransactionCharge,
        key: "id",
      },
      allowNull: false,
    },
    sender: {
      type: DataTypes.BIGINT,
      refrences: {
        model: Account,
        key: "id",
      },
      allowNull: false,
      onDelete: "SET NULL",
    },
    reciever: {
      type: DataTypes.BIGINT,
      refrences: {
        model: Account,
        key: "id",
      },
      allowNull: false,
      onDelete: "SET NULL",
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [["TRANSFER", "DEPOSIT", "WITHDRAW"]],
          msg: "ivalid transaction type must be either `TRANSFER`,`DEPOSIT` or `WITHDRAW`",
        },
      },
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [["PENDING", "REJECTED", "SUCCESSFULL", "CANCEL"]],
          msg: "invalid transaction status",
        },
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    hooks: {
      afterCreate: async (transaction, option) => {
        console.log(transaction)
        if (transaction) {
          transaction.code = 2000000 + transaction.id;
          const txn = await transaction.save();
          return txn
        }
      },
      afterUpdate:async (transaction,option) =>{
        if(transaction.type == 'WITHDRAW'){
          if(transaction.status === 'CANCEL'){
            const {Notification} = require("./")

            await Notification.create({})
            await Notification.create({})
          }
        }
      }
    },
    tableName: "transaction",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);


module.exports = Transaction;
