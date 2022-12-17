const express = require("express");
const User = require("../../models/User");

const userSchema = require("../../models/schema/userSchema");
const loginSchema = require("../../models/schema/loginSchema");

const { validate } = require("../../models/validation");

const router = express.Router();

router.post("/login", validate(loginSchema), async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username: username } });
  if (user) {
    const verify = await user.verifyPassword(password)
    if (verify) {
      res
        .status(200)
        .send({
          success: true,
          message: "login success full",
          user: user.toJSON(),
        });
    } else {
      res.status(404).send({ success: false, message: "password incorrect" });
    }
  } else {
    res
      .status(404)
      .send({ success: false, message: "username or password incorrect" });
  }
});

router.post("/register", validate(userSchema), async (req, res) => {
  const user = await User.create(req.body);
  res.status(200).json({
    data: user.toJSON(),
    success: true,
    message: "account created successful",
  });
});

router.get("/", async (req, res) => {
  const user = await User.findAll();
  res.status(200).send({ success: true, data: user });
});

router.get("/:id", async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (user) {
    res.status(200).send({ success: true, data: user.toJSON() });
  } else {
    res.status(400).send({ success: false, data: [] });
  }
});

module.exports = router;
