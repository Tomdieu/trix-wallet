const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const User = require("./User");

class Token extends Model {}

Token.init(
  {
    key: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      refrences: {
        model: User,
        key: "id",
        onDelete:'CASCADE'
      },
      onDelete: 'CASCADE'
    },
  },
  { sequelize, tableName: "auth_token", timestamps: false }
);

module.exports = Token;
