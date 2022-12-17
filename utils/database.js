const { Sequelize } = require("sequelize");

const path = require("path");

const BASE_DIR = path.dirname(__dirname);

const sequelize = new Sequelize("trix-wallet-db", "user", "pass", {
  dialect: "sqlite",
  host: path.join(BASE_DIR, "db.sqlite3"),
});

module.exports = sequelize;
