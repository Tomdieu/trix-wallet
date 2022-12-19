const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const bcrypt = require("bcrypt");

class User extends Model {
  /**
   *
   * Returns true if the password matches the user password
   *
   * @param {string} password
   * @returns
   */
  async verifyPassword(password) {
    const result = await bcrypt.compare(password,this.password);
    return result;
  }

  /**
   *
   * Set the password of a user
   *
   * @param {string} password
   */
  async setPassword(password) {
    this.password = await bcrypt.hash(password, 10);
    await this.save()
  }

  /**
   * Returns the full name of a user
   */
  getFullName() {
    return this.first_name + " " + this.last_name;
  }

  async getAccount(){
    const Account = require('./Account');
    const account = await Account.findOne({where:{user_id:this.id}})
    return account
  }

  async getNtifications(){
    const Notification = require('./Notification')
    const notifications = Notification.findAll({where:{user_id:this.id}})

    return notifications
  }

  notifications = this.getNtifications().then(d=>d) 

  account = this.getAccount().then(acc=>acc)
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
      unique: true,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      defaultValue: "",
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
    hooks: {
      beforeCreate: async (user, options) => {
        const hashPassword = await bcrypt.hash(user.password, 10);
        user.password = hashPassword;
        // return hashPassword;
      },
      afterCreate: (user, options) => {
        const Token = require("./Token");
        const Account = require("./Account");

        Token.create({ user_id: user.id });
        Account.create({
          user_id: user.id,
          account_number: Number(10000000 + user.id),
        });
      },
    },
  }
);

module.exports = User;
