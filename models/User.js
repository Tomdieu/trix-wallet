const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

class User extends Model {
  /**
   *
   * Returns true if the password matches the user password
   *
   * @param {string} password
   * @returns
   */
  verifyPassword(password) {
    return true;
  }

  /**
   *
   * Set the password of a user
   *
   * @param {string} password
   */
  setPassword(password) {}

  /**
   * Returns the full name of a user
   */
  getFullName() {
    return this.first_name + " " + this.last_name;
  }
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      defaultValue:''
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_superuser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lang: {
      type: DataTypes.ENUM("EN", "FR"),
      defaultValue: "EN",
      allowNull: false,
      validate: {
        isIn: {
          args: [["EN", "FR"]],
          msg: "Must be English or French",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "user",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);


module.exports = User;
