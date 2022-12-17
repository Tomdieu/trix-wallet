const express = require("express");
const User = require("../../models/User");

const userSchema = require('../../models/schema/userSchema')
const {validate} = require('../../models/validation')


const router = express.Router();



router.post("/register", validate(userSchema), (req, res) => {

  res.status(200).json({
    success: true,
    message: "Registration successful",
  });
});

router.get("/:id", (req, res) => {
  console.log(req.params);
  res.status(200).send({ success: true, data: [] });
});

module.exports = router;
