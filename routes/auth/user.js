const express = require("express");
const User = require("../../models/User");

const userSchema = require("../../models/schema/userSchema");
const { validate } = require("../../models/validation");

const router = express.Router();

router.post("/register", validate(userSchema), async (req, res) => {
  const user = await User.create(req.body);
  res.status(200).json({
    data: user.toJSON(),
    success: true,
    message: "Registration successful",
  });
});

router.get("/:id", (req, res) => {
  console.log(req.params);
  res.status(200).send({ success: true, data: [] });
});

module.exports = router;
