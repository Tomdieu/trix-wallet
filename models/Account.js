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
    pin_code:{
      type:DataTypes.STRING,
      defaultValue:'00000',
    },
    user_id: {
      type: DataTypes.BIGINT,
      references: {
        model: User,
        key: "id",
        onDelete:'CASCADE'
      },
      onDelete: 'CASCADE'
    },
  },
  {
    sequelize,
    modelName: "account",
    createdAt: "created_at",
    updatedAt: "updated_at",
   
  }
);

// User.hasOne(Account)

module.exports = Account;
