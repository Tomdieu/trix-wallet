const { User, Token } = require("../models");

const createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({
    data: user.toJSON(),
    success: true,
    message: "account created successful",
  });
};

const getAllUsers = async (req, res) => {
  const user = await User.findAll();
  res.status(200).send({ success: true, data: user });
};

const getUser = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (user) {
    res.status(200).send({ success: true, data: user.toJSON() });
  } else {
    res.status(400).send({ success: false, data: [] });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log(req.headers["authorization"]);
  const user = await User.findOne({ where: { username: username } });
  if (user) {
    const verify = await user.verifyPassword(password);
    if (verify) {
      const token = await Token.findOne({ where: { user_id: user.id } });
      res.status(200).send({
        success: true,
        message: "login success full",
        data: {
          user: user.toJSON(),
          token: token.key,
        },
      });
    } else {
      res.status(404).send({ success: false, message: "password incorrect" });
    }
  } else {
    res
      .status(404)
      .send({ success: false, message: "username or password incorrect" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  const authenticated_user = req.user;
  if (user.id !== req.user.id && authenticated_user.is_superuser === 0) {
    res
      .status(400)
      .send({ status: false, message: "you are unauthorize to do that" });
  }
  const { username, first_name, last_name, email, phone_number, is_superuser } =
    req.body;
  console.log("the email : ", email);
  // console.log(user.toJSON())
  if (username) user.username = username;
  if (first_name) user.first_name = first_name;
  if (last_name) user.last_name = last_name;
  if (email) user.email = email;
  if (phone_number) user.phone_number = phone_number;
  if (is_superuser) user.is_superuser = is_superuser;

  await user.save();

  res.status(200).send({ success: true, message: "user updated", data: user });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (user) {
    if (user.id === req.user.id || req.user.is_superuser) {
      await user.destroy();
      res.status(200).send({
        success: true,
        data: [],
        message: "user deleted successfully",
      });
    } else {
      res
        .status(400)
        .send({ success: false, message: "You are not authorize" });
    }
  } else {
    res.status(404), send({ success: false, message: "Not found" });
  }
};

module.exports = {
  loginUser,
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
