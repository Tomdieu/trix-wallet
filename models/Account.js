const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const User = require("./User");

class Account extends Model {}

Account.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    account_number: {
      type: DataTypes.BIGINT,
      unique: true,
      defaultValue: 10000000,
      allowNull: false,
    },
    balance: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.CHAR,
      validate: {
        max: 3,
      },
      allowNull: false,
      defaultValue: "XAF",
    },
    is_agent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "account",
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeCreate: (instance, option) => {
        console.log(
          "Enter with " + instance.isNewRecord + " and " + instance.id
        );
        if(instance.isNewRecord){

          instance.account_number = Number(10000000 + 100);
        }
        console.log(instance.toJSON())
        // instance.account_number = Number(
        //   [...Array(32)].map((_) => (Math.random() * 10) | 0).join("")
        // );
      },
      afterCreate:(instance,option)=>{
        console.log(instance.toJSON())
        
        if(instance.id && instance.account_number === Number(10000000 + 100)){
          console.log(true)
          instance.account_number=Number(10000000 + instance.id)
          instance.save('account_number').then(dt=>console.log(dt.toJSON())).catch(e=>console.log(e))
        }else{
          console.log(false)
        }
      }
    },
  }
);

// User.hasOne(Account)

module.exports = Account;
