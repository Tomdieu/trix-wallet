const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const User = require("./User");

class Notification extends Model {}

Notification.init(
  {
    user_id: {
      type: DataTypes.BIGINT,
      refrences: {
        model: User,
        key: "id",
      },
      onDelete: 'CASCADE'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM([
        "NORMAL",
        "TRANSFER_SUCCESSFULL",
        "DEPOSIT_SUCCESSFULL",
        "DEPOSIT_REJECTED",
        "TRANSFER_REJECTED",
        "WITHDRAW_REJECTED",
        "WITHDRAW_PENDING",
        "WITHDRAW_CANCEL",
        "APPROVE_WITHDRAWAL",
        "WITHDRAW_SUCCESSFULL",
        "ACCOUNT_EMPTY",
      ]),
      allowNull: false,
      defaultValue: "NORMAL",
    },
  },
  {
    sequelize,
    tableName: "notification",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// User.hasMany(Notification)
Notification.belongsTo(User,{foreignKey:{name:'user_id'},targetKey:'id'})

module.exports = Notification;
