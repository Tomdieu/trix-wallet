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

// User.hasOne(Token)
Token.belongsTo(User,{foreignKey:{name:'user_id',allowNull:false},targetKey:'id',keyType:DataTypes.BIGINT})

module.exports = Token;
