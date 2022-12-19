const express = require("express");
const { User, Token } = require("../../models");

const userSchema = require("../../models/schema/userSchema");
const loginSchema = require("../../models/schema/loginSchema");
const updateUserSchema = require("../../models/schema/updateUserSchema");

const { TokenMiddleWare } = require("../../middlewares");

const { validate } = require("../../models/validation");

const router = express.Router();

const {
  userControllers: {
    getAllUsers,
    loginUser,
    createUser,
    getUser,
    updateUser,
    deleteUser,
  },
} = require("../../controllers");

router.post("/login", validate(loginSchema), loginUser);

router.post("/register", validate(userSchema), createUser);

router.get("/", TokenMiddleWare, getAllUsers);

router.get("/:id", TokenMiddleWare, getUser);

router.patch("/:id", TokenMiddleWare, validate(updateUserSchema), updateUser);

router.put("/:id", TokenMiddleWare, validate(updateUserSchema), updateUser);

router.delete("/:id", TokenMiddleWare, deleteUser);

module.exports = router;
