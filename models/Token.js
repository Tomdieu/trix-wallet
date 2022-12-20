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
        key: "user_id",
      },
      onDelete: 'CASCADE'
    },
  },
  { sequelize, tableName: "auth_token", timestamps: false }
);

User.hasOne(Token,{foreignKey:'user_id',sourceKey:'id'})
Token.belongsTo(User,{foreignKey:'user_id',targetKey:'id'})

module.exports = Token;
